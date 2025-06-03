from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
import faiss
import pickle
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploaded_docs'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize FAISS index
dimension = 384
index = faiss.IndexFlatL2(dimension)
texts = []  # store raw text for each vector

@app.route("/train", methods=["POST"])
def train_model():
    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Extract text from PDF
    pdf_reader = PyPDF2.PdfReader(filepath)
    full_text = ""
    for page in pdf_reader.pages:
        full_text += page.extract_text()

    # Chunk text (simplified by sentences)
    sentences = [s.strip() for s in full_text.split(".") if s.strip()]
    embeddings = model.encode(sentences)

    # Store in FAISS
    global index, texts
    index.add(embeddings)
    texts.extend(sentences)

    return jsonify({"message": "PDF processed and indexed"}), 200

@app.route("/query", methods=["POST"])
def query_model():
    data = request.get_json()
    question = data.get("question", "")

    # Embed question and search
    query_vector = model.encode([question])
    D, I = index.search(query_vector, k=3)

    results = [texts[i] for i in I[0] if i < len(texts)]
    answer = " ".join(results)

    return jsonify({
        "question": question,
        "answer": answer,
        "context": results
    })

if __name__ == "__main__":
    app.run(port=5001)
