import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  RegularPolygon,
  Line,
  Text,
  Image,
  Transformer,
} from "react-konva";
import Toolbar from "./Toolbar";

export default function Editor({ initialContent }) {
  const [tool, setTool] = useState("select");
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentFill, setCurrentFill] = useState("#f0f0f0");
  const [currentStroke] = useState("#555555");
  const [currentStrokeWidth] = useState(2);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const lastLineRef = useRef(null);
  const [hasContent, setHasContent] = useState(!!initialContent);

  const mmToPx = (mm) => (mm * 72) / 25.4;
  const dinA4Width = mmToPx(210); // 595px
  const dinA4Height = mmToPx(297); // 842px

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".canvas-container");
      if (container) {
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        const scaleX = containerWidth / dinA4Width;
        const scaleY = containerHeight / dinA4Height;
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (initialContent) {
      // Render initial markdown content as plain text in the canvas
      const cleanedText = initialContent.replace(/[#*_-]/g, ""); // Strip markdown symbols
      setShapes([
        {
          type: "text",
          x: 40,
          y: 40,
          text: cleanedText,
          fontSize: 16,
          fontFamily: "Arial",
          fill: "black",
          width: dinA4Width - 80,
          id: shapes.length + 1,
        },
      ]);
      setHasContent(true);
    } else {
      setShapes([]);
      setHasContent(false);
    }
  }, [initialContent]);

  const handleMouseDown = (e) => {
    if (tool === "addLine") {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      lastLineRef.current = {
        points: [pos.x / scale, pos.y / scale, pos.x / scale, pos.y / scale],
        id: shapes.length + 1,
        type: "line",
        stroke: currentStroke,
        strokeWidth: currentStrokeWidth,
      };
      setShapes([...shapes, lastLineRef.current]);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && lastLineRef.current) {
      const pos = e.target.getStage().getPointerPosition();
      const points = lastLineRef.current.points;
      points.push(pos.x / scale, pos.y / scale);
      lastLineRef.current.points = points;
      setShapes([...shapes]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastLineRef.current = null;
    }
  };

  const handleClick = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const scaledPos = { x: pos.x / scale, y: pos.y / scale };

    if (tool === "addText") {
      const text = prompt("Enter text:", "Text") || "Text";
      setShapes([
        ...shapes,
        {
          type: "text",
          x: scaledPos.x,
          y: scaledPos.y,
          text,
          fontSize: 18,
          fill: currentFill,
          id: shapes.length + 1,
        },
      ]);
      setTool("select");
    } else if (tool === "addRect") {
      setShapes([
        ...shapes,
        {
          type: "rect",
          x: scaledPos.x,
          y: scaledPos.y,
          width: 100,
          height: 50,
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: currentStrokeWidth,
          id: shapes.length + 1,
        },
      ]);
      setTool("select");
    } else if (tool === "addCircle") {
      setShapes([
        ...shapes,
        {
          type: "circle",
          x: scaledPos.x,
          y: scaledPos.y,
          radius: 30,
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: currentStrokeWidth,
          id: shapes.length + 1,
        },
      ]);
      setTool("select");
    } else if (tool === "addTriangle") {
      setShapes([
        ...shapes,
        {
          type: "triangle",
          x: scaledPos.x,
          y: scaledPos.y,
          radius: 30,
          sides: 3,
          fill: currentFill,
          stroke: currentStroke,
          strokeWidth: currentStrokeWidth,
          id: shapes.length + 1,
        },
      ]);
      setTool("select");
    } else if (tool === "select" && e.target !== stage) {
      transformerRef.current.nodes([e.target]);
      transformerRef.current.getLayer().batchDraw();
    } else if (tool === "select") {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentFill(newColor);
    if (transformerRef.current.nodes().length > 0) {
      const node = transformerRef.current.nodes()[0];
      node.fill(newColor);
      node.getLayer().batchDraw();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          setShapes([
            ...shapes,
            {
              type: "image",
              x: 50,
              y: 50,
              image: img,
              width: 200,
              height: 200 * (img.height / img.width),
              id: shapes.length + 1,
            },
          ]);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoom = (factor) => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const newScale = oldScale * factor;
    if (newScale < 0.3) return;
    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
  };

  const handleResetZoom = () => {
    const stage = stageRef.current;
    stage.scale({ x: scale, y: scale });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
  };

  const handleDownload = () => {
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(initialContent || "Keine Daten verfügbar")
      .then(() => {
        const btn = document.getElementById("copyBtn");
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check me-1"></i> Kopiert';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      })
      .catch((err) => {
        console.error("Fehler beim Kopieren:", err);
      });
  };

  return (
    <div className="editor-container">
      <style>{`
        .editor-header {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          background-color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .editor-content {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: auto;
        }
        .canvas-container {
          width: 100%;
          height: calc(100% - 70px);
          background-color: #e0e0e0;
          border-radius: 8px;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
          position: relative;
        }
        .konva-container {
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          background-color: white;
        }
        .zoom-controls {
          position: absolute;
          bottom: 80px;
          right: 20px;
          background-color: white;
          border-radius: 5px;
          padding: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          z-index: 100;
          display: flex;
          gap: 10px;
        }
        .alert-info {
          margin-top: 1rem;
          width: 100%;
          max-width: 600px;
          text-align: center;
        }
      `}</style>
      <div className="editor-header">
        <h5 className="mb-0">Editor</h5>
        <div className="editor-tools">
          <button
            className="btn btn-sm btn-outline-primary"
            id="downloadBtn"
            onClick={handleDownload}
          >
            <i className="bi bi-download me-1"></i> Herunterladen
          </button>
          <button className="btn btn-sm btn-outline-primary" id="copyBtn" onClick={handleCopy}>
            <i className="bi bi-clipboard me-1"></i> Kopieren
          </button>
        </div>
      </div>
      <div className="editor-content">
        {hasContent ? (
          <div className="canvas-container">
            <div
              className="konva-container"
              style={{ width: `${dinA4Width * scale}px`, height: `${dinA4Height * scale}px` }}
            >
              <Stage
                width={dinA4Width * scale}
                height={dinA4Height * scale}
                scaleX={scale}
                scaleY={scale}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleClick}
              >
                <Layer>
                  {shapes.map((shape) => {
                    if (shape.type === "rect") {
                      return (
                        <Rect
                          key={shape.id}
                          x={shape.x}
                          y={shape.y}
                          width={shape.width}
                          height={shape.height}
                          fill={shape.fill}
                          stroke={shape.stroke}
                          strokeWidth={shape.strokeWidth}
                          draggable
                        />
                      );
                    } else if (shape.type === "circle") {
                      return (
                        <Circle
                          key={shape.id}
                          x={shape.x}
                          y={shape.y}
                          radius={shape.radius}
                          fill={shape.fill}
                          stroke={shape.stroke}
                          strokeWidth={shape.strokeWidth}
                          draggable
                        />
                      );
                    } else if (shape.type === "triangle") {
                      return (
                        <RegularPolygon
                          key={shape.id}
                          x={shape.x}
                          y={shape.y}
                          sides={shape.sides}
                          radius={shape.radius}
                          fill={shape.fill}
                          stroke={shape.stroke}
                          strokeWidth={shape.strokeWidth}
                          draggable
                        />
                      );
                    } else if (shape.type === "line") {
                      return (
                        <Line
                          key={shape.id}
                          points={shape.points}
                          stroke={shape.stroke}
                          strokeWidth={shape.strokeWidth}
                          lineCap="round"
                          lineJoin="round"
                          tension={0.5}
                          draggable
                        />
                      );
                    } else if (shape.type === "text") {
                      return (
                        <Text
                          key={shape.id}
                          x={shape.x}
                          y={shape.y}
                          text={shape.text}
                          fontSize={shape.fontSize}
                          fontFamily={shape.fontFamily}
                          fill={shape.fill}
                          width={shape.width}
                          draggable
                        />
                      );
                    } else if (shape.type === "image") {
                      return (
                        <Image
                          key={shape.id}
                          x={shape.x}
                          y={shape.y}
                          image={shape.image}
                          width={shape.width}
                          height={shape.height}
                          draggable
                        />
                      );
                    }
                    return null;
                  })}
                  <Transformer ref={transformerRef} />
                </Layer>
              </Stage>
            </div>
            <div className="zoom-controls">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleZoom(1.2)}>
                <i className="bi bi-zoom-in"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleZoom(1 / 1.2)}
              >
                <i className="bi bi-zoom-out"></i>
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleResetZoom}>
                <i className="bi bi-aspect-ratio"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="alert alert-info" id="noDataAlert">
            <i className="bi bi-info-circle me-2"></i>
            Keine Daten verfügbar. Bitte starten Sie eine neue Anfrage.
          </div>
        )}
        {hasContent && (
          <Toolbar
            setTool={setTool}
            currentTool={tool}
            onColorChange={handleColorChange}
            onImageUpload={handleImageUpload}
          />
        )}
      </div>
    </div>
  );
}
