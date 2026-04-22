# SkillTracker
**Stack: HTML · CSS · JavaScript · Supabase (backend + database + auth)**

---

## 📁 Your Files

```
SkillTracker/
├── index.html           ← All pages (landing, auth, dashboard)
├── style.css            ← Full design system
├── script.js            ← All frontend logic
├── supabase-config.js   ← ⚠ YOU FILL IN YOUR KEYS HERE
├── supabase-schema.sql  ← Run this once in Supabase SQL Editor
└── README.md            ← This file
```

---

## 🚀 SETUP GUIDE (Follow these steps in order)

---

### STEP 1 — Create a Supabase Project (FREE)

1. Go to **https://supabase.com** → Click **"Start your project"**
2. Sign up with GitHub (free)
3. Click **"New Project"**
4. Fill in:
   - **Name:** SkillTracker
   - **Database Password:** (save this somewhere)
   - **Region:** choose closest to you
5. Click **"Create new project"** — wait ~2 minutes for it to set up

---

### STEP 2 — Disable Email Confirmation (IMPORTANT)

By default Supabase asks users to confirm their email. We want to skip that.

1. In your Supabase project → go to **Authentication** (left sidebar)
2. Click **"Providers"** → **"Email"**
3. Turn OFF **"Confirm email"**
4. Click **Save**

Done! Users can now register and log in instantly without confirming email.

---

### STEP 3 — Run the Database Schema

1. In Supabase → go to **SQL Editor** (left sidebar, looks like `</>`)
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from your project folder
4. Copy ALL the contents and paste into the SQL editor
5. Click **"Run"** (green button)
6. You should see "Success. No rows returned."

This creates all 4 tables: `profiles`, `skills`, `progress`, `community_posts`

---

### STEP 4 — Get Your API Keys

1. In Supabase → go to **Settings** (gear icon, bottom left)
2. Click **"API"**
3. You need two values:
   - **Project URL** — looks like `https://xxxxxx.supabase.co`
   - **Project API Key** → under "Project API keys" → copy the **`anon` `public`** key

---

### STEP 5 — Add Your Keys to the Project

Open `supabase-config.js` in VS Code and replace the two placeholder values:

```javascript
// BEFORE (placeholders):
const SUPABASE_URL  = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';

// AFTER (your real values):
const SUPABASE_URL  = 'https://abcdefgh.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Save the file.

---

### STEP 6 — Open the Website

**Option A — VS Code Live Server (for testing locally)**
1. Install the **"Live Server"** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Opens at `http://127.0.0.1:5500`

**Option B — Deploy live (free)**
See the Deployment section below.

---

## 🌐 FREE DEPLOYMENT OPTIONS

### Option 1 — Netlify (Easiest, recommended)
1. Go to **https://netlify.com** → Sign up free
2. Drag and drop your **entire SkillTracker folder** onto the Netlify dashboard
3. Get a live URL like `https://skilltracker-xyz.netlify.app` instantly
4. Done! Share this URL.

### Option 2 — GitHub Pages
1. Push your folder to a GitHub repository
2. Go to repo → **Settings → Pages**
3. Source: **Deploy from a branch → main → / (root)**
4. Get URL like `https://yourusername.github.io/skilltracker`

---

## 🔒 Password Rules (enforced in the app)

Every password must have:
- ✓ Minimum 6 characters
- ✓ At least 1 UPPERCASE letter
- ✓ At least 1 number (0–9)
- ✓ At least 1 symbol: `@ $ # ! % * ? & ^ ( ) _ + = -`

And the email must be `@gmail.com` only.

---

## ✅ Features

| Feature | Status |
|---|---|
| Gmail-only registration | ✅ |
| Strong password validation (live feedback) | ✅ |
| No email confirmation required | ✅ (disabled in Supabase) |
| Login / Logout | ✅ |
| Session persists on page refresh | ✅ |
| Add / Edit / Delete skills | ✅ |
| Session goal per skill | ✅ |
| Log practice sessions | ✅ |
| Progress visualization (Chart.js) | ✅ |
| Inactivity alerts (30+ days) | ✅ |
| Anonymous community posts | ✅ |
| Change password | ✅ |
| Delete account | ✅ |
| Row Level Security (each user sees only their data) | ✅ |
| Responsive (mobile + desktop) | ✅ |
| Loading spinner | ✅ |
| Toast notifications | ✅ |

---

## 🛠 Troubleshooting

**"Invalid API key" or blank screen?**
→ Check `supabase-config.js` — make sure both values are filled in correctly.

**User registers but can't log in?**
→ Go to Supabase → Authentication → Providers → Email → turn off "Confirm email".

**"relation does not exist" error?**
→ Run `supabase-schema.sql` again in the SQL editor.

**Skills not saving?**
→ Check Supabase → Table Editor → skills — make sure the table exists and has rows.

---

*SkillTracker · 2026*
