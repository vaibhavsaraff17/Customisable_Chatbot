from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
import json
import uuid
import shutil
from datetime import datetime
from pathlib import Path
from pymongo import MongoClient
from werkzeug.utils import secure_filename

# Configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"
UPLOAD_FOLDER = "vector_stores"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'json'}

# Flask setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['DEBUG'] = True
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# MongoDB connection (using a demo connection string)
MONGO_URI = "mongodb://localhost:27017/"  # Local MongoDB for demo
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    db = client["enhanced_chatbot_demo"]
    sessions_collection = db["sessions"]
    conversations_collection = db["conversations"]
    print("✓ MongoDB connected successfully")
except Exception as e:
    print(f"⚠ MongoDB not available: {e}")
    # Use in-memory storage for demo
    sessions_collection = None
    conversations_collection = None
    demo_sessions = {}
    demo_conversations = {}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_session_path(session_id):
    return os.path.join(UPLOAD_FOLDER, session_id)

def get_documents_path(session_id):
    return os.path.join(get_session_path(session_id), "documents")

def create_session_directories(session_id):
    session_path = get_session_path(session_id)
    documents_path = get_documents_path(session_id)
    
    os.makedirs(session_path, exist_ok=True)
    os.makedirs(documents_path, exist_ok=True)
    
    return session_path, documents_path

def demo_retrieve_context(session_id, query):
    """Demo context retrieval - returns sample context"""
    documents_path = get_documents_path(session_id)
    
    if not os.path.exists(documents_path):
        return ""
    
    # Simple keyword matching for demo
    context_parts = []
    for filename in os.listdir(documents_path):
        if filename.endswith('.txt'):
            try:
                with open(os.path.join(documents_path, filename), 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Simple keyword matching
                    if any(word.lower() in content.lower() for word in query.split()):
                        context_parts.append(content[:500])  # First 500 chars
            except Exception:
                continue
    
    return "\n\n".join(context_parts[:3])  # Max 3 documents

def demo_query_llm(session_id, query, custom_prompt=None):
    """Demo LLM query - simulates response or uses Ollama if available"""
    
    # Get session data
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id, {})
    
    # Get context
    context = demo_retrieve_context(session_id, query)
    
    # Build prompt
    if session_data and session_data.get("custom_prompt"):
        system_prompt = session_data["custom_prompt"]
    elif custom_prompt:
        system_prompt = custom_prompt
    else:
        system_prompt = "You are a helpful AI assistant."
    
    full_prompt = f"{system_prompt}\n\nContext: {context}\n\nUser: {query}\n\nAssistant:"
    
    # Try Ollama first, fallback to demo response
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "prompt": full_prompt,
            "stream": False
        }, timeout=10)
        
        if response.status_code == 200:
            return response.json().get("response", "No response received.")
    except Exception:
        pass
    
    # Demo response
    if context:
        return f"Based on your uploaded documents, I can help you with '{query}'. The relevant information shows that this relates to your training materials. However, I'm currently running in demo mode without the full AI model. Please ensure Ollama with LLaMA3 is running for complete functionality."
    else:
        return f"I understand you're asking about '{query}'. I'm currently running in demo mode. Please upload some training documents and ensure Ollama with LLaMA3 is running for full AI-powered responses."

# API Routes

@app.route("/")
def index():
    return render_template("dashboard.html")

@app.route("/api/sessions/create", methods=["POST"])
def create_session():
    """Create a new user session"""
    data = request.get_json() or {}
    
    session_id = str(uuid.uuid4())
    user_description = data.get("user_description", "")
    use_case = data.get("use_case", "")
    
    # Create session directories
    create_session_directories(session_id)
    
    # Store session
    session_doc = {
        "session_id": session_id,
        "user_description": user_description,
        "use_case": use_case,
        "created_at": datetime.utcnow(),
        "custom_prompt": "",
        "documents_count": 0
    }
    
    if sessions_collection:
        sessions_collection.insert_one(session_doc)
    else:
        demo_sessions[session_id] = session_doc
    
    return jsonify({
        "session_id": session_id,
        "created_at": session_doc["created_at"].isoformat()
    })

@app.route("/api/sessions/<session_id>/status", methods=["GET"])
def get_session_status(session_id):
    """Get session status and configuration"""
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    # Count documents
    documents_path = get_documents_path(session_id)
    documents_count = 0
    if os.path.exists(documents_path):
        documents_count = len([f for f in os.listdir(documents_path) 
                              if os.path.isfile(os.path.join(documents_path, f))])
    
    return jsonify({
        "session_id": session_id,
        "user_description": session_data.get("user_description", ""),
        "use_case": session_data.get("use_case", ""),
        "documents_count": documents_count,
        "custom_prompt": session_data.get("custom_prompt", ""),
        "vector_store_ready": documents_count > 0,  # Simplified for demo
        "created_at": session_data.get("created_at", "").isoformat() if session_data.get("created_at") else ""
    })

@app.route("/api/sessions/<session_id>/documents/upload", methods=["POST"])
def upload_documents(session_id):
    """Upload and process training documents"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []
    errors = []
    
    documents_path = get_documents_path(session_id)
    
    for file in files:
        if file.filename == '':
            continue
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(documents_path, filename)
            
            try:
                file.save(file_path)
                uploaded_files.append(filename)
            except Exception as e:
                errors.append(f"Error saving {filename}: {str(e)}")
        else:
            errors.append(f"File type not allowed: {file.filename}")
    
    # Update documents count
    if uploaded_files:
        documents_count = len([f for f in os.listdir(documents_path) 
                              if os.path.isfile(os.path.join(documents_path, f))])
        
        if sessions_collection:
            sessions_collection.update_one(
                {"session_id": session_id},
                {"$set": {"documents_count": documents_count}}
            )
        else:
            demo_sessions[session_id]["documents_count"] = documents_count
    
    return jsonify({
        "uploaded_files": uploaded_files,
        "errors": errors,
        "vector_store_updated": len(uploaded_files) > 0,
        "processing_status": "completed"
    })

@app.route("/api/sessions/<session_id>/documents", methods=["GET"])
def list_documents(session_id):
    """List all uploaded documents for a session"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    documents_path = get_documents_path(session_id)
    documents = []
    
    if os.path.exists(documents_path):
        for filename in os.listdir(documents_path):
            file_path = os.path.join(documents_path, filename)
            if os.path.isfile(file_path):
                stat = os.stat(file_path)
                documents.append({
                    "filename": filename,
                    "size": stat.st_size,
                    "upload_date": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    "status": "processed"
                })
    
    return jsonify({"documents": documents})

@app.route("/api/sessions/<session_id>/documents/<filename>", methods=["DELETE"])
def delete_document(session_id, filename):
    """Remove a specific document"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    documents_path = get_documents_path(session_id)
    file_path = os.path.join(documents_path, secure_filename(filename))
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        os.remove(file_path)
        
        # Update documents count
        documents_count = len([f for f in os.listdir(documents_path) 
                              if os.path.isfile(os.path.join(documents_path, f))])
        
        if sessions_collection:
            sessions_collection.update_one(
                {"session_id": session_id},
                {"$set": {"documents_count": documents_count}}
            )
        else:
            demo_sessions[session_id]["documents_count"] = documents_count
        
        return jsonify({
            "deleted": filename,
            "vector_store_updated": True
        })
    except Exception as e:
        return jsonify({"error": f"Error deleting file: {str(e)}"}), 500

@app.route("/api/sessions/<session_id>/prompt", methods=["PUT"])
def update_prompt(session_id):
    """Set or update custom instruction prompt"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.get_json()
    if not data or "custom_prompt" not in data:
        return jsonify({"error": "custom_prompt is required"}), 400
    
    custom_prompt = data["custom_prompt"]
    
    # Update session
    if sessions_collection:
        sessions_collection.update_one(
            {"session_id": session_id},
            {"$set": {"custom_prompt": custom_prompt}}
        )
    else:
        demo_sessions[session_id]["custom_prompt"] = custom_prompt
    
    return jsonify({
        "prompt_updated": True,
        "session_id": session_id
    })

@app.route("/api/sessions/<session_id>/prompt", methods=["GET"])
def get_prompt(session_id):
    """Retrieve current custom prompt"""
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    return jsonify({
        "custom_prompt": session_data.get("custom_prompt", ""),
        "default_prompt": "You are a helpful AI assistant."
    })

@app.route("/api/sessions/<session_id>/chat", methods=["POST"])
def chat_with_session(session_id):
    """Send a message and receive a response"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "message is required"}), 400
    
    user_message = data["message"]
    conversation_id = data.get("conversation_id", str(uuid.uuid4()))
    
    # Save user message
    user_msg = {
        "session_id": session_id,
        "conversation_id": conversation_id,
        "message": user_message,
        "message_type": "user",
        "timestamp": datetime.utcnow()
    }
    
    if conversations_collection:
        conversations_collection.insert_one(user_msg)
    else:
        if session_id not in demo_conversations:
            demo_conversations[session_id] = []
        demo_conversations[session_id].append(user_msg)
    
    # Get bot response
    bot_response = demo_query_llm(session_id, user_message)
    
    # Save bot response
    bot_msg = {
        "session_id": session_id,
        "conversation_id": conversation_id,
        "message": bot_response,
        "message_type": "bot",
        "timestamp": datetime.utcnow()
    }
    
    if conversations_collection:
        conversations_collection.insert_one(bot_msg)
    else:
        demo_conversations[session_id].append(bot_msg)
    
    return jsonify({
        "response": bot_response,
        "conversation_id": conversation_id,
        "context_used": bool(demo_retrieve_context(session_id, user_message))
    })

@app.route("/api/sessions/<session_id>/conversations", methods=["GET"])
def get_conversations(session_id):
    """Retrieve conversation history"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    # Get conversations
    if conversations_collection:
        messages = list(conversations_collection.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1))
    else:
        messages = demo_conversations.get(session_id, [])
    
    # Group by conversation_id
    conversations = {}
    for msg in messages:
        conv_id = msg["conversation_id"]
        if conv_id not in conversations:
            conversations[conv_id] = []
        conversations[conv_id].append({
            "message": msg["message"],
            "message_type": msg["message_type"],
            "timestamp": msg["timestamp"].isoformat() if hasattr(msg["timestamp"], 'isoformat') else str(msg["timestamp"])
        })
    
    # Convert to list format
    conversation_list = []
    for conv_id, msgs in conversations.items():
        conversation_list.append({
            "id": conv_id,
            "messages": msgs
        })
    
    return jsonify({"conversations": conversation_list})

@app.route("/api/sessions/<session_id>/conversations/<conversation_id>", methods=["DELETE"])
def clear_conversation(session_id, conversation_id):
    """Clear specific conversation history"""
    # Verify session exists
    if sessions_collection:
        session_data = sessions_collection.find_one({"session_id": session_id})
    else:
        session_data = demo_sessions.get(session_id)
    
    if not session_data:
        return jsonify({"error": "Session not found"}), 404
    
    # Delete conversation messages
    if conversations_collection:
        result = conversations_collection.delete_many({
            "session_id": session_id,
            "conversation_id": conversation_id
        })
        deleted_count = result.deleted_count
    else:
        if session_id in demo_conversations:
            original_count = len(demo_conversations[session_id])
            demo_conversations[session_id] = [
                msg for msg in demo_conversations[session_id]
                if msg["conversation_id"] != conversation_id
            ]
            deleted_count = original_count - len(demo_conversations[session_id])
        else:
            deleted_count = 0
    
    return jsonify({
        "conversation_cleared": True,
        "messages_deleted": deleted_count
    })

if __name__ == "__main__":
    print("Enhanced AI Chatbot Platform - Demo Mode")
    print("=" * 50)
    print("✓ Flask application starting...")
    print("✓ CORS enabled for all routes")
    print("✓ File upload configured (max 16MB)")
    print("✓ Session management ready")
    print("⚠ Running in demo mode - some features may be limited")
    print("📁 Upload folder:", UPLOAD_FOLDER)
    print("🌐 Access the dashboard at: http://localhost:5000")
    print("=" * 50)
    
    app.run(host="0.0.0.0", port=5000, debug=True)

