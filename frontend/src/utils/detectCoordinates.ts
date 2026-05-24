const LATITUDE_CANDIDATES = [
  "lat",
  "latitude",
  "enlem",
  "y",
  "y_coord",
  "point_y",
];

const LONGITUDE_CANDIDATES = [
  "lon",
  "lng",
  "long",
  "longitude",
  "boylam",
  "x",
  "x_coord",
  "point_x",
];

function normalizeColumnName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

function scoreColumn(column: string, candidates: string[]) {
  const normalized = normalizeColumnName(column);

  let bestScore = 0;

  for (const candidate of candidates) {
    if (normalized === candidate) {
      bestScore = Math.max(bestScore, 100);
    }

    if (normalized.endsWith(`_${candidate}`)) {
      bestScore = Math.max(bestScore, 80);
    }

    if (normalized.startsWith(`${candidate}_`)) {
      bestScore = Math.max(bestScore, 80);
    }
  }

  return bestScore;
}

export function detectCoordinateFields(columns: string[]) {
  let latitudeField: string | null = null;
  let longitudeField: string | null = null;

  let bestLatScore = 0;
  let bestLonScore = 0;

  columns.forEach((column) => {
    const latScore = scoreColumn(column, LATITUDE_CANDIDATES);
    const lonScore = scoreColumn(column, LONGITUDE_CANDIDATES);

    if (latScore > bestLatScore) {
      bestLatScore = latScore;
      latitudeField = column;
    }

    if (lonScore > bestLonScore) {
      bestLonScore = lonScore;
      longitudeField = column;
    }
  });

  return {
    latitudeField,
    longitudeField,
  };
}