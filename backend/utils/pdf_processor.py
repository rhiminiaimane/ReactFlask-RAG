from PyPDF2 import PdfReader
import os
import pickle

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    return " ".join(page.extract_text() for page in reader.pages)

def chunk_text(text, chunk_size=512, overlap=50):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i + chunk_size])
    return chunks

def load_or_create_chunks(pdf_path, chunk_path):
    if os.path.exists(chunk_path):
        with open(chunk_path, "rb") as f:
            return pickle.load(f)
    text = extract_text_from_pdf(pdf_path)
    chunks = chunk_text(text)
    with open(chunk_path, "wb") as f:
        pickle.dump(chunks, f)
    return chunks