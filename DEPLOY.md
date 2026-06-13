# Deploy ApplyToMe to the Cloud

You have **two recommended free options**. Pick one:

| Platform | Difficulty | Cost | Best For |
|----------|-----------|------|----------|
| **Render.com** | Easy | Free tier | Fastest deploy, public URL in minutes |
| **Google Cloud Run** | Medium | Free tier (requires billing) | Google ecosystem, scales to zero |

---

## Option 1: Render.com (Recommended — Easiest)

Render offers a **free web service** + **free PostgreSQL** database. Your app will get a public URL like `https://applytome.onrender.com`.

> ⚠️ Free tier: web service sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

### Step 1: Push your code to GitHub

```bash
cd "C:\Users\okolo\Documents\kimi\workspace\applytome"

# Initialize git repo
git init
git add .
git commit -m "Initial deploy"

# Create a GitHub repo (go to github.com, create new repo, copy the URL)
# Then link and push
git remote add origin https://github.com/YOUR_USERNAME/applytome.git
git branch -M main
git push -u origin main
```

### Step 2: Create a free PostgreSQL database on Render

1. Go to https://dashboard.render.com
2. Sign up / Log in
3. Click **New** → **PostgreSQL**
4. Name it: `applytome-db`
5. Plan: **Free**
6. Click **Create Database**
7. Wait for it to be created, then copy the **Internal Database URL** (looks like: `postgresql://applytome:...@.../applytome`)

### Step 3: Create a Web Service on Render

1. On Render dashboard, click **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `applytome` |
| Environment | `Node` |
| Region | Choose closest to your users |
| Branch | `main` |
| Build Command | `cd backend && npm install && npx prisma generate && cd ../frontend && npm install && npm run build` |
| Start Command | `cd backend && npx prisma migrate deploy && npx tsx src/index.ts` |
| Plan | **Free** |

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (Paste the Internal Database URL from Step 2) |
| `JWT_SECRET` | (Generate a random string: `openssl rand -base64 32` or any long random string) |
| `NODE_ENV` | `production` |

5. Click **Create Web Service**

6. Render will build and deploy. Watch the logs.

### Step 4: Your app is live! 🎉

Once deployed, Render will give you a URL like:
```
https://applytome.onrender.com
```

Share it with anyone. They can sign up, create forms, and apply.

---

## Option 2: Google Cloud Run + Cloud SQL

Use this if you specifically want Google Cloud infrastructure.

> ⚠️ Requires a Google Cloud account and billing setup (free tier credits apply).

### Step 1: Set up Google Cloud

1. Go to https://console.cloud.google.com
2. Create a new project (e.g., `applytome-prod`)
3. Enable these APIs:
   - Cloud Run API
   - Cloud SQL Admin API
   - Secret Manager API

### Step 2: Create a Cloud SQL PostgreSQL instance

1. Go to **SQL** in the sidebar
2. Click **Create Instance** → **PostgreSQL**
3. Choose **Development** template (cheapest)
4. Instance ID: `applytome-db`
5. Password: generate a strong password, save it
6. Database version: PostgreSQL 15
7. Region: pick closest to your users
8. Click **Create**
9. Once created, create a database: `applytome`
10. Copy the **Connection name** (format: `project:region:instance`)

### Step 3: Build and push your Docker image

Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build the Docker image
cd "C:\Users\okolo\Documents\kimi\workspace\applytome"
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/applytome

# Or with Docker locally:
docker build -t gcr.io/YOUR_PROJECT_ID/applytome .
docker push gcr.io/YOUR_PROJECT_ID/applytome
```

### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy applytome \
  --image gcr.io/YOUR_PROJECT_ID/applytome \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@/applytome?host=/cloudsql/YOUR_CONNECTION_NAME" \
  --set-env-vars "JWT_SECRET=your-random-secret" \
  --set-env-vars "NODE_ENV=production" \
  --add-cloudsql-instances YOUR_CONNECTION_NAME
```

### Step 5: Your app is live on Google Cloud! 🎉

Cloud Run will give you a URL like:
```
https://applytome-abc123-uc.a.run.app
```

---

## Option 3: Local Docker (Easiest for testing)

If you want to run the full production stack locally before deploying:

### Prerequisites
- Docker Desktop installed: https://www.docker.com/products/docker-desktop

### Run it:
```bash
cd "C:\Users\okolo\Documents\kimi\workspace\applytome"

# Build and start everything (PostgreSQL + app)
docker-compose up --build

# The app will be available at http://localhost:8080
```

To stop:
```bash
docker-compose down
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Random string for signing tokens (32+ chars) |
| `NODE_ENV` | No | Set to `production` for production |
| `PORT` | No | Server port (default: 8080) |

### PostgreSQL Connection String Format
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
```

Example for Render:
```
postgresql://applytome:randompassword@dpg-xxx.render.com:5432/applytome?schema=public
```

---

## Troubleshooting

### Build fails on Render
- Check that your `Build Command` includes `npm install` for both frontend and backend
- Check Render logs for specific errors

### Database connection errors
- Make sure `DATABASE_URL` is exactly correct
- For Cloud Run: ensure the Cloud SQL instance is in the same region
- For Render: use the **Internal Database URL** (not External)

### App loads but API calls fail
- Check that the frontend `vite.config.ts` proxy is NOT being used in production
- The backend serves the frontend directly, so API calls go to `/api/*` on the same domain

### Images/uploads don't work
- The app stores uploads in `backend/uploads/`. On serverless platforms, this is ephemeral.
- For production, consider using Cloud Storage (Google) or S3. This is a Phase 2 feature.

---

## Next Steps After Deploy

1. **Set a custom domain** (Render supports this on paid plans, Cloud Run supports it free)
2. **Enable HTTPS** (both platforms do this automatically)
3. **Set up monitoring** (Render has basic logs, Google Cloud has Cloud Monitoring)
4. **Add email notifications** when someone applies (use SendGrid, Resend, or AWS SES)
5. **Add Google Analytics** to track form submissions

---

## Need Help?

If you get stuck on any step, tell me the exact error message and I'll help you fix it.
