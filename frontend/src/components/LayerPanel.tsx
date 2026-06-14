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
  const reorderLayers = useMapStore((state) => state.reorderLayers);
  const openAttributeTable = useMapStore(
    (state) => state.openAttributeTable
  );
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(
    null
  );
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dropTargetLayerId, setDropTargetLayerId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);

    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>Layers</h3>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: "8px",
          background: "#374151",
          borderRadius: "8px",
          overflowX: "hidden",
          overflowY: "auto",
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
              isDragging={draggedLayerId === layer.id}
              isDropTarget={dropTargetLayerId === layer.id}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", layer.id);
                setDraggedLayerId(layer.id);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setDropTargetLayerId(layer.id);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setDropTargetLayerId((current) =>
                    current === layer.id ? null : current
                  );
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const sourceLayerId =
                  draggedLayerId || event.dataTransfer.getData("text/plain");

                if (sourceLayerId) {
                  reorderLayers(sourceLayerId, layer.id);
                }

                setDraggedLayerId(null);
                setDropTargetLayerId(null);
              }}
              onDragEnd={() => {
                setDraggedLayerId(null);
                setDropTargetLayerId(null);
              }}
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
