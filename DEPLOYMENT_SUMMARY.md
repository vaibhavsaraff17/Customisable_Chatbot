# Render Deployment Configuration Summary

## ✅ What We Changed

### 1. Replaced Ollama with Gemini API
- **Before**: Local Ollama LLM (requires local server)
- **After**: Google Gemini API (cloud-based, no server needed)
- **File**: `app.py` - Updated LLM integration

### 2. Updated Dependencies
- Added `google-generativeai==0.8.3`
- Added `gunicorn==23.0.0` for production server
- **File**: `requirements.txt`

### 3. Environment Configuration
- Replaced `OLLAMA_URL` with `GEMINI_API_KEY`
- Updated model name to `gemini-1.5-flash`
- **File**: `.env`

### 4. Render Configuration Files
- Created `render.yaml` for automated deployment
- Updated `gunicorn_config.py` for Render compatibility
- Created `RENDER_DEPLOYMENT.md` with complete guide

## 📋 Render Service Configuration

Copy these values into Render dashboard:

```
Name: Customisable_Chatbot
Language: Python 3
Branch: main
Region: Oregon (US West)
Root Directory: (leave empty)

Build Command:
pip install -r requirements.txt

Start Command:
gunicorn app:app --config gunicorn_config.py
```

## 🔑 Environment Variables (Add in Render)

**Required:**
```
GEMINI_API_KEY = <your-gemini-api-key>
MONGO_URI = mongodb+srv://vaibhav024saraff:vaibhav123@custombot.zhj8oul.mongodb.net/?retryWrites=true&w=majority&appName=custombot&tls=true&tlsAllowInvalidCertificates=true
```

**Optional (use defaults):**
```
MODEL_NAME = gemini-1.5-flash
FLASK_ENV = production
FLASK_DEBUG = False
SECRET_KEY = (click "Generate" in Render)
UPLOAD_FOLDER = vector_stores
MAX_CONTENT_LENGTH = 104857600
PYTHON_VERSION = 3.11.0
```

## 🚀 Deployment Steps

1. **Get Gemini API Key**
   - Go to: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Render deployment with Gemini API"
   git push origin main
   ```

3. **Deploy on Render**
   - Go to: https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `vaibhavsaraff17/Customisable_Chatbot`
   - Fill in configuration from above
   - Add environment variables
   - Click "Create Web Service"

4. **Wait for Deployment**
   - Build time: ~5-10 minutes
   - Watch logs for "Gunicorn server is ready"
   - App will be live at: `https://customisable-chatbot.onrender.com`

## ✅ Testing Checklist

After deployment:
- [ ] Visit home page: `https://customisable-chatbot.onrender.com`
- [ ] Check health: `https://customisable-chatbot.onrender.com/api/health`
- [ ] Create new session
- [ ] Upload test document (PDF/TXT)
- [ ] Send test message
- [ ] Verify chatbot response

## 🐛 Common Issues & Solutions

### Build Fails
- Check `requirements.txt` syntax
- Verify Python version compatibility
- Review build logs in Render

### App Won't Start
- Verify `gunicorn` command is correct
- Check for syntax errors in `app.py`
- Ensure all imports are in `requirements.txt`

### Gemini API Errors
- Verify API key is correct (no spaces)
- Check API key is added to Render env vars
- Ensure API is enabled in Google Cloud Console

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string is correct
- Ensure database user has proper permissions

### File Upload Fails
- Normal on Render free tier (ephemeral storage)
- Files stored temporarily, deleted on restart
- Consider upgrading for persistent disk

## 📊 Performance Notes

**Free Tier:**
- Cold start: ~30-50 seconds after 15 min inactivity
- Memory: 512 MB (sufficient for this app)
- Build time: ~5-10 minutes
- Bandwidth: 100 GB/month

**Paid Tier ($7/month):**
- Always on (no cold starts)
- More memory available
- Faster deployments
- Persistent disk available

## 📚 Documentation Files

1. **RENDER_DEPLOYMENT.md** - Complete deployment guide
2. **render.yaml** - Automated deployment config
3. **gunicorn_config.py** - Production server config
4. **.env** - Local environment variables (update with your Gemini key)

## 🔄 Updating Your App

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Render auto-deploys from main branch
```

## 💰 Cost Breakdown

**Current Setup (Free):**
- Render: $0/month
- MongoDB Atlas: $0/month  
- Gemini API: $0/month (free tier)
- **Total: $0/month**

**Recommended for Production:**
- Render Starter: $7/month
- MongoDB Atlas: $0/month
- Gemini API: ~$0-5/month
- **Total: ~$7-12/month**

---

**Ready to deploy!** Follow the steps in RENDER_DEPLOYMENT.md
