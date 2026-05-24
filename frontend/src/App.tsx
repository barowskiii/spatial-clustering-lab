import "maplibre-gl/dist/maplibre-gl.css";

function App() {
  return (
    <div
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

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          Upload Data
        </button>

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
            No layers loaded
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#0f172a",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            zIndex: 10,
            background: "rgba(0,0,0,0.7)",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
        >
          Map View
        </div>
      </div>
    </div>
  );
}

export default App;