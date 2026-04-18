# CoreVault AI: Masterpiece Plan & Project Blueprint

This document serves as the "source of truth" for the CoreVault AI project, bridging traditional fintech with AI-driven autonomous trading.

## 🎯 Project Vision
CoreVault AI is a self-learning financial companion that automates investment strategies for the Indian market. It uses a "Dual-Brain" architecture to handle both long-term wealth building and short-term swing trading.

## 🏗️ Technical Architecture
- **Frontend**: Next.js (Project-CoreVault) with React 19 and Tailwind CSS 4.x.
- **Backend Core**: Python (FastAPI/Flask) for AI heavy lifting.
- **AI Engine**: Qwen API for sentiment and technical analysis.
- **Visualization**: Recharts for live market fluctuations and portfolio diversification.

---

## 📅 Roadmap: Stages of Development

### Stage 1: Documentation & Infrastructure [IN PROGRESS]
- **Goal**: Establish a solid foundation for logs and guides.
- **Tasks**:
  - Initialize the `Z-my-work-logs-&-project-guide` directory.
  - Create the Masterpiece Plan (this document).
  - Setup local data persistence (e.g. `lib/storage.ts`) for users and profiles.

### Stage 2: Authentication & Secure Access (Sign-Up / Login)
- **Goal**: Controlled entry with professional security standards.
- **Tasks**:
  - **Sign-Up**: Create a professional registration form (Name, Contact, Email, Username, Password).
  - **Password Security**: Implement regex validation (8+ chars, Alpha, Numeric, Special).
  - **Login**: Standard authentication gate with username/password check.
  - **Persistence**: Store credentials locally on the PC for now, with path to MongoDB.

### Stage 3: The "Wealth Architect" Onboarding (Demat-Style Form)
- **Goal**: Capture the financial DNA of the user via a dedicated overlay.
- **Tasks**:
  - Implement a **Multi-Step Onboarding Overlay** that triggers after the first sign-up.
  - **Step 1: Bio & Contact**: Name, Age, Occupation.
  - **Step 2: Financial Stats**: Monthly Income, Fixed Expenses, Savings Capacity.
  - **Step 3: Investment Mindset**: Short-term vs Long-term focus, Risk Appetite (Conservative to Aggressive).
  - **Step 4: Interests**: Suggested sectors (Tech, Pharma, ESG) or specific companies.
  - **Step 5: Voice Goals**: Integrated voice input for "Investment Priorities."

### Stage 4: Enhanced User Profile (The "SwasthyaNet" Style)
- **Goal**: A professional "Investor Identity" dashboard.
- **Tasks**:
  - **Investor ID**: Generate a unique Customer ID for every user.
  - **Profile QR**: A dynamic QR code containing the encrypted investor profile.
  - **Profile Health Chart**: A "Radar" or "Gauge" chart representing "Investment Readiness" based on data filled.
  - **Design**: Strictly follow professional, clean aesthetic within the existing theme.

### Stage 5: Real-Time Market Fluctuation Engine
- **Goal**: Make the UI "Breathe" like a real trading platform.
- **Tasks**:
  - Shift from static mock data to a dynamic state management system.
  - Implement a `useMarketPulse` hook to simulate real-time price fluctuations every 5s.
  - Integrate live-moving line charts for "Market Pulse" using Recharts.

### Stage 4: Intelligent Audit Engine (Qwen Integration)
- **Goal**: Transform a chatbot into a financial analyst.
- **Tasks**:
  - Setup the Python backend (FastAPI) to handle Qwen API requests.
  - Implement Sentiment Analysis logic: Fetch news headlines -> Qwen -> Sentiment Score.
  - Implement "Timeline Logic": Calculate RSI and EMA indicators to determine entry/exit points.

### Stage 5: The AI Trading Agent & "Hired Hand" Mode
- **Goal**: Enable interactive and autonomous trading.
- **Tasks**:
  - Enhance the `AIAgentPage` with a true conversational interface.
  - Add the "Hired Hand" toggle: Granting the AI permission to execute trades on mock APIs.
  - Implement reactive sentiment understanding (AI changes suggestions based on user feedback).

### Stage 6: Market Sentinel & Exit Alerts
- **Goal**: Protect user capital with proactive monitoring.
- **Tasks**:
  - Build a background worker (Market Sentinel) that monitors active trades.
  - Implement the "Exit Alert" system: Pushing notifications when market conditions shift.
  - Logic: "Bull run detected -> Increase Target" vs "Volatility spike -> Stop-Loss trigger".

### Stage 7: Production-Level Visuals & Analytics
- **Goal**: WOW the reviewers with data visualization.
- **Tasks**:
  - Implement the **Portfolio Diversification Pie-Chart**.
  - Add the **AI Confidence Score** (88% etc.) beside every signal.
  - Polish the UI with glassmorphism and subtle animations (Framer Motion).

---

## 🛠️ Implementation Rules
1. **Preserve UI**: The v0 UI is sacred. All logic must be injected *behind* the existing design.
2. **Bottom-Up Development**: Complete sub-tasks before moving to the next stage.
3. **Continuous Logging**: Every session must end with a work log update.

## 🚀 Suggested Enhancements `[Suggestion]`
- **Voice-to-Wealth**: Integrate Web Speech API so users can say "I want to save for a bike in 2 years" and the form auto-fills.
- **Scenario Simulation**: Add a "What-If" slider (e.g. What if inflation hits 8%? What if the Nifty 50 drops 10%?).
