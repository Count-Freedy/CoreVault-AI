"use client"
import { useState, useMemo, useEffect } from "react"
import { Trophy, Star, Award, CheckCircle, Flame, Play, Check, TrendingUp, Brain, Zap, Compass } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { BADGES_DATA, COURSES_DATA } from "@/lib/academy-data"
import { ActiveCourseDialog } from "./ActiveCourseDialog"
import { SkillVerificationQuiz } from "./SkillVerificationQuiz"
import { UserProfile } from "@/lib/db"

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: any }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}

function CourseCard({ course, isCompleted, onResume }: { course: any, isCompleted: boolean, onResume: () => void }) {
  const levelColors: Record<string, string> = {
    Beginner: "bg-success/10 text-success border-success/20",
    Intermediate: "bg-warning/10 text-warning border-warning/20",
    Advanced: "bg-destructive/10 text-destructive border-destructive/20",
    Expert: "bg-primary/10 text-primary border-primary/20",
    Masterclass: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  }

  const progress = isCompleted ? 100 : 0
  
  return (
    <Card onClick={onResume} className="relative overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-pointer group bg-gradient-to-b from-card to-card hover:to-primary/5">
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100" />
      <CardContent className="p-5 flex flex-col h-full z-10 relative">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="outline" className={levelColors[course.level] || "bg-muted"}>{course.level}</Badge>
          <div className="flex items-center gap-1 text-sm text-warning font-semibold bg-warning/10 px-2 py-0.5 rounded-full">
            <Star className="h-4 w-4 fill-warning" />
            <span>{course.xp} XP</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-6 font-medium bg-muted/50 w-max px-2 py-1 rounded-md">{isCompleted ? course.modules : 0}/{course.modules} Modules Complete</p>
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className={progress === 100 ? "text-success" : "text-muted-foreground"}>{progress}% PROGRESS</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-primary">
              {isCompleted ? <Check className="h-3 w-3 mr-1 text-success" /> : <Play className="h-3 w-3 mr-1 fill-primary" />} 
              {isCompleted ? "REVIEW" : "RESUME"}
            </span>
          </div>
          <Progress value={progress} className={`h-2 ${isCompleted ? '[&>div]:bg-success' : ''}`} />
        </div>
      </CardContent>
    </Card>
  )
}

const ICONS_MAP: Record<string, any> = { Brain, Award, Zap, Compass, TrendingUp }

export function AcademyPage({ onPushNotification }: { onPushNotification?: (type: string, title: string, message: string) => void }) {
  const { user, updateProfile } = useAuth()
  
  const [activeCourse, setActiveCourse] = useState<any | null>(null)
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  const defaultAcademyData = { xp: 0, coursesCompleted: [], badgesEarned: [], currentStreak: 0, lastActiveDate: 0 }
  const data = user?.academyData || defaultAcademyData

  // Evaluate XP unlocks dynamically
  useEffect(() => {
    if (!user || !user.academyData) return
    const earned = [...data.badgesEarned]
    let newlyEarned = false

    BADGES_DATA.forEach(badge => {
      if (data.xp >= badge.requiredXP && !earned.includes(badge.id)) {
        earned.push(badge.id)
        newlyEarned = true
        if(onPushNotification) onPushNotification("success", "🏆 Badge Unlocked!", `You've earned the ${badge.name} badge for reaching ${badge.requiredXP} XP.`)
      }
    })

    if (newlyEarned) {
      updateProfile({ academyData: { ...data, badgesEarned: earned } as Extract<UserProfile["academyData"], object> })
    }
  }, [data.xp, data.badgesEarned, user, updateProfile, onPushNotification])

  const handleCourseComplete = (courseId: string, xpReward: number) => {
    if (!data.coursesCompleted.includes(courseId)) {
      if(onPushNotification) onPushNotification("success", "Module Completed", `+${xpReward} XP awarded!`)
      updateProfile({
        academyData: {
          ...data,
          xp: data.xp + xpReward,
          coursesCompleted: [...data.coursesCompleted, courseId]
        } as Extract<UserProfile["academyData"], object>
      })
    }
  }

  const handleQuizComplete = (xpEarned: number) => {
    if (xpEarned > 0) {
      if(onPushNotification) onPushNotification("success", "Verification Passed", `+${xpEarned} XP awarded!`)
      updateProfile({
        academyData: {
          ...data,
          xp: data.xp + xpEarned,
          lastActiveDate: Date.now()
        } as Extract<UserProfile["academyData"], object>
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total XP" value={data.xp.toLocaleString()} icon={Star} />
        <StatCard title="Courses Completed" value={data.coursesCompleted.length} icon={CheckCircle} />
        <StatCard title="Badges Earned" value={data.badgesEarned.length} icon={Award} />
        <StatCard title="Current Streak" value={data.currentStreak + " days"} icon={Flame} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" /> Progression Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {BADGES_DATA.map((badge) => {
              const isEarned = data.badgesEarned.includes(badge.id)
              const Icon = ICONS_MAP[badge.iconName] || Award
              return (
                <div key={badge.id} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl min-w-[120px] transition-all ${isEarned ? "bg-warning/10 border border-warning/30 shadow-lg shadow-warning/5" : "bg-muted opacity-60 grayscale"}`}>
                  <Icon className={`h-8 w-8 ${isEarned ? "text-warning" : "text-muted-foreground"}`} />
                  <span className="text-xs text-center font-bold px-1">{badge.name}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">{badge.requiredXP} XP</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Learning Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSES_DATA.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isCompleted={data.coursesCompleted.includes(String(course.id))} 
              onResume={() => setActiveCourse(course)}
            />
          ))}
        </div>
      </div>

      <Card className="border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary fill-primary animate-pulse" /> Daily Skill Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-xl">CoreVault Prop-Firm Challenge</h3>
              <p className="text-muted-foreground">Answer 5 randomized multi-choice questions covering advanced market structures, on-chain analytics, and algorithmic concepts. Gain XP to unlock Badges.</p>
            </div>
            <Button onClick={() => setIsQuizOpen(true)} className="w-full md:w-auto font-bold px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Trophy className="h-4 w-4" /> Start Verification
            </Button>
          </div>
        </CardContent>
      </Card>

      <ActiveCourseDialog 
        isOpen={!!activeCourse} 
        course={activeCourse} 
        onClose={() => setActiveCourse(null)} 
        onComplete={(xp: number) => handleCourseComplete(String(activeCourse?.id), xp)}
      />

      <SkillVerificationQuiz 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        onCompleteXP={handleQuizComplete} 
      />
    </div>
  )
}
