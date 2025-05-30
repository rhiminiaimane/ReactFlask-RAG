import React, { useState } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import "../css/ChatBot.css";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [pdf, setPdf] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

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
        sources: res.data.sources,
        context: res.data.context,
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      alert("Failed to get response.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="chatbot-container">
        {/*
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
          <button type="submit" disabled={!pdf}>
            Upload PDF
          </button>
        </form>
        */}

        <div className="chat-box">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "user" ? "user" : "bot"
              }`}
            >
              <div className="message-text">{msg.text}</div>
              {msg.sender === "bot" && (
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
          <button onClick={handleAsk} disabled={!question}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;