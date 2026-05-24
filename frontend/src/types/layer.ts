export interface PointFeature {
  latitude: number;
  longitude: number;
  properties: Record<string, any>;
}

export interface LayerData {
  id: string;
  name: string;
  data: PointFeature[];
  columns: string[];
}