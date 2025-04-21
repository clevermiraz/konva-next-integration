import React from "react";
import Chat from "./Chat";

export default function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <Chat />
    </div>
  );
}
