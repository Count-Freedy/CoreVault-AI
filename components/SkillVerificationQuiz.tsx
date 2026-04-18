"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Target, Trophy, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import { QUIZ_BANK } from "@/lib/academy-data"
import { Progress } from "@/components/ui/progress"

export function SkillVerificationQuiz({ isOpen, onClose, onCompleteXP }: { isOpen: boolean, onClose: () => void, onCompleteXP: (xpToAward: number) => void }) {
  const [questions, setQuestions] = useState<typeof QUIZ_BANK>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const shuffled = [...QUIZ_BANK].sort(() => 0.5 - Math.random())
      setQuestions(shuffled.slice(0, 5))
      setCurrentIndex(0)
      setSelectedOption(null)
      setHasAnswered(false)
      setScore(0)
      setIsFinished(false)
    }
  }, [isOpen])

  if (!isOpen || questions.length === 0) return null

  const currentQ = questions[currentIndex]
  const progressValue = ((currentIndex) / questions.length) * 100

  const handleSelect = (idx: number) => {
    if (hasAnswered) return
    setSelectedOption(idx)
  }

  const handleSubmit = () => {
    if (selectedOption !== null && !hasAnswered) {
      setHasAnswered(true)
      if (selectedOption === currentQ.correct) {
        setScore(prev => prev + 1)
      }
    } else if (hasAnswered) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setHasAnswered(false)
        setSelectedOption(null)
      } else {
        setIsFinished(true)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card/90 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
           {!isFinished && <Progress value={progressValue} className="h-full rounded-none transition-all duration-500 [&>div]:bg-primary" />}
        </div>

        <DialogHeader className="px-6 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 tracking-tight">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              Daily Verification
            </DialogTitle>
            <div className="px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {!isFinished ? (
            <div className="space-y-6">
               <h3 className="text-xl font-semibold leading-relaxed text-foreground/90">{currentQ.q}</h3>
               <div className="space-y-3">
                 {currentQ.options.map((opt, idx) => {
                   let btnClass = "w-full justify-start text-left h-auto py-4 px-5 border-2 transition-all duration-200 group relative overflow-hidden"
                   let variant: "outline" | "default" | "destructive" = "outline"
                   
                   if (hasAnswered) {
                     if (idx === currentQ.correct) {
                       btnClass += " border-success/50 bg-success/5 text-success shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]"
                     } else if (idx === selectedOption) {
                       btnClass += " border-destructive/50 bg-destructive/5 text-destructive"
                     } else {
                       btnClass += " opacity-40 grayscale-[0.5]"
                     }
                   } else {
                     if (idx === selectedOption) {
                       btnClass += " border-primary bg-primary/5 shadow-[0_0_15px_-5px_rgba(var(--primary),0.3)] scale-[1.01]"
                     } else {
                       btnClass += " hover:border-primary/30 hover:bg-muted/50"
                     }
                   }

                   return (
                     <Button 
                       key={idx} 
                       variant={variant} 
                       className={btnClass}
                       onClick={() => handleSelect(idx)}
                     >
                       <span className="flex-1 whitespace-normal leading-normal pr-4">{opt}</span>
                       <div className="flex-shrink-0">
                         {hasAnswered && idx === currentQ.correct && <CheckCircle className="h-6 w-6 text-success animate-in zoom-in duration-300" />}
                         {hasAnswered && idx === selectedOption && idx !== currentQ.correct && <XCircle className="h-6 w-6 text-destructive animate-in zoom-in duration-300" />}
                         {!hasAnswered && idx === selectedOption && <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />}
                       </div>
                     </Button>
                   )
                 })}
               </div>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Trophy className={`h-24 w-24 relative z-10 ${score >= 4 ? 'text-warning drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-primary'}`} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter">VERIFICATION COMPLETE</h2>
                <p className="text-muted-foreground font-medium">Market knowledge assessment finalized.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4">
                <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Session Score</p>
                  <p className={`text-3xl font-black ${score >= 4 ? 'text-success' : 'text-primary'}`}>{score} / {questions.length}</p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">XP Earned</p>
                  <p className="text-3xl font-black text-warning">+{score * 50}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-6 bg-muted/30 border-t border-border/50">
           {!isFinished ? (
              <Button 
                disabled={selectedOption === null} 
                onClick={handleSubmit} 
                className="w-full sm:w-auto min-w-[160px] py-6 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2"
              >
                {hasAnswered ? (currentIndex === questions.length - 1 ? "Get Results" : "Next Question") : "Submit Answer"}
                {hasAnswered && <ChevronRight className="h-5 w-5" />}
              </Button>
           ) : (
              <Button onClick={() => { onCompleteXP(score * 50); onClose(); }} className="w-full py-7 rounded-xl font-black text-lg bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all gap-3">
                <CheckCircle className="h-6 w-6" /> CLAIM REWARDS & EXIT
              </Button>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
