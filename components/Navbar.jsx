import React from "react";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ position: "fixed", top: 0, width: "100%", zIndex: 1020 }}
    >
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="/dashboard">
          <i className="bi bi-tools me-2"></i>Tools Platform
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/dashboard">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/chat">
                Chat
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
