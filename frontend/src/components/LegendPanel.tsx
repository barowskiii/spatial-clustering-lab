import { useMapStore } from "../store/useMapStore";

type Color = [number, number, number];

const toRgb = (color: Color) => `rgb(${color.join(", ")})`;

const swatchStyle = (color: Color) => ({
  width: "14px",
  height: "14px",
  flexShrink: 0,
  borderRadius: "3px",
  background: toRgb(color),
  border: "1px solid rgba(255, 255, 255, 0.35)",
});

function LegendPanel() {
  const layers = useMapStore((state) => state.layers);
  const visibleLayers = layers.filter((layer) => layer.style.visible);

  if (visibleLayers.length === 0) return null;

  return (
    <div
      aria-label="Map legend"
      style={{
        position: "absolute",
        left: "12px",
        bottom: "12px",
        zIndex: 20,
        width: "300px",
        minWidth: "260px",
        maxWidth: "320px",
        flexShrink: 0,
        maxHeight: "40vh",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "10px",
        boxSizing: "border-box",
        border: "1px solid #4b5563",
        borderRadius: "8px",
        background: "rgba(17, 24, 39, 0.94)",
        color: "#f9fafb",
        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.35)",
        fontSize: "12px",
      }}
    >
      <div
        style={{
          marginBottom: "8px",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        Legend
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        {visibleLayers.map((layer) => (
          <div key={layer.id} style={{ minWidth: 0 }}>
            <div
              title={layer.name}
              style={{
                marginBottom: "5px",
                overflow: "hidden",
                fontWeight: 600,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {layer.name}
            </div>

            {layer.style.mode === "single" && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={swatchStyle(layer.style.color)} />
                <span style={{ color: "#d1d5db" }}>Single Symbol</span>
              </div>
            )}

            {layer.style.mode === "categorized" && (
              <div style={{ minWidth: 0 }}>
                <div style={{ marginBottom: "5px", color: "#9ca3af" }}>
                  {layer.style.categoryField || "No category field"}
                </div>
                <div style={{ display: "grid", gap: "4px", minWidth: 0 }}>
                  {layer.style.categories?.map((category) => (
                    <div
                      key={category.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        minWidth: 0,
                      }}
                    >
                      <span style={swatchStyle(category.color)} />
                      <span
                        title={category.value}
                        style={{
                          overflow: "hidden",
                          minWidth: 0,
                          color: "#d1d5db",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {category.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layer.style.mode === "graduated" && layer.style.graduated && (
              <div>
                <div style={{ marginBottom: "5px", color: "#9ca3af" }}>
                  {layer.style.graduated.field}
                </div>
                <div
                  style={{
                    height: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    borderRadius: "3px",
                    background: `linear-gradient(to right, ${toRgb(
                      layer.style.graduated.startColor
                    )}, ${toRgb(layer.style.graduated.endColor)})`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "3px",
                    color: "#d1d5db",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span>{layer.style.graduated.min}</span>
                  <span>{layer.style.graduated.max}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegendPanel;
