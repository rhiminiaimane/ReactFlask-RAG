import google.generativeai as genai

genai.configure(api_key="")
gemini = genai.GenerativeModel("gemini-1.5-flash")

def ask_gemini(context, question):
    prompt = f"""You are a medical assistant. Use the context below to answer the question:
Context: {context}
Question: {question}
Answer:"""
    return gemini.generate_content(prompt).text.strip()