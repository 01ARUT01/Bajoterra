(function() {
  const pokedexGrid = document.getElementById('pokedexGrid');
  const statusContainer = document.getElementById('statusContainer');
  const loaderContainer = document.getElementById('loaderContainer');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  let allBabosas = [];

  function showStatus(message, isError = false) {
    statusContainer.textContent = message;
    statusContainer.style.display = 'block';
    statusContainer.style.background = isError ? 'rgba(180, 10, 30, 0.8)' : 'rgba(0, 0, 0, 0.4)';
    loaderContainer.style.display = 'none';
  }

  function hideStatus() {
    statusContainer.style.display = 'none';
  }

  function showLoader() {
    loaderContainer.style.display = 'block';
    statusContainer.style.display = 'none';
    pokedexGrid.innerHTML = '';
  }

  function hideLoader() {
    loaderContainer.style.display = 'none';
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getBabosaImageSrc(babosa) {
    if (babosa.imagen) {
      return babosa.imagen;
    }

    return `img/${slugify(babosa.nombre)}.svg`;
  }

  function renderBabosas(babosas) {
    if (!babosas || babosas.length === 0) {
      pokedexGrid.innerHTML = '';
      showStatus('No se encontraron babosas de Bajo Terra 🏞️', true);
      return;
    }

    hideStatus();
    pokedexGrid.innerHTML = '';

    babosas.forEach((babosa) => {
      const card = document.createElement('article');
      card.className = 'pokemon-card';

      const habitat = babosa.habitat || 'Sin habitat';
      const descripcion = babosa.descripcion || 'Sin descripción disponible.';
      const fallbackIcon = babosa.icono && !babosa.icono.startsWith('http') ? babosa.icono : '🌿';
      const imageSrc = getBabosaImageSrc(babosa);

      card.innerHTML = `
        <div class="pokemon-sprite">
          <img
            class="babosa-image"
            src="${imageSrc}"
            alt="${babosa.nombre}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >
          <span class="babosa-icon" style="display: none;">${fallbackIcon}</span>
        </div>
        <span class="pokemon-id">#${String(babosa.id).padStart(2, '0')}</span>
        <span class="pokemon-name">${babosa.nombre}</span>
        <div class="pokemon-types">
          <span class="type-badge type-grass">${habitat}</span>
        </div>
        <p class="babosa-descripcion">${descripcion}</p>
      `;

      pokedexGrid.appendChild(card);
    });
  }

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') {
      renderBabosas(allBabosas);
      hideStatus();
      return;
    }

    const filtered = allBabosas.filter((babosa) => {
      const nombre = (babosa.nombre || '').toLowerCase();
      const idTexto = String(babosa.id || '');
      return nombre.includes(query) || idTexto.includes(query);
    });

    if (filtered.length === 0) {
      pokedexGrid.innerHTML = '';
      showStatus(`No se encontró ninguna babosa relacionada con "${searchInput.value.trim()}"`, true);
      return;
    }

    renderBabosas(filtered);
    hideStatus();
  }

  async function loadBabosas() {
    showLoader();

    try {
      const response = await fetch('api/babosas_bajoterra.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar la API de Bajo Terra');
      }

      const data = await response.json();
      const apiBabosas = Array.isArray(data)
        ? data
        : data.babosas?.buenas || data.babosas || [];

      allBabosas = apiBabosas
        .slice()
        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

      renderBabosas(allBabosas);
      hideLoader();
      hideStatus();
    } catch (error) {
      console.error('Error cargando babosas:', error);
      hideLoader();
      showStatus('No se pudo cargar la API de Bajo Terra. Revisa que el servidor esté activo.', true);
    }
  }

  function init() {
    loadBabosas();

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        performSearch();
      }
    });

    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() === '') {
        renderBabosas(allBabosas);
        hideStatus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
