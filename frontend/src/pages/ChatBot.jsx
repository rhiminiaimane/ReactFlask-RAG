import React, { useState } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [pdf, setPdf] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdf) return;

    const formData = new FormData();
    formData.append("pdf_file", pdf);

    await axios.post("http://localhost:5000/upload", formData);
  };

  const handleAsk = async () => {
    const res = await axios.post("http://localhost:5000/ask", {
      question,
    });
    setResponse(res.data);
  };

  return (
    <div> 
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>PDF QA App</h1>

        <form onSubmit={handleUpload}>
          <input type="file" accept=".pdf" onChange={(e) => setPdf(e.target.files[0])} />
          <button type="submit">Upload PDF</button>
        </form>

        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: 300, marginTop: 10 }}
        />
        <button onClick={handleAsk}>Ask</button>

        {response && (
          <div>
            <h3>Answer:</h3>
            <p>{response.answer}</p>
            <h4>Sources:</h4>
            <ul>{response.sources.map((src, i) => <li key={i}>{src}</li>)}</ul>
            <h4>Context Snippet:</h4>
            <p>{response.context}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBot;