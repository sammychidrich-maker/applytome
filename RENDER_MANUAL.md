# ApplyToMe — Manual Deploy to Render.com

Follow these exact steps. It takes about 5 minutes.

---

## Step 1: Create Database (1 minute)

1. Go to https://dashboard.render.com
2. Click **New** → **PostgreSQL**
3. Name: `applytome-db`
4. Plan: **Free**
5. Click **Create Database**
6. Wait for it to say "Available" (about 30 seconds)
7. Click on the database name
8. Copy the **Internal Database URL** (looks like `postgresql://applytome:...`)
   - Save it somewhere — you'll need it in Step 2

---

## Step 2: Create Web Service (2 minutes)

1. Go back to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Connect your GitHub repo `applytome`
4. Fill in:

| Setting | Value |
|---------|-------|
| Name | `applytome` |
| Runtime | `Node` |
| Region | Pick closest to you |
| Branch | `main` |
| Build Command | `cd backend && npm install && npx prisma generate && cd ../frontend && npm install && npm run build` |
| Start Command | `cd backend && npx prisma migrate deploy && npx tsx src/index.ts` |
| Plan | **Free** |

5. Click **Advanced** → add **Environment Variables**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the Internal Database URL from Step 1 |
| `JWT_SECRET` | `applytome-secret-2024-change-later` |
| `NODE_ENV` | `production` |

6. Click **Create Web Service**

---

## Step 3: Wait for Build (2 minutes)

Render will:
- Install dependencies
- Build the frontend
- Deploy the app

You'll see logs scrolling. Wait for the green checkmark ✅

---

## Step 4: Your App is Live! 🎉

Render gives you a URL like:
```
https://applytome.onrender.com
```

Open it in your browser. Share it with anyone.

---

## Important Notes

- **Free tier sleeps after 15 min of inactivity.** First visit after sleep takes ~30 seconds to wake up.
- **Uploads/images** are stored on the server's disk. On free tier, they disappear when the server sleeps.
- **Database** persists across sleeps (PostgreSQL is permanent).

---

## Troubleshooting

### Build fails with "Prisma generate error"
The build command already runs `npx prisma generate`. If it fails, check that `prisma/schema.prisma` is in the repo (it is).

### Database connection error
Make sure `DATABASE_URL` is the **Internal** URL (not External). Internal URLs work inside Render's network.

### Server crashes on startup
Check the Render logs. Usually a missing env variable. Make sure all 3 are set.
