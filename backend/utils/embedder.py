import os
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

def load_embedder():
    return SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks, embedder, embedding_path):
    if os.path.exists(embedding_path):
        return np.load(embedding_path)
    embeddings = embedder.encode(chunks, show_progress_bar=True)
    np.save(embedding_path, embeddings)
    return embeddings