import { create } from "zustand";
import type { LayerData } from "../types/layer";

interface MapState {
  layers: LayerData[];

  selectedLayerId: string | null;
  attributeTableLayerId: string | null;

  addLayer: (layer: LayerData) => void;
  selectLayer: (layerId: string) => void;

  openAttributeTable: (layerId: string) => void;
  closeAttributeTable: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  layers: [],

  selectedLayerId: null,
  attributeTableLayerId: null,

  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, layer],
      selectedLayerId: layer.id,
    })),

  selectLayer: (layerId) =>
    set({
      selectedLayerId: layerId,
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