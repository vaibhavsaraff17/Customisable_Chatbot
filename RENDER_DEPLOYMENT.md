# 🚀 Render Deployment Guide

## Prerequisites

1. **Gemini API Key**: Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **MongoDB Atlas**: Your database is already configured
3. **GitHub Repository**: Code should be pushed to GitHub
4. **Render Account**: Sign up at [render.com](https://render.com)

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key (you'll need it for Render)

## Step 2: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Migrate to Gemini API for Render deployment"
git push origin main
```

## Step 3: Deploy on Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select repository: `vaibhavsaraff17/Customisable_Chatbot`
   - Click "Connect"

3. **Configure Service**
   Fill in these settings:

   ```
   Name: customisable-chatbot
   Region: Oregon (US West)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --config gunicorn_config.py
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" for each:

   ```
   GEMINI_API_KEY = your-gemini-api-key-here
   MONGO_URI = mongodb+srv://vaibhav024saraff:vaibhav123@custombot.zhj8oul.mongodb.net/?retryWrites=true&w=majority&appName=custombot&tls=true&tlsAllowInvalidCertificates=true
   MODEL_NAME = gemini-1.5-flash
   FLASK_ENV = production
   FLASK_DEBUG = False
   SECRET_KEY = (click "Generate" for random value)
   UPLOAD_FOLDER = vector_stores
   MAX_CONTENT_LENGTH = 104857600
   PYTHON_VERSION = 3.11.0
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your app will be live at: `https://customisable-chatbot.onrender.com`

### Option B: Using render.yaml (Automatic)

1. Make sure `render.yaml` is in your repository root
2. Go to Render Dashboard → "Blueprints" → "New Blueprint Instance"
3. Connect your repository
4. Render will detect `render.yaml` and configure automatically
5. You'll still need to add secret environment variables manually:
   - `GEMINI_API_KEY`
   - `MONGO_URI`

## Step 4: Test Your Deployment

1. Visit your deployed URL: `https://customisable-chatbot.onrender.com`
2. Check health: `https://customisable-chatbot.onrender.com/api/health`
3. Create a test session and upload a document
4. Test the chat functionality

## Important Notes

### Free Tier Limitations

- **Cold Starts**: App sleeps after 15 min of inactivity, takes 30-50s to wake up
- **Build Time**: ~5-10 minutes for first deployment
- **Memory**: 512 MB RAM (sufficient for this app)
- **Bandwidth**: 100 GB/month

### Gemini API Limits

**Free Tier:**
- 15 requests per minute (RPM)
- 1 million tokens per minute (TPM)
- 1,500 requests per day (RPD)

**Gemini 1.5 Flash** is recommended for:
- Fast responses
- Cost-effective
- Good quality

**Upgrade to Gemini 1.5 Pro** if you need:
- Better quality
- Longer context
- More complex reasoning

## Monitoring & Logs

### View Logs
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor real-time logs

### Common Log Messages
```
✓ "Gunicorn server is ready" - App started successfully
✓ "MongoDB connection successful!" - Database connected
✗ "GEMINI_API_KEY not set" - Missing API key
✗ "Gemini API error" - API issue (check quota/key)
```

## Troubleshooting

### Issue 1: App Not Starting
```
Error: Module 'google.generativeai' not found
```
**Solution**: Check build logs, ensure requirements.txt is correct

### Issue 2: Gemini API Errors
```
Error: API_KEY_INVALID
```
**Solution**: 
- Verify API key is correct
- Check it's added to environment variables
- Ensure no extra spaces

### Issue 3: MongoDB Connection Failed
```
Error: MongoDB connection failed
```
**Solution**:
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Verify connection string
- Check database user permissions

### Issue 4: File Upload Issues
```
Error: No such file or directory: 'vector_stores'
```
**Solution**: 
- Render creates `/opt/render/project/src` as working directory
- App auto-creates `vector_stores` folder
- If issues persist, check file permissions in logs

### Issue 5: Slow First Response
**This is normal!**
- Render free tier sleeps after 15 min inactivity
- First request takes 30-50 seconds to wake up
- Subsequent requests are fast
- Consider paid plan ($7/month) to prevent sleep

## Updating Your Deployment

### Method 1: Auto-Deploy (Recommended)
```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main

# Render auto-deploys from GitHub
```

### Method 2: Manual Deploy
1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## Scaling & Optimization

### Upgrade to Paid Plan ($7/month)
**Benefits:**
- No cold starts
- Always-on
- Faster responses
- More memory (512MB → 2GB+)

### Optimize for Free Tier
1. **Keep app warm**: Use a cron job to ping every 10 minutes
2. **Reduce model size**: Use `gemini-1.5-flash` (faster, cheaper)
3. **Optimize vector store**: Reduce chunk size/overlap
4. **Cache responses**: Add Redis for frequent queries

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | - | Google Gemini API key |
| `MONGO_URI` | ✅ Yes | - | MongoDB connection string |
| `MODEL_NAME` | No | `gemini-1.5-flash` | Gemini model to use |
| `FLASK_ENV` | No | `production` | Flask environment |
| `FLASK_DEBUG` | No | `False` | Debug mode (keep False in prod) |
| `SECRET_KEY` | ✅ Yes | - | Flask secret key (auto-generated) |
| `UPLOAD_FOLDER` | No | `vector_stores` | Document storage folder |
| `MAX_CONTENT_LENGTH` | No | `104857600` | Max file size (100MB) |
| `PORT` | No | `10000` | Port (Render sets automatically) |

## Cost Estimation

### Free Tier (Current Setup)
- **Render**: $0/month
- **MongoDB Atlas**: $0/month (512MB free)
- **Gemini API**: $0/month (15 RPM free tier)
- **Total**: $0/month

### Recommended Paid Setup
- **Render Starter**: $7/month (no sleep, more memory)
- **MongoDB Atlas**: $0/month (free tier sufficient)
- **Gemini API**: $0-5/month (pay per use after free tier)
- **Total**: ~$7-12/month

## Security Best Practices

1. **Never commit API keys**: Use environment variables only
2. **Use strong SECRET_KEY**: Auto-generate in Render
3. **MongoDB Security**: 
   - Use strong password
   - Enable IP whitelist (or 0.0.0.0/0 for Render)
   - Use TLS/SSL
4. **Rate Limiting**: Add Flask-Limiter for API protection
5. **CORS**: Already configured, verify allowed origins

## Support & Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Gemini API Docs**: [ai.google.dev/docs](https://ai.google.dev/docs)
- **MongoDB Atlas**: [mongodb.com/docs/atlas](https://docs.atlas.mongodb.com/)
- **GitHub Issues**: Report bugs in repository

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test all features
3. 📝 Update README with live URL
4. 🔧 Monitor logs for errors
5. 📊 Track API usage
6. 🚀 Consider upgrading if needed

---

**Your app will be live at**: `https://customisable-chatbot.onrender.com`

Good luck with your deployment! 🎉
