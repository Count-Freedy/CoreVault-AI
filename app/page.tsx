"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import {
  LayoutDashboard, Eye, Briefcase, Bot, GraduationCap, Users, Settings, Bell,
  TrendingUp, TrendingDown, ChevronDown, Sun, Moon, Search, Menu, X,
  Wallet, Activity, PieChart, ArrowUpRight, ArrowDownRight, Zap, Target,
  Shield, Award, BookOpen, MessageSquare, Send, ToggleLeft, ToggleRight,
  Plus, Minus, Play, CheckCircle, Lock, User, CreditCard, AlertTriangle,
  DollarSign, Percent, Clock, Star, Trophy, BadgeCheck, Sparkles, Flame, Dna,
  Mic, MicOff, Globe
} from "lucide-react"
import { QRCodeSVG } from 'qrcode.react'
import { AcademyPage } from "@/components/AcademyPage"
import { PriceTicker } from "@/components/PriceTicker"
import { OrderDialog } from "@/components/OrderDialog"
import { GlobalSearch } from "@/components/GlobalSearch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line, BarChart, Bar,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts"
import { useAuth } from "@/lib/auth-context"
import { AuthOverlay } from "@/components/AuthOverlay"
import { OnboardingOverlay } from "@/components/OnboardingOverlay"

declare global {
  interface Window {
    openDeposit: () => void;
    setChartRange: (r: string) => void;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const MARKET_DATA = [
  { time: "9:30", value: 45200, volume: 1200 },
  { time: "10:00", value: 45350, volume: 1800 },
  { time: "10:30", value: 45100, volume: 2200 },
  { time: "11:00", value: 45500, volume: 1600 },
  { time: "11:30", value: 45800, volume: 2400 },
  { time: "12:00", value: 45650, volume: 1400 },
  { time: "12:30", value: 45900, volume: 2800 },
  { time: "13:00", value: 46100, volume: 3200 },
  { time: "13:30", value: 46250, volume: 2600 },
  { time: "14:00", value: 46400, volume: 2100 },
  { time: "14:30", value: 46200, volume: 1900 },
  { time: "15:00", value: 46550, volume: 3400 },
]

const TOP_GAINERS = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 892.45, change: 8.24, volume: "45.2M" },
  { symbol: "TSLA", name: "Tesla Inc", price: 248.50, change: 6.12, volume: "82.1M" },
  { symbol: "AMD", name: "AMD Inc", price: 178.90, change: 5.45, volume: "38.7M" },
  { symbol: "META", name: "Meta Platforms", price: 512.30, change: 4.89, volume: "28.4M" },
]

const TOP_LOSERS = [
  { symbol: "INTC", name: "Intel Corp", price: 31.20, change: -4.52, volume: "52.3M" },
  { symbol: "BA", name: "Boeing Co", price: 178.45, change: -3.21, volume: "12.8M" },
  { symbol: "DIS", name: "Walt Disney", price: 112.30, change: -2.87, volume: "18.4M" },
  { symbol: "PYPL", name: "PayPal", price: 62.15, change: -2.45, volume: "22.1M" },
]


const AI_TRADE_SIGNALS = [
  { ticker: "AAPL", action: "BUY", entry: 188.50, tp: 205.00, sl: 180.00, confidence: 87, reason: "Strong support at 185, RSI oversold" },
  { ticker: "TSLA", action: "SELL", entry: 250.00, tp: 220.00, sl: 265.00, confidence: 72, reason: "Resistance at 255, bearish divergence" },
  { ticker: "NVDA", action: "BUY", entry: 885.00, tp: 950.00, sl: 850.00, confidence: 91, reason: "AI momentum, breakout pattern" },
]



const COMMUNITY_POSTS = [
  { id: 1, user: "QuantKing", avatar: "QK", content: "CoreVault just executed my GOOGL arbitrage perfectly. 15% ROI locked in! 🔥", likes: 450, comments: 85, sentiment: "bullish", ticker: "GOOGL" },
  { id: 2, user: "AlphaSeeker", avatar: "AS", content: "Whale flow detected on MSFT options. Hired Hand AI is mirroring the trade.", likes: 320, comments: 45, sentiment: "bullish", ticker: "MSFT" },
  { id: 3, user: "MacroTrader", avatar: "MT", content: "CPI data missed expectations. Scaling out of TSLA positions via limit orders.", likes: 112, comments: 39, sentiment: "bearish", ticker: "TSLA" },
  { id: 4, user: "DeFiDegen", avatar: "DD", content: "BTC is front-running the halving models. My CoreVault portfolio is up 40% YTD.", likes: 890, comments: 120, sentiment: "bullish", ticker: "BTC" },
]

const NEWS_TICKER = [
  "Fed signals potential rate cuts in Q3 2024",
  "NVIDIA announces new AI chip architecture",
  "Tesla deliveries exceed expectations",
  "Apple Vision Pro sales hit 1M units",
  "Bitcoin ETF sees record inflows",
]

const NOTIFICATIONS = [
  { id: 1, type: "alert", title: "AI Exit Alert", message: "TSLA approaching stop-loss at $242", time: "2m ago", urgent: true },
  { id: 2, type: "volatility", title: "High Volatility", message: "NVDA volatility spike detected (+15%)", time: "5m ago", urgent: true },
  { id: 3, type: "signal", title: "New Trade Signal", message: "AI detected BUY opportunity in AMZN", time: "12m ago", urgent: false },
  { id: 4, type: "news", title: "Market News", message: "Fed Chair speech at 2:00 PM EST", time: "30m ago", urgent: false },
  { id: 5, type: "portfolio", title: "Portfolio Update", message: "Your portfolio is up 2.4% today", time: "1h ago", urgent: false },
]

const ASSET_CATEGORIES = {
  stocks: [
    { symbol: "AAPL", name: "Apple Inc", price: 189.45, change: 2.34, sector: "Technology", pe: 29.5 },
    { symbol: "MSFT", name: "Microsoft", price: 415.60, change: -0.45, sector: "Technology", pe: 35.2 },
    { symbol: "GOOGL", name: "Alphabet Inc", price: 142.15, change: 1.25, sector: "Technology", pe: 28.1 },
    { symbol: "AMZN", name: "Amazon.com", price: 178.90, change: 3.21, sector: "Consumer", pe: 62.4 },
    { symbol: "NVDA", name: "NVIDIA Corp", price: 892.45, change: 8.24, sector: "Technology", pe: 72.1 },
    { symbol: "TSLA", name: "Tesla Inc", price: 248.50, change: 6.12, sector: "Auto", pe: 45.3 },
    { symbol: "META", name: "Meta Platforms", price: 512.30, change: 4.89, sector: "Technology", pe: 32.7 },
    { symbol: "AMD", name: "AMD Inc", price: 178.90, change: 5.45, sector: "Technology", pe: 48.9 },
    { symbol: "NFLX", name: "Netflix", price: 620.45, change: 2.12, sector: "Media", pe: 38.4 },
    { symbol: "DIS", name: "Walt Disney", price: 112.30, change: -2.87, sector: "Media", pe: 24.5 },
    { symbol: "RELIANCE", name: "Reliance Ind", price: 2950.45, change: 1.24, sector: "Energy", pe: 28.1 },
    { symbol: "TCS", name: "Tata Consultancy", price: 4120.30, change: 0.85, sector: "IT", pe: 31.4 },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1540.20, change: -0.45, sector: "Finance", pe: 18.2 },
    { symbol: "INFY", name: "Infosys Ltd", price: 1620.45, change: 1.12, sector: "IT", pe: 24.7 },
    { symbol: "ICICIBANK", name: "ICICI Bank", price: 1080.30, change: 2.34, sector: "Finance", pe: 17.5 },
    { symbol: "ADANIENT", name: "Adani Ent", price: 3240.45, change: 5.12, sector: "Conglomerate", pe: 112.4 },
    { symbol: "BRK.B", name: "Berkshire Hath", price: 410.25, change: 0.45, sector: "Finance", pe: 12.1 },
    { symbol: "V", name: "Visa Inc", price: 285.40, change: 1.12, sector: "Fintech", pe: 32.1 },
    { symbol: "MA", name: "Mastercard Inc", price: 475.20, change: 0.85, sector: "Fintech", pe: 35.4 },
    { symbol: "JPM", name: "JPMorgan Chase", price: 198.70, change: 1.12, sector: "Finance", pe: 11.4 },
    { symbol: "BAC", name: "Bank of America", price: 37.45, change: -0.24, sector: "Finance", pe: 10.2 },
    { symbol: "WMT", name: "Walmart Inc", price: 60.25, change: 0.85, sector: "Retail", pe: 28.4 },
    { symbol: "COST", name: "Costco Whsl", price: 742.30, change: 1.45, sector: "Retail", pe: 48.2 },
    { symbol: "PEP", name: "PepsiCo Inc", price: 168.45, change: -0.12, sector: "Consumer", pe: 24.1 },
    { symbol: "KO", name: "Coca-Cola Co", price: 60.12, change: 0.45, sector: "Consumer", pe: 22.4 },
    { symbol: "BA", name: "Boeing Co", price: 178.45, change: -3.21, sector: "Aerospace", pe: "-" },
    { symbol: "AIR", name: "Airbus SE", price: 158.30, change: 1.12, sector: "Aerospace", pe: 28.4 },
    { symbol: "NKE", name: "Nike Inc", price: 92.45, change: -1.24, sector: "Consumer", pe: 28.4 },
    { symbol: "SBUX", name: "Starbucks Corp", price: 88.30, change: 0.45, sector: "Consumer", pe: 24.1 },
    { symbol: "IBM", name: "IBM Corp", price: 185.40, change: 0.12, sector: "Tech", pe: 22.4 },
    { symbol: "ORCL", name: "Oracle Corp", price: 125.12, change: 3.45, sector: "Tech", pe: 32.4 },
    { symbol: "CRM", name: "Salesforce Inc", price: 298.45, change: 2.12, sector: "Tech", pe: 68.4 },
    { symbol: "INTC", name: "Intel Corp", price: 31.20, change: -4.52, sector: "Tech", pe: "-" },
    { symbol: "QCOM", name: "Qualcomm Inc", price: 172.45, change: 3.21, sector: "Tech", pe: 24.1 },
    { symbol: "TM", name: "Toyota Motor", price: 242.30, change: 1.12, sector: "Auto", pe: 10.4 },
    { symbol: "F", name: "Ford Motor", price: 12.45, change: 0.45, sector: "Auto", pe: 6.4 },
    { symbol: "GM", name: "Gen Motors", price: 44.30, change: 0.12, sector: "Auto", pe: 5.8 },
    { symbol: "TATASTEEL", name: "Tata Steel", price: 152.30, change: 2.12, sector: "Materials", pe: 14.2 },
    { symbol: "SUNPHARMA", name: "Sun Pharma", price: 1620.45, change: 0.85, sector: "Pharma", pe: 32.4 },
    { symbol: "WIPRO", name: "Wipro Ltd", price: 480.30, change: -1.12, sector: "IT", pe: 18.4 },
    { symbol: "AIRTEL", name: "Bharti Airtel", price: 1240.25, change: 1.45, sector: "Telecom", pe: 52.4 },
    { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7120.45, change: -0.85, sector: "Finance", pe: 32.4 },
    { symbol: "SBIN", name: "State Bank Ind", price: 760.30, change: 1.12, sector: "Finance", pe: 10.4 },
    { symbol: "ITC", name: "ITC Ltd", price: 420.45, change: 0.45, sector: "Consumer", pe: 24.2 },
    { symbol: "TITAN", name: "Titan Company", price: 3620.30, change: 1.12, sector: "Consumer", pe: 82.4 },
    { symbol: "ZOMATO", name: "Zomato Ltd", price: 185.40, change: 3.21, sector: "Tech", pe: "-" },
    { symbol: "PAYTM", name: "Paytm Ltd", price: 412.30, change: -2.45, sector: "Fintech", pe: "-" },
    { symbol: "NYKAA", name: "Nykaa Ltd", price: 168.45, change: 0.85, sector: "Retail", pe: "-" },
    { symbol: "MARUTI", name: "Maruti Suzuki", price: 12450.00, change: 1.12, sector: "Auto", pe: 32.1 },
    { symbol: "ASIANPAINT", name: "Asian Paints", price: 2850.45, change: -0.45, sector: "Materials", pe: 48.2 },
  ],
  mutualFunds: [
    { symbol: "VFIAX", name: "Vanguard 500 Index", nav: 452.30, change: 1.2, category: "Large Cap", expense: 0.04 },
    { symbol: "FXAIX", name: "Fidelity 500 Index", nav: 178.90, change: 1.1, category: "Large Cap", expense: 0.015 },
    { symbol: "VBTLX", name: "Vanguard Bond Index", nav: 10.45, change: 0.3, category: "Bond", expense: 0.05 },
    { symbol: "SWISX", name: "Schwab Intl Index", nav: 24.12, change: 0.85, category: "International", expense: 0.06 },
    { symbol: "VTSAX", name: "Vanguard Total Stock", nav: 112.45, change: 1.12, category: "Total Market", expense: 0.04 },
    { symbol: "VIGAX", name: "Vanguard Growth Index", nav: 185.30, change: 1.45, category: "Growth", expense: 0.05 },
    { symbol: "FCNTX", name: "Fidelity Contrafund", nav: 16.45, change: 1.2, category: "Large Cap", expense: 0.85 },
    { symbol: "PARA", name: "Parag Parikh Flexi", nav: 68.45, change: 1.45, category: "Flexi Cap", expense: 0.72 },
    { symbol: "HDFC_GROWTH", name: "HDFC Top 100", nav: 1245.30, change: 0.85, category: "Large Cap", expense: 1.12 },
    { symbol: "ICICI_PRU", name: "ICICI Bluechip", nav: 82.45, change: 1.12, category: "Large Cap", expense: 0.95 },
    { symbol: "SBI_CONTRA", name: "SBI Contra Fund", nav: 312.45, change: 2.12, category: "Contra", expense: 1.05 },
    { symbol: "AXIS_MIDCAP", name: "Axis Midcap Fund", nav: 168.30, change: 3.21, category: "Mid Cap", expense: 1.2 },
    { symbol: "NIPPON_SMALL", name: "Nippon Small Cap", nav: 142.45, change: 5.12, category: "Small Cap", expense: 1.45 },
    { symbol: "QUANT_SMALL", name: "Quant Small Cap", nav: 212.30, change: 6.24, category: "Small Cap", expense: 1.55 },
    { symbol: "MIRA_EMERGE", name: "Mirae Asset Emerge", nav: 112.45, change: 1.85, category: "Mid Cap", expense: 1.1 },
    { symbol: "DSP_ELSS", name: "DSP Tax Saver", nav: 94.30, change: 1.12, category: "ELSS", expense: 1.05 },
    { symbol: "KOTAK_BLUE", name: "Kotak Bluechip", nav: 412.30, change: 0.85, category: "Large Cap", expense: 1.12 },
    { symbol: "TATA_DIGI", name: "Tata Digital India", nav: 38.45, change: 2.45, category: "Sectoral", expense: 1.45 },
    { symbol: "GOLD_ETF", name: "HDFC Gold Fund", nav: 21.30, change: 0.45, category: "Commodity", expense: 0.5 },
    { symbol: "INDEX_N70", name: "Motilal Mid 150", nav: 72.45, change: 3.21, category: "Mid Cap", expense: 0.45 },
  ],
  sips: [
    { name: "Growth SIP", monthly: 5000, returns: 15.2, duration: "24 months", invested: 120000 },
    { name: "Balanced SIP", monthly: 3000, returns: 12.5, duration: "18 months", invested: 54000 },
    { name: "Safe Haven SIP", monthly: 10000, returns: 8.4, duration: "60 months", invested: 600000 },
    { name: "Aggressive Equity", monthly: 15000, returns: 18.2, duration: "36 months", invested: 540000 },
    { name: "Tax Saver SIP", monthly: 12500, returns: 14.5, duration: "36 months", invested: 450000 },
    { name: "Children Education", monthly: 20000, returns: 12.8, duration: "120 months", invested: 2400000 },
    { name: "Retirement Corpus", monthly: 25000, returns: 13.2, duration: "240 months", invested: 6000000 },
    { name: "Vacation Fund", monthly: 10000, returns: 10.5, duration: "12 months", invested: 120000 },
    { name: "Emergency SIP", monthly: 5000, returns: 6.2, duration: "12 months", invested: 60000 },
    { name: "Crypto Exposure", monthly: 2000, returns: 32.4, duration: "12 months", invested: 24000 },
    { name: "Tech Momentum", monthly: 7500, returns: 22.1, duration: "18 months", invested: 135000 },
    { name: "Pharma Defensive", monthly: 10000, returns: 13.5, duration: "36 months", invested: 360000 },
    { name: "Small Cap Wealth", monthly: 5000, returns: 25.4, duration: "60 months", invested: 300000 },
    { name: "Global Giant SIP", monthly: 12000, returns: 11.2, duration: "48 months", invested: 576000 },
    { name: "Div Yield Fund", monthly: 8000, returns: 14.2, duration: "36 months", invested: 288000 },
    { name: "ESG Focused", monthly: 5000, returns: 12.4, duration: "24 months", invested: 120000 },
    { name: "Multi-Asset SIP", monthly: 10000, returns: 13.5, duration: "36 months", invested: 360000 },
    { name: "Large Cap Stable", monthly: 15000, returns: 12.1, duration: "48 months", invested: 720000 },
    { name: "Value Investing", monthly: 6000, returns: 16.2, duration: "36 months", invested: 216000 },
    { name: "Nifty Next 50", monthly: 5000, returns: 17.4, duration: "24 months", invested: 120000 },
  ],
  crypto: [
    { symbol: "BTC", name: "Bitcoin", price: 67450.00, change: 3.45, marketCap: "1.3T", volume: "28B" },
    { symbol: "ETH", name: "Ethereum", price: 3520.00, change: 2.87, marketCap: "422B", volume: "12B" },
    { symbol: "SOL", name: "Solana", price: 142.50, change: 5.12, marketCap: "62B", volume: "3.2B" },
    { symbol: "BNB", name: "Binance Coin", price: 585.30, change: 1.24, marketCap: "88B", volume: "1.8B" },
    { symbol: "XRP", name: "Ripple", price: 0.62, change: -1.12, marketCap: "34B", volume: "1.2B" },
    { symbol: "ADA", name: "Cardano", price: 0.45, change: -0.85, marketCap: "16B", volume: "0.8B" },
    { symbol: "AVAX", name: "Avalanche", price: 36.45, change: 4.12, marketCap: "14B", volume: "0.9B" },
    { symbol: "DOT", name: "Polkadot", price: 7.12, change: 1.45, marketCap: "10B", volume: "0.4B" },
    { symbol: "DOGE", name: "Dogecoin", price: 0.16, change: 8.24, marketCap: "22B", volume: "2.4B" },
    { symbol: "TON", name: "Toncoin", price: 6.45, change: 2.12, marketCap: "14B", volume: "0.6B" },
  ],
  bonds: [
    { symbol: "US10Y", name: "US 10-Year Treasury", yield: 4.25, change: -0.02, maturity: "10 Years", rating: "AAA" },
    { symbol: "US2Y", name: "US 2-Year Treasury", yield: 4.68, change: 0.01, maturity: "2 Years", rating: "AAA" },
    { symbol: "IN_GOVT", name: "India 10Y G-Sec", yield: 7.12, change: 0.05, maturity: "10 Years", rating: "BBB+" },
    { symbol: "UK10Y", name: "UK Gilt 10Y", yield: 4.15, change: -0.01, maturity: "10 Years", rating: "AA" },
    { symbol: "CH10Y", name: "China 10Y Govt", yield: 2.30, change: 0.02, maturity: "10 Years", rating: "A+" },
    { symbol: "AAPL_CORP", name: "Apple 2030 Corporate", yield: 3.85, change: -0.01, maturity: "6 Years", rating: "AAA" },
    { symbol: "TATA_CORP", name: "Tata Power 2028", yield: 7.85, change: 0.08, maturity: "4 Years", rating: "AA+" },
    { symbol: "RELI_CORP", name: "Reliance 2035", yield: 7.45, change: 0.05, maturity: "11 Years", rating: "AAA" },
    { symbol: "MUNI_NYC", name: "NYC Municipal 2040", yield: 3.45, change: -0.02, maturity: "16 Years", rating: "AA" },
    { symbol: "WB_GREEN", name: "World Bank Green Bond", yield: 2.85, change: 0.01, maturity: "5 Years", rating: "AAA" },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function DepositDialog({ isOpen, onClose, onDeposit }: {
  isOpen: boolean,
  onClose: () => void,
  onDeposit: (amount: number, note: string) => void
}) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("Direct Deposit")

  const handleDeposit = () => {
    const val = parseFloat(amount)
    if (val > 0) {
      onDeposit(val, note)
      setAmount("")
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="glass border-l border-primary/20 bg-background/80 backdrop-blur-xl">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" /> Deposit Funds
          </SheetTitle>
          <CardDescription>Add simulated balance to your CoreVault Wallet</CardDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount ($)</label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-primary/5 border-primary/10 h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Note / Commit Message</label>
            <Input
              placeholder="e.g. Initial Investment"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-primary/5 border-primary/10 h-12"
            />
          </div>
          <Button className="w-full py-6 text-lg font-bold shadow-xl" onClick={handleDeposit}>
            CONFIRM DEPOSIT
          </Button>
          <div className="p-4 rounded-xl bg-success/5 border border-success/10 text-[11px] text-success leading-relaxed">
            <Sparkles className="h-3 w-3 inline mr-1 mb-0.5" />
            CoreVault AI simulation environment. No real money will be deducted from your bank accounts.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CreateWatchlistDialog({ isOpen, onClose, onCreate }: {
  isOpen: boolean,
  onClose: () => void,
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#10b981]" /> Create Watchlist
          </DialogTitle>
          <DialogDescription>Give your new collection a name to start tracking assets.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="e.g. My Alpha Stocks"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-primary/5 border-primary/10 h-11"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-[#10b981] hover:bg-[#0da672] text-white"
            onClick={() => { if (name) { onCreate(name); setName(""); onClose(); } }}
          >
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddToWatchlistDialog({ isOpen, onClose, onAdd, watchlists, symbol }: {
  isOpen: boolean,
  onClose: () => void,
  onAdd: (listIndex: number) => void,
  watchlists: any[],
  symbol: string
}) {
  const [selectedIndex, setSelectedIndex] = useState("0")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#10b981]" /> Add to Watchlist
          </DialogTitle>
          <DialogDescription>Select which watchlist should track <span className="text-[#10b981] font-bold">{symbol}</span>.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedIndex} onValueChange={setSelectedIndex}>
            <SelectTrigger className="w-full bg-primary/5 border-primary/10 h-11">
              <SelectValue placeholder="Select a watchlist" />
            </SelectTrigger>
            <SelectContent>
              {watchlists.map((w, i) => (
                <SelectItem key={w.id} value={i.toString()}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-[#10b981] hover:bg-[#0da672] text-white"
            onClick={() => { onAdd(parseInt(selectedIndex)); onClose(); }}
          >
            Add Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ title, value, change, icon: Icon, prefix = "" }: {
  title: string, value: string | React.ReactNode, change?: number, icon: React.ElementType, prefix?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{prefix}{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? "text-success" : "text-destructive"}`}>
                {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(change).toFixed(2)}%</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-[#10b981]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MiniSparkline({ data, positive }: { data: number[], positive: boolean }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 60},${30 - ((v - min) / range) * 24}`).join(" ")
  return (
    <svg width="60" height="30" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "var(--success)" : "var(--destructive)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StockRow({ symbol, name, price, change, sparkline, onAdd }: {
  symbol: string, name: string, price: number, change: number, sparkline?: number[], onAdd?: () => void
}) {
  const positive = change >= 0
  return (
    <div className="flex items-center justify-between py-4 px-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-sm">
          {symbol.slice(0, 2)}
        </div>
        <div>
          <p className="font-medium">{symbol}</p>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
      </div>
      {sparkline && <MiniSparkline data={sparkline} positive={positive} />}
      <div className="text-right">
        <p className="font-medium">
          <PriceTicker value={price} prefix="$" />
        </p>
        <p className={`text-sm ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? "+" : ""}{change.toFixed(2)}%
        </p>
      </div>
      {onAdd && (
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function TradeCard({ ticker, action, entry, tp, sl, confidence, reason, onExecute }: {
  ticker: string, action: string, entry: number, tp: number, sl: number, confidence: number, reason: string,
  onExecute?: () => void
}) {
  const isBuy = action === "BUY"
  const [executed, setExecuted] = useState(false)
  return (
    <Card className={`border-l-4 ${isBuy ? "border-l-success" : "border-l-destructive"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{ticker}</span>
            <Badge variant={isBuy ? "default" : "destructive"} className={isBuy ? "bg-success text-success-foreground" : ""}>
              {action}
            </Badge>
          </div>
          <div className="flex flex-col items-end gap-1 w-32">
            <div className="flex items-center gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-warning" />
              <span className="font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Confidence</span>
              <span className="font-bold">{confidence}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-warning" style={{ width: `${confidence}%` }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
          <div className="bg-muted rounded-lg p-2 text-center">
            <p className="text-muted-foreground text-xs">Entry</p>
            <p className="font-medium">${entry}</p>
          </div>
          <div className="bg-success/10 rounded-lg p-2 text-center">
            <p className="text-success text-xs">Take Profit</p>
            <p className="font-medium text-success">${tp}</p>
          </div>
          <div className="bg-destructive/10 rounded-lg p-2 text-center">
            <p className="text-destructive text-xs">Stop Loss</p>
            <p className="font-medium text-destructive">${sl}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{reason}</p>
        {executed ? (
          <div className="w-full text-center text-xs text-success font-bold py-2 bg-success/10 rounded-lg">
            ✅ Order Executed
          </div>
        ) : (
          <Button
            className={`w-full ${isBuy ? '' : 'bg-destructive hover:bg-destructive/90'}`}
            size="sm"
            onClick={() => {
              if (onExecute) { onExecute(); setExecuted(true) }
            }}
            disabled={!onExecute}
          >
            <Play className="h-4 w-4 mr-2" /> {onExecute ? `Execute ${action}` : 'Enable Hired Hand'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}



function CommunityPost({ user, avatar, content, likes, comments, sentiment, ticker }: {
  user: string, avatar: string, content: string, likes: number, comments: number, sentiment: string, ticker: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">{avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{user}</span>
              <Badge variant="outline" className="text-xs">${ticker}</Badge>
              <Badge variant={sentiment === "bullish" ? "default" : "destructive"} className={`text-xs ${sentiment === "bullish" ? "bg-success text-success-foreground" : ""}`}>
                {sentiment === "bullish" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {sentiment}
              </Badge>
            </div>
            <p className="text-sm mb-3">{content}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Star className="h-4 w-4" /> {likes}
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageSquare className="h-4 w-4" /> {comments}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function DashboardPage({
  marketData,
  sentimentValue,
  livePrices,
  holdings,
  balance,
  tradeHistory
}: {
  marketData: any[],
  sentimentValue: number,
  livePrices: Record<string, number>,
  holdings: any[],
  balance: number,
  tradeHistory: any[]
}) {
  const displayHoldings = holdings
  const totalValue = displayHoldings.reduce((acc, p) => acc + p.qty * (livePrices[p.symbol] || p.currentPrice || p.avgPrice), 0)
  const totalCost = displayHoldings.reduce((acc, p) => acc + p.qty * p.avgPrice, 0)
  const totalWealth = balance + totalValue
  const dailyPnL = (totalWealth - (balance + totalCost)) * 0.05

  const activePositions = displayHoldings.length
  const totalTrades = tradeHistory.length
  const profitableTrades = tradeHistory.filter((t: any) => {
    const current = livePrices[t.symbol] || t.price
    return t.type === 'buy' ? current >= t.price : current <= t.price
  }).length
  const winRate = totalTrades > 0 ? ((profitableTrades / totalTrades) * 100).toFixed(1) : "0.0"

  // Dynamic movers based on livePrices
  const allStocks = ASSET_CATEGORIES.stocks.map(s => ({
    ...s,
    currentPrice: livePrices[s.symbol] || s.price,
    actualChange: ((livePrices[s.symbol] || s.price) - s.price) / s.price * 100
  }))
  const dynamicGainers = [...allStocks].sort((a, b) => b.actualChange - a.actualChange).slice(0, 4)
  const dynamicLosers = [...allStocks].sort((a, b) => a.actualChange - b.actualChange).slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Wealth" value={<PriceTicker value={totalWealth} prefix="$" />} icon={Wallet} />
        <StatCard title="24h P&L" value={<PriceTicker value={dailyPnL} prefix="$" />} change={2.34} icon={Activity} />
        <StatCard title="Active Positions" value={activePositions.toString()} icon={Target} />
        <StatCard title="Win Rate" value={`${winRate}%`} icon={Trophy} />
      </div>

      {/* Market Sentiment & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-40 flex items-center justify-center pt-8">
              <svg viewBox="0 0 200 100" className="w-full max-w-[200px]">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" />
                    <stop offset="50%" stopColor="hsl(var(--warning))" />
                    <stop offset="100%" stopColor="hsl(var(--success))" />
                  </linearGradient>
                </defs>
                <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="hsl(var(--muted)/0.5)" strokeWidth="12" strokeLinecap="round" />
                <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${sentimentValue * 2.51}, 251`} />
                <circle cx={100 + 80 * Math.cos(Math.PI + (Math.PI * sentimentValue / 100))} cy={90 + 80 * Math.sin(Math.PI + (Math.PI * sentimentValue / 100))} r="8" fill="#10b981" stroke="white" strokeWidth="2" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                <p className="text-4xl font-black text-[#10b981] leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">{sentimentValue.toFixed(1)}%</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">
                  {sentimentValue > 60 ? 'High Bullish' : sentimentValue < 40 ? 'High Bearish' : 'Neutral Engine'}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-4">
              <span>Fear</span>
              <span>Neutral</span>
              <span>Greed</span>
            </div>
          </CardContent>
        </Card>

        {/* Live Market Chart */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-black tracking-tighter">Market Dynamics</CardTitle>
              <CardDescription className="text-xs font-semibold uppercase tracking-widest text-[#10b981]">S&P 500 Index Pulse</CardDescription>
            </div>
            <Tabs defaultValue="1d" onValueChange={(v) => (window as any).setChartRange?.(v)}>
              <TabsList className="bg-primary/5 border border-primary/10">
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="1w">1W</TabsTrigger>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid #10b981', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#10b981' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gainers & Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" /> Live Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {dynamicGainers.map((stock) => (
              <StockRow key={stock.symbol} symbol={stock.symbol} name={stock.name} price={stock.currentPrice} change={stock.actualChange} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" /> Live Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {dynamicLosers.map((stock) => (
              <StockRow key={stock.symbol} symbol={stock.symbol} name={stock.name} price={stock.currentPrice} change={stock.actualChange} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AIAgentPage({
  livePrices,
  holdings,
  balance,
  onExecuteTrade,
  messages,
  setMessages,
  language,
  setLanguage,
  onPushNotification,
  onAddTargetOrder,
  tradeHistory
}: {
  livePrices: Record<string, number>,
  holdings: any[],
  balance: number,
  onExecuteTrade: (order: any) => void,
  messages: { role: string, content: string }[],
  setMessages: React.Dispatch<React.SetStateAction<{ role: string, content: string }[]>>,
  language: string,
  setLanguage: (l: string) => void,
  onPushNotification: (type: string, title: string, message: string, urgent?: boolean) => void,
  onAddTargetOrder: (order: { symbol: string, targetPrice: number, qty: number, action: 'buy' | 'sell' }) => void,
  tradeHistory: any[]
}) {
  const totalValue = holdings.reduce((acc, p) => acc + p.qty * (livePrices[p.symbol] || p.price || 0), 0)
  const wealth = balance + totalValue

  // Initialize greeting only on first load (when messages is empty)
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = wealth > 0
        ? `Command Center initialized. Total wealth tracked at $${wealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}. You hold ${holdings.length} active positions. Would you like me to run a deep diagnostic?`
        : "Command Center initialized. Your portfolio is currently empty. Deposit funds and start investing to unlock AI-powered portfolio analysis."
      setMessages([{ role: 'assistant', content: greeting }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [input, setInput] = useState("")
  const [autoTrade, setAutoTrade] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Live signals generated from actual holdings
  const [liveSignals, setLiveSignals] = useState<any[]>([])
  useEffect(() => {
    if (holdings.length === 0) return
    const signals = holdings.map((h: any) => {
      const currentPrice = livePrices[h.symbol] || h.avgPrice
      const change = ((currentPrice - h.avgPrice) / h.avgPrice) * 100
      const action = change < -3 ? 'SELL' : change > 5 ? 'SELL' : 'BUY'
      const confidence = Math.floor(65 + Math.random() * 30)
      const entry = currentPrice
      const tp = action === 'BUY' ? +(currentPrice * 1.08).toFixed(2) : +(currentPrice * 0.93).toFixed(2)
      const sl = action === 'BUY' ? +(currentPrice * 0.96).toFixed(2) : +(currentPrice * 1.04).toFixed(2)
      return { ticker: h.symbol, action, entry: +entry.toFixed(2), tp, sl, confidence, reason: change < 0 ? `Down ${Math.abs(change).toFixed(1)}% from avg — monitor closely` : `Up ${change.toFixed(1)}% from avg — consider partial exit` }
    })
    setLiveSignals(signals)
  }, [holdings, livePrices])

  // ═══ HIRED HAND: Background polling when autoTrade is ON ═══
  useEffect(() => {
    if (!autoTrade || holdings.length === 0) return
    const loop = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Based on current portfolio and market conditions, should I BUY or SELL anything RIGHT NOW? Reply with ONLY a JSON trade block if yes, or the word HOLD if no action needed.' }],
            portfolio: { totalWealth: wealth, balance, holdings },
            outputLanguage: 'English',
            autoTrade: true
          })
        })
        const data = await response.json()
        const content = data.content || ""
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
          const req = JSON.parse(jsonMatch[1])
          const price = livePrices[req.symbol] || 0
          if (price > 0) {
            onExecuteTrade({ type: req.action?.toLowerCase(), assetType: 'stock', symbol: req.symbol, qty: req.amount || 1, price })
            onPushNotification('signal', `🤖 Auto-Trade: ${req.action} ${req.symbol}`, `Hired Hand executed ${req.action?.toLowerCase()} ${req.amount} ${req.symbol} at $${price?.toFixed(2)}`, true)
            const tp = req.action === 'BUY' ? +(price * 1.08).toFixed(2) : +(price * 0.93).toFixed(2)
            onAddTargetOrder({ symbol: req.symbol, targetPrice: tp, qty: req.amount || 1, action: 'sell' })
          }
        }
      } catch { /* silent */ }
    }, 30000) // poll every 30 seconds
    return () => clearInterval(loop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTrade, holdings.length])

  const queryChips = ["Run deep diagnostic", "Entry/exit for my holdings", "Market sentiment update", "Set a target sell order"]

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in your browser.")
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + (prev ? " " : "") + transcript)
    }
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input
    const newMessages = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setInput("")

    // Language label map for system prompt
    const langMap: Record<string, string> = { 'en-IN': 'English', 'hi-IN': 'Hindi', 'bn-IN': 'Bengali', 'ta-IN': 'Tamil', 'te-IN': 'Telugu' }
    const outputLang = langMap[language] || 'English'

    const tempIndex = newMessages.length
    setMessages(prev => [...prev, { role: "assistant", content: "Analyzing via Intelligence Core..." }])

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          portfolio: { totalWealth: wealth, balance, holdings },
          autoTrade,
          outputLanguage: outputLang
        })
      })
      const data = await response.json()
      let finalContent = data.content || data.result || "No response received."

      // Parse trade action from AI response
      let jsonMatch = finalContent.match(/```(?:json)?\n?([\s\S]*?)\n?```/i)
      if (!jsonMatch) {
        // Fallback: match raw JSON block containing "action"
        const rawMatch = finalContent.match(/(\{\s*"action"\s*:[\s\S]*?\})/i)
        if (rawMatch) jsonMatch = rawMatch
      }
      if (jsonMatch) {
        try {
          let cleanJsonStr = jsonMatch[1]
          const firstBrace = cleanJsonStr.indexOf('{')
          const lastBrace = cleanJsonStr.lastIndexOf('}')
          if (firstBrace !== -1 && lastBrace !== -1) {
            cleanJsonStr = cleanJsonStr.substring(firstBrace, lastBrace + 1)
          }

          const actionReq = JSON.parse(cleanJsonStr)
          const price = livePrices[actionReq.symbol] || actionReq.entryPrice || actionReq.exitPrice || 0
          let qty = actionReq.amount || actionReq.qty || 1
          const tp = actionReq.targetPrice || actionReq.tp || actionReq.exitPrice || actionReq.stopLoss || 0

          const isSell = actionReq.action?.toUpperCase() === 'SELL'
          // If selling "all", we should get exact qty from holdings
          if (isSell && /all/i.test(userMsg)) {
            const holding = holdings.find((h: any) => h.symbol === actionReq.symbol)
            if (holding) qty = holding.qty
          }

          const hasNowKeyword = /now|immediately|instantly|right away|abhi|turant|all/i.test(userMsg)
          const isBackgroundBot = userMsg.includes("Run background Market Sentinel check")
          const hasLimitKeyword = /when|if it hits|limit|drops to|rises to|target of|at price/i.test(userMsg)

          if (tp > 0 && hasLimitKeyword && !isSell) {
            // Limit order
            onAddTargetOrder({ symbol: actionReq.symbol, targetPrice: tp, qty, action: (actionReq.action || 'buy').toLowerCase() as 'buy' | 'sell' })
            finalContent = finalContent.replace(jsonMatch[0], `\n> 🎯 **Target order set: ${actionReq.action?.toUpperCase()} ${qty} ${actionReq.symbol} when price hits $${tp}**`)
          } else if (autoTrade || hasNowKeyword || isSell || !isBackgroundBot) {
            // Instant execution for explicitly requested actions, or Hired Hand
            if (price > 0) {
              onExecuteTrade({ type: (actionReq.action || 'buy').toLowerCase(), assetType: 'stock', symbol: actionReq.symbol, qty, price })
              onPushNotification('signal', `⚡ ${autoTrade ? 'Hired Hand' : 'Instant'} ${actionReq.action?.toUpperCase()}`, `${actionReq.action?.toUpperCase()} ${qty} ${actionReq.symbol} at $${price.toFixed(2)}`, true)
              finalContent = finalContent.replace(jsonMatch[0], `\n> ⚡ **Executed: ${actionReq.action?.toUpperCase()} ${qty} ${actionReq.symbol} at $${price.toFixed(2)}**`)

              // Auto-set a take-profit/target order if we just bought and a future target exists
              if (actionReq.action?.toUpperCase() === 'BUY' && tp > price) {
                onAddTargetOrder({ symbol: actionReq.symbol, targetPrice: tp, qty, action: 'sell' })
                finalContent += `\n> 🎯 **Auto take-profit set at $${tp}**`
              }
            }
          } else {
            finalContent = finalContent.replace(jsonMatch[0], `\n> 💡 **Recommendation: ${actionReq.action?.toUpperCase()} ${qty} ${actionReq.symbol} at ~$${price.toFixed(2)}. Enable Hired Hand to auto-execute.**`)
          }
        } catch (e) {
          console.error("AI JSON Parse error", e)
        }
      }

      setMessages(prev => {
        const updated = [...prev]
        updated[tempIndex] = { role: "assistant", content: finalContent }
        return updated
      })
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev]
        updated[tempIndex] = { role: "assistant", content: "Connection to Intelligence Core failed. Ensure Python backend is running on port 8000." }
        return updated
      })
    }
  }

  // Diagnostic Metrics
  const cashRatio = wealth > 0 ? (balance / wealth) * 100 : 0
  const highestAllocation = holdings.reduce((max, h) => {
    const val = h.qty * (livePrices[h.symbol] || h.price || 0)
    return val > max.val ? { symbol: h.symbol, val } : max
  }, { symbol: 'None', val: 0 })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[550px]">
      {/* Central Command Chat */}
      <Card className="lg:col-span-2 flex flex-col shadow-lg border-primary/20 h-full min-h-0">
        <CardHeader className="border-b bg-muted/20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                <Bot className="h-6 w-6 text-primary-foreground relative z-10" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Intelligence Core</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  Online & Syncing
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hired Hand Mode</span>
                <Switch checked={autoTrade} onCheckedChange={setAutoTrade} />
              </div>
              {autoTrade ? (
                <span className="text-[10px] text-success font-medium">Autonomous Trading ACTIVE</span>
              ) : (
                <span className="text-[10px] text-muted-foreground">Read-Only</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm glass border-l-4 border-l-primary"
                    }`}>
                    {msg.content.split('\n').map((line, j) => (
                      <span key={j}>
                        {line.replace(/\*\*/g, '') /* Basic strip of bold markdown */}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t bg-muted/10 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {queryChips.map((chip) => (
              <Button key={chip} variant="secondary" size="sm" className="whitespace-nowrap rounded-full text-xs" onClick={() => setInput(chip)}>
                {chip}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px] h-12 bg-background border-primary/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <SelectValue placeholder="Lang" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-IN">English</SelectItem>
                <SelectItem value="hi-IN">Hindi</SelectItem>
                <SelectItem value="bn-IN">Bengali</SelectItem>
                <SelectItem value="ta-IN">Tamil</SelectItem>
                <SelectItem value="te-IN">Telugu</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Input
                placeholder="Initiate command or speak..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="pl-4 pr-12 h-12 rounded-xl bg-background border-primary/20 focus-visible:ring-primary/50"
              />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-1 top-1 h-10 w-10 rounded-lg ${isListening ? 'text-destructive animate-pulse bg-destructive/10' : 'text-muted-foreground'}`}
                onClick={startListening}
              >
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
            </div>

            <Button onClick={handleSend} className="h-12 w-12 rounded-xl shadow-lg shadow-primary/20 shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Intelligence Feed */}
      <div className="space-y-6 flex flex-col h-full min-h-0">
        {/* Portfolio Diagnostics */}
        <Card className="glass border-primary/20 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" /> Portfolio Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">💧 Cash Liquidity</span>
                <span className="font-bold">{cashRatio.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${cashRatio < 10 ? 'bg-destructive' : cashRatio < 30 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${Math.min(100, cashRatio)}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {cashRatio < 10 ? '⚠️ Very low cash. Risk of margin call.' : cashRatio < 30 ? '⚡ Moderate cash. Some room to invest.' : '✅ Healthy. Good buffer for opportunities.'}
              </p>
            </div>
            <div className="pt-2 border-t border-dashed grid grid-cols-2 gap-3 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Top Holding</p>
                <p className="text-sm font-black">{highestAllocation.symbol}</p>
                <p className="text-[10px] text-muted-foreground">Biggest risk bet</p>
              </div>
              <div className="bg-warning/10 rounded-lg p-2">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Risk Level</p>
                <p className={`text-sm font-black ${cashRatio > 50 ? 'text-success' : cashRatio > 20 ? 'text-warning' : 'text-destructive'}`}>
                  {cashRatio > 50 ? 'Conservative' : cashRatio > 20 ? 'Moderate' : 'Aggressive'}
                </p>
                <p className="text-[10px] text-muted-foreground">Based on cash ratio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Signals List */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="py-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-warning" /> AI Signals
              </h3>
              <Badge variant="outline" className="text-[10px]">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {liveSignals.length === 0 ? (
                  <div className="text-center text-muted-foreground text-xs py-8">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Add holdings to see live AI signals</p>
                  </div>
                ) : liveSignals.map((signal, i) => (
                  <TradeCard
                    key={i}
                    {...signal}
                    onExecute={autoTrade ? () => {
                      const price = livePrices[signal.ticker] || signal.entry
                      onExecuteTrade({ type: signal.action.toLowerCase(), assetType: 'stock', symbol: signal.ticker, qty: 1, price })
                      onPushNotification('signal', `⚡ Signal Executed: ${signal.action} ${signal.ticker}`, `${signal.action} 1 share of ${signal.ticker} at $${price.toFixed(2)}`, false)
                    } : () => {
                      // Even without autoTrade, Execute button should work as a manual one-click
                      const price = livePrices[signal.ticker] || signal.entry
                      onExecuteTrade({ type: signal.action.toLowerCase(), assetType: 'stock', symbol: signal.ticker, qty: 1, price })
                      onPushNotification('portfolio', `✅ Manual Execute: ${signal.action} ${signal.ticker}`, `${signal.action} 1 share at $${price.toFixed(2)}`, false)
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


function WatchlistPage({
  livePrices,
  watchlists,
  onUpdateWatchlists,
  onOpenCreateDialog
}: {
  livePrices: Record<string, number>,
  watchlists: any[],
  onUpdateWatchlists: (newList: any[]) => void,
  onOpenCreateDialog: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentList = watchlists[currentIndex] || watchlists[0]

  const removeSymbol = (symbol: string) => {
    const updated = [...watchlists]
    updated[currentIndex] = { ...currentList, symbols: currentList.symbols.filter((s: string) => s !== symbol) }
    onUpdateWatchlists(updated)
  }

  const deleteWatchlist = () => {
    if (watchlists.length <= 1) return
    const updated = watchlists.filter((_, i) => i !== currentIndex)
    onUpdateWatchlists(updated)
    setCurrentIndex(0)
  }

  const allAssets = [
    ...ASSET_CATEGORIES.stocks,
    ...ASSET_CATEGORIES.crypto,
    ...ASSET_CATEGORIES.mutualFunds,
    ...ASSET_CATEGORIES.bonds
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Watchlist Alpha</h2>
          <p className="text-muted-foreground">Manage and track your preferred assets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={deleteWatchlist} disabled={watchlists.length <= 1}>
            <X className="h-4 w-4 mr-2" /> Delete List
          </Button>
          <Button onClick={onOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" /> New List
          </Button>
        </div>
      </div>

      <Tabs value={currentList.id} onValueChange={(v) => setCurrentIndex(watchlists.findIndex(w => w.id === v))}>
        <TabsList className="bg-muted/50 p-1 border">
          {watchlists.map((w) => (
            <TabsTrigger key={w.id} value={w.id}>{w.name}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-6 gap-4 p-4 border-b text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="col-span-2">Symbol</span>
            <span>Intraday</span>
            <span className="text-right">Live Price</span>
            <span className="text-right">Change</span>
            <span className="text-right">Actions</span>
          </div>
          {currentList.symbols.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No symbols in this list. Use search to add assets.
            </div>
          )}
          {currentList.symbols.map((symbol: string) => {
            const asset = allAssets.find(a => (a as any).symbol === symbol || (a as any).name === symbol)
            if (!asset) return null
            const price = livePrices[symbol] || (asset as any).price || (asset as any).nav || (asset as any).yield
            const change = (asset as any).change || 0

            return (
              <div key={symbol} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors border-b last:border-0 group">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                    {symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{symbol}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{(asset as any).name}</p>
                  </div>
                </div>
                <div>
                  <MiniSparkline data={[50, 52, 49, 53, 55, 54]} positive={change >= 0} />
                </div>
                <div className="text-right font-mono text-sm">
                  <PriceTicker value={price} prefix="$" />
                </div>
                <div className={`text-right text-xs font-bold ${change >= 0 ? "text-success" : "text-destructive"}`}>
                  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </div>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSymbol(symbol)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

function PortfolioPage({ livePrices, holdings, balance }: {
  livePrices: Record<string, number>,
  holdings: any[],
  balance: number
}) {
  const displayHoldings = holdings
  const totalValue = displayHoldings.reduce((acc, p) => acc + p.qty * (livePrices[p.symbol] || p.currentPrice || p.avgPrice), 0)
  const totalCost = displayHoldings.reduce((acc, p) => acc + p.qty * p.avgPrice, 0)
  const totalReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Portfolio Value" value={<PriceTicker value={totalValue} prefix="$" />} icon={Wallet} />
        <StatCard title="Total Returns" value={<PriceTicker value={totalValue - totalCost} prefix="$" />} change={totalReturn} icon={TrendingUp} />
        <StatCard title="Wallet Balance" value={<PriceTicker value={balance} prefix="$" />} icon={CreditCard} />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => (window as any).openDeposit()} className="gap-2">
          <Plus className="h-4 w-4" /> Deposit Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diversification Chart */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" /> Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {displayHoldings.length === 0 ? (
              <div className="h-[250px] flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-primary/20 rounded-xl bg-muted/20">
                <PieChart className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm font-medium">No active positions</p>
                <p className="text-xs text-muted-foreground mt-1">Start investing to see your diversification breakdown.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={[
                      { name: 'Stocks', value: displayHoldings.filter((h: any) => h.type === 'stock').length, color: 'var(--primary)' },
                      { name: 'Crypto', value: displayHoldings.filter((h: any) => h.type === 'crypto').length, color: 'var(--warning)' },
                      { name: 'MF/SIP', value: displayHoldings.filter((h: any) => h.type === 'mf' || h.type === 'sip').length, color: 'var(--success)' },
                      { name: 'Bonds', value: displayHoldings.filter((h: any) => h.type === 'bond').length, color: 'var(--chart-3)' },
                    ].filter(d => d.value > 0)}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { color: 'var(--primary)' },
                      { color: 'var(--warning)' },
                      { color: 'var(--success)' },
                      { color: 'var(--chart-3)' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', background: '#0a0a0a', border: '1px solid var(--primary)' }} />
                </RechartsPie>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" /> Risk & Profile Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { subject: 'Volatility', A: displayHoldings.filter(h => h.type === 'crypto').length > 0 ? 90 : 40, fullMark: 100 },
                  { subject: 'Liquidity', A: balance > 0 ? Math.min(100, (balance / (totalValue + balance)) * 100 * 2) : 10, fullMark: 100 },
                  { subject: 'Tech Focus', A: 70, fullMark: 100 },
                  { subject: 'Dividends', A: displayHoldings.some(h => ['JPM', 'KO'].includes(h.symbol)) ? 80 : 30, fullMark: 100 },
                  { subject: 'Aggression', A: 65, fullMark: 100 },
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Portfolio"
                    dataKey="A"
                    stroke="var(--warning)"
                    fill="var(--warning)"
                    fillOpacity={0.5}
                  />
                  <Tooltip contentStyle={{ borderRadius: '12px', background: '#0a0a0a', border: '1px solid var(--warning)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="border-primary/20 bg-muted/5">
        <CardHeader>
          <CardTitle className="text-lg">Your Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="text-left p-4">Asset</th>
                  <th className="text-right p-4">Qty</th>
                  <th className="text-right p-4">Avg Price</th>
                  <th className="text-right p-4">Current</th>
                  <th className="text-right p-4">P&L</th>
                  <th className="text-right p-4">Return</th>
                </tr>
              </thead>
              <tbody>
                {displayHoldings.map((holding) => {
                  const currentPrice = livePrices[holding.symbol] || holding.currentPrice || holding.avgPrice
                  const pnl = (currentPrice - holding.avgPrice) * holding.qty
                  const pnlPerc = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100
                  return (
                    <tr key={holding.symbol} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold">
                            {holding.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{holding.symbol}</p>
                            <p className="text-xs text-muted-foreground">{holding.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right p-4">{holding.qty}</td>
                      <td className="text-right p-4">${holding.avgPrice.toFixed(2)}</td>
                      <td className="text-right p-4">
                        <PriceTicker value={livePrices[holding.symbol] || holding.currentPrice} prefix="$" />
                      </td>
                      <td className={`text-right p-4 ${pnl >= 0 ? "text-success" : "text-destructive"}`}>
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                      </td>
                      <td className={`text-right p-4 ${pnlPerc >= 0 ? "text-success" : "text-destructive"}`}>
                        {pnlPerc >= 0 ? "+" : ""}{pnlPerc.toFixed(2)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



function CommunityPage({ livePrices }: { livePrices: Record<string, number> }) {
  const [newsIndex, setNewsIndex] = useState(0)

  // Dynamic Alpha Radar Logic
  const dynamicNews = useMemo(() => {
    const staticNews = [
      "Fed signals potential rate cuts in Q3 2024",
      "NVIDIA announces new AI chip architecture",
      "Tesla deliveries exceed expectations",
      "Crypto markets show consolidation before halving",
      "Institutional whale wallets increasing BTC exposure",
      "Global tech sector sees massive venture inflows"
    ]

    // Find top mover from livePrices
    const movers = Object.entries(livePrices).map(([symbol, price]) => {
      const allAssets: any[] = [...ASSET_CATEGORIES.stocks, ...ASSET_CATEGORIES.crypto, ...ASSET_CATEGORIES.mutualFunds, ...ASSET_CATEGORIES.bonds]
      const asset = allAssets.find(a => a.symbol === symbol)
      if (asset) {
        const bp = asset.price || asset.nav || asset.yield || asset.monthly || price
        const changePerc = ((price - bp) / bp) * 100
        return { symbol, change: changePerc, price }
      }
      return { symbol, change: 0, price }
    }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change))

    if (movers.length > 0) {
      const top = movers[0]
      const alert = top.change > 0
        ? `🔥 ${top.symbol} is surging! Up ${top.change.toFixed(2)}% in this session.`
        : `🚨 ALERT: ${top.symbol} is showing weakness (${top.change.toFixed(2)}%). Market Sentinel monitoring.`
      return [alert, ...staticNews]
    }
    return staticNews
  }, [livePrices])

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % dynamicNews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [dynamicNews])

  return (
    <div className="space-y-6">
      {/* News Ticker */}
      <Card className="bg-primary/5 border-primary/20 overflow-hidden shadow-sm relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4 relative z-10">
          <Badge variant="default" className="bg-primary hover:bg-primary whitespace-nowrap shadow-md shadow-primary/20 animate-pulse">
            <Zap className="h-3 w-3 mr-1 fill-white" /> ALPHA RADAR
          </Badge>
          <div className="w-full relative h-6 flex items-center font-bold text-muted-foreground overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${newsIndex}-${dynamicNews[newsIndex]}`}
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute text-sm font-semibold tracking-wide text-foreground flex items-center gap-2"
              >
                {dynamicNews[newsIndex].includes("🔥") || dynamicNews[newsIndex].includes("🚨") ? (
                  <span className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    {dynamicNews[newsIndex]}
                  </span>
                ) : dynamicNews[newsIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Social Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Live Pulse Feed
            </h3>
            <div className="hidden md:flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
              <Button variant="ghost" size="sm" className="h-8 text-xs font-bold">Latest</Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-bold bg-background shadow-xs text-primary">Top Alpha</Button>
            </div>
          </div>
          {COMMUNITY_POSTS.map((post) => (
            <CommunityPost key={post.id} {...post} />
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* WhatsApp Communities */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-[#25D366]" /> Premium Hubs
            </h3>
            <div className="space-y-3">
              {[
                { name: "CoreVault Signals", members: "12.4k", desc: "Live algo-driven trade drops.", link: "https://chat.whatsapp.com/D1FjX0PpWIlDXHZQ6Bt1Kw?mode=gi_t" },
                { name: "Options Flow Desk", members: "8.2k", desc: "Whale options activity tracking.", link: "https://chat.whatsapp.com/LBW0TFVsC6ALtVDlvgDdmh?mode=gi_t" },
                { name: "Crypto Yield Farming", members: "24.1k", desc: "On-chain alpha & protocol news.", link: "https://chat.whatsapp.com/KRzoVUoaUeo9rPmJDNZweK?mode=gi_t" },
              ].map((group) => (
                <Card key={group.name} className="overflow-hidden border-border/50 hover:border-[#25D366]/50 transition-all group bg-gradient-to-br from-card to-muted/20 hover:scale-[1.02] duration-300">
                  <CardContent className="p-4 relative">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-[#25D366]/10 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-[#25D366]/20 transition-all" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm tracking-tight">{group.name}</span>
                        <span className="text-xs font-semibold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Users className="h-3 w-3" /> {group.members}
                        </span>
                      </div>
                      <p className="text-[13px] text-muted-foreground mb-4 leading-tight">{group.desc}</p>
                      <a href={group.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full text-xs font-bold h-9 bg-accent text-accent-foreground hover:bg-[#25D366] hover:text-white transition-colors border shadow-sm group-hover:shadow-md">
                          Join via WhatsApp
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Traders */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-warning" /> AI Leaderboard
            </h3>
            <Card className="border-border/50 bg-gradient-to-b from-card to-muted/10 shadow-lg shadow-warning/5">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    { user: "AITrader_Fast", profit: 8450, trades: 42, winRate: 92 },
                    { user: "QuantBot_Pro", profit: 6890, trades: 18, winRate: 88 },
                    { user: "AlphaGenerator", profit: 4245, trades: 31, winRate: 80 },
                  ].map((trader, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-sm transition-transform group-hover:scale-110 ${i === 0 ? "bg-warning text-warning-foreground shadow-warning/20" : "bg-muted text-muted-foreground"}`}>
                          #{i + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{trader.user}</span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{trader.trades} trades</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-success font-black text-sm tracking-tight">+${trader.profit}</p>
                        <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{trader.winRate}% win</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvestPage({ category, livePrices, onAction, onAddToWatchlist }: {
  category: string,
  livePrices: Record<string, number>,
  onAction: (asset: any) => void,
  onAddToWatchlist: (symbol: string) => void
}) {
  const categoryMap: Record<string, keyof typeof ASSET_CATEGORIES> = {
    stocks: "stocks",
    "mutual-funds": "mutualFunds",
    sips: "sips",
    crypto: "crypto",
    bonds: "bonds",
  }
  const data = ASSET_CATEGORIES[categoryMap[category] || "stocks"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold capitalize">{category.replace("-", " ")}</h2>
        <p className="text-muted-foreground">Browse and invest in {category.replace("-", " ")}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {category === "stocks" && (
            <div className="divide-y">
              {(data as typeof ASSET_CATEGORIES.stocks).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <PriceTicker value={livePrices[stock.symbol] || stock.price} prefix="$" className="font-bold" />
                      <p className={`text-xs ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">{stock.sector}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-[#10b981] hover:bg-[#10b981]/10 px-2" onClick={() => onAddToWatchlist(stock.symbol)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => onAction(stock)}>Buy</Button>
                      <Button size="sm" variant="outline" onClick={() => onAction(stock)}>Sell</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {category === "crypto" && (
            <div className="divide-y">
              {(data as typeof ASSET_CATEGORIES.crypto).map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center font-semibold text-warning">
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-sm text-muted-foreground">{coin.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <PriceTicker value={livePrices[coin.symbol] || coin.price} prefix="$" className="font-bold" />
                      <p className={`text-xs ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground hidden lg:block">Vol: {coin.volume}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-[#10b981] hover:bg-[#10b981]/10 px-2" onClick={() => onAddToWatchlist(coin.symbol)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-warning hover:bg-warning/80 text-warning-foreground"
                        onClick={() => onAction({ ...coin, type: 'crypto' })}
                      >
                        Trade
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {category === "mutual-funds" && (
            <div className="divide-y">
              {(data as typeof ASSET_CATEGORIES.mutualFunds).map((fund) => (
                <div key={fund.symbol} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center font-semibold text-chart-2">
                      {fund.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{fund.symbol}</p>
                      <p className="text-sm text-muted-foreground">{fund.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <PriceTicker value={livePrices[fund.symbol] || fund.nav} prefix="$" className="font-bold" />
                      <p className={`text-xs ${fund.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {fund.change >= 0 ? "+" : ""}{fund.change.toFixed(2)}%
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden sm:flex">{fund.category}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-[#10b981] hover:bg-[#10b981]/10 px-2" onClick={() => onAddToWatchlist(fund.symbol)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => onAction({ ...fund, price: fund.nav, type: 'mf' })}>Invest</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {category === "bonds" && (
            <div className="divide-y">
              {(data as typeof ASSET_CATEGORIES.bonds).map((bond) => (
                <div key={bond.symbol} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center font-semibold text-chart-3">
                      {bond.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-medium">{bond.symbol}</p>
                      <p className="text-sm text-muted-foreground">{bond.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Yield:</span>
                        <PriceTicker value={livePrices[bond.symbol] || bond.yield} prefix="" className="font-bold" />
                      </div>
                      <p className={`text-xs ${bond.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {bond.change >= 0 ? "+" : ""}{bond.change.toFixed(2)}%
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden lg:flex">{bond.rating}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-[#10b981] hover:bg-[#10b981]/10 px-2" onClick={() => onAddToWatchlist(bond.symbol)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => onAction({ ...bond, price: bond.yield, type: 'bond' })}>Buy</Button>
                      <Button size="sm" variant="outline" onClick={() => onAction({ ...bond, price: bond.yield, type: 'bond' })}>Sell</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {category === "sips" && (
            <div className="divide-y">
              {(data as typeof ASSET_CATEGORIES.sips).map((sip, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{sip.name}</p>
                      <PriceTicker value={livePrices[sip.name] || sip.monthly} prefix="$" className="text-sm text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-success">+{sip.returns}%</p>
                      <p className="text-xs text-muted-foreground">Historical</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-[#10b981] hover:bg-[#10b981]/10 px-2" onClick={() => onAddToWatchlist(sip.name)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => onAction({ ...sip, symbol: sip.name, price: sip.monthly, type: 'sip' })}>Invest</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsPage() {
  const { user, logout, updateProfile } = useAuth()
  const [riskProfile, setRiskProfile] = useState(2)
  const [showDetails, setShowDetails] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profileHealth = [
    { subject: 'Risk', A: user?.onboardingData?.riskAppetite === 'aggressive' ? 100 : 70, fullMark: 150 },
    { subject: 'Savings', A: 85, fullMark: 150 },
    { subject: 'Diversification', A: 60, fullMark: 150 },
    { subject: 'Strategy', A: user?.onboardingData?.investmentMindset === 'long-term' ? 90 : 50, fullMark: 150 },
    { subject: 'Activity', A: 40, fullMark: 150 },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById("investor-qr")
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `CoreVault_ID_${user?.investorId}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const qrPayload = useMemo(() => JSON.stringify({
    id: user?.investorId || "CV-DEMO-99",
    name: user?.name,
    risk: user?.onboardingData?.riskAppetite || "Balanced",
    target: user?.onboardingData?.savingsTarget || "25,000",
    v: "1.0"
  }), [user])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Investor Identity</h2>
          <p className="text-muted-foreground">Manage your secure wealth profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning/10" onClick={() => {
            if (confirm("Are you sure you want to wipe all portfolio and wallet data? This will reset the simulation to 0.")) {
              updateProfile({
                walletBalance: 0,
                holdings: [],
                tradeHistory: [],
                walletHistory: [],
                watchlists: [{ id: 'main', name: 'Main Watchlist', symbols: [] }]
              })
              window.location.reload()
            }
          }}>
            <AlertTriangle className="h-4 w-4 mr-2" /> Reset Simulation
          </Button>
          <Button variant="destructive" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Bio & DNA */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-primary/20">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-success/20 text-success border-success/30">AI Verified</Badge>
              </div>
            </div>
            <CardContent className="relative pt-0 px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-end gap-x-6 -mt-12 mb-6">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-2xl">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">{user?.name}</h3>
                    <BadgeCheck className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Lock className="h-3 w-3" /> {user?.email}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl border border-border text-center shadow-inner">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Investor ID</p>
                  <p className="font-mono font-bold text-lg text-primary">{user?.investorId || "CV-901036"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Username</p>
                  <p className="font-medium text-lg">@{user?.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Contact</p>
                  <p className="font-medium text-lg">{user?.contact || "7666261702"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Primary Role</p>
                  <p className="font-medium text-lg capitalize">{user?.onboardingData?.occupation || "Software Engineer"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Prominent DNA Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="border-b border-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Dna className="h-6 w-6 text-primary" /> Investor DNA
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <CardDescription>Comprehensive financial profile from "Wealth Architect" onboarding</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Knowledge Level", value: user?.onboardingData?.knowledgeLevel || "Intermediate", icon: GraduationCap },
                  { label: "Risk Appetite", value: user?.onboardingData?.riskAppetite || "Balanced", icon: Shield },
                  { label: "Horizon", value: (user?.onboardingData?.investmentHorizon || "Medium") + " Term", icon: Clock },
                  { label: "Mindset", value: user?.onboardingData?.investmentMindset === "long-term" ? "Wealth Building" : "Aggressive", icon: Target },
                  { label: "Monthly Income", value: "₹" + (user?.onboardingData?.income || "50,000"), icon: ArrowUpRight, color: "text-success" },
                  { label: "Avg Expenses", value: "₹" + (user?.onboardingData?.expenses || "20,000"), icon: ArrowDownRight, color: "text-destructive" },
                  { label: "Savings Target", value: "₹" + (user?.onboardingData?.savingsTarget || "10,000"), icon: Wallet, color: "text-primary" },
                  { label: "Age Group", value: (user?.onboardingData?.age || "25") + " Years", icon: User },
                ].map((item, idx) => (
                  <div key={idx} className="bg-background/50 p-4 rounded-xl border shadow-sm group hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{item.label}</span>
                    </div>
                    <p className={`font-bold capitalize ${item.color || ""}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-background/50 p-4 rounded-xl border border-dashed border-primary/30">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Sectors of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {(user?.onboardingData?.sectors || ["Technology", "Crypto", "Finance"]).map((s, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/10 hover:bg-primary/20 border-primary/20">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-background/50 p-4 rounded-xl border border-dashed border-primary/30">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Primary Investment Philosophy</p>
                  <p className="text-sm italic text-primary leading-relaxed font-medium">
                    "{user?.onboardingData?.lifeGoals || "I want a mix of safe bonds and growth-oriented tech stocks to secure my future retirement."}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Analytics & Security */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2">
              <Zap className="h-4 w-4 text-warning opacity-50" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <Activity className="h-5 w-5" /> Profile Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={profileHealth}>
                    <PolarGrid stroke="var(--primary)" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <Radar
                      name="User"
                      dataKey="A"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 mt-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">AI Trust Score</span>
                    <span className="text-primary font-black">88%</span>
                  </div>
                  <Progress value={88} className="h-2 bg-primary/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground uppercase font-bold tracking-wider">Security Level</span>
                    <span className="text-success font-black">MAX</span>
                  </div>
                  <Progress value={94} className="h-2 bg-success/10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* REFINED QR SECTION */}
          <Card className="flex flex-col items-center border-primary/20 shadow-2xl relative overflow-hidden group py-8 px-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
            <div className="p-4 bg-white rounded-[2rem] mb-6 shadow-2xl group-hover:scale-105 transition-transform duration-500 relative">
              <QRCodeSVG
                id="investor-qr"
                value={qrPayload}
                size={180}
                level="M"
                includeMargin={true}
                imageSettings={{
                  src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjg2ZGYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMkw5LjA5IDkuMDkgTDIgMTJMOS4wOSAxNC45MSBMMTIgMjJMMTQuOTEgMTQuOTEgTDIyIDEyTDI0LjkxIDkuMDkgTDEyIDJaIi8+PC9zdmc+',
                  height: 35,
                  width: 35,
                  excavate: true,
                }}
              />
              <div className="absolute inset-0 border-8 border-white rounded-[2rem] pointer-events-none" />
            </div>

            <div className="text-center space-y-2 mb-6">
              <h4 className="text-xl font-black tracking-tight flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Secure Identity
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed px-2 font-medium">
                Scan to instantly verify and share your encrypted <br className="hidden sm:inline" />
                investor DNA across the CoreVault network.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-2xl border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold py-5"
              onClick={downloadQR}
            >
              <TrendingDown className="h-4 w-4 rotate-180" /> Download ID Logo
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

type PageType = "dashboard" | "watchlist" | "portfolio" | "ai-agent" | "academy" | "community" | "settings" | "stocks" | "mutual-funds" | "sips" | "crypto" | "bonds"

const NAV_ITEMS = [
  { id: "dashboard" as PageType, label: "Dashboard", icon: LayoutDashboard },
  { id: "watchlist" as PageType, label: "Watchlist", icon: Eye },
  { id: "portfolio" as PageType, label: "Portfolio", icon: Briefcase },
  { id: "ai-agent" as PageType, label: "AI Agent", icon: Bot },
  { id: "academy" as PageType, label: "Academy", icon: GraduationCap },
  { id: "community" as PageType, label: "Community", icon: Users },
]

const INVEST_ITEMS = [
  { id: "stocks" as PageType, label: "Stocks" },
  { id: "mutual-funds" as PageType, label: "Mutual Funds" },
  { id: "sips" as PageType, label: "SIPs" },
  { id: "crypto" as PageType, label: "Crypto" },
  { id: "bonds" as PageType, label: "Bonds" },
]

export default function CoreVaultAI() {
  const { user, logout, updateProfile } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [navVisible, setNavVisible] = useState(true)
  const [investMenuOpen, setInvestMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [isCreateWatchlistOpen, setIsCreateWatchlistOpen] = useState(false)
  const [isAddToWatchlistOpen, setIsAddToWatchlistOpen] = useState(false)
  const [selectedSymbolForWatchlist, setSelectedSymbolForWatchlist] = useState("")
  const [chartRange, setChartRange] = useState("1d")
  const [mounted, setMounted] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // ═══════ LIVE NOTIFICATIONS ═══════
  const [notifications, setNotifications] = useState<{ id: number, type: string, title: string, message: string, time: string, urgent?: boolean }[]>([
    { id: 0, type: 'signal', title: 'AI Ready', message: 'CoreVault Intelligence Core is online and monitoring your portfolio.', time: 'Just now' }
  ])
  const pushNotification = (type: string, title: string, message: string, urgent = false) => {
    setNotifications(prev => [{ id: Date.now(), type, title, message, time: 'Just now', urgent }, ...prev].slice(0, 30))
  }
  const [unreadCount, setUnreadCount] = useState(1)

  // ═══════ PERSISTED AI CHAT (survives page switches) ═══════
  const [aiMessages, setAiMessages] = useState<{ role: string, content: string }[]>([])
  const [aiLanguage, setAiLanguage] = useState("en-IN")

  // ═══════ HIRED HAND TARGET ORDERS ═══════
  const [targetOrders, setTargetOrders] = useState<{ symbol: string, targetPrice: number, qty: number, action: 'buy' | 'sell', id: number }[]>([])

  useEffect(() => {
    window.openDeposit = () => setIsDepositOpen(true)
    window.setChartRange = (r: string) => setChartRange(r)
  }, [setIsDepositOpen, setChartRange])
  const { theme, setTheme } = useTheme()

  // Stage 6: Persistent Store & Universal Pulse
  const [marketData, setMarketData] = useState(MARKET_DATA)
  const [sentimentValue, setSentimentValue] = useState(74)
  const [livePrices, setLivePrices] = useState<Record<string, number>>(() => {
    const prices: Record<string, number> = {}
    ASSET_CATEGORIES.stocks.forEach(s => prices[s.symbol] = s.price)
    ASSET_CATEGORIES.mutualFunds.forEach(f => prices[f.symbol] = f.nav)
    ASSET_CATEGORIES.crypto.forEach(c => prices[c.symbol] = c.price)
    ASSET_CATEGORIES.bonds.forEach(b => prices[b.symbol] = b.yield)
    ASSET_CATEGORIES.sips.forEach(s => prices[s.name] = s.monthly)
    return prices
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(symbol => {
          const current = next[symbol]
          const isCrypto = ASSET_CATEGORIES.crypto.some(c => c.symbol === symbol)
          const isSIP = ASSET_CATEGORIES.sips.some(s => s.name === symbol)

          let volatility = 0.002
          if (isCrypto) volatility = 0.01 // 1% for crypto
          if (isSIP) volatility = 0.0005

          const change = (Math.random() - 0.5) * (current * volatility * 2)
          next[symbol] = parseFloat((current + change).toFixed(2))
        })
        return next
      })

      setMarketData(prev => {
        const last = prev[prev.length - 1]
        const newVal = last.value + (Math.random() - 0.5) * 80
        return [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: parseFloat(newVal.toFixed(2)),
          volume: last.volume + Math.floor(Math.random() * 300) - 150
        }]
      })
      setSentimentValue(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 3)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Live Crypto API (CoinGecko)
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd')
        const data = await res.json()
        setLivePrices(prev => ({
          ...prev,
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          SOL: data.solana.usd
        }))
      } catch (err) { console.error("API Error:", err) }
    }
    fetchCrypto()
    const interval = setInterval(fetchCrypto, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  // Simulation Persistence
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance ?? 0)
  const [holdings, setHoldings] = useState(user?.holdings ?? [])
  const [tradeHistory, setTradeHistory] = useState(user?.tradeHistory ?? [])
  const [walletHistory, setWalletHistory] = useState(user?.walletHistory ?? [])
  const [watchlists, setWatchlists] = useState(user?.watchlists ?? [{ id: 'main', name: 'Main Watchlist', symbols: [] }])

  // Notify on login
  useEffect(() => {
    if (user) {
      pushNotification('portfolio', `Welcome back, ${user.name}!`, `Logged in successfully. ${holdings.length} active positions detected.`)
      setUnreadCount(prev => prev + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // ═══════ HIRED HAND TARGET PRICE WATCHER ═══════
  useEffect(() => {
    if (targetOrders.length === 0) return
    const matched = targetOrders.filter(order => {
      const price = livePrices[order.symbol]
      if (!price) return false
      if (order.action === 'sell') return price >= order.targetPrice
      if (order.action === 'buy') return price <= order.targetPrice
      return false
    })
    matched.forEach(order => {
      const price = livePrices[order.symbol]
      handleExecuteOrder({ type: order.action, symbol: order.symbol, price, qty: order.qty, assetType: 'stock' })
      pushNotification('signal', `⚡ Hired Hand: ${order.action.toUpperCase()} ${order.symbol}`, `Target $${order.targetPrice} hit! ${order.action === 'sell' ? 'Position liquidated' : 'Position opened'} at $${price?.toFixed(2)}.`, true)
      setUnreadCount(prev => prev + 1)
    })
    if (matched.length > 0) {
      setTargetOrders(prev => prev.filter(o => !matched.find(m => m.id === o.id)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePrices])

  const handleOpenOrder = (asset: any) => {
    setSelectedAsset(asset)
    setIsOrderOpen(true)
  }

  const handleDeposit = (amount: number, note: string) => {
    const newEntry = { type: 'deposit' as const, amount, note, timestamp: Date.now() }
    const newBalance = walletBalance + amount
    setWalletBalance(newBalance)
    setWalletHistory(prev => [newEntry, ...prev])
    updateProfile({
      walletBalance: newBalance,
      walletHistory: [newEntry, ...(user?.walletHistory ?? [])]
    })
  }

  const handleCreateWatchlist = (name: string) => {
    const updated = [...watchlists, { id: name.toLowerCase().replace(/\s+/g, '-'), name, symbols: [] }]
    setWatchlists(updated)
    updateProfile({ watchlists: updated })
  }

  const handleAddToWatchlist = (listIndex: number) => {
    const updated = [...watchlists]
    if (!updated[listIndex].symbols.includes(selectedSymbolForWatchlist)) {
      const newList = { ...updated[listIndex], symbols: [...updated[listIndex].symbols, selectedSymbolForWatchlist] }
      updated[listIndex] = newList
      setWatchlists(updated)
      updateProfile({ watchlists: updated })
    }
  }

  // Market Sentinel Polling
  const [exitAlert, setExitAlert] = useState<{ symbol: string, reason: string } | null>(null)

  const runSentinelCheck = useCallback(async (currentPrices?: Record<string, number>) => {
    const pricesToUse = currentPrices || livePrices
    // FOR DEMO PURPOSES: If we pass currentPrices manually (Simulation), 
    // we bypass the backend to ensure a 100% successful and instant AI alert.
    if (currentPrices && Object.keys(currentPrices).length > 0) {
      const topHolding = holdings[0]
      setTimeout(() => {
        setExitAlert({
          symbol: topHolding.symbol,
          reason: "Market Sentinel detected severe downside risk and recommends an immediate exit to preserve capital."
        })
      }, 500)
      return
    }

    try {
      const totalValue = holdings.reduce((acc: number, p: any) => acc + p.qty * (pricesToUse[p.symbol] || p.price || 0), 0)
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Run background Market Sentinel check. Output ONLY JSON indicating 'SELL' if an asset you hold is collapsing and must be exited immediately, else output Action: HOLD." }],
          portfolio: { totalWealth: walletBalance + totalValue, balance: walletBalance, holdings },
          autoTrade: false
        })
      })
      const data = await response.json()
      const content = data.content || ""
      if (content.includes("```json")) {
        const match = content.match(/```json\n([\s\S]*?)\n```/)
        if (match) {
          const alertData = JSON.parse(match[1])
          if (alertData.action === "SELL") {
            setExitAlert({ symbol: alertData.symbol, reason: "Market Sentinel detected severe downside risk and recommends an immediate exit to preserve capital." })
          }
        }
      }
    } catch (err) {
      // silent fail in background
    }
  }, [holdings, livePrices, walletBalance])

  useEffect(() => {
    if (holdings.length === 0) return
    const sentinelInterval = setInterval(() => {
      runSentinelCheck()
    }, 45000) // Poll every 45 seconds for demo
    return () => clearInterval(sentinelInterval)
  }, [holdings, runSentinelCheck])

  const triggerAddToWatchlist = (symbol: string) => {
    setSelectedSymbolForWatchlist(symbol)
    setIsAddToWatchlistOpen(true)
  }

  // Demo Control logic
  const handleFillWallet = () => {
    const amount = 1000000
    setWalletBalance(prev => prev + amount)
    pushNotification('portfolio', '💎 Demo Funding', `Wallet injected with $${amount.toLocaleString()} DEMO capital.`, true)
  }

  const handleSimulateCrash = () => {
    const symbol = holdings[0]?.symbol || "AAPL"
    const crashedPrices = { ...livePrices, [symbol]: (livePrices[symbol] || 100) * 0.7 }
    setLivePrices(crashedPrices)
    pushNotification('alert', '🚨 Market Anomaly', `${symbol} is experiencing severe slippage! Sentinel alert triggered.`, true)

    // Trigger immediate sentinel check with the crashed prices
    runSentinelCheck(crashedPrices)
  }

  const handleResetDemo = () => {
    setWalletBalance(10000)
    setHoldings([])
    setTradeHistory([])
    updateProfile({ walletBalance: 10000, holdings: [], tradeHistory: [] })
    pushNotification('settings', '🔄 Demo Reset', 'Project state cleared for a fresh start.', false)
  }



  const handleExecuteOrder = (order: any) => {
    const cost = order.qty * order.price
    let newBalance = walletBalance
    let newHoldings = [...holdings]
    const newTrade = { ...order, timestamp: Date.now() }

    if (order.type === 'buy') {
      if (cost > walletBalance) {
        pushNotification('alert', `❌ BUY failed`, `Insufficient funds for ${order.qty} ${order.symbol}.`)
        return
      }
      newBalance -= cost
      const existing = newHoldings.find((h: any) => h.symbol === order.symbol)
      if (existing) {
        const newQty = existing.qty + order.qty
        existing.avgPrice = (existing.qty * existing.avgPrice + cost) / newQty
        existing.qty = newQty
      } else {
        newHoldings.push({
          symbol: order.symbol,
          name: order.symbol,
          qty: order.qty,
          avgPrice: order.price,
          type: order.assetType || 'stock'
        })
      }
      pushNotification('portfolio', `✅ BUY order executed`, `Bought ${order.qty} shares of ${order.symbol} at $${order.price?.toFixed(2)}. Cost: $${cost?.toFixed(2)}.`)
    } else {
      const existingIndex = newHoldings.findIndex((h: any) => h.symbol === order.symbol)
      if (existingIndex !== -1) {
        const existing = newHoldings[existingIndex]
        if (order.qty >= existing.qty) {
          // Sell all
          newBalance += (existing.qty * order.price)
          newHoldings.splice(existingIndex, 1)
          pushNotification('portfolio', `✅ SELL order executed`, `Sold all ${existing.qty} shares of ${order.symbol} at $${order.price?.toFixed(2)}. Proceeds: $${(existing.qty * order.price).toFixed(2)}.`)
        } else {
          // Sell partial
          newBalance += cost
          existing.qty -= order.qty
          pushNotification('portfolio', `✅ SELL order executed`, `Sold ${order.qty} shares of ${order.symbol} at $${order.price?.toFixed(2)}. Proceeds: $${cost?.toFixed(2)}.`)
        }
      } else {
        pushNotification('alert', `❌ SELL failed`, `You do not own any shares of ${order.symbol}.`)
        return
      }
    }
    setUnreadCount(prev => prev + 1)

    setWalletBalance(newBalance)
    setHoldings(newHoldings)
    setTradeHistory(prev => [newTrade, ...prev])
    updateProfile({
      walletBalance: newBalance,
      holdings: newHoldings,
      tradeHistory: [newTrade, ...(user?.tradeHistory ?? [])]
    })
  }

  // Auto-hide navbar
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setNavVisible(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setNavVisible(false), 3000)
    }
    window.addEventListener("mousemove", handleMouseMove)
    handleMouseMove()
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case "dashboard": return (
        <DashboardPage
          marketData={marketData}
          sentimentValue={sentimentValue}
          livePrices={livePrices}
          holdings={holdings}
          balance={walletBalance}
          tradeHistory={tradeHistory}
        />
      )
      case "watchlist": return (
        <WatchlistPage
          livePrices={livePrices}
          watchlists={watchlists}
          onUpdateWatchlists={(newList) => { setWatchlists(newList); updateProfile({ watchlists: newList }) }}
          onOpenCreateDialog={() => setIsCreateWatchlistOpen(true)}
        />
      )
      case "portfolio": return (
        <PortfolioPage
          livePrices={livePrices}
          holdings={holdings}
          balance={walletBalance}
        />
      )
      case "ai-agent": return (
        <AIAgentPage
          livePrices={livePrices}
          holdings={holdings}
          balance={walletBalance}
          onExecuteTrade={handleExecuteOrder}
          messages={aiMessages}
          setMessages={setAiMessages}
          language={aiLanguage}
          setLanguage={setAiLanguage}
          onPushNotification={pushNotification}
          onAddTargetOrder={(order) => { setTargetOrders(prev => [...prev, { ...order, id: Date.now() }]); pushNotification('signal', `🎯 Target Order Set`, `${order.action.toUpperCase()} ${order.qty} ${order.symbol} when price hits $${order.targetPrice}`, false); setUnreadCount(p => p + 1) }}
          tradeHistory={tradeHistory}
        />
      )
      case "academy": return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <AcademyPage onPushNotification={pushNotification} />
        </motion.div>
      )
      case "community": return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <CommunityPage livePrices={livePrices} />
        </motion.div>
      )
      case "settings": return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <SettingsPage />
        </motion.div>
      )
      case "stocks":
      case "mutual-funds":
      case "sips":
      case "crypto":
      case "bonds":
        return <InvestPage
          category={currentPage}
          livePrices={livePrices}
          onAction={handleOpenOrder}
          onAddToWatchlist={triggerAddToWatchlist}
        />
      default: return (
        <DashboardPage
          marketData={marketData}
          sentimentValue={sentimentValue}
          livePrices={livePrices}
          holdings={holdings}
          balance={walletBalance}
          tradeHistory={tradeHistory}
        />
      )
    }
  }, [currentPage, marketData, sentimentValue, livePrices, holdings, walletBalance, tradeHistory, aiMessages, watchlists])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <AuthOverlay />
      <OnboardingOverlay />
      {/* Auto-hiding Navbar */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:block">CoreVault AI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(item.id)}
                className="gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
            {/* Invest Mega Menu */}
            <div className="relative" onMouseEnter={() => setInvestMenuOpen(true)} onMouseLeave={() => setInvestMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Invest
                <ChevronDown className={`h-4 w-4 transition-transform ${investMenuOpen ? "rotate-180" : ""}`} />
              </Button>
              <AnimatePresence>
                {investMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-popover border rounded-xl shadow-xl p-2"
                  >
                    {INVEST_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setCurrentPage(item.id); setInvestMenuOpen(false) }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notification Center - LIVE */}
            <Sheet onOpenChange={(open) => { if (open) setUnreadCount(0) }}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Live Notifications</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  <div className="space-y-3">
                    {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No notifications yet.</p>}
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-3 rounded-lg border ${notif.urgent ? "bg-destructive/5 border-destructive/20" : "bg-muted/50"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.urgent ? "bg-destructive/10" : "bg-primary/10"}`}>
                            {notif.type === "signal" && <Sparkles className="h-4 w-4 text-warning" />}
                            {notif.type === "portfolio" && <Briefcase className="h-4 w-4 text-success" />}
                            {notif.type === "alert" && <AlertTriangle className={`h-4 w-4 ${notif.urgent ? "text-destructive" : "text-primary"}`} />}
                            {notif.type === "news" && <Zap className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notif.title}</p>
                            <p className="text-xs text-muted-foreground">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1 opacity-60">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage("settings")} className="hidden sm:flex">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${currentPage === item.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
                <Separator />
                <p className="text-sm text-muted-foreground px-3 py-2">Invest</p>
                {INVEST_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false) }}
                    className="w-full text-left p-3 pl-8 rounded-lg hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Separator />
                <button
                  onClick={() => { setCurrentPage("settings"); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Stage 6: Persistent Components */}
      <DepositDialog
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleDeposit}
      />

      {selectedAsset && (
        <OrderDialog
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          asset={selectedAsset}
          balance={walletBalance}
          onExecute={handleExecuteOrder}
        />
      )}

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(tab) => { setCurrentPage(tab as PageType); setIsSearchOpen(false) }}
        onAddToWatchlist={triggerAddToWatchlist}
        assets={ASSET_CATEGORIES}
        livePrices={livePrices}
      />

      <CreateWatchlistDialog
        isOpen={isCreateWatchlistOpen}
        onClose={() => setIsCreateWatchlistOpen(false)}
        onCreate={handleCreateWatchlist}
      />

      <AddToWatchlistDialog
        isOpen={isAddToWatchlistOpen}
        onClose={() => setIsAddToWatchlistOpen(false)}
        onAdd={handleAddToWatchlist}
        watchlists={watchlists}
        symbol={selectedSymbolForWatchlist}
      />

      {/* Market Sentinel Exit Alert Dialog */}
      <Dialog open={!!exitAlert} onOpenChange={(open) => !open && setExitAlert(null)}>
        <DialogContent className="border-destructive/30 bg-destructive/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive text-xl">
              <AlertTriangle className="h-6 w-6" /> EMERGENCY EXIT ALERT
            </DialogTitle>
            <DialogDescription className="text-foreground pt-4">
              <p className="font-bold text-lg mb-2">{exitAlert?.symbol} Position at Risk</p>
              {exitAlert?.reason}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setExitAlert(null)}>Ignore</Button>
            <Button variant="destructive" className="gap-2" onClick={() => {
              // Execute full dump
              const holding = holdings.find((h: any) => h.symbol === exitAlert?.symbol)
              if (holding) {
                handleExecuteOrder({ type: 'sell', symbol: holding.symbol, price: livePrices[holding.symbol] || holding.avgPrice, qty: holding.qty, assetType: holding.type || 'stock' })
              }
              setExitAlert(null)
            }}>
              <Zap className="h-4 w-4" /> Liquidate Position Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Stage 10: Demo Presentation Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {demoMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-4 rounded-2xl border-primary/30 shadow-2xl pointer-events-auto space-y-4 min-w-[200px]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Demo Control
                </span>
                <Badge variant="outline" className="text-[8px] h-4">Alpha v1.0</Badge>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button onClick={handleFillWallet} size="sm" variant="outline" className="justify-start gap-2 h-9 text-xs font-bold hover:bg-primary/10 transition-all">
                  <DollarSign className="h-3 w-3 text-success" /> Fill Wallet ($1M)
                </Button>
                <Button onClick={handleSimulateCrash} size="sm" variant="outline" className="justify-start gap-2 h-9 text-xs font-bold hover:bg-destructive/10 transition-all">
                  <ArrowDownRight className="h-3 w-3 text-destructive" /> Simulate Crash
                </Button>
                <Button onClick={handleResetDemo} size="sm" variant="ghost" className="justify-start gap-2 h-9 text-xs font-bold text-muted-foreground">
                  <Clock className="h-3 w-3" /> Reset Session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={() => setDemoMode(!demoMode)}
          className={`h-12 w-12 rounded-full shadow-2xl transition-all flex items-center justify-center pointer-events-auto ${demoMode ? "bg-primary text-primary-foreground rotate-180" : "bg-muted text-muted-foreground"}`}
        >
          {demoMode ? <X className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}
