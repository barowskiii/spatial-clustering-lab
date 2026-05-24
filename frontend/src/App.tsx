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

  const updateLayerStyle = useMapStore(
    (state) => state.updateLayerStyle
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
          zIndex: 10,
          position: "relative",
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

                  <div
                    style={{
                      marginTop: "10px",
                      display: "grid",
                      gap: "8px",
                    }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    
                    <label style={{ fontSize: "12px" }}>
                      Symbology

                      <select
                        value={layer.style.mode}
                        onChange={(event) =>
                          updateLayerStyle(layer.id, {
                            mode: event.target.value as
                              | "single"
                              | "categorized"
                              | "graduated",
                          })
                        }
                        style={{
                          width: "100%",
                          marginTop: "4px",
                          padding: "6px",
                          borderRadius: "6px",
                        }}
                      >
                        <option value="single">Single Symbol</option>
                        <option value="categorized">Categorized</option>
                        <option value="graduated">Graduated</option>
                      </select>
                    </label>

                    {layer.style.mode === "categorized" && (
                      <label style={{ fontSize: "12px" }}>
                        Category Field
                        <select
                          value={layer.style.categoryField ?? ""}
                          onChange={(event) => {
                            const field = event.target.value;
                          
                            const uniqueValues = Array.from(
                              new Set(
                                layer.data.map((item) =>
                                  String(item.properties[field] ?? "")
                                )
                              )
                            ).slice(0, 20);
                          
                            const categories = uniqueValues.map((value) => ({
                              value,
                              color: [
                                Math.floor(Math.random() * 255),
                                Math.floor(Math.random() * 255),
                                Math.floor(Math.random() * 255),
                              ] as [number, number, number],
                            }));
                          
                            updateLayerStyle(layer.id, {
                              categoryField: field,
                              categories,
                            });
                          }}
                          style={{
                            width: "100%",
                            marginTop: "4px",
                            padding: "6px",
                            borderRadius: "6px",
                          }}
                        >
                          <option value="">Select field</option>
                        
                          {layer.columns.map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {layer.style.mode === "categorized" &&
                      layer.style.categories &&
                      layer.style.categories.length > 0 && (
                        <div style={{ display: "grid", gap: "6px" }}>
                          {layer.style.categories.map((category) => (
                            <div
                              key={category.value}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "28px 1fr",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                              }}
                            >
                              <input
                                type="color"
                                value={`#${category.color
                                  .map((value) =>
                                    value.toString(16).padStart(2, "0")
                                  )
                                  .join("")}`}
                                onChange={(event) => {
                                  const hex = event.target.value;
                                
                                  const color: [number, number, number] = [
                                    parseInt(hex.slice(1, 3), 16),
                                    parseInt(hex.slice(3, 5), 16),
                                    parseInt(hex.slice(5, 7), 16),
                                  ];
                                
                                  updateLayerStyle(layer.id, {
                                    categories: layer.style.categories?.map((item) =>
                                      item.value === category.value
                                        ? { ...item, color }
                                        : item
                                    ),
                                  });
                                }}
                              />
                    
                              <span
                                title={category.value}
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {category.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                    {layer.style.mode === "graduated" && (
                      <label style={{ fontSize: "12px" }}>
                        Graduated Field
                        <select
                          value={layer.style.graduated?.field ?? ""}
                          onChange={(event) => {
                            const field = event.target.value;
                          
                            const numericValues = layer.data
                              .map((item) =>
                                Number(item.properties[field])
                              )
                              .filter((value) => !Number.isNaN(value));
                            
                            const min = Math.min(...numericValues);
                            const max = Math.max(...numericValues);
                            
                            updateLayerStyle(layer.id, {
                              graduated: {
                                field,
                                min,
                                max,
                                startColor: [0, 140, 255],
                                endColor: [255, 0, 0],
                              },
                            });
                          }}
                          style={{
                            width: "100%",
                            marginTop: "4px",
                            padding: "6px",
                            borderRadius: "6px",
                          }}
                        >
                          <option value="">Select numeric field</option>
                        
                          {layer.columns.map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {layer.style.mode === "graduated" &&
                      layer.style.graduated && (
                        <div style={{ display: "grid", gap: "8px" }}>
                          <div style={{ fontSize: "12px", opacity: 0.8 }}>
                            Min: {layer.style.graduated.min} / Max:{" "}
                            {layer.style.graduated.max}
                          </div>
                      
                          <label style={{ fontSize: "12px" }}>
                            Start Color
                            <input
                              type="color"
                              value={`#${layer.style.graduated.startColor
                                .map((value) => value.toString(16).padStart(2, "0"))
                                .join("")}`}
                              onChange={(event) => {
                                const hex = event.target.value;
                              
                                updateLayerStyle(layer.id, {
                                  graduated: {
                                    ...layer.style.graduated!,
                                    startColor: [
                                      parseInt(hex.slice(1, 3), 16),
                                      parseInt(hex.slice(3, 5), 16),
                                      parseInt(hex.slice(5, 7), 16),
                                    ],
                                  },
                                });
                              }}
                              style={{ width: "100%", marginTop: "4px" }}
                            />
                          </label>
                            
                          <label style={{ fontSize: "12px" }}>
                            End Color
                            <input
                              type="color"
                              value={`#${layer.style.graduated.endColor
                                .map((value) => value.toString(16).padStart(2, "0"))
                                .join("")}`}
                              onChange={(event) => {
                                const hex = event.target.value;
                              
                                updateLayerStyle(layer.id, {
                                  graduated: {
                                    ...layer.style.graduated!,
                                    endColor: [
                                      parseInt(hex.slice(1, 3), 16),
                                      parseInt(hex.slice(3, 5), 16),
                                      parseInt(hex.slice(5, 7), 16),
                                    ],
                                  },
                                });
                              }}
                              style={{ width: "100%", marginTop: "4px" }}
                            />
                          </label>
                        </div>
                      )}
                    
                    <label style={{ fontSize: "12px" }}>
                      <input
                        type="checkbox"
                        checked={layer.style.visible}
                        onChange={(event) =>
                          updateLayerStyle(layer.id, {
                            visible: event.target.checked,
                          })
                        }
                      />{" "}
                      Visible
                    </label>
                      
                    <label style={{ fontSize: "12px" }}>
                      Color
                      <input
                        type="color"
                        value={`#${layer.style.color
                          .map((value) => value.toString(16).padStart(2, "0"))
                          .join("")}`}
                        onChange={(event) => {
                          const hex = event.target.value;
                          const color: [number, number, number] = [
                            parseInt(hex.slice(1, 3), 16),
                            parseInt(hex.slice(3, 5), 16),
                            parseInt(hex.slice(5, 7), 16),
                          ];
                        
                          updateLayerStyle(layer.id, { color });
                        }}
                        style={{ width: "100%", marginTop: "4px" }}
                      />
                    </label>
                      
                    <label style={{ fontSize: "12px" }}>
                      Radius: {layer.style.radius}px
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={layer.style.radius}
                        onChange={(event) =>
                          updateLayerStyle(layer.id, {
                            radius: Number(event.target.value),
                          })
                        }
                        style={{ width: "100%" }}
                      />
                    </label>
                      
                    <label style={{ fontSize: "12px" }}>
                      Opacity: {layer.style.opacity}
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={layer.style.opacity}
                        onChange={(event) =>
                          updateLayerStyle(layer.id, {
                            opacity: Number(event.target.value),
                          })
                        }
                        style={{ width: "100%" }}
                      />
                    </label>
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