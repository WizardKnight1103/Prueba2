const accessKey = 'VDkr-aTNquBM9-glo7L7zbHGViKxNVkjKUQJ2c5ep4I'; // Reemplaza con tu clave de acceso de Unsplash

// Función para buscar imágenes
async function searchImages() {
    const query = document.getElementById('query').value;
    if (!query) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`;

    try {
        showLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las imágenes');
        }
        const data = await response.json();
        displayImages(data.results);
        showFeedback('Resultados cargados exitosamente');
    } catch (error) {
        console.error('Error fetching images:', error);
        showFeedback('Error al cargar las imágenes. Inténtalo de nuevo.');
    } finally {
        showLoading(false);
    }
}

// Función para mostrar las imágenes
function displayImages(images) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; // Limpiar contenedor antes de agregar nuevas imágenes

    if (images.length === 0) {
        imageContainer.innerHTML = '<p>No se encontraron imágenes.</p>';
        return;
    }

    images.forEach(image => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description;

        // Botón de descarga
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('download-button');
        downloadButton.textContent = 'Descargar';
        downloadButton.onclick = () => downloadImage(image.urls.full, `image_${image.id}.jpg`);

        // Botón de favoritos
        const favoriteButton = document.createElement('button');
        favoriteButton.classList.add('favorite-button');
        favoriteButton.textContent = 'Añadir a Favoritos';
        favoriteButton.onclick = () => addToFavorites(image);

        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(downloadButton);
        imageWrapper.appendChild(favoriteButton);
        imageContainer.appendChild(imageWrapper);
    });
}

// Función para descargar una imagen
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error descargando la imagen:', error);
        showFeedback('Error al descargar la imagen. Inténtalo de nuevo.');
    }
}

// Función para añadir una imagen a favoritos
function addToFavorites(image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.id === image.id)) {
        favorites.push(image);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showFeedback('Imagen añadida a favoritos');
        displayFavorites();
    } else {
        showFeedback('La imagen ya está en favoritos');
    }
}

// Función para mostrar las imágenes favoritas
function displayFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = ''; // Limpiar contenedor antes de agregar nuevas imágenes

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p>No hay imágenes en favoritos.</p>';
        return;
    }

    favorites.forEach(image => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description;

        // Botón de descarga para favoritos
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('download-button');
        downloadButton.textContent = 'Descargar';
        downloadButton.onclick = () => downloadImage(image.urls.full, `image_${image.id}.jpg`);

        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(downloadButton);
        favoritesGrid.appendChild(imageWrapper);
    });
}

// Función para mostrar/ocultar la sección de favoritos
document.getElementById('toggle-favorites').addEventListener('click', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.style.display = favoritesContainer.style.display === 'none' ? 'block' : 'none';
    displayFavorites();
});

// Función para mostrar/ocultar el indicador de carga
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = show ? 'block' : 'none';
}

// Función para mostrar feedback al usuario
function showFeedback(message) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
    feedbackElement.style.display = 'block';

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        feedbackElement.style.display = 'none';
    }, 3000);
}

// Función para alternar el modo oscuro
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Verificar el modo oscuro al cargar la página
window.addEventListener('load', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    displayFavorites(); // Mostrar favoritos al cargar la página
});