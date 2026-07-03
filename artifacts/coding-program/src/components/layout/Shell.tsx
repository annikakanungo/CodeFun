import { Link, useLocation } from "wouter";
import { BookOpen, Home, Code, Presentation, Trophy, Flame, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetStudentProgress, getGetStudentProgressQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: Code },
  { href: "/progress/demo-student", label: "Your Stats", icon: Trophy },
  { href: "/teacher", label: "Teacher Hub", icon: Presentation },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  // Fetch progress for XP and Level
  const { data: progress } = useGetStudentProgress("demo-student", {
    query: { queryKey: getGetStudentProgressQueryKey("demo-student") }
  });

  const xp = (progress?.completedLessons || 0) * 100;
  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;
  const currentLevelProgress = xp % 500;
  const progressPercent = (currentLevelProgress / 500) * 100;
  const streak = 5; // Hardcoded for now per requirements

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background selection:bg-primary/20">
      {/* Mobile Nav */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-indigo-900 bg-[#1e0a3c] text-white">
        <Link href="/" className="flex items-center gap-2 font-black text-xl font-heading tracking-tight">
          <Code className="w-6 h-6 text-[#FFD700]" />
          code<span className="text-[#a855f7]">.</span>fun
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-sm bg-black/30 px-2 py-1 rounded-full text-orange-400">
            <Flame className="w-4 h-4" /> {streak}
          </div>
        </div>
      </header>

      {/* Sidebar Nav */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 sticky top-0 h-[100dvh] bg-gradient-to-b from-[#1e0a3c] to-[#312e81] text-white shadow-2xl overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="p-6 relative z-10">
          <Link href="/" className="flex items-center gap-2 font-black text-3xl font-heading tracking-tight mb-8 group">
            <div className="relative">
              <Code className="w-8 h-8 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="w-4 h-4 text-[#FFD700] absolute -top-1 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            code<span className="text-primary group-hover:text-[#FFD700] transition-colors">.</span>fun
          </Link>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group",
                    isActive
                      ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD700]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-[#FFD700]" : "text-white/40")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Gamification Widget */}
        <div className="mt-auto p-6 relative z-10">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#FFD700] flex items-center justify-center p-0.5 shadow-lg">
                  <div className="w-full h-full bg-black/50 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-widest leading-none mb-0.5">Coder</div>
                  <div className="text-sm font-bold text-white leading-none">Level {level}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-sm bg-orange-500/20 text-orange-400 px-2.5 py-1 rounded-lg border border-orange-500/30">
                <Flame className="w-4 h-4" /> {streak}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase tracking-wider">
                <span>{xp} XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
              <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#a855f7] to-[#FFD700] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e0a3c] text-white border-t border-indigo-900 flex justify-around p-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] pb-safe">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl text-[10px] font-bold transition-all relative",
                isActive ? "text-[#FFD700]" : "text-white/50"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNavMobile"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 mb-1 relative z-10 transition-transform", isActive && "scale-110")} />
              <span className="relative z-10">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
