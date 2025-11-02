# Frequently Asked Questions (FAQ)

## General Questions

### What is this project?
The Enhanced AI Chatbot Platform is a customizable chatbot system that allows you to create AI assistants powered by your own documents. Each chatbot instance (session) can have its own knowledge base and behavior.

### Is this free to use?
Yes! This is an open-source project under MIT license. You can use, modify, and distribute it freely.

### What makes this different from ChatGPT?
- **Privacy**: Runs entirely locally with your own LLM
- **Customization**: Train on your specific documents
- **Control**: Full control over behavior and data
- **Cost**: No API fees after initial setup

## Technical Questions

### What are the system requirements?

**Minimum:**
- CPU: 4 cores
- RAM: 4GB
- Storage: 10GB
- OS: Windows 10/11, macOS 10.15+, Linux

**Recommended:**
- CPU: 8 cores
- RAM: 8GB+
- Storage: 20GB SSD
- GPU: Optional but speeds up inference

### Which LLM models can I use?

Any Ollama-supported model:
- **Small**: tinyllama (1GB), llama3.2:1b
- **Medium**: llama3.2:3b (default, 2GB)
- **Large**: llama3:8b, mixtral, codellama

Change model:
```bash
ollama pull model-name
```
Update `.env`:
```
MODEL_NAME=model-name
```

### Can I use OpenAI/Claude instead of Ollama?

Not currently, but you can modify `app.py` to integrate other APIs. The LangChain framework makes this relatively straightforward.

### What file types are supported?

- **Text**: .txt
- **PDF**: .pdf (with text extraction)
- **Word**: .docx
- **JSON**: .json

Want more formats? See [CONTRIBUTING.md](CONTRIBUTING.md) to add support.

### How much does it cost to run?

**Zero operational costs!** 

You only pay for:
- Your server/computer electricity
- MongoDB Atlas (free tier available)
- Optional: Cloud hosting fees

No per-request API fees.

## Usage Questions

### How do I create multiple chatbots?

Each session is a separate chatbot:
1. Create multiple sessions from the dashboard
2. Upload different documents to each
3. Set different custom instructions
4. Switch between them using the session selector

### Can multiple users use this simultaneously?

Yes! Each user should:
- Create their own session
- Get a unique session ID
- Use that ID in API calls

Sessions are completely isolated.

### How do I make the chatbot more accurate?

1. **Better Documents**: Upload comprehensive, well-organized documents
2. **Custom Instructions**: Be specific about desired behavior
3. **Larger Model**: Use llama3:8b instead of 3b
4. **More Context**: Increase `num_ctx` in app.py (uses more RAM)

### Can I train it on my company's data?

Yes! That's the primary use case:
- Upload company documentation
- Set company-specific instructions
- Keep data private and local

### How do I delete old sessions?

Currently: Manually delete from `vector_stores/{session_id}/` directory

Feature coming: Delete button in dashboard (v3.0)

## Troubleshooting

### The chatbot gives irrelevant answers

**Causes:**
- Documents not properly processed
- Questions too vague
- Model too small

**Solutions:**
- Re-upload documents
- Ask specific questions
- Try larger model
- Add custom instructions for context

### Responses are too slow

**Causes:**
- Large model on small hardware
- First request loads model into RAM
- Too large context window

**Solutions:**
- Use smaller model (tinyllama, llama3.2:1b)
- Wait for first load (subsequent faster)
- Reduce `num_ctx` in app.py
- Add more RAM
- Use GPU acceleration

### MongoDB connection fails

**Solutions:**
1. App automatically falls back to local storage
2. Or install local MongoDB:
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   ```
3. Or use MongoDB Atlas (free): [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

### File upload fails

**Checks:**
- File size under 100MB?
- File type supported?
- Enough disk space?
- Write permissions?

**Solution:**
```bash
# Check disk space
df -h

# Check permissions
ls -la vector_stores/
chmod -R 755 vector_stores/
```

### Ollama not responding

**Solutions:**
```bash
# Kill existing process
pkill ollama

# Restart
ollama serve

# Verify model
ollama list

# Test model
ollama run llama3.2:3b "Hello"
```

## Deployment Questions

### Can I deploy this to production?

Yes! See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Production setup with Gunicorn
- Docker deployment
- Cloud deployment (AWS, GCP, Azure)
- Scaling strategies

### How do I secure it in production?

1. **Use HTTPS**: Set up SSL/TLS certificates
2. **Authentication**: Add user authentication (v3.0)
3. **Firewall**: Restrict access to necessary ports
4. **Environment**: Never commit `.env` files
5. **Updates**: Keep dependencies updated

### Can I use this commercially?

Yes! MIT license allows commercial use. See [LICENSE](LICENSE).

### What about GDPR/data privacy?

Since everything runs locally:
- ✅ Full data control
- ✅ No third-party data sharing
- ✅ Right to be forgotten (delete sessions)
- ⚠️ You're responsible for securing your deployment

## Development Questions

### Can I contribute?

Absolutely! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas we need help:
- User authentication
- More file format support
- Mobile app
- Performance optimization
- Documentation

### How do I report bugs?

[Open an issue](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- System info (OS, Python version, etc.)

### Can I request features?

Yes! [Create a feature request](https://github.com/vaibhavsaraff17/Customisable_Chatbot/issues/new) or vote on existing ones.

### How do I stay updated?

- ⭐ Star the repository
- 👀 Watch for releases
- 📧 Enable GitHub notifications
- 📰 Check CHANGELOG.md

## Advanced Questions

### Can I use a GPU for faster inference?

Yes! Ollama automatically uses GPU if available:

**NVIDIA GPU:**
```bash
# Install CUDA
# Ollama will automatically detect and use GPU
```

**Apple Silicon:**
```bash
# Ollama automatically uses Metal
# No additional setup needed
```

### How do I scale for many users?

1. **Horizontal Scaling**: Run multiple instances behind load balancer
2. **Separate Services**: Run Ollama on GPU servers
3. **Caching**: Add Redis for session caching
4. **CDN**: Serve static files from CDN

See [DEPLOYMENT.md#scaling](DEPLOYMENT.md#scaling-and-performance)

### Can I use this as a microservice?

Yes! The API is RESTful and can be integrated:
```python
import requests

# Create session
response = requests.post('http://api-url/api/sessions/create')
session_id = response.json()['session_id']

# Chat
response = requests.post(
    f'http://api-url/api/sessions/{session_id}/chat',
    json={'message': 'Hello!'}
)
print(response.json()['response'])
```

### How do I backup my data?

**Automatic Backup Script:**
```bash
#!/bin/bash
# backup.sh
tar -czf backup-$(date +%Y%m%d).tar.gz vector_stores/ local_db/
mongodump --uri="$MONGO_URI" --out=backup-mongo-$(date +%Y%m%d)
```

**Run daily:**
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Still Have Questions?

- 💬 [GitHub Discussions](https://github.com/vaibhavsaraff17/Customisable_Chatbot/discussions)
- 📧 Email: vaibhav.saraff@example.com
- 📖 Read the [full documentation](README.md)

---

**Don't see your question? Ask in [Discussions](https://github.com/vaibhavsaraff17/Customisable_Chatbot/discussions)!**
