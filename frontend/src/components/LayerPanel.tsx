import { useEffect, useState } from "react";
import { useMapStore } from "../store/useMapStore";
import LayerCard from "./LayerCard";

interface ContextMenuState {
  x: number;
  y: number;
  layerId: string;
}

function LayerPanel() {
  const layers = useMapStore((state) => state.layers);
  const selectedLayerId = useMapStore((state) => state.selectedLayerId);
  const openAttributeTable = useMapStore(
    (state) => state.openAttributeTable
  );
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(
    null
  );

  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);

    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  return (
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
            <LayerCard
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onContextMenu={(event) => {
                event.preventDefault();
                setContextMenu({
                  x: event.clientX,
                  y: event.clientY,
                  layerId: layer.id,
                });
              }}
            />
          ))
        )}
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

export default LayerPanel;
