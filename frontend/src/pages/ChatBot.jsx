import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import "../css/ChatBot.css";
import { jsPDF } from "jspdf";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [pdf, setPdf] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const initialWelcome = {
    sender: "bot",
    text: "Hello, how can I assist you today?",
    sources: [],
    context: "",
  };

  useEffect(() => {
    setChatHistory([initialWelcome]);
  }, []);

  const cleanResponse = (text) => {
    return text.replace(/\*\*/g, "").replace(/\*/g, "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdf) return;

    const formData = new FormData();
    formData.append("pdf_file", pdf);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF.");
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: "user", text: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      const res = await axios.post("http://localhost:5000/ask", { question });
      const botMessage = {
        sender: "bot",
        text: cleanResponse(res.data.answer),
        sources: res.data.sources || [],
        context: res.data.context || "",
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      alert("Failed to get response.");
    }
  };

  // Export chat history as PDF
  const exportChatAsPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Chat Conversation", 10, y);
    y += 10;

    doc.setFontSize(12);

    chatHistory.forEach((msg) => {
      const senderLabel = msg.sender === "user" ? "User:" : "Bot:";
      const lines = doc.splitTextToSize(msg.text, 180);

      doc.setTextColor(msg.sender === "user" ? "#007bff" : "#1e293b");
      doc.text(senderLabel, 10, y);
      y += 7;

      doc.setTextColor("#000000");
      doc.text(lines, 20, y);
      y += lines.length * 7;

      if (msg.sender === "bot" && msg.sources && msg.sources.length > 0) {
        doc.setTextColor("#475569");
        doc.text("Sources:", 20, y);
        y += 7;

        msg.sources.forEach((src) => {
          const srcLines = doc.splitTextToSize("- " + src, 170);
          doc.text(srcLines, 25, y);
          y += srcLines.length * 7;
        });
      }

      y += 5;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("chat_conversation.pdf");
  };

  // Reset conversation to initial state
  const resetConversation = () => {
    setChatHistory([initialWelcome]);
    setQuestion("");
  };

  return (
    <div>
      <Navbar />
      <div className="chatbot-container">

        {/* Export & Reset buttons */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button onClick={exportChatAsPDF} className="export-btn">
            Export Conversation as PDF
          </button>
          <button onClick={resetConversation} className="reset-btn">
            Reset Conversation
          </button>
        </div>

        {/* Optional Upload Section */}
        {/* <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
          <button type="submit" disabled={!pdf}>
            Upload PDF
          </button>
        </form> */}

        <div className="chat-box">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "user" ? "user" : "bot"
              }`}
            >
              <div className="message-text">{msg.text}</div>
              {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                <div className="extra-info">
                  <h4>Sources:</h4>
                  <ul>
                    {msg.sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button onClick={handleAsk} disabled={!question.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;