from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import httpx
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.post("/analyze")
async def analyze(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages", [])
        portfolio = data.get("portfolio", {})
        output_language = data.get("outputLanguage", "English")

        holdings_str = json.dumps(portfolio.get('holdings', []))

        system_prompt = (
            f"You are CoreVault AI, an elite autonomous financial trading advisor. "
            f"IMPORTANT: Always respond in {output_language} language. "
            f"The user's portfolio: Total Wealth=${portfolio.get('totalWealth', 0):.0f}, "
            f"Cash=${portfolio.get('balance', 0):.0f}, Holdings={holdings_str}. "
            "Rules: (1) Be ultra-concise, use bullet points, max 120 words. "
            "Use newlines between each bullet — never one long paragraph. "
            "(2) Always include specific entry price, exit/take-profit price, stop-loss price, and quantity when recommending trades. "
            "(3) If the user asks to buy/sell or if Hired Hand is active, output a JSON block at the very end: "
            "```json\n"
            "{\"action\": \"BUY\", \"symbol\": \"AAPL\", \"amount\": 5, \"entryPrice\": 188.5, \"targetPrice\": 205.0, \"stopLoss\": 180.0}\n"
            "```\n"
            "(4) For target/limit orders include targetPrice in the JSON. "
            "(5) Never use markdown headers like ##. Use plain bullet points starting with -."
        )

        api_messages = [{"role": "system", "content": system_prompt}] + messages

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": api_messages,
            "temperature": 0.7,
            "max_tokens": 512
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                GROQ_URL, 
                headers=headers, 
                json=payload, 
                timeout=30.0
            )

            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]
            else:
                return {"role": "assistant", "content": f"Groq API Error: {resp.status_code} - {resp.text}"}

    except Exception as e:
        return {"role": "assistant", "content": f"Internal Error: {str(e)}"}

@app.get("/")
def read_root():
    return {"status": "CoreVault Intelligence Core Active — Powered by Groq"}
