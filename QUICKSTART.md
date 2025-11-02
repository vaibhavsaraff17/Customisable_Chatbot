# Quick Start Guide

Get your chatbot running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- [ ] Python 3.8 or higher
- [ ] At least 4GB free RAM
- [ ] 2GB free disk space
- [ ] Internet connection

## 5-Minute Setup

### Step 1: Download & Extract (30 seconds)
```bash
git clone https://github.com/vaibhavsaraff17/Customisable_Chatbot.git
cd Customisable_Chatbot
```

### Step 2: Create Virtual Environment (30 seconds)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies (2 minutes)
```bash
pip install -r requirements.txt
```

### Step 4: Install Ollama (1 minute)
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from: https://ollama.ai/download/windows
```

### Step 5: Pull AI Model (1 minute)
```bash
ollama pull llama3.2:3b
```

### Step 6: Configure Environment (30 seconds)
```bash
cp .env.example .env
# Edit .env if needed (optional for local testing)
```

### Step 7: Start the Application (10 seconds)
```bash
# In one terminal
ollama serve

# In another terminal
python app.py
```

### Step 8: Open Dashboard (10 seconds)
Open your browser and go to: **http://localhost:5002**

## First Chatbot in 2 Minutes

1. **Create Session** (20 seconds)
   - Click "Create New Session"
   - Enter name: "My First Bot"
   - Select use case: "General"
   - Click "Create"

2. **Upload Document** (30 seconds)
   - Go to "Documents" tab
   - Drag and drop a text/PDF file
   - Wait for "Processing complete"

3. **Chat!** (1 minute)
   - Go to "Chat" tab
   - Type your question
   - Press Enter
   - Get AI-powered response!

## Troubleshooting

### "Cannot connect to Ollama"
```bash
# Make sure Ollama is running
ollama serve

# Check if model is installed
ollama list
```

### "MongoDB connection error"
**Solution:** The app automatically falls back to local storage. No action needed for testing!

### "Module not found"
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Port 5002 already in use
Edit `.env` file:
```
PORT=5003
```

## What's Next?

- 📖 Read the [Full Documentation](README.md)
- 🎨 Customize your chatbot with [Custom Instructions](IMPLEMENTATION_GUIDE.md#custom-instructions)
- 🚀 Deploy to production with [Deployment Guide](DEPLOYMENT.md)
- 🤝 Contribute to the project with [Contributing Guide](CONTRIBUTING.md)

## Need Help?

- 💬 [GitHub Discussions](https://github.com/vaibhavsaraff17/Customisable_Chatbot/discussions)
- 🐛 [Report Issues](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues)
- 📧 Email: vaibhav.saraff@example.com

---

**Congratulations! You now have a working AI chatbot! 🎉**
