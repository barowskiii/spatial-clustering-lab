import { useState } from "react";
import Papa from "papaparse";
import { useMapStore } from "../store/useMapStore";
import { detectCoordinateFields } from "../utils/detectCoordinates";
import type { PointFeature } from "../types/layer";

type CsvRow = Record<string, string>;

export default function UploadCsvButton() {
  const addLayer = useMapStore((state) => state.addLayer);

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [xField, setXField] = useState<string>("");
  const [yField, setYField] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedRows = result.data;
        const parsedColumns = result.meta.fields ?? [];

        const { latitudeField, longitudeField } =
          detectCoordinateFields(parsedColumns);

        setFileName(file.name);
        setRows(parsedRows);
        setColumns(parsedColumns);

        setXField(longitudeField ?? "");
        setYField(latitudeField ?? "");
      },
    });

    event.target.value = "";
  };

  const confirmImport = () => {
    if (!fileName || !xField || !yField) {
      alert("Please select X and Y fields.");
      return;
    }

    const points: PointFeature[] = rows
      .map((row) => {
        const longitude = Number(row[xField]);
        const latitude = Number(row[yField]);

        if (
          Number.isNaN(latitude) ||
          Number.isNaN(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          return null;
        }

        return {
          latitude,
          longitude,
          properties: row,
        };
      })
      .filter((point): point is PointFeature => point !== null);

    addLayer({
      id: crypto.randomUUID(),
      name: fileName,
      data: points,
      columns,
    });

    setFileName(null);
    setRows([]);
    setColumns([]);
    setXField("");
    setYField("");
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Upload CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </label>

      {fileName && (
        <div
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>
            Coordinate Fields
          </div>

          <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "8px" }}>
            {fileName}
          </div>

          <label style={{ fontSize: "12px" }}>X Field / Longitude</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "10px",
            }}
          >
            <option value="">Select field</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>

          <label style={{ fontSize: "12px" }}>Y Field / Latitude</label>
          <select
            value={yField}
            onChange={(e) => setYField(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "10px",
            }}
          >
            <option value="">Select field</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>

          <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "10px" }}>
            {rows.length} rows detected
          </div>

          <button
            onClick={confirmImport}
            style={{
              width: "100%",
              padding: "10px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Confirm Import
          </button>
        </div>
      )}
    </div>
  );
}