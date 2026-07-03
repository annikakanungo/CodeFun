import { useParams, Link } from "wouter";
import { useGetStudentProgress, getGetStudentProgressQueryKey } from "@workspace/api-client-react";
import { Trophy, Star, BookOpen, Clock, Activity, Code, Flame, Target, Rocket, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BADGE_ICONS: Record<string, any> = {
  "First Step": Rocket,
  "Getting Started": Target,
  "Building Momentum": Flame,
  "Code Explorer": BookOpen,
  "Code Champion": Trophy,
};

const BADGE_COLORS: Record<string, string> = {
  "First Step": "from-blue-400 to-blue-600",
  "Getting Started": "from-emerald-400 to-emerald-600",
  "Building Momentum": "from-orange-400 to-red-500",
  "Code Explorer": "from-violet-400 to-fuchsia-600",
  "Code Champion": "from-[#FFD700] to-orange-500",
};

export default function Progress() {
  const { studentId } = useParams();
  const id = studentId || "demo-student";
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const { data: progress, isLoading } = useGetStudentProgress(id, {
    query: { enabled: !!id, queryKey: getGetStudentProgressQueryKey(id) }
  });

  const completionPercent = progress && progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100) 
    : 0;

  useEffect(() => {
    if (completionPercent > 0) {
      setTimeout(() => setAnimatedPercent(completionPercent), 100);
    }
  }, [completionPercent]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-48 w-full rounded-[2rem]" />
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full rounded-[2rem] md:col-span-2" />
          <Skeleton className="h-64 w-full rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (!progress) {
    return <div className="p-20 text-center font-bold text-xl">Stats not found</div>;
  }

  const allBadges = ["First Step", "Getting Started", "Building Momentum", "Code Explorer", "Code Champion"];

  return (
    <PageTransition className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      
      {completionPercent > 0 && (
         <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="confetti-piece" 
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FFD700', '#a855f7', '#22c55e', '#ef4444', '#3b82f6'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  top: '-20px'
                }}
              />
            ))}
         </div>
      )}

      {/* Student Card */}
      <div className="bg-card border-2 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#a855f7] to-[#FFD700] flex items-center justify-center text-white shrink-0 shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform"
        >
          <span className="text-6xl font-black font-heading -rotate-3">{id.charAt(0).toUpperCase()}</span>
        </motion.div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 tracking-tight">Your Stats</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {progress.currentGrade && (
              <span className="px-4 py-2 bg-muted/50 border-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                Grade {progress.currentGrade}
              </span>
            )}
            <span className="px-4 py-2 bg-[#FFD700]/20 text-[#b49800] border-2 border-[#FFD700]/40 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Star className="w-4 h-4 fill-current" /> Coder
            </span>
          </div>
        </div>
        
        <div className="shrink-0 w-full md:w-56 relative z-10">
          <div className="bg-background rounded-3xl p-6 text-center border-2 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#FFD700]" />
            <p className="text-5xl font-black text-primary mb-2 tracking-tight">{progress.completedLessons * 100}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-10">
          {/* Progress Bar */}
          <div className="bg-card border-2 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
              <Activity className="w-7 h-7 text-primary" /> Overall Progress
            </h2>
            <div className="flex justify-between text-base font-black mb-3">
              <span className="text-primary">{animatedPercent}% Complete</span>
              <span className="text-muted-foreground">{progress.completedLessons} / {progress.totalLessons} Quests</span>
            </div>
            <div className="h-6 bg-muted/50 rounded-full overflow-hidden border-2 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-[#a855f7] to-[#FFD700] rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${animatedPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiI+PC9yZWN0Pgo8L3N2Zz4=')] mix-blend-overlay" />
              </motion.div>
            </div>
            {completionPercent === 100 && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-base text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-3 bg-emerald-100 dark:bg-emerald-900/30 p-5 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800"
              >
                <Trophy className="w-6 h-6 fill-current" /> Flawless Victory! All available quests completed!
              </motion.p>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-card border-2 rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
              <Clock className="w-7 h-7 text-primary" /> Quest History
            </h2>
            {progress.recentCompletions && progress.recentCompletions.length > 0 ? (
              <div className="space-y-4">
                {progress.recentCompletions.map((record) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={record.id} 
                    className="flex gap-5 p-5 rounded-2xl border-2 bg-background items-center shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                      <Code className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-lg">Quest {record.lessonId}</p>
                      <p className="text-sm font-medium text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(record.completedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-sm font-black bg-gradient-to-r from-[#FFD700] to-orange-400 text-indigo-950 px-3 py-1.5 rounded-lg shadow-sm">
                      +100 XP
                    </div>
                    <Link href={`/lessons/${record.lessonId}`} className="text-muted-foreground hover:bg-primary hover:text-white p-3 rounded-xl transition-all border-2">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 border-2 border-dashed rounded-3xl">
                 <Rocket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                 <p className="text-lg font-bold text-muted-foreground">Your history is blank — start your first quest!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Badges */}
        <div className="space-y-10">
          <div className="bg-card border-2 rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
              <Trophy className="w-7 h-7 text-[#FFD700] fill-[#FFD700]" /> Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {allBadges.map((badgeName, i) => {
                const earned = progress.badges.includes(badgeName);
                const Icon = BADGE_ICONS[badgeName] || Star;
                const gradient = BADGE_COLORS[badgeName] || "from-slate-400 to-slate-600";
                
                return (
                  <motion.div 
                    key={i} 
                    whileHover={earned ? { scale: 1.05, rotate: 5 } : {}}
                    className={cn(
                      "flex flex-col items-center justify-center p-5 border-2 rounded-2xl text-center relative overflow-hidden transition-all",
                      earned 
                        ? "bg-background border-primary/20 shadow-sm" 
                        : "bg-muted/20 border-dashed opacity-60 grayscale"
                    )}
                  >
                    {earned && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 mix-blend-multiply`} />}
                    
                    <div className={cn(
                      "w-14 h-14 clip-hex flex items-center justify-center mb-3 shadow-sm",
                      earned ? `bg-gradient-to-br ${gradient}` : "bg-muted"
                    )} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                      <Icon className={cn("w-6 h-6", earned ? "text-white drop-shadow-md" : "text-muted-foreground/50")} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest leading-tight",
                      earned ? "text-foreground" : "text-muted-foreground"
                    )}>{badgeName}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
