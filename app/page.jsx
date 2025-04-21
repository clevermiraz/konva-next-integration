"use client";

import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [initialResponse, setInitialResponse] = useState(null);

  useEffect(() => {
    // Fetch initial AI response on page load
    const fetchInitialResponse = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Initial request" }),
        });
        const data = await response.json();
        setInitialResponse(data);
      } catch (error) {
        console.error("Error fetching initial response:", error);
        // Fallback demo response
        setInitialResponse({
          summary: `# Initial AI Response\n\nIch habe folgendes Ergebnis für Sie erstellt.\n\n- **Details**: Siehe Editor für Inhalt.`,
          editor_content: `# Demo Editor Content\n\nDies ist ein Beispielinhalt für den Editor.\n\n- Punkt 1\n- Punkt 2\n\n**Hervorgehoben**: Wichtiger Text`,
        });
      }
    };
    fetchInitialResponse();
  }, []);

  return (
    <div className="font-sans h-screen overflow-hidden">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --primary-color: #4361ee;
          --secondary-color: #3f37c9;
          --accent-color: #4cc9f0;
          --light-color: #f8f9fa;
          --dark-color: #212529;
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }
        .main-container {
          display: flex;
          height: 100vh;
          margin-top: 56px;
        }
        .sidebar {
          width: 33.333%;
          background-color: var(--light-color);
          padding: 1rem;
          overflow-y: auto;
          height: 100%;
          transition: transform 0.3s;
          border-right: 1px solid #ddd;
        }
        .sidebar.collapsed {
          transform: translateX(-100%);
        }
        .editor-container {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          height: 100%;
          background-color: white;
          display: flex;
          flex-direction: column;
        }
        .toggle-sidebar {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 1010;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .loading-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 1000;
          display: none;
        }
        .loading-indicator.active {
          display: block;
        }
        .spinner-border {
          color: var(--primary-color);
          width: 3rem;
          height: 3rem;
        }
      `}</style>
      <Navbar />
      <div className="main-container">
        <button className="toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <i className={`bi ${isSidebarOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
        </button>
        <Sidebar isOpen={isSidebarOpen} initialResponse={initialResponse} />
        <Editor initialContent={initialResponse?.editor_content} />
        <div className="loading-indicator" id="loadingIndicator">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Wird geladen...</span>
          </div>
          <p className="mt-3">Ihre Anfrage wird verarbeitet...</p>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}
