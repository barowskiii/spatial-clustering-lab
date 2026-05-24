import "maplibre-gl/dist/maplibre-gl.css";
import MapView from "./components/MapView";
import UploadCsvButton from "./components/UploadCsvButton";
import AttributeTable from "./components/AttributeTable";
import { useMapStore } from "./store/useMapStore";
import { useState } from "react";

function App() {
  const layers = useMapStore((state) => state.layers);
  
  const selectLayer = useMapStore((state) => state.selectLayer);
  
  const selectedLayerId = useMapStore(
    (state) => state.selectedLayerId
  );

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    layerId: string;
  } | null>(null);
  
  const openAttributeTable = useMapStore(
    (state) => state.openAttributeTable
  );

  return (
    <div
      onClick={() => setContextMenu(null)}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        background: "#111827",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "320px",
          background: "#1f2937",
          borderRight: "1px solid #374151",
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Spatial Clustering Lab</h2>

        <UploadCsvButton />

        <div>
          <h3>Layers</h3>

          <div
            style={{
              padding: "12px",
              background: "#374151",
              borderRadius: "8px",
              marginTop: "8px",
            }}
          >
            {layers.length === 0 ? (
              <div
                style={{
                  padding: "12px",
                  background: "#374151",
                  borderRadius: "8px",
                  marginTop: "8px",
                }}
              >
                No layers loaded
              </div>
            ) : (
              layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectLayer(layer.id);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setContextMenu({
                      x: event.clientX,
                      y: event.clientY,
                      layerId: layer.id,
                    });
                  }}
                  style={{
                    padding: "12px",
                    background:
                      selectedLayerId === layer.id
                        ? "#2563eb"
                        : "#374151",
                    borderRadius: "8px",
                    marginTop: "8px",
                    cursor: "pointer",
                  }}
                >
                  {layer.name}
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                      marginTop: "4px",
                    }}
                  >
                    {layer.data.length} points
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
          }}
        >
          <MapView />
        </div>
        
        <AttributeTable />
      </div>

       {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "6px",
            zIndex: 9999,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <button
            onClick={() => {
              openAttributeTable(contextMenu.layerId);
              setContextMenu(null);
            }}
            style={{
              background: "transparent",
              color: "white",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              width: "180px",
              textAlign: "left",
            }}
          >
            Open Attribute Table
          </button>
        </div>
      )}

    </div>
  );
}

export default App;