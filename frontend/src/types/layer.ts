export interface PointFeature {
  latitude: number;
  longitude: number;
  properties: Record<string, any>;
}

export type SymbologyMode = "single" | "categorized" | "graduated";

export interface CategoryStyle {
  value: string;
  color: [number, number, number];
}

export interface GraduatedStyle {
  field: string;
  min: number;
  max: number;
  startColor: [number, number, number];
  endColor: [number, number, number];
}

export interface LayerStyle {
  mode: SymbologyMode;

  visible: boolean;
  opacity: number;
  radius: number;

  color: [number, number, number];

  categoryField?: string;
  categories?: CategoryStyle[];

  graduated?: GraduatedStyle;
}

export interface LayerData {
  id: string;
  name: string;
  data: PointFeature[];
  columns: string[];
  style: LayerStyle;
}