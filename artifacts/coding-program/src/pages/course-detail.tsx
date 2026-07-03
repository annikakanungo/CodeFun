import { useParams, Link } from "wouter";
import { useGetCourse, useGetCourseLessons, getGetCourseQueryKey, getGetCourseLessonsQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, BookOpen, Clock, PlayCircle, CheckCircle2, Video, Code, HelpCircle, Star, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";

export default function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);

  const { data: course, isLoading: courseLoading } = useGetCourse(courseId, {
    query: { enabled: !!courseId, queryKey: getGetCourseQueryKey(courseId) }
  });

  const { data: lessons, isLoading: lessonsLoading } = useGetCourseLessons(courseId, {
    query: { enabled: !!courseId, queryKey: getGetCourseLessonsQueryKey(courseId) }
  });

  if (courseLoading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-3/4 rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-20 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-3xl font-black mb-4 tracking-tight">Course Not Found</h2>
        <Link href="/courses" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">Return to Courses</Link>
      </div>
    );
  }

  const isElementary = course.gradeband === "elementary";
  const isMiddle = course.gradeband === "middle";
  const totalXp = (lessons?.length || 0) * 80;

  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <PageTransition className="pb-20">
      {/* Course Header */}
      <div 
        className="pt-12 pb-20 px-6 md:px-10 relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${course.color || 'var(--primary)'}ee, ${course.color || 'var(--primary)'})` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPgo8L3JlY3Q+Cjwvc3ZnPg==')] opacity-30 mix-blend-overlay pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white/90 hover:text-white mb-8 text-sm font-bold transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Quests
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
              Grade {course.grade}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-black/30 backdrop-blur-md text-white shadow-sm">
              {course.language}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#FFD700] to-orange-400 text-indigo-950 shadow-sm flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-indigo-950" /> {totalXp} XP Total
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black font-heading mb-6 leading-[1.1] tracking-tight text-shadow-glow">{course.title}</h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-3xl font-medium leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border-2 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5">
              <h2 className="text-2xl font-black font-heading mb-6 flex items-center gap-3 tracking-tight">
                <BookOpen className="w-6 h-6 text-primary" /> Quest Line
              </h2>
              
              <div className="space-y-4">
                {lessonsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                ) : lessons?.length === 0 ? (
                  <div className="text-center py-10 bg-muted/30 rounded-2xl border-2 border-dashed">
                    <p className="text-muted-foreground font-bold">Quests are being forged. Check back soon!</p>
                  </div>
                ) : (
                  <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-4">
                    {lessons?.map((lesson, index) => (
                      <motion.div variants={itemVariants} key={lesson.id}>
                        <Link 
                          href={`/lessons/${lesson.id}`}
                          className="group flex gap-4 p-5 rounded-2xl border-2 bg-background hover:border-primary/60 hover:shadow-lg transition-all block relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-muted group-hover:bg-primary transition-colors" />
                          
                          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center font-black text-xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-sm">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-black text-xl mb-1.5 tracking-tight group-hover:text-primary transition-colors">{lesson.title}</h3>
                            <p className="text-sm font-medium text-muted-foreground mb-4">{lesson.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground">
                              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
                                <Clock className="w-4 h-4" /> {lesson.durationMinutes} min
                              </span>
                              {lesson.hasVideo && (
                                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                                  <Video className="w-4 h-4" /> Video
                                </span>
                              )}
                              {lesson.hasExercises && (
                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">
                                  <Code className="w-4 h-4" /> Code
                                </span>
                              )}
                              {lesson.hasQuiz && (
                                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-md">
                                  <HelpCircle className="w-4 h-4" /> Quiz
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 flex items-center justify-center pl-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                              <PlayCircle className="w-5 h-5 ml-0.5" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border-2 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-black text-xl font-heading mb-6 tracking-tight">What you'll learn</h3>
              <ul className="space-y-4">
                {course.objectives?.map((obj, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed">
                    <CheckCircle2 className="w-6 h-6 text-[#22c55e] shrink-0" />
                    <span className="pt-0.5">{obj}</span>
                  </li>
                ))}
                {(!course.objectives || course.objectives.length === 0) && (
                  <li className="text-sm font-medium text-muted-foreground text-center py-4">Secret knowledge awaits...</li>
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 border-2 border-slate-300 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-300/50 dark:bg-slate-700/50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              <h3 className="font-black text-xl font-heading mb-3 tracking-tight relative z-10">For Teachers</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6 leading-relaxed relative z-10">
                Teaching this? Get lesson plans, rubrics, and curriculum maps.
              </p>
              <Link href="/teacher" className="inline-block bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-black px-5 py-2.5 rounded-xl hover:shadow-lg transition-all relative z-10">
                Teacher Hub &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
