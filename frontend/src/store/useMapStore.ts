import { create } from "zustand";
import type { LayerData, LayerStyle } from "../types/layer";

export type BasemapId = "dark" | "light" | "voyager" | "osm";

interface MapState {
  layers: LayerData[];

  selectedLayerId: string | null;
  attributeTableLayerId: string | null;

  basemap: BasemapId;

  addLayer: (layer: LayerData) => void;
  selectLayer: (layerId: string) => void;

  updateLayerStyle: (
    layerId: string,
    style: Partial<LayerStyle>
  ) => void;

  setBasemap: (basemap: BasemapId) => void;

  openAttributeTable: (layerId: string) => void;
  closeAttributeTable: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  layers: [],

  selectedLayerId: null,
  attributeTableLayerId: null,

  basemap: "dark",

  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, layer],
      selectedLayerId: layer.id,
    })),

  selectLayer: (layerId) =>
    set({
      selectedLayerId: layerId,
    }),

  updateLayerStyle: (layerId, style) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              style: {
                ...layer.style,
                ...style,
              },
            }
          : layer
      ),
    })),

  setBasemap: (basemap) =>
    set({
      basemap,
    }),

  openAttributeTable: (layerId) =>
    set({
      attributeTableLayerId: layerId,
      selectedLayerId: layerId,
    }),

  closeAttributeTable: () =>
    set({
      attributeTableLayerId: null,
    }),
}));