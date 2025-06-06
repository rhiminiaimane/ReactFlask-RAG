import faiss
import os
import numpy as np

def create_or_load_faiss_index(embeddings, index_path):
    if os.path.exists(index_path):
        return faiss.read_index(index_path)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    faiss.write_index(index, index_path)
    return index

def retrieve_relevant_chunks(question, embedder, index, chunks_with_metadata, k=3):
    question_embedding = embedder.encode([question])
    _, indices = index.search(question_embedding, k)
    
    retrieved = [
        {
            "chunk": chunks_with_metadata[i]["chunk"],
            "pdf": chunks_with_metadata[i]["pdf"]
        }
        for i in indices[0]
    ]
    
    return retrieved