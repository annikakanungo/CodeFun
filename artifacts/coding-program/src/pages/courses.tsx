import { useState } from "react";
import { useListCourses, getListCoursesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { BookOpen, Search, ArrowRight, PlayCircle, Code2, Cpu, Star, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Courses() {
  const [filter, setFilter] = useState<"all" | "elementary" | "middle" | "secondary">("all");
  const [search, setSearch] = useState("");

  const { data: courses, isLoading } = useListCourses(
    { gradeband: filter !== "all" ? filter : undefined },
    { query: { queryKey: getListCoursesQueryKey({ gradeband: filter !== "all" ? filter : undefined }) } }
  );

  const filteredCourses = courses?.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.language.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-primary font-black uppercase tracking-widest text-sm bg-primary/10 px-4 py-1.5 rounded-full inline-block">Missions</span>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight">Course Library</h1>
          <p className="text-lg font-medium text-muted-foreground">Find the right path for your grade level and dive into learning.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card border-2 p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search courses by title or language..." 
            className="pl-11 h-12 bg-muted/50 border-none rounded-xl text-base font-medium shadow-none focus-visible:ring-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-muted/50 rounded-xl p-1 overflow-x-auto no-scrollbar shrink-0">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All Levels</FilterButton>
          <FilterButton active={filter === "elementary"} onClick={() => setFilter("elementary")} className="hover:text-orange-600 active-bg:bg-orange-100">Grades 4-5</FilterButton>
          <FilterButton active={filter === "middle"} onClick={() => setFilter("middle")} className="hover:text-teal-600 active-bg:bg-teal-100">Grades 6-8</FilterButton>
          <FilterButton active={filter === "secondary"} onClick={() => setFilter("secondary")} className="hover:text-indigo-600 active-bg:bg-indigo-100">Grades 9-12</FilterButton>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border-2 rounded-3xl p-6 h-72 flex flex-col">
              <Skeleton className="w-20 h-8 rounded-full mb-6" />
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-auto" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))
        ) : filteredCourses?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-card border-2 border-dashed rounded-3xl">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-black mb-2 tracking-tight">No quests found</h3>
            <p className="text-muted-foreground font-medium">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredCourses?.map((course) => {
            const isElementary = course.gradeband === "elementary";
            const isMiddle = course.gradeband === "middle";
            const isSecondary = course.gradeband === "secondary";
            
            const bandColor = isElementary ? "text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/40" : 
                              isMiddle ? "text-teal-700 bg-teal-100 border-teal-200 dark:text-teal-300 dark:bg-teal-900/40" : 
                              "text-indigo-700 bg-indigo-100 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/40";
                              
            const xpReward = course.lessonCount * 80;
            const difficultyStars = isElementary ? 1 : isMiddle ? 2 : 3;

            return (
              <motion.div variants={itemVariants} key={course.id}>
                <Link 
                  href={`/courses/${course.id}`}
                  className="group flex flex-col bg-card border-2 rounded-3xl h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative"
                >
                  {/* Vibrant Gradient Header */}
                  <div 
                    className="h-24 p-5 flex items-start justify-between relative overflow-hidden" 
                    style={{ 
                      background: `linear-gradient(135deg, ${course.color}dd, ${course.color})` 
                    }}
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-20 mix-blend-overlay pointer-events-none" />
                    
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm z-10">
                      Grade {course.grade}
                    </span>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black z-10 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" /> 
                      {xpReward} XP
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative bg-card">
                    {/* Floating language icon */}
                    <div className="absolute -top-10 right-6 w-14 h-14 rounded-2xl bg-white border-2 shadow-lg flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      {course.language.toLowerCase().includes('python') ? <Code2 className="w-7 h-7" /> :
                       course.language.toLowerCase().includes('scratch') ? <Cpu className="w-7 h-7" /> :
                       <Code2 className="w-7 h-7" />}
                    </div>

                    <div className="flex gap-1 mb-4 mt-2">
                      {Array.from({length: 3}).map((_, idx) => (
                        <Star key={idx} className={cn("w-4 h-4", idx < difficultyStars ? "text-[#FFD700] fill-[#FFD700]" : "text-muted-foreground/30 fill-muted-foreground/10")} />
                      ))}
                    </div>
                    
                    <h3 className="text-2xl font-black mb-3 font-heading tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm font-medium text-muted-foreground mb-8 line-clamp-2 flex-1 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-5 border-t mt-auto">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <PlayCircle className="w-4 h-4" />
                        {course.lessonCount} Lessons
                      </div>
                      <motion.div 
                        className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Let's Go <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </PageTransition>
  );
}

function FilterButton({ active, children, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
        active ? "bg-background shadow-sm text-foreground ring-1 ring-border" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
