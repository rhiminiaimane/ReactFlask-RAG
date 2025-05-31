from PyPDF2 import PdfReader
import os
import pickle
import re

def clean_text(text):
    text = re.sub(r'Page\s\d+|-\s\d+\s-', '', text) # les numéros de page
    text = re.sub(r'CONFIDENTIEL|Copyright.*|©.*|\bDOI:.*', '', text, flags=re.IGNORECASE) # les en-têtes/pieds de page
    text = re.sub(r'\n+', '\n', text) # les sauts de ligne
    text = re.sub(r' +', ' ', text) # les espaces multiples
    text = re.sub(r'(?<!\w)[^\w\s-]+(?!\w)', '', text) # les caractères spéciaux isolés (emojis...)
    return text.strip()

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = " ".join(page.extract_text() for page in reader.pages)
    return clean_text(text)  # Appliquer le nettoyage

def chunk_text(text, chunk_size=512, overlap=50):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence_length = len(sentence)
        if current_length + sentence_length <= chunk_size:
            current_chunk.append(sentence)
            current_length += sentence_length
        else:
            if current_chunk:  # Ne pas ajouter de chunks vides
                chunks.append(' '.join(current_chunk))
            current_chunk = [sentence]
            current_length = sentence_length
    
    if current_chunk:  # Ajouter le dernier chunk
        chunks.append(' '.join(current_chunk))
    
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