(function () {
  'use strict';

  /* ============================= Datos del juego ============================= */

  const ELEMENTOS = {
    fuego:    { color: '#ff6a00', icono: '🔥' },
    agua:     { color: '#3aa0ff', icono: '💧' },
    hielo:    { color: '#7fe9ff', icono: '❄️' },
    tierra:   { color: '#c9974f', icono: '⛰️' },
    electrico:{ color: '#ffef5c', icono: '⚡' },
    veneno:   { color: '#9dff6a', icono: '☠️' },
    sombra:   { color: '#8e6bff', icono: '🌑' },
    energia:  { color: '#ffd93d', icono: '🌟' },
    psiquico: { color: '#ff5eea', icono: '🧠' },
    cristal:  { color: '#ff9efc', icono: '💎' },
    planta:   { color: '#58d068', icono: '🌿' },
    aire:     { color: '#9fe6e0', icono: '💨' },
    metal:    { color: '#c9d1e0', icono: '⚙️' },
    fantasma: { color: '#9e7bff', icono: '👻' }
  };

  const RAREZAS = {
    'comun':      { label: 'Común',      color: '#8a8a8a' },
    'poco-comun': { label: 'Poco común', color: '#4bd66f' },
    'rara':       { label: 'Rara',       color: '#4f9ef2' },
    'ultra-rara': { label: 'Ultra rara', color: '#b06bff' },
    'legendaria': { label: 'Legendaria', color: '#ffd042' },
    'elemental':  { label: 'Elemental',  color: '#ff8a3d' }
  };

  /* Tabla de ventaja de tipos: atacante -> contra qué es fuerte */
  const VENTAJA = {
    fuego:     ['planta', 'hielo'],
    agua:      ['fuego', 'tierra'],
    planta:    ['agua', 'tierra'],
    hielo:     ['agua', 'planta'],
    tierra:    ['electrico', 'metal'],
    aire:      ['planta', 'sombra'],
    energia:   ['sombra', 'metal', 'fantasma'],
    electrico: ['agua', 'metal'],
    veneno:    ['planta', 'fantasma'],
    psiquico:  ['sombra', 'veneno'],
    sombra:    ['psiquico', 'fantasma'],
    cristal:   ['tierra', 'hielo'],
    metal:     ['hielo', 'cristal'],
    fantasma:  ['sombra', 'psiquico']
  };

  const FAMILIA_ROCA = ['tierra', 'cristal', 'metal'];
  const MAGIA_SOMBRA = ['sombra', 'fantasma', 'psiquico'];

  function typeMult(atacante, defensor) {
    if (VENTAJA[atacante] && VENTAJA[atacante].indexOf(defensor) !== -1) return 1.5;
    if (VENTAJA[defensor] && VENTAJA[defensor].indexOf(atacante) !== -1) return 0.75;
    return 1;
  }

  const RAZAS = [
    { id: 'topo', nombre: 'Topo', icono: '⛏️', color: '#b57e4a',
      stats: { fuerza: 70, defensa: 85, velocidad: 45, energia: 88 }, nivel: 72,
      pasiva: 'Excavador', pasivaDesc: '+30% resistencia ante ataques de roca y tierra.' },
    { id: 'humano', nombre: 'Humano', icono: '🧑‍🚒', color: '#4a9bd9',
      stats: { fuerza: 65, defensa: 60, velocidad: 65, energia: 70 }, nivel: 65,
      pasiva: 'Vínculo', pasivaDesc: '+15% de poder en todas tus babosas por su vínculo.' },
    { id: 'troll', nombre: 'Troll', icono: '🪨', color: '#6f9c4f',
      stats: { fuerza: 95, defensa: 70, velocidad: 30, energia: 95 }, nivel: 78,
      pasiva: 'Coloso', pasivaDesc: '+25% de energía, pero -20% de resistencia a la magia y la sombra.' },
    { id: 'humanoide', nombre: 'Humanoide', icono: '🧝', color: '#9c7bd8',
      stats: { fuerza: 60, defensa: 60, velocidad: 70, energia: 65 }, nivel: 63,
      pasiva: 'Versátil', pasivaDesc: 'Elige +10 en un atributo para tu personaje.' },
    { id: 'sombras', nombre: 'Clan de las Sombras', icono: '🌑', color: '#5b3f8f',
      stats: { fuerza: 70, defensa: 55, velocidad: 85, energia: 65 }, nivel: 84,
      pasiva: 'Umbría', pasivaDesc: '+20% de poder y velocidad en babosas de sombra o veneno.' },
    { id: 'shein', nombre: 'Shein', icono: '👑', color: '#e04f8f',
      stats: { fuerza: 80, defensa: 80, velocidad: 80, energia: 80 }, nivel: 80,
      pasiva: 'Energía ancestral', pasivaDesc: 'Su presencia otorga +10% de poder a todas tus babosas.' }
  ];

  /* Babosas que no están en la API (elementales, guardianas y extra) */
  const EXTRAS = [
    { nombre: 'Elemental de Fuego', elemento: 'fuego', rareza: 'elemental', categoria: 'elemental', nivel: 65, habitat: 'Fuentes de lava del Cañón del Molino', descripcion: 'Una de las cinco babosas elementales sagradas. Concentra el poder del magma en un ser viviente.', imagen: 'img/Elemental de Fuego.webp' },
    { nombre: 'Elemental de Agua', elemento: 'agua', rareza: 'elemental', categoria: 'elemental', nivel: 65, habitat: 'Corrientes subterráneas del Río Este', descripcion: 'Babosa elemental que controla cada gota de agua del mundo subterráneo.', imagen: 'img/Elemental de Agua.webp' },
    { nombre: 'Elemental de Aire', elemento: 'aire', rareza: 'elemental', categoria: 'elemental', nivel: 65, habitat: 'Laderas del Gran Ventisquero', descripcion: 'Babosa elemental de los vientos. Puede desviar cualquier proyectil frontal.', imagen: 'img/Elemental de Aire.webp' },
    { nombre: 'Elemental de Tierra', elemento: 'tierra', rareza: 'elemental', categoria: 'elemental', nivel: 65, habitat: 'Cavernas de los Cantos Rodados', descripcion: 'Babosa elemental del subsuelo. Un solo golpe suyo puede abrir un cañón en la roca.', imagen: 'img/Elemental de Tierra.webp' },
    { nombre: 'Elemental de Energía', elemento: 'energia', rareza: 'elemental', categoria: 'elemental', nivel: 65, habitat: 'Corazón de Bajo Tierra', descripcion: 'La más rara de las elementales: canaliza la energía pura que mantiene vivo a todo el subsuelo.', imagen: 'img/Elemental de Energía.webp' },
    { nombre: 'Tornado', elemento: 'aire', rareza: 'comun', categoria: 'comun', nivel: 20, habitat: 'Mesetas con vientos permanentes', descripcion: 'Gira a gran velocidad formando pequeños torbellinos que desorientan al enemigo.', imagen: 'img/Tornado.webp' },
    { nombre: 'Erizo', elemento: 'tierra', rareza: 'comun', categoria: 'comun', nivel: 18, habitat: 'Laderas de matorral espinoso', descripcion: 'Babosa con púas que lanza en todas direcciones. Molesta e incómoda de agarrar.', imagen: 'img/Erizo.webp' },
    { nombre: 'Sanadora Blanca', elemento: 'energia', rareza: 'ultra-rara', categoria: 'guardiana', nivel: 80, habitat: 'Claro de Luz entre las Cavernas', descripcion: 'Babosa guardiana legendaria. Su luz cura a las babosas aliadas y deshace cualquier maleficio.', imagen: 'img/Sanadora Blanca.webp' },
    { nombre: 'Flautista', elemento: 'aire', rareza: 'ultra-rara', categoria: 'guardiana', nivel: 70, habitat: 'Bosques de Carillones', descripcion: 'Babosa guardiana que guía a otras babosas con su música y las aleja del peligro.', imagen: 'img/Flautista.webp' },
    { nombre: 'Espectro', elemento: 'fantasma', rareza: 'rara', categoria: 'comun', nivel: 55, habitat: 'Cavernas engullidas por la niebla', descripcion: 'Babosa fantasmal que atraviesa la materia sólida. Nadie sabe de dónde surgió.', imagen: 'img/Espectro.webp' },
    { nombre: 'Hexlet', elemento: 'psiquico', rareza: 'rara', categoria: 'comun', nivel: 52, habitat: 'Corrientes de energía violeta', descripcion: 'Babosa de los augurios: si la ves, se dice que cambia la suerte de quien la lanza.', imagen: 'img/Hexlet.webp' },
    { nombre: 'Emulek', elemento: 'energia', rareza: 'rara', categoria: 'comun', nivel: 58, habitat: 'Torre de Resonancia', descripcion: 'Babosa que amplifica la energía que recibe y la devuelve multiplicada.', imagen: 'img/Emulek.webp' },
    { nombre: 'Planeadora', elemento: 'aire', rareza: 'comun', categoria: 'comun', nivel: 24, habitat: 'Grietas de corriente ascendente', descripcion: 'Planea entre corrientes de aire y envía olas cortantes hacia sus rivales.', imagen: 'img/Planeadora.webp' },
    { nombre: 'Slirena', elemento: 'psiquico', rareza: 'rara', categoria: 'comun', nivel: 54, habitat: 'Lagunas de canto profundo', descripcion: 'Lanza cantos hipnóticos que confunden al rival y lo hacen errar su tiro.', imagen: 'img/Slirena.webp' },
    { nombre: 'Gazzer', elemento: 'aire', rareza: 'poco-comun', categoria: 'comun', nivel: 30, habitat: 'Fumarolas del Ventisquero', descripcion: 'Lanza ráfagas de gas que desorientan a las babosas enemigas.', imagen: 'img/Gazzer.webp' },
    { nombre: 'Makobreaker', elemento: 'agua', rareza: 'poco-comun', categoria: 'comun', nivel: 38, habitat: 'Manglares del Río Este', descripcion: 'Babosa marina de gran potencia que rompe superficies con olas de choque.', imagen: 'img/Makobreaker.webp' },
    { nombre: 'Versátil', elemento: 'energia', rareza: 'ultra-rara', categoria: 'comun', nivel: 78, habitat: 'Cavernas de la Dualidad', descripcion: 'Babosa única capaz de copiar el poder de otras babosas en plena batalla.', imagen: 'img/Versátil.webp' },
    { nombre: 'Enredadera', elemento: 'planta', rareza: 'poco-comun', categoria: 'comun', nivel: 34, habitat: 'Jardines Colgantes', descripcion: 'Babosa vegetal que cubre al rival con lianas imposibles de cortar a tiempo.', imagen: 'img/Enredadera.webp' },
    { nombre: 'Flatulorhinka', elemento: 'aire', rareza: 'poco-comun', categoria: 'comun', nivel: 32, habitat: 'Cañerías aromáticas del subsuelo', descripcion: 'Babosa bromista que lanza gases apestosos que distraen por completo al contrario.', imagen: 'img/Flatulorhinka.webp' },
    { nombre: 'Estropeada', elemento: 'tierra', rareza: 'comun', categoria: 'comun', nivel: 10, habitat: 'Vertederos de las Cavernas Bajas', descripcion: 'Babosa desechada que, contra todo pronóstico, casi siempre acierta cuando dispara.', imagen: 'img/Estropeada.webp' }
  ];

  /* Metadatos de las 32 babosas de la api (elemento, rareza, categoría, nivel) */
  const META = {
    'Infierno':        { t: 'fuego', r: 'comun', nivel: 20 },
    'Demoledora':      { t: 'fuego', r: 'comun', nivel: 22 },
    'Bengala':         { t: 'fuego', r: 'comun', nivel: 12 },
    'Granada':         { t: 'fuego', r: 'comun', nivel: 18 },
    'Fraguadora':      { t: 'fuego', r: 'comun', nivel: 25 },
    'Blastipede':      { t: 'fuego', r: 'comun', nivel: 24 },
    'Lavalynx':        { t: 'fuego', r: 'comun', nivel: 24 },
    'Aquabeek':        { t: 'agua', r: 'comun', nivel: 21 },
    'Bubbaleone':      { t: 'agua', r: 'comun', nivel: 21 },
    'Gelatinosa':      { t: 'agua', r: 'comun', nivel: 16 },
    'Congelada':       { t: 'hielo', r: 'poco-comun', nivel: 32 },
    'Lariat':          { t: 'agua', r: 'comun', nivel: 15 },
    'Carnero':         { t: 'tierra', r: 'comun', nivel: 22 },
    'Tejedora':        { t: 'planta', r: 'poco-comun', nivel: 30 },
    'Arenosa':         { t: 'tierra', r: 'comun', nivel: 20 },
    'Diggrix':         { t: 'tierra', r: 'poco-comun', nivel: 27 },
    'Cristálida':      { t: 'cristal', r: 'rara', nivel: 52 },
    'Esquirla Helada': { t: 'hielo', r: 'poco-comun', nivel: 28 },
    'Trilladora':      { t: 'tierra', r: 'poco-comun', nivel: 38 },
    'Polaro':          { t: 'tierra', r: 'poco-comun', nivel: 35 },
    'Torpedo':         { t: 'agua', r: 'comun', nivel: 23 },
    'Punzante':        { t: 'tierra', r: 'comun', nivel: 19 },
    'Magnetosa':       { t: 'metal', r: 'rara', nivel: 46 },
    'Neotox':          { t: 'veneno', r: 'rara', nivel: 48 },
    'Sanadora (Doc)':  { t: 'energia', r: 'ultra-rara', c: 'guardiana', nivel: 75 },
    'Electroshock':    { t: 'electrico', r: 'rara', nivel: 55 },
    'Fandango':        { t: 'energia', r: 'rara', c: 'guardiana', nivel: 58 },
    'Fósforo':         { t: 'energia', r: 'poco-comun', nivel: 36 },
    'Enigma':          { t: 'psiquico', r: 'legendaria', nivel: 90 },
    'Nube de Humo':    { t: 'fantasma', r: 'comun', nivel: 13 },
    'Xmitter':         { t: 'metal', r: 'rara', nivel: 60 },
    'Hipnogrif':       { t: 'psiquico', r: 'rara', nivel: 60 }
  };

  function slugify(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function rutaTransformada(nombre) {
    return 'img/transformadas/' + slugify(nombre) + '.webp';
  }

  function statsDeNivel(nivel) {
    return {
      hp: Math.round(nivel * 1.6) + 30,
      atk: Math.round(nivel) + 10,
      vel: Math.round(nivel * 0.5) + 30
    };
  }

  function esc(t) {
    return String(t || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ============================= Estado ============================= */

  const ENEMIGO = { stats: { fuerza: 70, defensa: 55, velocidad: 85, energia: 65 } };

  const state = {
    personaje: null,
    buenas: [],
    malvadas: [],
    equipo: [],
    filtroCat: 'todas',
    filtroEl: null,
    batalla: null,
    error: null
  };

  if (typeof window !== 'undefined') { window.__gameState = state; }

  function $id(id) { return document.getElementById(id); }

  function mostrarPantalla(id) {
    ['screenChar', 'screenTeam', 'screenBattle'].forEach(function (s) {
      $id(s).style.display = (s === id) ? 'block' : 'none';
    });
  }

  function elDe(s) { return ELEMENTOS[s.elemento] || ELEMENTOS.energia; }
  function rzDe(s) { return RAREZAS[s.rareza] || RAREZAS['comun']; }

  /* ============================= Carga de datos ============================= */

  async function cargarDatos() {
    try {
      const [rGood, rEvil] = await Promise.all([
        fetch('api/babosas_bajoterra.json'),
        fetch('api/babosas_malvadas.json')
      ]);
      if (!rGood.ok) throw new Error('No se pudo cargar las babosas aliadas');
      if (!rEvil.ok) throw new Error('No se pudo cargar las babosas malvadas');

      const g = await rGood.json();
      const goodJson = ((g.babosas && g.babosas.buenas) || g.babosas || []).slice()
        .sort(function (a, b) { return (a.id || 0) - (b.id || 0); });

      const buenas = goodJson.map(function (b) {
        const meta = META[b.nombre] || { t: 'energia', r: 'comun', c: 'comun', nivel: 30 };
        return {
          nombre: b.nombre,
          elemento: meta.t,
          rareza: meta.r,
          categoria: meta.c || 'comun',
          nivel: meta.nivel,
          habitat: b.habitat || 'Sin ubicación conocida',
          descripcion: b.descripcion || 'Sin descripción.',
          imagen: b.imagen || ('img/' + slugify(b.nombre) + '.webp')
        };
      }).concat(EXTRAS);

      const em = await rEvil.json();
      const evilList = (em.babosas) || em || [];

      const malvadas = evilList.map(function (eb) {
        const origen = buenas.find(function (x) { return x.nombre === eb.origen; }) || null;
        const nivel = Math.max(10, Math.round((origen ? origen.nivel : 30) * 1.1));
        return {
          nombre: eb.nombre,
          origen: eb.origen,
          elemento: 'sombra',
          rareza: origen ? origen.rareza : 'rara',
          categoria: 'malvada',
          nivel: nivel,
          habitat: eb.habitat || 'Cavernas de Oscuridad Total',
          descripcion: eb.descripcion || 'Babosa corrompida por las Sombras.',
          imagen: (origen && origen.imagen) || ('img/' + slugify(eb.nombre) + '.webp')
        };
      });

      state.buenas = buenas;
      state.malvadas = malvadas;
      init();
    } catch (err) {
      console.error('Error cargando datos:', err);
      $id('loaderGame').style.display = 'none';
      $id('gameContent').style.display = 'block';
      $id('charError').textContent = 'No se pudieron cargar los datos. Revisa que el servidor esté activo.';
    }
  }

  /* ============================= Pantalla: personaje ============================= */

  function pintarRazas() {
    const grid = $id('raceGrid');
    grid.innerHTML = '';
    RAZAS.forEach(function (raza) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'race-card';
      card.dataset.raza = raza.id;

      let statsHtml = '';
      const labels = { fuerza: 'Fuerza', defensa: 'Defensa', velocidad: 'Velocidad', energia: 'Energía' };
      Object.keys(raza.stats).forEach(function (k) {
        statsHtml += '<div class="stat-line"><span class="stat-label">' + labels[k] + '</span>' +
          '<div class="stat-bar"><i style="width:' + Math.round(raza.stats[k]) + '%"></i></div>' +
          '<span class="stat-val">' + raza.stats[k] + '</span></div>';
      });

      card.innerHTML =
        '<div class="race-head"><span class="race-icon">' + raza.icono + '</span>' +
        '<div><div class="race-name">' + raza.nombre + '</div><div class="race-level">Nivel ' + raza.nivel + '</div></div></div>' +
        '<div class="race-stats">' + statsHtml + '</div>' +
        '<div class="race-passive"><b>' + raza.pasiva + ':</b> ' + raza.pasivaDesc + '</div>';

      card.addEventListener('click', function () {
        state.personaje = {
          nombre: $id('charNombre').value.trim() || 'Viajero de Bajo Terra',
          raza: raza,
          bono: 'fuerza'
        };
        pintarRazas();
        pintarBono();
      });
      if (state.personaje && state.personaje.raza.id === raza.id) {
        card.classList.add('selected');
      }
      grid.appendChild(card);
    });
  }

  function pintarBono() {
    if (!state.personaje) return;
    const esVersatil = state.personaje.raza.id === 'humanoide';
    $id('bonoRow').style.display = esVersatil ? 'flex' : 'none';
    if (!esVersatil) return;
    const opts = [
      { k: 'fuerza', l: 'Ataque (+10)' },
      { k: 'defensa', l: 'Defensa (+10)' },
      { k: 'velocidad', l: 'Velocidad (+10)' },
      { k: 'energia', l: 'Energía (+10)' }
    ];
    $id('bonoRow').innerHTML = '';
    opts.forEach(function (o) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bono-btn' + (state.personaje.bono === o.k ? ' active' : '');
      b.textContent = o.l;
      b.addEventListener('click', function () {
        state.personaje.bono = o.k;
        pintarBono();
      });
      $id('bonoRow').appendChild(b);
    });
  }

  function irASeleccion() {
    if (!state.personaje) {
      $id('charError').textContent = 'Elige una raza para continuar.';
      return;
    }
    state.personaje.nombre = $id('charNombre').value.trim() || 'Viajero de Bajo Terra';
    pintarResumen();
    pintarFiltros();
    pintarGrid();
    pintarEquipoBar();
    mostrarPantalla('screenTeam');
  }

  function pintarResumen() {
    const p = state.personaje;
    $id('teamCharInfo').innerHTML =
      p.raza.icono + ' <b>' + esc(p.nombre) + '</b> · ' + p.raza.nombre +
      ' (Nivel ' + p.raza.nivel + ') · Pasiva: ' + p.raza.pasiva +
      (p.raza.id === 'humanoide' && p.bono ? ' · Bono: ' + p.bono : '');
  }

  /* ============================= Pantalla: selección ============================= */

  function pintarFiltros() {
    const cats = [
      { id: 'todas', l: 'Todas' },
      { id: 'elemental', l: '🌸 Elementales' },
      { id: 'guardiana', l: '🛡️ Guardianas' },
      { id: 'malvada', l: '🌑 Malvadas' }
    ];
    const catBox = $id('filterCat');
    catBox.innerHTML = '';
    cats.forEach(function (c) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.filtroCat === c.id ? ' active' : '');
      b.textContent = c.l;
      b.addEventListener('click', function () {
        state.filtroCat = c.id;
        pintarFiltros();
        pintarGrid();
      });
      catBox.appendChild(b);
    });

    const elBox = $id('filterEl');
    elBox.innerHTML = '';
    Object.keys(ELEMENTOS).forEach(function (el) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (state.filtroEl === el ? ' active' : '');
      b.innerHTML = ELEMENTOS[el].icono + ' ' + el;
      b.style.borderColor = ELEMENTOS[el].color;
      b.style.color = ELEMENTOS[el].color;
      if (state.filtroEl === el) b.style.background = ELEMENTOS[el].color + '33';
      b.addEventListener('click', function () {
        state.filtroEl = (state.filtroEl === el) ? null : el;
        pintarFiltros();
        pintarGrid();
      });
      elBox.appendChild(b);
    });
  }

  function listaFiltrada() {
    const todas = state.buenas.concat(state.malvadas);
    return todas.filter(function (s) {
      if (state.filtroCat === 'elemental' && s.categoria !== 'elemental') return false;
      if (state.filtroCat === 'guardiana' && s.categoria !== 'guardiana') return false;
      if (state.filtroCat === 'malvada' && s.categoria !== 'malvada') return false;
      if (state.filtroEl && s.elemento !== state.filtroEl) return false;
      return true;
    });
  }

  function pintarGrid() {
    const grid = $id('cardsGrid');
    grid.innerHTML = '';
    const lista = listaFiltrada().sort(function (a, b) { return b.nivel - a.nivel; });

    if (lista.length === 0) {
      grid.innerHTML = '<p class="empty">No hay babosas con esos filtros.</p>';
      return;
    }

    lista.forEach(function (s) {
      const el = elDe(s);
      const rz = rzDe(s);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'slug-card cat-' + s.categoria;
      card.innerHTML =
        '<div class="slug-thumb" style="border-color:' + el.color + '">' +
        '<img src="' + s.imagen + '" alt="' + esc(s.nombre) + '" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">' +
        '<span class="slug-icon" style="display:none">' + el.icono + '</span>' +
        '</div>' +
        '<div class="slug-name">' + esc(s.nombre) + '</div>' +
        '<div class="slug-tags"><span class="tag" style="color:' + el.color + '">' + el.icono + ' ' + s.elemento + '</span>' +
        '<span class="tag" style="color:' + rz.color + '">' + rz.label + '</span></div>' +
        '<div class="slug-nivel">Nivel ' + s.nivel + '</div>';

      card.addEventListener('click', function () { abrirFicha(s); });
      grid.appendChild(card);
    });
  }

  function estadoTransformada(s, cb) {
    const ruta = rutaTransformada(s.nombre);
    const img = new window.Image();
    img.onload = function () { cb(true, ruta); };
    img.onerror = function () { cb(false, ruta); };
    img.src = ruta;
  }

  /* ============================= Ficha (modal) ============================= */

  function estEnEquipo(s) {
    return state.equipo.some(function (x) { return x.nombre === s.nombre; });
  }

  function toggleEquipo(s) {
    const i = state.equipo.findIndex(function (x) { return x.nombre === s.nombre; });
    if (i !== -1) {
      state.equipo.splice(i, 1);
    } else {
      if (state.equipo.length >= 3) {
        $id('teamError').textContent = 'Tu equipo ya tiene 3 babosas. Quita una primero.';
        return;
      }
      state.equipo.push(s);
    }
    $id('teamError').textContent = '';
    pintarEquipoBar();
    abrirFicha(s);
  }

  function abrirFicha(s) {
    const el = elDe(s);
    const rz = rzDe(s);
    const stats = statsDeNivel(s.nivel);
    const malvada = (s.categoria !== 'malvada') ? state.malvadas.find(function (m) { return m.origen === s.nombre; }) : null;

    $id('modalContent').innerHTML =
      '<div class="ficha" style="--aura:' + el.color + '">' +
      '<div class="ficha-top">' +
      '<div class="ficha-slot"><div class="ficha-img proto" style="border-color:' + el.color + '">' +
      '<img src="' + s.imagen + '" alt="Protoforma" onerror="this.remove()">' +
      '</div><div class="ficha-titulo-img">Protoforma</div></div>' +
      '<div class="ficha-slot"><div class="ficha-img transf" style="border-color:' + el.color + '">' +
      '<img src="' + rutaTransformada(s.nombre) + '" alt="Transformada" onerror="this.closest(\'.ficha-img\').classList.add(\'sin-transf\'); this.remove();">' +
      '</div><div class="ficha-titulo-img">Transformada</div></div>' +
      '</div>' +
      '<div class="ficha-info">' +
      '<h2>' + esc(s.nombre) + '</h2>' +
      '<div class="ficha-tags">' +
      '<span class="tag" style="color:' + el.color + '">' + el.icono + ' ' + s.elemento + '</span>' +
      '<span class="tag" style="color:' + rz.color + '">' + rz.label + '</span>' +
      '<span class="tag cat">' + s.categoria + '</span>' +
      '<span class="ficha-nivel">Nivel ' + s.nivel + '</span>' +
      '</div>' +
      barra(stats.atk, 'Ataque', '#ff6a4d') +
      barra(stats.hp, 'Energía', '#3aa0ff') +
      barra(stats.vel, 'Velocidad', '#9dff6a') +
      '<div class="ficha-habitat">📍 <b>Dónde encontrarla:</b> ' + esc(s.habitat) + '</div>' +
      '<p class="ficha-desc">' + esc(s.descripcion) + '</p>' +
      (malvada
        ? '<div class="ficha-malvada">🌑 <b>Versión malvada:</b> ' + esc(malvada.nombre) + ' (Nivel ' + malvada.nivel + ').<br>' + barra(malvada.nivel, 'Poder malvada', '#8e6bff') + '</div>'
        : '<div class="ficha-malvada">😇 <b>Aliada:</b> puedes contar con ella en batalla sin transformación malvada.</div>') +
      '<div class="ficha-btns">' +
      '<button type="button" class="btn-prim" id="btnElegir">' + (estEnEquipo(s) ? 'Quitar del equipo' : 'Elegir para tu equipo') + '</button>' +
      '<button type="button" class="btn-sec" id="btnCerrarFicha">Cerrar</button>' +
      '</div>' +
      '</div></div>';

    $id('btnCerrarFicha').addEventListener('click', cerrarFicha);
    $id('btnElegir').addEventListener('click', function () { toggleEquipo(s); });
    $id('modalOverlay').style.display = 'flex';
  }

  function barra(val, label, color) {
    return '<div class="barra-campo"><div class="campo-t">' + label + '</div>' +
      '<div class="barra-ext"><i style="width:' + Math.min(100, val) + '%;background:' + color + '"></i></div><b>' + val + '</b></div>';
  }

  function cerrarFicha() {
    $id('modalOverlay').style.display = 'none';
  }

  function pintarEquipoBar() {
    const bar = $id('teamBar');
    bar.innerHTML = '';
    state.equipo.forEach(function (s) {
      const el = elDe(s);
      const slot = document.createElement('div');
      slot.className = 'team-slot';
      slot.innerHTML =
        '<div class="ts-img" style="border-color:' + el.color + '"><img src="' + s.imagen + '" alt="' + esc(s.nombre) + '" onerror="this.remove()"></div>' +
        '<b>' + esc(s.nombre) + '</b>';
      slot.title = 'Quitar del equipo';
      slot.addEventListener('click', function () { toggleEquipo(s); });
      bar.appendChild(slot);
    });
    for (let i = state.equipo.length; i < 3; i++) {
      const slot = document.createElement('div');
      slot.className = 'team-slot empty';
      slot.innerHTML = '<div class="ts-img"><span style="font-size:1.6rem">+</span></div><b>Vacío</b>';
      bar.appendChild(slot);
    }
    $id('btnIniciar').disabled = state.equipo.length !== 3;
  }

  /* ============================= Batalla ============================= */

  function iniciarBatalla() {
    if (state.equipo.length !== 3) return;
    montarArena();
    crearEquipos();
    pintarArena();
    $id('battleLog').innerHTML = '';
    log('⚔️ <b>¡Batalla de babosas!</b> Toca una babosa aliada para disparar.');
    mostrarPantalla('screenBattle');
  }

  function crearEquipos() {
    const pool = state.malvadas.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    const enemigas = pool.slice(0, 3);
    const jugadoras = state.equipo.slice();

    state.batalla = {
      jugador: jugadoras.map(function (s) { return crearUnidad({ slug: s, esEnemigo: false }); }),
      enemigo: enemigas.map(function (s) { return crearUnidad({ slug: s, esEnemigo: true }); }),
      ocupado: false,
      fin: false
    };
  }

  function crearUnidad(m) {
    const s = m.slug;
    const stats = statsDeNivel(s.nivel);
    const persStats = m.esEnemigo ? ENEMIGO.stats : (state.personaje ? state.personaje.raza.stats : ENEMIGO.stats);
    let hp = stats.hp + Math.round(persStats.energia / 2);
    if (!m.esEnemigo && state.personaje.raza.id === 'troll') hp = Math.round(hp * 1.25);
    return { slug: s, hp: hp, maxHp: hp, viva: true, esEnemigo: m.esEnemigo, stats: stats };
  }

  function montarArena() {
    $id('arena').innerHTML =
      '<div class="row-enemy">' + slotHtml('e0') + slotHtml('e1') + slotHtml('e2') + '</div>' +
      '<div id="centerLane" class="center-lane"></div>' +
      '<div class="row-player">' + slotHtml('p0') + slotHtml('p1') + slotHtml('p2') + '</div>';
  }

  function slotHtml(id) {
    return '<div class="slot" id="' + id + '"><div class="slot-inner"></div></div>';
  }

  function pintarArena() {
    const lados = { p: state.batalla.jugador, e: state.batalla.enemigo };
    Object.keys(lados).forEach(function (lado) {
      lados[lado].forEach(function (u, i) {
        const slot = $id(lado + i);
        const el = elDe(u.slug);
        slot.innerHTML =
          '<div class="slot-aura" style="--aura:' + el.color + '"></div>' +
          '<img class="slot-img" src="' + u.slug.imagen + '" alt="' + esc(u.slug.nombre) + '" onerror="this.remove()">' +
          '<div class="slot-nombre">' + esc(u.slug.nombre) + '</div>' +
          '<div class="slot-hp"><i id="hp-' + lado + i + '" style="width:100%;background:' + el.color + '"></i></div>';
        slot.classList.toggle('enemy', lado === 'e');
        slot.classList.toggle('player', lado === 'p');
        slot.classList.remove('derrotado', 'disabled');
        if (lado === 'p') {
          slot.addEventListener('click', function () { dispararDe(i); });
        }
      });
    });
  }

  function actualizarHp(lado, i, u) {
    const barra = $id('hp-' + lado + i);
    if (!barra) return;
    const pct = Math.max(0, Math.round((u.hp / u.maxHp) * 100));
    barra.style.width = pct + '%';
    barra.style.background = pct < 30 ? '#ff4141' : elDe(u.slug).color;
    if (!u.viva) {
      const slot = $id(lado + i);
      if (slot) slot.classList.add('derrotado');
    }
  }

  function log(msg, clase) {
    const line = document.createElement('div');
    line.className = 'log-line' + (clase ? ' ' + clase : '');
    line.innerHTML = msg;
    $id('battleLog').appendChild(line);
    $id('battleLog').scrollTop = $id('battleLog').scrollHeight;
  }

  function enemigoVivo() {
    const es = state.batalla.enemigo;
    for (let i = 0; i < es.length; i++) if (es[i].viva) return i;
    return -1;
  }

  function jugadorVivo() {
    const js = state.batalla.jugador;
    for (let i = 0; i < js.length; i++) if (js[i].viva) return i;
    return -1;
  }

  function posCentro(el) {
    const r = el.getBoundingClientRect();
    const a = $id('arena').getBoundingClientRect();
    return { x: r.left + r.width / 2 - a.left, y: r.top + r.height / 2 - a.top };
  }

  function dispararDe(i) {
    if (state.batalla.ocupado || state.batalla.fin) return;
    const att = state.batalla.jugador[i];
    if (!att.viva) return;
    const defIdx = enemigoVivo();
    if (defIdx === -1) return;

    state.batalla.ocupado = true;
    activarSlots(false);

    const o = posCentro($id('p' + i));
    const centro = posCentro($id('e' + defIdx));
    const d = { x: centro.x, y: centro.y, lado: 'e', idx: defIdx };
    volar(o, d, att, function () {
      const def = state.batalla.enemigo[defIdx];
      aplicarDanio(att, def, defIdx, true);
      if (state.batalla.fin) return;
      setTimeout(turnoEnemigo, 700);
    });
  }

  function volar(origen, destino, unidad, done) {
    const lane = $id('centerLane');
    const el = elDe(unidad.slug);
    const proj = document.createElement('div');
    proj.className = 'proyectil';
    proj.style.setProperty('--aura', el.color);
    proj.style.setProperty('--trail', el.color);
    lane.appendChild(proj);

    const ruta = rutaTransformada(unidad.slug.nombre);
    const stamp = new window.Image();
    stamp.onload = function () { proj.style.backgroundImage = "url('" + ruta + "')"; };
    stamp.onerror = function () { proj.classList.add('sintransf'); };
    stamp.src = ruta;

    proj.style.left = (origen.x - 26) + 'px';
    proj.style.top = (origen.y - 14) + 'px';

    const DUR = 1000;
    const t0 = performance.now();
    const dx = destino.x - origen.x;
    const dy = destino.y - origen.y;

    function paso(ahora) {
      const t = Math.min(1, (ahora - t0) / DUR);
      const av = ease(t);
      const y = dy * av + Math.sin(av * Math.PI) * -80;
      proj.style.transform = 'translate(' + (dx * av) + 'px,' + y + 'px) scale(' + (1 + av * 1.8) + ')';
      if (av > 0.42) proj.classList.add('transformado');

      if (t < 1) {
        requestAnimationFrame(paso);
      } else {
        proj.classList.add('impacto');
        const slot = destino && destino.lado ? $id(destino.lado + destino.idx) : null;
        if (slot) slot.classList.add('sacudida');
        setTimeout(function () {
          if (slot) slot.classList.remove('sacudida');
          proj.remove();
          done();
        }, 240);
      }
    }
    requestAnimationFrame(paso);
  }

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function activarSlots(activo) {
    const slots = document.querySelectorAll('#p0, #p1, #p2');
    slots.forEach(function (s) { s.classList.toggle('disabled', !activo); });
  }

  function aplicarDanio(att, def, defIdx, ataqueJugador) {
    const persStats = ataqueJugador ? state.personaje.raza.stats : ENEMIGO.stats;
    let dmg = att.stats.atk;

    dmg *= (0.9 + persStats.fuerza / 350);
    dmg *= typeMult(att.slug.elemento, def.slug.elemento);
    dmg *= (1 + (att.slug.nivel - 50) / 400);

    if (ataqueJugador) {
      const r = state.personaje.raza;
      if (r.id === 'humano') dmg *= 1.15;
      if (r.id === 'shein') dmg *= 1.10;
      if (r.id === 'sombras' && (att.slug.elemento === 'sombra' || att.slug.elemento === 'veneno')) dmg *= 1.20;
      if (r.id === 'humanoide' && state.personaje.bono === 'fuerza') dmg *= 1.05;
    } else {
      if (att.slug.elemento === 'sombra' || att.slug.elemento === 'veneno') dmg *= 1.20;
    }

    const defPers = ataqueJugador ? ENEMIGO.stats.defensa : state.personaje.raza.stats.defensa;
    dmg *= (1 - defPers / 1000);
    if (!ataqueJugador) {
      const rzChar = state.personaje.raza;
      if (rzChar.id === 'topo' && FAMILIA_ROCA.indexOf(att.slug.elemento) !== -1) dmg *= 0.7;
      if (rzChar.id === 'troll' && MAGIA_SOMBRA.indexOf(att.slug.elemento) !== -1) dmg *= 1.25;
    }

    const velAtt = att.stats.vel + persStats.velocidad * 0.5;
    const velDef = def.stats.vel;
    const crit = velAtt > velDef && Math.random() < 0.15;
    if (crit) dmg *= 1.5;

    dmg = Math.max(2, Math.round(dmg));
    def.hp -= dmg;
    if (def.hp <= 0) { def.hp = 0; def.viva = false; }

    actualizarHp(ataqueJugador ? 'e' : 'p', defIdx, def);
    const cls = ataqueJugador ? 'jugador' : 'enemigo';
    if (crit) {
      log((ataqueJugador ? '💥 <b>' : '🌑 <b>') + esc(att.slug.nombre) + '</b> <b>[CRÍTICO '+ dmg +']</b> contra <b>' + esc(def.slug.nombre) + '</b>', cls);
    } else {
      log((ataqueJugador ? '🎯 <b>' : '🌑 <b>') + esc(att.slug.nombre) + '</b> golpeó a <b>' + esc(def.slug.nombre) + '</b>: <b>-' + dmg + '</b>', cls);
    }
    if (!def.viva) log('💀 <b>' + esc(def.slug.nombre) + '</b> fue derrotada.', cls);

    if (ataqueJugador && enemigoVivo() === -1) finalizar(true);
    if (!ataqueJugador && jugadorVivo() === -1) finalizar(false);
  }

  function turnoEnemigo() {
    if (state.batalla.fin) return;
    const attIdx = enemigoVivo();
    const defIdx = jugadorVivo();
    if (attIdx === -1 || defIdx === -1) return;

    state.batalla.ocupado = true;
    activarSlots(false);
    const att = state.batalla.enemigo[attIdx];
    const o = posCentro($id('e' + attIdx));
    const centro = posCentro($id('p' + defIdx));
    const d = { x: centro.x, y: centro.y, lado: 'p', idx: defIdx };
    volar(o, d, att, function () {
      const def = state.batalla.jugador[defIdx];
      aplicarDanio(att, def, defIdx, false);
      if (state.batalla.fin) return;
      state.batalla.ocupado = false;
      activarSlots(true);
    });
  }

  function finalizar(victoria) {
    state.batalla.fin = true;
    state.batalla.ocupado = false;
    activarSlots(false);
    $id('resultOverlay').style.display = 'flex';
    const r = $id('resultado');
    r.className = victoria ? 'win' : 'lose';
    r.innerHTML = victoria
      ? '🏆 ¡Victoria! Has dominado a las babosas malvadas.'
      : '💀 Derrota... las malvadas fueron más fuertes esta vez.';
  }

  function reiniciar() {
    $id('resultOverlay').style.display = 'none';
    state.equipo = [];
    $id('teamError').textContent = '';
    pintarResumen();
    pintarFiltros();
    pintarGrid();
    pintarEquipoBar();
    mostrarPantalla('screenTeam');
  }

  /* ============================= Init ============================= */

  function init() {
    $id('btnContinuar').addEventListener('click', irASeleccion);
    $id('btnVolverChar').addEventListener('click', function () { mostrarPantalla('screenChar'); });
    $id('btnSalir').addEventListener('click', function () { mostrarPantalla('screenTeam'); });
    $id('btnIniciar').addEventListener('click', iniciarBatalla);
    $id('btnReiniciar').addEventListener('click', reiniciar);
    $id('modalOverlay').addEventListener('click', function (e) {
      if (e.target === $id('modalOverlay')) cerrarFicha();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarFicha();
    });
    $id('charNombre').addEventListener('input', function () { $id('charError').textContent = ''; });

    pintarRazas();
    pintarBono();
    pintarFiltros();
    pintarGrid();
    pintarEquipoBar();
    mostrarPantalla('screenChar');
    $id('loaderGame').style.display = 'none';
    $id('gameContent').style.display = 'block';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarDatos);
  } else {
    cargarDatos();
  }
})();