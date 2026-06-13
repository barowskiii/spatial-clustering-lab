import type { MouseEvent } from "react";
import { useMapStore } from "../store/useMapStore";
import type { LayerData, SymbologyMode } from "../types/layer";

interface LayerCardProps {
  layer: LayerData;
  isSelected: boolean;
  onContextMenu: (event: MouseEvent<HTMLDivElement>) => void;
}

const colorToHex = (color: [number, number, number]) =>
  `#${color.map((value) => value.toString(16).padStart(2, "0")).join("")}`;

const hexToColor = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

function LayerCard({ layer, isSelected, onContextMenu }: LayerCardProps) {
  const selectLayer = useMapStore((state) => state.selectLayer);
  const updateLayerStyle = useMapStore((state) => state.updateLayerStyle);

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        selectLayer(layer.id);
      }}
      onContextMenu={onContextMenu}
      style={{
        padding: "12px",
        background: isSelected ? "#2563eb" : "#374151",
        borderRadius: "8px",
        marginTop: "8px",
        cursor: "pointer",
      }}
    >
      {layer.name}
      <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
        {layer.data.length} points
      </div>

      <div
        style={{ marginTop: "10px", display: "grid", gap: "8px" }}
        onClick={(event) => event.stopPropagation()}
      >
        <label style={{ fontSize: "12px" }}>
          Symbology
          <select
            value={layer.style.mode}
            onChange={(event) =>
              updateLayerStyle(layer.id, {
                mode: event.target.value as SymbologyMode,
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

                updateLayerStyle(layer.id, { categoryField: field, categories });
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
                    value={colorToHex(category.color)}
                    onChange={(event) => {
                      const color = hexToColor(event.target.value);
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
                  .map((item) => Number(item.properties[field]))
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

        {layer.style.mode === "graduated" && layer.style.graduated && (
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Min: {layer.style.graduated.min} / Max: {layer.style.graduated.max}
            </div>
            <label style={{ fontSize: "12px" }}>
              Start Color
              <input
                type="color"
                value={colorToHex(layer.style.graduated.startColor)}
                onChange={(event) =>
                  updateLayerStyle(layer.id, {
                    graduated: {
                      ...layer.style.graduated!,
                      startColor: hexToColor(event.target.value),
                    },
                  })
                }
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
            <label style={{ fontSize: "12px" }}>
              End Color
              <input
                type="color"
                value={colorToHex(layer.style.graduated.endColor)}
                onChange={(event) =>
                  updateLayerStyle(layer.id, {
                    graduated: {
                      ...layer.style.graduated!,
                      endColor: hexToColor(event.target.value),
                    },
                  })
                }
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
              updateLayerStyle(layer.id, { visible: event.target.checked })
            }
          />{" "}
          Visible
        </label>

        <label style={{ fontSize: "12px" }}>
          Color
          <input
            type="color"
            value={colorToHex(layer.style.color)}
            onChange={(event) =>
              updateLayerStyle(layer.id, {
                color: hexToColor(event.target.value),
              })
            }
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
  );
}

export default LayerCard;
