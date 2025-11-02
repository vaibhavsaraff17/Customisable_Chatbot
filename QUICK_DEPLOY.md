# 🚀 Quick Deployment Checklist

## Before You Deploy

- [ ] Get Gemini API Key: https://makersuite.google.com/app/apikey
- [ ] Verify MongoDB connection works
- [ ] Push latest code to GitHub

## Render Configuration (Copy-Paste Ready)

### Basic Settings
```
Name: Customisable_Chatbot
Language: Python 3
Branch: main
Region: Oregon (US West)
```

### Commands
```
Build Command:
pip install -r requirements.txt

Start Command:
gunicorn app:app --config gunicorn_config.py
```

### Environment Variables

**Copy these exactly into Render:**

```
GEMINI_API_KEY = [paste your key here]
MONGO_URI = mongodb+srv://vaibhav024saraff:vaibhav123@custombot.zhj8oul.mongodb.net/?retryWrites=true&w=majority&appName=custombot&tls=true&tlsAllowInvalidCertificates=true
MODEL_NAME = gemini-1.5-flash
FLASK_ENV = production
FLASK_DEBUG = False
SECRET_KEY = [click Generate]
UPLOAD_FOLDER = vector_stores
MAX_CONTENT_LENGTH = 104857600
PYTHON_VERSION = 3.11.0
```

## Deployment URL
Your app will be at: `https://customisable-chatbot.onrender.com`

## After Deployment

Test these URLs:
- Home: https://customisable-chatbot.onrender.com/
- Health: https://customisable-chatbot.onrender.com/api/health

## Need Help?
See: `RENDER_DEPLOYMENT.md` for complete guide

---

✅ Ready to go! Deploy on Render now.
