import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from utils import embedder, pdf_processor, retriever, qa

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "backend", "data")
CACHE_DIR = os.path.join(os.getcwd(), "backend", "cache")
INDEX_PATH = os.path.join(CACHE_DIR, "faiss_index.faiss")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)

embedder_model = embedder.load_embedder()

def process_pdfs():
    chunks_meta = []
    all_embeddings = []

    pdf_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".pdf")]
    for pdf in pdf_files:
        base_name = os.path.splitext(pdf)[0]
        chunk_path = os.path.join(CACHE_DIR, f"{base_name}_chunks.pkl")
        embedding_path = os.path.join(CACHE_DIR, f"{base_name}_embeddings.npy")
        pdf_path = os.path.join(UPLOAD_FOLDER, pdf)

        chunks = pdf_processor.load_or_create_chunks(pdf_path, chunk_path)
        embeddings = embedder.embed_chunks(chunks, embedder_model, embedding_path)

        chunks_meta.extend([{"chunk": chunk, "pdf": pdf} for chunk in chunks])
        all_embeddings.append(embeddings)

    index = retriever.create_or_load_faiss_index(np.vstack(all_embeddings), INDEX_PATH)
    return index, chunks_meta

index, chunks_meta = process_pdfs()

@app.route("/upload", methods=["POST"])
def upload_pdf():
    file = request.files.get("pdf_file")
    if not file or not file.filename.endswith(".pdf"):
        return jsonify({"error": "No PDF file provided."}), 400

    filename = secure_filename(file.filename)
    pdf_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(pdf_path)

    global index, chunks_meta
    index, chunks_meta = process_pdfs()

    return jsonify({"message": "PDF uploaded and processed."}), 200

@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Question is required."}), 400

    relevant_chunks = retriever.retrieve_relevant_chunks(question, embedder_model, index, chunks_meta)
    context = " ".join(chunk["chunk"] for chunk in relevant_chunks)
    sources = list(set(chunk["pdf"] for chunk in relevant_chunks))
    answer = qa.ask_gemini(context, question)

    return jsonify({
        "answer": answer,
        "sources": sources,
        "context": context[:300]
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)