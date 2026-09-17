# Deploying MediCare Hospital to Vercel

This repository is fully configured for zero-friction deployment to [Vercel](https://vercel.com).

---

## 🚀 Quick Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New" > "Project"**.
3. Import your MediCare Hospital repository.
4. Vercel will automatically detect:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `vite build` (configured in `vercel.json`)
   - **Output Directory**: `dist` (configured in `vercel.json`)
5. Open the **Environment Variables** section and add the required keys (listed below).
6. Click **Deploy**.

---

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Log in to your Vercel account:
   ```bash
   vercel login
   ```
3. Run the deployment command from the project root:
   ```bash
   vercel --prod
   ```

---

## 🔑 Required Environment Variables on Vercel

In your Vercel Project Settings under **Settings > Environment Variables**, add the following:

| Variable Name | Required? | Description | Example Value |
|---|---|---|---|
| `GROQ_API_KEY` | **Yes** | Your Groq API key for MediCare AI chat & triage | `gsk_...` |
| `GROQ_MODEL` | Optional | LLM model to use on Groq (defaults to `openai/gpt-oss-120b`) | `openai/gpt-oss-120b` |
| `ADMIN_EMAIL` | Recommended | Administrator email for admin panel login | `admin@medicare.com` |
| `ADMIN_PASSWORD` | Recommended | Secure password for administrator console login | `YourSecurePasswordHere` |
| `ADMIN_NAME` | Optional | Display name for administrator (defaults to "Administrator") | `Adewale` |
| `MONGODB_URI` | Recommended | MongoDB Atlas connection string for persistent cloud data | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `MONGODB_DB_NAME` | Optional | MongoDB Database name | `medicare_db` |
| `CLOUDINARY_CLOUD_NAME`| Recommended | Cloudinary cloud name for staff photos & PDF uploads | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Recommended | Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Recommended | Cloudinary API Secret | `your_secret` |
| `CLOUDINARY_FOLDER` | Optional | Cloudinary asset folder | `medicare_hospital` |
| `RESEND_API_KEY` | Optional | Resend API key for automated appointment confirmation emails | `re_...` |
| `RESEND_FROM_EMAIL` | Optional | Sender address for patient notifications | `MediCare Hospital <noreply@medicare.name.ng>` |
| `GEMINI_API_KEY` | Optional | Optional fallback AI model key | `AIzaSy...` |

---

## 🛠️ How It Works Under the Hood

- **Frontend (`dist/`)**: Built using Vite and hosted across Vercel's global Edge CDN network with high-speed asset caching and instant invalidation.
- **Backend API (`/api/*`)**: Automatically routed by `vercel.json` to the serverless function handler at `/api/index.js` (bundled cleanly with `esbuild` via `npm run build`). All Express endpoints (`/api/doctors`, `/api/ai/chat`, `/api/appointments`, `/api/patients`, `/api/admin/login`, `/api/upload`, etc.) run as a lightweight, scalable, and fully self-contained serverless function with a 60-second execution allowance and no external module resolution issues.
- **Single Page Application Routing**: All non-API frontend paths (`/`, `/admin`, `/doctors`, etc.) seamlessly fallback to `/index.html` for client-side routing.
