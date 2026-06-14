import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { ViewStateChangeParameters } from "@deck.gl/core";
import WebMercatorViewport from "viewport-mercator-project";

import { useMapStore } from "../store/useMapStore";

export default function MapView() {
  const layers = useMapStore((state) => state.layers);
  const allPoints = layers.flatMap((layer) => layer.data);
  const basemap = useMapStore((state) => state.basemap);
  const setBasemap = useMapStore((state) => state.setBasemap);

  const [viewState, setViewState] = useState({
    longitude: 35,
    latitude: 39,
    zoom: 5,
    pitch: 0,
    bearing: 0,
  });

  useEffect(() => {
    if (allPoints.length === 0) return;

    const longitudes = allPoints.map((p) => p.longitude);
    const latitudes = allPoints.map((p) => p.latitude);

    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);

    const viewport = new WebMercatorViewport({
      width: window.innerWidth - 320,
      height: window.innerHeight,
    });

    const { longitude, latitude, zoom } = viewport.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 80,
      }
    );

    setViewState({
      longitude,
      latitude,
      zoom,
      pitch: 0,
      bearing: 0,
    });
  }, [allPoints.length]);

  const interpolateColor = (
    start: [number, number, number],
    end: [number, number, number],
    t: number
  ): [number, number, number] => {
    const clamped = Math.max(0, Math.min(1, t));

    return [
      Math.round(start[0] + (end[0] - start[0]) * clamped),
      Math.round(start[1] + (end[1] - start[1]) * clamped),
      Math.round(start[2] + (end[2] - start[2]) * clamped),
    ];
  };

  const deckLayers = layers
    .filter((layer) => layer.style.visible)
    .reverse()
    .map(
      (layer) =>
        new ScatterplotLayer({
          id: `scatter-layer-${layer.id}`,
          data: layer.data,
          getPosition: (d: any) => [d.longitude, d.latitude],

          getFillColor: (d: any) => {
            if (layer.style.mode === "categorized") {
              const value = String(
                d.properties[layer.style.categoryField ?? ""]
              );

              const category = layer.style.categories?.find(
                (item) => item.value === value
              );

              return category?.color ?? layer.style.color;
            }

            if (
              layer.style.mode === "graduated" &&
              layer.style.graduated
            ) {
              const rawValue =
                d.properties[layer.style.graduated.field];

              const value = Number(rawValue);

              if (Number.isNaN(value)) {
                return layer.style.color;
              }

              const { min, max, startColor, endColor } =
                layer.style.graduated;

              const t = max === min ? 0 : (value - min) / (max - min);

              return interpolateColor(startColor, endColor, t);
            }

            return layer.style.color;
          },

          getRadius: layer.style.radius,
          radiusUnits: "pixels",
          opacity: layer.style.opacity,
          pickable: true,

          updateTriggers: {
            getFillColor: [
              layer.style.mode,
              layer.style.color,
              layer.style.categoryField,
              layer.style.categories,
              layer.style.graduated,
            ],
            getRadius: [layer.style.radius],
          },
        })
  );

  const basemapStyles: Record<string, any> = {
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    osm: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm",
        },
      ],
    },
  };

  return (
    <DeckGL
      viewState={viewState}
      controller={true}
      onViewStateChange={(params: ViewStateChangeParameters) =>
        setViewState(params.viewState as typeof viewState)
      }
      layers={deckLayers}
      style={{ pointerEvents: "auto" }}
    >
      
      <Map mapStyle={basemapStyles[basemap]}>
        reuseMaps
      </Map>

      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "12px",
          zIndex: 9999,
          display: "grid",
          gap: "4px",
        }}
      >
        <button
          onClick={() =>
            setViewState((state) => ({
              ...state,
              zoom: state.zoom + 1,
            }))
          }
        >
          +
        </button>
        
        <button
          onClick={() =>
            setViewState((state) => ({
              ...state,
              zoom: state.zoom - 1,
            }))
          }
        >
          -
        </button>

        <select
          value={basemap}
          onChange={(event) =>
            setBasemap(event.target.value as typeof basemap)
          }
          style={{
            marginTop: "8px",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #374151",
            background: "#111827",
            color: "white",
          }}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="voyager">Voyager</option>
          <option value="osm">OSM</option>
        </select>

      </div>

    </DeckGL>
  );
}
