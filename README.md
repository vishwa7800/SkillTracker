# ◈ SkillTracker

**[🌐 View Live Demo](https://skill-tracker-eosin.vercel.app/)**

SkillTracker is a personal learning dashboard designed for self-learners to track their skills, log practice sessions, and visualize their growth over time. 

Built with a focus on simplicity and consistency, SkillTracker helps you set goals, stay accountable with progress charts, and build learning habits.

## ✨ Features

- **🔒 Secure Authentication:** Gmail-only account registration and login powered by Supabase. Your data stays private.
- **🎯 Skill Management:** Add new skills, define custom session goals, and track active vs. inactive skills.
- **📝 Progress Logging:** Record individual practice sessions with dates, topics, and notes.
- **📈 Visual Charts:** Visualize your learning progress over time using dynamic charts (powered by Chart.js).
- **🤖 AI Learning Paths:** Get AI-generated learning paths and session topic suggestions powered by Google's Gemini API.
- **💬 Anonymous Community:** Share learning tips, ask questions, and post resources in a fully anonymous community feed.
- **📥 Export Reports:** Download your progress as a weekly PDF report.
- **⚠️ Inactivity Alerts:** Automatically flags skills that haven't been practiced in 30+ days.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox/Grid), Vanilla JavaScript (SPA architecture)
- **Backend/BaaS:** [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication)
- **Data Visualization:** [Chart.js](https://www.chartjs.org/)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/)
- **PDF Generation:** [jsPDF](https://parall.ax/products/jspdf)
- **Fonts:** Syne & DM Sans (Google Fonts)

## 🚀 Getting Started

### Prerequisites
To run this project locally, you will need to set up a Supabase project and get a Gemini API key.

1. **Supabase:**
   - Create a project on [Supabase](https://supabase.com/).
   - Set up the database tables (e.g., `profiles`, `skills`, `sessions`, `posts`).
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

2. **Gemini API:**
   - Get an API key from [Google AI Studio](https://aistudio.google.com/).

### Installation & Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skilltracker.git
   cd skilltracker
   ```

2. Configure your local API keys:
   - Copy `supabase-config.example.js` to `supabase-config.js`:
     ```bash
     cp supabase-config.example.js supabase-config.js
     ```
   - Fill in your Supabase credentials and Gemini API key inside `supabase-config.js`.
   - *Note: `supabase-config.js` is automatically excluded by `.gitignore` so your private keys will never be committed to GitHub.*

3. Open `index.html` in your browser or use a local live server (e.g., VS Code Live Server).

### 🔒 Deploying to Production (Vercel)

When deploying to Vercel, your API keys stay 100% hidden and secure:
1. In your **Vercel Project Dashboard**, navigate to **Settings** → **Environment Variables**.
2. Add the following variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase public anon key
   - `GEMINI_API_KEY`: Your private Google Gemini API key
3. Deploy! The application uses the built-in serverless proxy (`/api/generate-path`) so your Gemini API key is executed server-side and never exposed to visitors inspecting browser DevTools or Network requests.

## 💡 How it Works

1. **Create Account:** Sign up with your Gmail address.
2. **Add Skills:** Add a skill you want to learn (e.g., "Frontend Development", "Public Speaking") and set a target number of sessions.
3. **Log Sessions:** After you practice, log a session with a date and a quick note.
4. **See Growth:** Watch your progress bar fill up and check the charts to see your consistency!
