# BajoTerra

Una enciclopedia web interactiva para explorar las criaturas y especies del mundo de **Bajo Terra**: un rincón de naturaleza, misterio y descubrimientos.

## Características

- Catálogo de más de 30 babosas con nombre, hábitat y descripción.
- Búsqueda por nombre o número de criatura.
- Tarjetas con imagen de cada babosa y vista tipo Pokédex.
- Datos cargados desde un archivo JSON local (`api/`).
- Diseño responsive y oscuro con estética de caverna.

## Estructura del proyecto

```
BajoTerra/
├── BajoTerra.html          # Página principal
├── server.py               # Servidor HTTP local (puerto 8000)
├── api/
│   └── babosas_bajoterra.json   # Datos de las babosas
├── css/
│   └── style.css           # Estilos de la aplicación
├── js/
│   └── script.js           # Lógica: carga de datos, búsqueda y render
└── img/                    # Imágenes (WebP) de las babosas
```

## Cómo ejecutar

1. Clona el repositorio:

```bash
git clone https://github.com/01ARUT01/Bajoterra.git
cd Bajoterra
```

2. Abre `BajoTerra.html` en el navegador o levanta el servidor local:

```bash
python server.py
```

3. Visita `http://localhost:8000` en tu navegador.

> Usar el servidor local es lo recomendado para que la aplicación pueda cargar el archivo de datos correctamente.

## Licencia

Proyecto de carácter educativo y fan-made basado en el universo de Slugterra (Bajo Terra). No afiliado a sus creadores originales.