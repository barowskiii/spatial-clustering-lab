import "maplibre-gl/dist/maplibre-gl.css";
import AttributeTable from "./components/AttributeTable";
import LayerPanel from "./components/LayerPanel";
import MapView from "./components/MapView";
import UploadCsvButton from "./components/UploadCsvButton";

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
        <LayerPanel />
      </div>

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
    </div>
  );
}

export default App;
