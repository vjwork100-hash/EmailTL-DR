
# EmailSmart MVP

**High-Fidelity Email Intelligence Powered by Gemini.**

EmailSmart is a professional-grade email thread summarizer that parses complex chains into actionable intelligence: decisions, deadlines, and ownership.

## ✨ Features

- **Semantic Analysis**: Understands context beyond simple keywords.
- **Ownership Mapping**: Identifies who is responsible for what.
- **Decision Tracking**: Isolates the "bottom line" of any thread.
- **Public Sharing**: Securely share intelligence reports with stakeholders.
- **Pro Dashboard**: Maintain a historical archive of project decisions.

## 🚀 Setup

1. **Prerequisites**:
   - Node.js (v18+)
   - A Google Gemini API Key from [AI Studio](https://aistudio.google.com/).

2. **Installation**:
   ```bash
   npm install
   ```

3. **Environment**:
   Create a `.env.local` file in the root:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Development**:
   ```bash
   npm start
   ```

## 🛠 Deployment (Vercel)

1. Connect your repository to Vercel.
2. In Project Settings, add `API_KEY` under Environment Variables.
3. Deploy. The app is a static SPA using HashRouter for maximum compatibility.

## 📈 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/amazing-feature`).
3. Commit your changes.
4. Push and open a Pull Request.

---
Engineering the future of professional communication.
