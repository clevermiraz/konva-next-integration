import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat({ initialResponse }) {
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatMessages");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              text: "Hallo! Ich bin hier, um Ihnen mit Ihrem Ergebnis zu helfen. Sie können mir Fragen stellen oder Änderungen vorschlagen.",
              isUser: false,
              isMarkdown: false,
            },
          ];
    }
    return [];
  });
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial AI response to chat if available
    if (initialResponse) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: initialResponse.summary,
          isUser: false,
          isMarkdown: true,
        },
      ]);
    }
  }, [initialResponse]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      setError("Bitte geben Sie eine Nachricht ein.");
      return;
    }
    setError("");
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      isMarkdown: false,
    };
    setMessages([...messages, newMessage]);
    setInputText("");
    setIsLoading(true);
    document.getElementById("loadingIndicator").classList.add("active");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });
      const aiResponse = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: aiResponse.summary, isUser: false, isMarkdown: true },
      ]);
      // Note: editor_content is handled by parent component
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const demoResponse = {
        summary: `# AI Response\n\nDanke für Ihre Nachricht!\n\n- **Antwort**: Dies ist eine Demo-Antwort.\n- **Details**: Siehe Editor für Inhalt.`,
        editor_content: `# Demo Editor Content\n\nDies ist ein Beispielinhalt für den Editor.\n\n- Punkt 1\n- Punkt 2\n\n**Hervorgehoben**: Wichtiger Text`,
      };
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: demoResponse.summary, isUser: false, isMarkdown: true },
      ]);
    } finally {
      setIsLoading(false);
      document.getElementById("loadingIndicator").classList.remove("active");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container h-100 d-flex flex-column">
      <style>{`
        .chat-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .chat-header {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          background-color: white;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }
        .chat-input {
          padding: 1rem;
          border-top: 1px solid #ddd;
          background-color: white;
        }
        .message {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          max-width: 80%;
        }
        .message-user {
          background-color: var(--primary-color);
          color: white;
          align-self: flex-end;
          margin-left: auto;
          border-bottom-right-radius: 0;
        }
        .message-bot {
          background-color: #f1f1f1;
          color: var(--dark-color);
          align-self: flex-start;
          border-bottom-left-radius: 0;
        }
        .message-bot.markdown {
          background-color: #e9ecef;
          padding: 1rem;
          border-radius: 1rem;
        }
        .message-bot.markdown h1, .message-bot.markdown h2, .message-bot.markdown h3 {
          margin: 0.5rem 0;
          font-weight: bold;
        }
        .message-bot.markdown ul {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .message-bot.markdown strong {
          font-weight: bold;
        }
        .model-selector {
          max-width: 200px;
        }
      `}</style>
      <div className="chat-header">
        <h5 className="mb-0">Chat</h5>
        <div className="d-flex align-items-center mt-2">
          <small className="text-muted me-2">KI-Modell:</small>
          <select className="form-select form-select-sm model-selector" id="modelSelector">
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="gemini-pro">Gemini Pro</option>
          </select>
        </div>
      </div>
      <div className="chat-messages" id="chatMessages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isUser ? "message-user" : "message-bot"} ${
              msg.isMarkdown ? "markdown" : ""
            }`}
          >
            {msg.isMarkdown ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="d-flex align-items-center mb-2">
          <small className="text-muted me-2">Benutzer-ID:</small>
          <input
            type="number"
            className="form-control form-control-sm"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            min="1"
            style={{ maxWidth: "100px" }}
          />
        </div>
        {error && <p className="text-danger text-sm mb-2">{error}</p>}
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nachricht eingeben..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button className="btn btn-primary" onClick={handleSendMessage} disabled={isLoading}>
            <i className="bi bi-send"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
