import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star } from "lucide-react"

export function ActiveCourseDialog({ course, isOpen, onClose, onComplete }: { course: any, isOpen: boolean, onClose: () => void, onComplete: (xp: number) => void }) {
  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden bg-card/90 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-0 flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        
        <div className="overflow-y-auto p-8 flex-1">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wider text-[10px] px-2 py-1">
                {course.level}
              </Badge>
              <div className="flex items-center gap-1.5 text-warning font-black text-sm bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
                <Star className="h-4 w-4 fill-warning" />
                {course.xp} XP
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-black tracking-tight leading-none text-foreground">
              {course.title}
            </DialogTitle>
            
            <DialogDescription className="text-muted-foreground leading-relaxed text-lg pt-4 text-left border-t border-border/50">
              <span className="block first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                {course.content}
              </span>
              
              <div className="clear-both pt-8 mt-8 border-t border-border/30">
                <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <div className="h-1.5 w-6 bg-primary rounded-full" />
                  Module Objectives
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {[
                    `Understand core mechanics of ${course.title}.`,
                    "Learn institutional leverage technology.",
                    "Apply risk management to live trades."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm p-3 rounded-xl bg-muted/30 border border-border/50">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t border-border/50 flex flex-row items-center justify-between gap-4">
          <Button variant="ghost" onClick={onClose} className="font-bold text-muted-foreground hover:bg-background/50">
            Close Reader
          </Button>
          <Button 
            onClick={() => { onComplete(course.xp); onClose(); }} 
            className="flex-1 sm:flex-none min-w-[200px] h-14 bg-primary text-primary-foreground font-black text-base gap-3 rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <CheckCircle className="h-6 w-6" /> COMPLETE MODULE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
