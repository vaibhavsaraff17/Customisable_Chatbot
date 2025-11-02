# 🤖 Enhanced AI Chatbot Platform

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.1-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

A powerful, customizable AI chatbot platform that enables users to create personalized chatbots powered by their own documents and custom instructions. Built with Flask, LangChain, and Ollama for local LLM inference.

## ✨ Features

- **🎯 Session-based Management**: Complete user isolation with individual vector stores
- **📄 Document Upload**: Support for PDF, DOCX, TXT, and JSON files with automatic processing
- **🎨 Custom Instructions**: Personalize chatbot behavior, personality, and response style
- **💬 Multi-turn Conversations**: Context-aware conversations with full memory retention
- **📊 Real-time Dashboard**: Modern, intuitive web interface for all management tasks
- **👥 Concurrent Users**: Support for multiple users with complete data isolation
- **🔍 Smart Context Retrieval**: FAISS vector store for efficient semantic search
- **🚀 Local LLM**: Privacy-focused local inference using Ollama
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Persistent Storage**: MongoDB for reliable data persistence

## 🖼️ Screenshots

### Main Dashboard
![Dashboard](docs/images/dashboard.png)

### Chat Interface
![Chat](docs/images/chat.png)

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Ollama** with LLaMA 3.2 model
- **MongoDB** (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaibhavsaraff17/Customisable_Chatbot.git
   cd Customisable_Chatbot
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Install and configure Ollama**
   ```bash
   # Install Ollama (macOS/Linux)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Start Ollama service
   ollama serve
   
   # Pull the LLaMA 3.2 model (in a new terminal)
   ollama pull llama3.2:3b
   ```

6. **Configure MongoDB**
   - For local MongoDB: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
   - For MongoDB Atlas: Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Update `MONGO_URI` in `.env` file

7. **Run the application**
   ```bash
   python app.py
   ```

8. **Access the dashboard**
   Open your browser and navigate to `http://localhost:5002`

## 📖 Usage Guide

### Creating Your First Chatbot

1. **Create a Session**
   - Click "Create New Session" on the dashboard
   - Enter a description for your chatbot
   - Select a use case (Customer Support, Personal Assistant, etc.)

2. **Upload Documents**
   - Navigate to the "Documents" tab
   - Drag and drop your files or click to browse
   - Supported formats: PDF, DOCX, TXT, JSON
   - Wait for processing to complete

3. **Configure Instructions (Optional)**
   - Go to the "Custom Instructions" tab
   - Choose a template or write your own
   - Define chatbot personality and behavior
   - Click "Save Instructions"

4. **Start Chatting**
   - Switch to the "Chat" tab
   - Type your message and press Enter
   - The chatbot will respond based on your documents and instructions

### Managing Multiple Sessions

- Use the session selector dropdown to switch between chatbots
- Each session maintains its own documents and conversation history
- Delete sessions you no longer need from the session management panel

## 🏗️ Project Structure

```
enhanced_chatbot/
├── app.py                      # Main Flask application (full version)
├── app_demo.py                 # Demo version without ML dependencies
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── config.py.example          # Configuration template
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── IMPLEMENTATION_GUIDE.md    # Detailed implementation guide
├── MIGRATION_GUIDE.md         # Migration from old version
├── test_setup.py             # Setup verification script
├── templates/
│   └── dashboard.html        # Main dashboard interface
├── static/
│   ├── dashboard_enhanced.css # Enhanced styling
│   ├── dashboard.css         # Basic styling
│   └── dashboard.js          # Frontend functionality
├── local_db/                 # Local JSON storage (fallback)
│   ├── sessions.json
│   └── conversations.json
└── vector_stores/            # Session data (auto-created)
    └── {session_id}/
        ├── documents/        # Uploaded files
        └── faiss_index/      # Vector embeddings
```

## 🔌 API Documentation

### Session Management

#### Create Session
```http
POST /api/sessions/create
Content-Type: application/json

{
  "user_description": "My Customer Support Bot",
  "use_case": "customer_support"
}
```

#### Get Session Status
```http
GET /api/sessions/{session_id}/status
```

#### List All Sessions
```http
GET /api/sessions/list
```

### Document Management

#### Upload Documents
```http
POST /api/sessions/{session_id}/documents/upload
Content-Type: multipart/form-data

files: [file1, file2, ...]
```

#### List Documents
```http
GET /api/sessions/{session_id}/documents
```

#### Delete Document
```http
DELETE /api/sessions/{session_id}/documents/{filename}
```

### Custom Instructions

#### Update Prompt
```http
PUT /api/sessions/{session_id}/prompt
Content-Type: application/json

{
  "custom_prompt": "You are a friendly customer support assistant..."
}
```

#### Get Prompt
```http
GET /api/sessions/{session_id}/prompt
```

### Chat Interface

#### Send Message
```http
POST /api/sessions/{session_id}/chat
Content-Type: application/json

{
  "message": "What are your business hours?",
  "conversation_id": "optional-conversation-id"
}
```

#### Get Conversation History
```http
GET /api/sessions/{session_id}/conversations
```

#### Clear Conversation
```http
DELETE /api/sessions/{session_id}/conversations/{conversation_id}
```

### Health Check

#### Check System Status
```http
GET /api/health
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Ollama Configuration
OLLAMA_URL=http://localhost:11434/api/generate
MODEL_NAME=llama3.2:3b

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key

# Upload Configuration
MAX_CONTENT_LENGTH=104857600
UPLOAD_FOLDER=vector_stores

# Server Configuration
HOST=0.0.0.0
PORT=5002
```

### Customizing the Model

You can use different Ollama models:

```bash
# Available models
ollama list

# Pull a different model
ollama pull mistral
ollama pull codellama
ollama pull tinyllama

# Update MODEL_NAME in .env
MODEL_NAME=mistral
```

### File Upload Limits

Adjust in `.env` or `app.py`:

```python
MAX_CONTENT_LENGTH=104857600  # 100MB
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'json'}
```

## 🔒 Security Features

- **Session Isolation**: Complete data separation between users
- **Secure File Upload**: Filename sanitization and type validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: All API endpoints validate inputs
- **MongoDB Security**: Parameterized queries prevent injection attacks
- **Environment Variables**: Sensitive data stored securely

## 🚀 Deployment

### Development Server

```bash
python app.py
```

### Production Server (with Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5002 app:app --timeout 120
```

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5002
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5002", "app:app", "--timeout", "120"]
```

Build and run:
```bash
docker build -t enhanced-chatbot .
docker run -p 5002:5002 --env-file .env enhanced-chatbot
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Ollama Connection Error
```
Error: Cannot connect to Ollama server
```

**Solution:**
```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama
ollama serve

# Verify model is installed
ollama list
ollama pull llama3.2:3b
```

#### 2. MongoDB Connection Error
```
Error: MongoDB connection failed
```

**Solution:**
- Verify MongoDB is running: `systemctl status mongod` (Linux) or check MongoDB Compass
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP
- Test connection: `mongosh "your-connection-string"`

#### 3. File Upload Issues
```
Error: File too large or format not supported
```

**Solution:**
- Check file size (default limit: 100MB)
- Verify file format is in `ALLOWED_EXTENSIONS`
- Ensure sufficient disk space

#### 4. Vector Store Errors
```
Error: Cannot load FAISS index
```

**Solution:**
```bash
# Reinstall FAISS
pip uninstall faiss-cpu
pip install faiss-cpu==1.11.0

# Check write permissions
ls -la vector_stores/

# Clear corrupted index
rm -rf vector_stores/{session_id}/faiss_index/
# Re-upload documents to rebuild
```

#### 5. Memory Issues
```
Error: Out of memory
```

**Solution:**
- Use a smaller model: `ollama pull tinyllama`
- Reduce `num_ctx` in `app.py` (line ~250)
- Process fewer documents at once
- Increase system swap space

### Debug Mode

Enable detailed logging:

```python
# In app.py
import logging
logging.basicConfig(level=logging.DEBUG)
app.config['DEBUG'] = True
```

### Performance Optimization

1. **Model Selection**: Use appropriate model size for your hardware
   - Small systems: `tinyllama` or `llama3.2:1b`
   - Medium systems: `llama3.2:3b`
   - Large systems: `llama3:8b` or `mixtral`

2. **Context Window**: Adjust based on your needs
   ```python
   "num_ctx": 4096  # Default: 32768, reduce for faster responses
   ```

3. **Database Indexing**: Add indexes for better query performance
   ```python
   sessions_collection.create_index("session_id")
   conversations_collection.create_index([("session_id", 1), ("timestamp", -1)])
   ```

## 🧪 Testing

Run the setup verification script:

```bash
python test_setup.py
```

Expected output:
```
✓ Python version: 3.9.7
✓ All required packages installed
✓ Ollama is running
✓ Model llama3.2:3b is available
✓ MongoDB connection successful
✓ Vector stores directory created
✓ All systems operational!
```

## 📚 Additional Resources

- **Implementation Guide**: See `IMPLEMENTATION_GUIDE.md` for detailed setup
- **Migration Guide**: See `MIGRATION_GUIDE.md` for upgrading from older versions
- **LangChain Documentation**: [python.langchain.com](https://python.langchain.com/)
- **Ollama Documentation**: [ollama.ai/docs](https://ollama.ai/docs)
- **FAISS Documentation**: [faiss.ai](https://faiss.ai/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/Customisable_Chatbot.git

# Install development dependencies
pip install -r requirements.txt
pip install pytest black flake8

# Run tests
pytest

# Format code
black .

# Lint code
flake8 .
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Authors

- **Vaibhav Saraff** - [@vaibhavsaraff17](https://github.com/vaibhavsaraff17)
- **Tushar Saraff** - Contributor

## 🙏 Acknowledgments

- **LangChain** for the excellent framework
- **Ollama** for local LLM inference
- **FAISS** for efficient vector search
- **Flask** for the web framework
- **MongoDB** for database support

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vaibhavsaraff17/Customisable_Chatbot/discussions)
- **Email**: vaibhav.saraff@example.com

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Advanced analytics dashboard
- [ ] User authentication and authorization
- [ ] Cloud deployment templates (AWS, Azure, GCP)
- [ ] REST API client libraries (Python, JavaScript)
- [ ] Mobile app (React Native)
- [ ] Integration with popular messaging platforms

---

**Made with ❤️ by Vaibhav Saraff**

## API Endpoints

### Session Management
- `POST /api/sessions/create` - Create new session
- `GET /api/sessions/{session_id}/status` - Get session status

### Document Management
- `POST /api/sessions/{session_id}/documents/upload` - Upload documents
- `GET /api/sessions/{session_id}/documents` - List documents
- `DELETE /api/sessions/{session_id}/documents/{filename}` - Delete document

### Prompt Management
- `PUT /api/sessions/{session_id}/prompt` - Update custom prompt
- `GET /api/sessions/{session_id}/prompt` - Get current prompt

### Chat
- `POST /api/sessions/{session_id}/chat` - Send message
- `GET /api/sessions/{session_id}/conversations` - Get conversation history
- `DELETE /api/sessions/{session_id}/conversations/{conversation_id}` - Clear conversation

## File Structure

```
enhanced_chatbot/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── dashboard.html    # Main dashboard template
├── static/
│   ├── dashboard.css     # Dashboard styles
│   └── dashboard.js      # Dashboard functionality
└── vector_stores/        # Session-specific data (created automatically)
    └── {session_id}/
        ├── documents/    # Uploaded documents
        ├── faiss_index/  # Vector store files
        └── metadata/     # Session configuration
```

## Configuration

### Environment Variables
- `OLLAMA_URL`: Ollama API endpoint (default: http://localhost:11434/api/generate)
- `MODEL_NAME`: LLM model name (default: llama3)
- `MONGO_URI`: MongoDB connection string

### File Upload Limits
- Maximum file size: 16MB
- Supported formats: PDF, DOCX, TXT, JSON
- Multiple files can be uploaded simultaneously

## Security Features

- Session isolation with unique IDs
- File upload validation and sanitization
- Secure filename handling
- CORS protection
- Input validation for all API endpoints

## Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   - Ensure Ollama is running: `ollama serve`
   - Check if LLaMA3 model is installed: `ollama list`

2. **MongoDB Connection Error**
   - Verify MongoDB connection string
   - Ensure MongoDB service is running

3. **File Upload Issues**
   - Check file size (max 16MB)
   - Verify file format is supported
   - Ensure sufficient disk space

4. **Vector Store Errors**
   - Check write permissions in project directory
   - Verify FAISS installation: `pip install faiss-cpu`

## Development

### Adding New Document Types
1. Update `ALLOWED_EXTENSIONS` in `app.py`
2. Add processing logic in `process_document()` function
3. Update frontend file validation

### Customizing UI
- Modify `templates/dashboard.html` for structure
- Update `static/dashboard.css` for styling
- Enhance `static/dashboard.js` for functionality

### Adding New Features
- Extend API endpoints in `app.py`
- Update frontend JavaScript for new functionality
- Add corresponding UI elements in HTML template

## License

This project is provided as-is for educational and development purposes.

