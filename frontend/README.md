# Spatial Clustering Lab

A web-based GIS and spatial clustering platform inspired by QGIS, ArcGIS Pro, and kepler.gl.

The project focuses on spatial clustering workflows, point-based spatial analysis, and interactive GIS visualization directly in the browser.

---

# Current Features

## Data Import
- CSV upload
- Automatic coordinate field detection
- Manual X/Y field selection
- UTF-8 / Turkish character support
- Large point dataset rendering

## GIS Visualization
- Interactive WebGL map
- Basemap switcher
- Layer system
- Auto zoom-to-layer
- Layer visibility toggle

## Symbology
- Single Symbol
- Categorized Symbology
- Graduated Symbology
- Dynamic color editing
- Radius and opacity controls

## Attribute Table
- Open from layer context menu
- Scrollable table
- First 100 records preview

---

# Planned Features

## Data Support
- Excel (.xlsx)
- GeoJSON
- Shapefile (.shp)
- KML / KMZ
- GeoPackage

## Spatial Analysis
- DBSCAN
- HDBSCAN
- OPTICS
- K-Means
- Nearest Neighbor Hierarchy
- Kernel Density Estimation
- Moran's I
- Getis-Ord Gi*
- Hotspot Analysis

## GIS Features
- Feature selection
- Hover popup
- Spatial filtering
- Export tools
- Legend panel
- CRS management
- Layer ordering
- Label rendering

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Deck.gl
- MapLibre GL
- Zustand

## Planned Backend
- FastAPI
- GeoPandas
- Shapely
- PySAL
- Scikit-learn

---

# Installation

## Requirements

Install:
- Git
- Node.js LTS
- VS Code

---

## Clone Repository

```bash
git clone https://github.com/barowskiii/spatial-clustering-lab.git
```

---

## Frontend Setup

```bash
cd spatial-clustering-lab/frontend
npm install
npm run dev
```

---

## Open Application

```text
http://localhost:5173
```

---

# Development Workflow

## Pull Latest Changes

```bash
git pull
```

## Start Development Server

```bash
npm run dev
```

## Save Changes

```bash
git add .
git commit -m "Your commit message"
git push
```

---

# Folder Structure

```text
frontend/
│
├── src/
│   ├── components/
│   ├── store/
│   ├── types/
│   ├── utils/
│   └── assets/
│
├── public/
├── package.json
└── vite.config.ts
```

---

# Architecture Notes

## Rendering Engine
Deck.gl is used for GPU-accelerated rendering of large spatial datasets.

## Map Engine
MapLibre GL provides the base map and camera interaction system.

## State Management
Zustand manages:
- layers
- symbology
- basemap
- attribute table state

## Spatial Pipeline
CSV -> Coordinate Detection -> Layer Creation -> WebGL Rendering

---

# Long-Term Vision

The goal is to create a browser-based spatial clustering and GIS platform specialized for:
- spatial statistics
- hotspot analysis
- clustering workflows
- large point datasets
- crime analysis
- transportation safety analysis

The project aims to combine:
- QGIS-style GIS workflows
- ArcGIS Pro-like analysis concepts
- kepler.gl-style visualization performance
- modern web architecture

---

# Author

Developed by Baran Topçuoğlu.

Research interests:
- Spatial clustering algorithms
- GIS software development
- Spatial statistics
- Web-based geospatial systems
- Transportation safety analytics

LinkedIn:
https://www.linkedin.com/in/baran-topcuoglu/