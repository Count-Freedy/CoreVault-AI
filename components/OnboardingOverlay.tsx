"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, Wallet, Target, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, Mic, Briefcase, DollarSign, PieChart, Shield,
  GraduationCap, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"

const SECTORS = ["Technology", "Healthcare", "Finance", "Energy", "Consumer Goods", "Real Estate", "Crypto", "Pharma", "ESG"]

export function OnboardingOverlay() {
  const { user, updateProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [isListening, setIsListening] = useState(false)
  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
    income: "",
    expenses: "",
    savingsTarget: "",
    knowledgeLevel: "intermediate",
    investmentHorizon: "medium",
    riskAppetite: "balanced",
    investmentMindset: "long-term",
    sectors: [] as string[],
    lifeGoals: "",
  })

  if (!user || user.onboarded) return null

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleComplete = () => {
    updateProfile({
      onboarded: true,
      onboardingData: formData,
      investorId: `CV-${Math.floor(100000 + Math.random() * 900000)}`,
    })
  }

  const toggleSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }))
  }

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.")
      return
    }
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setFormData(prev => ({ ...prev, lifeGoals: (prev.lifeGoals + " " + finalTranscript).trim() }))
      }
    }
    recognition.start()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl px-4"
    >
      <div className="w-full max-w-2xl relative">
        <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-2">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
               <Sparkles className="h-4 w-4 text-primary-foreground" />
             </div>
             <span className="font-bold text-lg">Wealth Architect</span>
           </div>
           <span className="text-sm font-medium text-muted-foreground">Step {step} of 6</span>
        </div>
        
        <Progress value={(step / 6) * 100} className="h-1 mb-8" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold flex items-center gap-2">
                         <Briefcase className="h-6 w-6 text-primary" /> Professional Profile
                       </h2>
                       <p className="text-muted-foreground">Tell us about yourself to tailor your investment strategy.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Current Age</Label>
                        <Input id="age" type="number" placeholder="25" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occ">Occupation</Label>
                        <Input id="occ" placeholder="Software Engineer" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold flex items-center gap-2">
                         <DollarSign className="h-6 w-6 text-primary" /> Financial Pulse
                       </h2>
                       <p className="text-muted-foreground">Your income & savings help AI calculate your safety margins.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Monthly Income</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input className="pl-8" type="number" value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} placeholder="50,000" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Avg. Monthly Expenses</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input className="pl-8" type="number" value={formData.expenses} onChange={e => setFormData({...formData, expenses: e.target.value})} placeholder="20,000" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Monthly Savings Target</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input className="pl-8" type="number" value={formData.savingsTarget} onChange={e => setFormData({...formData, savingsTarget: e.target.value})} placeholder="10,000" />
                        </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold flex items-center gap-2">
                         <GraduationCap className="h-6 w-6 text-primary" /> Experience & Horizon
                       </h2>
                       <p className="text-muted-foreground">Help the AI understand your market background.</p>
                    </div>
                    <div className="space-y-4">
                      <Label>Financial Knowledge</Label>
                      <RadioGroup value={formData.knowledgeLevel} onValueChange={v => setFormData({...formData, knowledgeLevel: v})} className="grid grid-cols-3 gap-4">
                        {["Beginner", "Intermediate", "Advanced"].map(k => (
                          <Label key={k} className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer hover:bg-muted transition-colors ${formData.knowledgeLevel === k.toLowerCase() ? "border-primary bg-primary/5" : ""}`}>
                            <RadioGroupItem value={k.toLowerCase()} className="sr-only" />
                            <span className="font-semibold">{k}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-4">
                       <Label>Investment Horizon</Label>
                       <RadioGroup value={formData.investmentHorizon} onValueChange={v => setFormData({...formData, investmentHorizon: v})} className="grid grid-cols-3 gap-4">
                         {[{id: "short", label: "< 1 Year"}, {id: "medium", label: "1-5 Years"}, {id: "long", label: "5+ Years"}].map(h => (
                          <Label key={h.id} className={`flex flex-col items-center gap-1 p-4 rounded-xl border cursor-pointer hover:bg-muted transition-colors ${formData.investmentHorizon === h.id ? "border-primary bg-primary/5" : ""}`}>
                            <RadioGroupItem value={h.id} className="sr-only" />
                            <span className="font-semibold">{h.label}</span>
                          </Label>
                         ))}
                       </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold flex items-center gap-2">
                         <Shield className="h-6 w-6 text-primary" /> Risk & Strategy
                       </h2>
                       <p className="text-muted-foreground">How should CoreVault AI handle your capital?</p>
                    </div>
                    <div className="space-y-4">
                      <Label>Risk Appetite</Label>
                      <RadioGroup value={formData.riskAppetite} onValueChange={v => setFormData({...formData, riskAppetite: v})} className="grid grid-cols-3 gap-4">
                        {["Conservative", "Balanced", "Aggressive"].map(r => (
                          <Label key={r} className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer hover:bg-muted transition-colors ${formData.riskAppetite === r.toLowerCase() ? "border-primary bg-primary/5" : ""}`}>
                            <RadioGroupItem value={r.toLowerCase()} className="sr-only" />
                            <span className="font-semibold">{r}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-4">
                       <Label>Investment Logic</Label>
                       <RadioGroup value={formData.investmentMindset} onValueChange={v => setFormData({...formData, investmentMindset: v})} className="grid grid-cols-2 gap-4">
                         {[{id: "long-term", label: "Wealth Building", sub: "SIPs / Mutual Funds"}, {id: "short-term", label: "Swing Trading", sub: "Short-term returns"}].map(m => (
                          <Label key={m.id} className={`flex flex-col items-start gap-1 p-4 rounded-xl border cursor-pointer hover:bg-muted transition-colors ${formData.investmentMindset === m.id ? "border-primary bg-primary/5" : ""}`}>
                            <RadioGroupItem value={m.id} className="sr-only" />
                            <span className="font-semibold">{m.label}</span>
                            <span className="text-xs text-muted-foreground">{m.sub}</span>
                          </Label>
                         ))}
                       </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold flex items-center gap-2">
                         <PieChart className="h-6 w-6 text-primary" /> Sectors of Interest
                       </h2>
                       <p className="text-muted-foreground">Select sectors you'd like the AI to monitor for you.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {SECTORS.map(s => (
                        <div key={s} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <Checkbox id={s} checked={formData.sectors.includes(s)} onCheckedChange={() => toggleSector(s)} />
                          <label htmlFor={s} className="text-xs font-medium cursor-pointer">{s}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-bold flex items-center gap-2">
                         <Target className="h-6 w-6 text-primary" /> Life Goals
                       </h2>
                       <p className="text-muted-foreground">What are you investing for? Our AI will plan accordingly.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          placeholder="e.g. Save ₹2 Lakhs for a Europe trip in 2 years..."
                          className="w-full h-32 p-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                          value={formData.lifeGoals}
                          onChange={e => setFormData({...formData, lifeGoals: e.target.value})}
                        />
                        <Button 
                          size="icon" 
                          variant={isListening ? "destructive" : "secondary"}
                          className="absolute bottom-4 right-4 animate-pulse shadow-lg"
                          onClick={startVoiceInput}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg flex gap-3 items-center border border-primary/20">
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <TrendingUp className="h-5 w-5" />
                         </div>
                         <p className="text-xs text-muted-foreground">Our "Wealth Architect" logic will automatically project your targets based on this description.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  {step < 6 ? (
                    <Button onClick={handleNext}>
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleComplete} className="bg-success hover:bg-success/90 text-success-foreground">
                      Finish Setup <CheckCircle2 className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
