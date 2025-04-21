import React from "react";

export default function Toolbar({ setTool, currentTool, onColorChange, onImageUpload }) {
  const tools = [
    { name: "select", icon: "bi-cursor", title: "Auswählen" },
    { name: "hand", icon: "bi-hand", title: "Hand" },
    { name: "addText", icon: "bi-fonts", title: "Text hinzufügen" },
    { name: "addRect", icon: "bi-square", title: "Rechteck" },
    { name: "addCircle", icon: "bi-circle", title: "Kreis" },
    { name: "addTriangle", icon: "bi-triangle", title: "Dreieck" },
    { name: "addLine", icon: "bi-slash-lg", title: "Linie" },
    { name: "uploadImage", icon: "bi-image", title: "Bild hochladen" },
    { name: "addShape", icon: "bi-hexagon", title: "Formen" },
    { name: "colorPicker", icon: "bi-palette", title: "Farbe" },
  ];

  return (
    <div id="konva-toolbar">
      <style>{`
        #konva-toolbar {
          display: flex;
          gap: 5px;
          padding: 10px 20px;
          background-color: white;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
          justify-content: center;
          border-top: 1px solid #eaeaea;
          margin-top: 15px;
          width: 100%;
        }
        .toolbar-section {
          display: flex;
          align-items: center;
          padding: 0 15px;
          border-right: 1px solid #eaeaea;
        }
        .toolbar-section:last-child {
          border-right: none;
        }
        .tool-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 5px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tool-btn:hover {
          background-color: #f0f0f0;
        }
        .tool-btn.active {
          background-color: #e6f7ff;
          color: #1890ff;
        }
        .tool-btn i {
          font-size: 1.2rem;
        }
      `}</style>
      <div className="toolbar-section">
        {tools.slice(0, 2).map((tool) => (
          <button
            key={tool.name}
            className={`tool-btn ${currentTool === tool.name ? "active" : ""}`}
            title={tool.title}
            onClick={() => setTool(tool.name)}
          >
            <i className={`bi ${tool.icon}`}></i>
          </button>
        ))}
      </div>
      <div className="toolbar-section">
        <button
          className={`tool-btn ${currentTool === "addText" ? "active" : ""}`}
          title="Text hinzufügen"
          onClick={() => setTool("addText")}
        >
          <i className="bi bi-fonts"></i>
        </button>
      </div>
      <div className="toolbar-section">
        {tools.slice(3, 7).map((tool) => (
          <button
            key={tool.name}
            className={`tool-btn ${currentTool === tool.name ? "active" : ""}`}
            title={tool.title}
            onClick={() => setTool(tool.name)}
          >
            <i className={`bi ${tool.icon}`}></i>
          </button>
        ))}
      </div>
      <div className="toolbar-section">
        <button
          className={`tool-btn ${currentTool === "uploadImage" ? "active" : ""}`}
          title="Bild hochladen"
          onClick={() => document.getElementById("imageUpload").click()}
        >
          <i className="bi bi-image"></i>
        </button>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onImageUpload}
        />
        <button
          className={`tool-btn ${currentTool === "addShape" ? "active" : ""}`}
          title="Formen"
          onClick={() => alert("This function will be available soon!")}
        >
          <i className="bi bi-hexagon"></i>
        </button>
      </div>
      <div className="toolbar-section">
        <button
          className={`tool-btn ${currentTool === "colorPicker" ? "active" : ""}`}
          title="Farbe"
          onClick={() => document.getElementById("colorPicker").click()}
        >
          <i className="bi bi-palette"></i>
        </button>
        <input type="color" id="colorPicker" style={{ display: "none" }} onChange={onColorChange} />
      </div>
    </div>
  );
}
