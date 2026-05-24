import { useEffect, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { ViewStateChangeParameters } from "@deck.gl/core";
import WebMercatorViewport from "viewport-mercator-project";

import { useMapStore } from "../store/useMapStore";

export default function MapView() {
  const layers = useMapStore((state) => state.layers);
  const allPoints = layers.flatMap((layer) => layer.data);

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

  const scatterLayer = new ScatterplotLayer({
    id: "scatter-layer",
    data: allPoints,
    getPosition: (d: any) => [d.longitude, d.latitude],
    getFillColor: [0, 140, 255],
    getRadius: 3,
    radiusUnits: "pixels",
    opacity: 0.55,
    pickable: true,
   });

  return (
    <DeckGL
      viewState={viewState}
      controller={true}
      onViewStateChange={(params: ViewStateChangeParameters) =>
        setViewState(params.viewState as typeof viewState)
      }
      layers={[scatterLayer]}
    >
      <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json">
        <NavigationControl position="top-right" />
      </Map>
    </DeckGL>
  );
}