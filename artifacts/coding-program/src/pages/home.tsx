import { useGetProgramStats, useGetRecentActivity, getGetProgramStatsQueryKey, getGetRecentActivityQueryKey } from "@workspace/api-client-react";
import { Code, BookOpen, ArrowRight, Activity, Users, Sparkles, Rocket } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetProgramStats({
    query: { queryKey: getGetProgramStatsQueryKey() },
  });

  const { data: activities, isLoading: activityLoading } = useGetRecentActivity({ limit: 5 }, {
    query: { queryKey: getGetRecentActivityQueryKey({ limit: 5 }) },
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageTransition className="p-6 md:p-10 max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-800 text-white p-8 md:p-14 shadow-2xl shadow-primary/30 group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 blur-2xl" />
        
        {/* Animated Floating Element */}
        <motion.div 
          className="absolute -right-10 -top-10 text-white/10 hidden md:block"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Code className="w-96 h-96" />
        </motion.div>

        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-bold text-[#FFD700] uppercase tracking-widest shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Level up your skills
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black font-heading leading-[1.1] tracking-tight">
            Learn to build <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-orange-400">real things</span> with code.
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xl">
            From your first block of code in Grade 4 to deploying full apps in Grade 12. 
            code.fun is your free, open path to mastering software.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/courses" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-orange-500 text-indigo-950 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all animate-pulse-glow">
                Let's Go <Rocket className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grade Progression Journey */}
      <section className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <span className="text-primary font-black uppercase tracking-widest text-sm bg-primary/10 px-4 py-1.5 rounded-full">Your Journey</span>
          <h2 className="text-3xl md:text-4xl font-black font-heading">Pick Your Path</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Elementary */}
          <motion.div variants={itemVariants} className="group relative rounded-3xl bg-grade-elementary p-8 overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-orange-500/20 cursor-pointer">
            <Link href="/courses">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-black/20 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">Grades 4-5</span>
                  <div className="text-5xl font-black text-white/30 group-hover:text-white/50 transition-colors">1</div>
                </div>
                <h3 className="text-3xl font-black font-heading tracking-tight">Elementary</h3>
                <p className="text-white/90 text-sm font-medium leading-relaxed pb-4">Discover the magic of code. Learn the logic of programming through visual blocks and interactive puzzles.</p>
                <div className="flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
                  Start Quest <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Middle */}
          <motion.div variants={itemVariants} className="group relative rounded-3xl bg-grade-middle p-8 overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-teal-500/20 cursor-pointer">
            <Link href="/courses">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-black/20 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">Grades 6-8</span>
                  <div className="text-5xl font-black text-white/30 group-hover:text-white/50 transition-colors">2</div>
                </div>
                <h3 className="text-3xl font-black font-heading tracking-tight">Middle School</h3>
                <p className="text-white/90 text-sm font-medium leading-relaxed pb-4">Write real syntax. Build websites, script simple games, and start thinking like a software engineer.</p>
                <div className="flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
                  Start Quest <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary */}
          <motion.div variants={itemVariants} className="group relative rounded-3xl bg-grade-secondary p-8 overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-indigo-500/20 cursor-pointer">
            <Link href="/courses">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-black/20 text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">Grades 9-12</span>
                  <div className="text-5xl font-black text-white/30 group-hover:text-white/50 transition-colors">3</div>
                </div>
                <h3 className="text-3xl font-black font-heading tracking-tight">Secondary</h3>
                <p className="text-white/90 text-sm font-medium leading-relaxed pb-4">Build for the real world. Master web development, work with APIs, and ship actual software.</p>
                <div className="flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
                  Start Quest <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black font-heading tracking-tight">Global Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon={BookOpen} label="Courses" value={stats?.totalCourses} isLoading={statsLoading} color="text-blue-500" bg="bg-blue-100 dark:bg-blue-900/30" />
            <StatCard icon={Code} label="Lessons" value={stats?.totalLessons} isLoading={statsLoading} color="text-violet-500" bg="bg-violet-100 dark:bg-violet-900/30" />
            <StatCard icon={Users} label="Students" value={stats?.totalStudents} isLoading={statsLoading} color="text-emerald-500" bg="bg-emerald-100 dark:bg-emerald-900/30" />
          </div>
          
          <div className="bg-card border-2 rounded-3xl p-8 shadow-sm">
            <h3 className="font-black text-xl mb-6 tracking-tight">Coders by Grade</h3>
            {statsLoading ? (
              <Skeleton className="h-48 w-full rounded-2xl" />
            ) : (
              <div className="flex items-end gap-3 h-48 pt-4">
                {stats?.gradeBreakdown?.map((b) => {
                  const maxCount = Math.max(...(stats.gradeBreakdown?.map(x => x.studentCount) || [1]));
                  const heightPercentage = Math.max((b.studentCount / maxCount) * 100, 5);
                  
                  let barColor = "bg-primary";
                  if (b.grade >= 4 && b.grade <= 5) barColor = "bg-orange-400";
                  if (b.grade >= 6 && b.grade <= 8) barColor = "bg-teal-400";
                  if (b.grade >= 9 && b.grade <= 12) barColor = "bg-indigo-500";

                  return (
                    <div key={b.grade} className="flex-1 flex flex-col items-center gap-3 group relative">
                      <div className="absolute -top-10 bg-foreground text-background text-sm font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl transform group-hover:-translate-y-1">
                        {b.studentCount}
                      </div>
                      <div 
                        className={cn("w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110", barColor)}
                        style={{ height: `${heightPercentage}%` }}
                      />
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">G{b.grade}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-heading tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Live Feed
          </h2>
          <div className="bg-card border-2 rounded-3xl p-6 space-y-6 shadow-sm">
            {activityLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : activities?.length === 0 ? (
              <div className="text-center py-10">
                <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">It's quiet... start coding to appear here!</p>
              </div>
            ) : (
              activities?.map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:bottom-[-24px] before:w-0.5 before:bg-border last:before:hidden">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 bg-background z-10 shadow-sm",
                    activity.type === "badge_earned" ? "border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-950" :
                    "border-teal-400 text-teal-500 bg-teal-50 dark:bg-teal-950"
                  )}>
                    {activity.type === "badge_earned" ? <Rocket className="w-4 h-4" /> :
                     <BookOpen className="w-4 h-4" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium leading-snug">
                      {activity.studentName ? <span className="font-bold text-foreground">{activity.studentName}</span> : "A coder"}
                      {" "}<span className="text-muted-foreground">{activity.description}</span>
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1.5">Grade {activity.grade}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function StatCard({ icon: Icon, label, value, isLoading, color, bg }: { icon: any, label: string, value?: number, isLoading: boolean, color: string, bg: string }) {
  return (
    <div className="bg-card border-2 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/30 transition-colors">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm rotate-3", bg, color)}>
        <Icon className="w-6 h-6 -rotate-3" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <div className="text-3xl font-black font-heading tracking-tight mb-1">{value || 0}</div>
      )}
      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{label}</div>
    </div>
  );
}
