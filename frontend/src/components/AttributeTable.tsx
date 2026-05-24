import { useMapStore } from "../store/useMapStore";

export default function AttributeTable() {
  const layers = useMapStore((state) => state.layers);
  const attributeTableLayerId = useMapStore(
    (state) => state.attributeTableLayerId
  );
  const closeAttributeTable = useMapStore(
    (state) => state.closeAttributeTable
  );

  const selectedLayer = layers.find(
    (layer) => layer.id === attributeTableLayerId
  );

  if (!selectedLayer) {
    return null;
  }

  const previewRows = selectedLayer.data.slice(0, 100);

  return (
    <div
      style={{
        height: "260px",
        background: "#111827",
        borderTop: "1px solid #374151",
        overflow: "auto",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #374151",
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "#111827",
          zIndex: 2,
        }}
      >
        <span>Attribute Table — {selectedLayer.name}</span>

        <button
          onClick={closeAttributeTable}
          style={{
            background: "#374151",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr>
            {selectedLayer.columns.map((column) => (
              <th
                key={column}
                style={{
                  padding: "8px",
                  border: "1px solid #374151",
                  textAlign: "left",
                  background: "#1f2937",
                  position: "sticky",
                  top: 42,
                  zIndex: 1,
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {previewRows.map((row, index) => (
            <tr key={index}>
              {selectedLayer.columns.map((column) => (
                <td
                  key={column}
                  style={{
                    padding: "6px",
                    border: "1px solid #374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {String(row.properties[column] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}