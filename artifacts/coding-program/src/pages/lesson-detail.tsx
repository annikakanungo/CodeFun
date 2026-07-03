import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetLesson, 
  useGetLessonExercises, 
  useGetLessonQuiz, 
  useGetLessonCurriculumMappings,
  useRecordProgress,
  getGetLessonQueryKey,
  getGetLessonExercisesQueryKey,
  getGetLessonQuizQueryKey,
  getGetLessonCurriculumMappingsQueryKey
} from "@workspace/api-client-react";
import { ArrowLeft, Play, Code, CheckCircle, HelpCircle, BookOpen, GraduationCap, Star, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function LessonDetail() {
  const { id } = useParams();
  const lessonId = Number(id);
  
  const [activeTab, setActiveTab] = useState("content");
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const { data: lesson, isLoading: lessonLoading } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) }
  });

  const { data: exercises, isLoading: exercisesLoading } = useGetLessonExercises(lessonId, {
    query: { enabled: !!lessonId && lesson?.hasExercises, queryKey: getGetLessonExercisesQueryKey(lessonId) }
  });

  const { data: quiz, isLoading: quizLoading } = useGetLessonQuiz(lessonId, {
    query: { enabled: !!lessonId && lesson?.hasQuiz, queryKey: getGetLessonQuizQueryKey(lessonId) }
  });

  const { data: mappings } = useGetLessonCurriculumMappings(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonCurriculumMappingsQueryKey(lessonId) }
  });

  const recordProgress = useRecordProgress();

  const handleCompleteLesson = () => {
    recordProgress.mutate({
      data: { studentId: "demo-student", lessonId }
    }, {
      onSuccess: () => {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2500);
      }
    });
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake grading logic - just random for demo
    const score = Math.floor(Math.random() * 3) + 1; // 1 to 3 stars
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  if (lessonLoading) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-[500px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!lesson) return <div className="p-20 text-center font-bold text-xl">Lesson not found in the archives.</div>;

  return (
    <PageTransition className="pb-20 bg-background min-h-screen relative">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-2xl flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-24 h-24 bg-gradient-to-br from-[#FFD700] to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/50"
              >
                <Star className="w-12 h-12 text-white fill-white" />
              </motion.div>
              <h2 className="text-4xl font-black font-heading mb-2 text-indigo-950 dark:text-white tracking-tight">Lesson Complete!</h2>
              <div className="text-2xl font-black text-primary flex items-center gap-2 justify-center">
                <Zap className="w-6 h-6 fill-primary" /> +100 XP
              </div>
              
              {/* CSS Confetti built-in via class */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="confetti-piece" 
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#FFD700', '#a855f7', '#22c55e', '#ef4444', '#3b82f6'][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 0.5}s`,
                    top: '-50px'
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-card border-b-2 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href={`/courses/${lesson.courseId}`} className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-xl border-2 hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 bg-primary/10 inline-block px-2 py-0.5 rounded">Quest {lesson.order}</p>
              <h1 className="text-2xl font-black font-heading tracking-tight leading-none">{lesson.title}</h1>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleCompleteLesson} 
              disabled={recordProgress.isPending || showCelebration} 
              className="gap-2 rounded-xl font-black text-base h-12 px-6 bg-gradient-to-r from-primary to-[#a855f7] hover:shadow-lg hover:shadow-primary/30 text-white w-full md:w-auto"
            >
              <CheckCircle className="w-5 h-5" /> Done! Claim XP
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
        
        {lesson.videoUrl && (
          <div className="aspect-video bg-[#0f172a] rounded-3xl overflow-hidden border-2 shadow-2xl relative group flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e0a3c] to-[#312e81] opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIj48L3JlY3Q+Cjwvc3ZnPg==')] pointer-events-none mix-blend-overlay" />
            
            <div className="relative z-10 text-center space-y-6 transition-transform group-hover:scale-105 duration-500">
              <motion.div 
                className="w-24 h-24 rounded-full bg-[#FFD700] text-indigo-950 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,215,0,0.4)] cursor-pointer hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play className="w-10 h-10 ml-2 fill-current" />
              </motion.div>
              <div>
                <h3 className="text-white font-black text-2xl tracking-tight mb-1">Play Video Lesson</h3>
                <p className="text-[#FFD700] font-bold text-sm uppercase tracking-widest">{lesson.durationMinutes} minutes</p>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b-2 rounded-none h-auto p-0 bg-transparent gap-2 md:gap-6 overflow-x-auto no-scrollbar">
            <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider">
              <BookOpen className="w-5 h-5 mr-2 mb-0.5" /> Intel
            </TabsTrigger>
            {lesson.hasExercises && (
              <TabsTrigger value="exercises" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider">
                <Code className="w-5 h-5 mr-2 mb-0.5" /> Code
              </TabsTrigger>
            )}
            {lesson.hasQuiz && (
              <TabsTrigger value="quiz" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider">
                <HelpCircle className="w-5 h-5 mr-2 mb-0.5" /> Boss Fight
              </TabsTrigger>
            )}
            <TabsTrigger value="teacher" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-slate-500 data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-300 rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider ml-auto">
              <GraduationCap className="w-5 h-5 mr-2 mb-0.5" /> Teachers
            </TabsTrigger>
          </TabsList>

          <div className="mt-10">
            <TabsContent value="content" className="space-y-10 animate-in fade-in-50 duration-500 m-0">
              <div className="bg-card border-2 rounded-3xl p-8 md:p-12 shadow-sm">
                <div className="prose prose-lg dark:prose-invert max-w-none font-sans font-medium text-foreground/90 leading-relaxed marker:text-primary" dangerouslySetInnerHTML={{ __html: lesson.content || "<p>No content provided.</p>" }} />
              </div>

              {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-8 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="font-black text-2xl text-primary mb-6 font-heading tracking-tight flex items-center gap-3">
                    <Zap className="w-6 h-6 fill-primary" /> Key Takeaways
                  </h3>
                  <ul className="space-y-4 relative z-10">
                    {lesson.objectives.map((obj, i) => (
                      <li key={i} className="flex gap-4 text-base font-bold text-foreground/80 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-primary/10">
                        <CheckCircle className="w-6 h-6 text-primary shrink-0" /> {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="exercises" className="space-y-8 animate-in fade-in-50 duration-500 m-0">
              {exercisesLoading ? (
                <Skeleton className="h-96 w-full rounded-3xl" />
              ) : exercises?.map((exercise) => (
                <div key={exercise.id} className="bg-card border-2 rounded-3xl overflow-hidden shadow-md flex flex-col relative group">
                  <div className="p-5 border-b-2 bg-muted/40 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-md mr-4 shadow-sm",
                        exercise.difficulty === "beginner" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                        exercise.difficulty === "intermediate" ? "bg-[#FFD700]/20 text-[#b49800] border border-[#FFD700]/40" :
                        "bg-red-100 text-red-800 border border-red-200"
                      )}>{exercise.difficulty}</span>
                      <span className="font-black text-lg tracking-tight">{exercise.title}</span>
                    </div>
                    <span className="text-xs font-black font-mono bg-white dark:bg-black px-3 py-1 rounded-md border-2 shadow-sm text-primary">{exercise.language}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 min-h-[400px] divide-y-2 md:divide-y-0 md:divide-x-2">
                    <div className="p-8 bg-card space-y-6">
                      <h4 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Instructions
                      </h4>
                      <p className="text-base font-medium leading-relaxed">{exercise.instructions}</p>
                    </div>
                    
                    <div className="bg-[#0f172a] p-4 flex flex-col relative">
                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <Button size="sm" className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-xs rounded-lg shadow-lg">Run Code <Play className="w-3 h-3 ml-1 fill-white" /></Button>
                      </div>
                      <pre className="text-green-400 font-mono text-sm overflow-auto p-4 flex-1 outline-none font-medium leading-relaxed bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-inner" contentEditable suppressContentEditableWarning spellCheck={false}>
                        {exercise.starterCode}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="quiz" className="animate-in fade-in-50 duration-500 m-0">
              {quizLoading ? (
                <Skeleton className="h-96 w-full rounded-3xl" />
              ) : quiz ? (
                <div className="bg-card border-2 rounded-3xl p-8 md:p-12 shadow-sm max-w-3xl mx-auto relative overflow-hidden">
                  {!quizSubmitted ? (
                    <form onSubmit={handleQuizSubmit}>
                      <h3 className="text-3xl font-black font-heading mb-10 flex items-center gap-3 tracking-tight border-b-2 pb-6">
                        <HelpCircle className="w-8 h-8 text-primary" /> Boss Fight Quiz
                      </h3>
                      <div className="space-y-12">
                        {quiz.questions.map((q, i) => (
                          <div key={q.id} className="space-y-5 bg-muted/20 p-6 rounded-2xl border-2">
                            <p className="font-bold text-lg leading-snug"><span className="text-primary font-black mr-3 text-xl">{i + 1}.</span>{q.question}</p>
                            <div className="space-y-3">
                              {q.options.map((opt, j) => (
                                <label key={j} className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 group">
                                  <input type="radio" name={`q-${q.id}`} className="w-5 h-5 accent-primary border-2" required />
                                  <span className="text-base font-medium group-hover:text-primary transition-colors">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                            Submit Answers
                          </Button>
                        </motion.div>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-3xl font-black mb-8 tracking-tight">Quiz Results</h3>
                      <div className="flex justify-center gap-4 mb-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.2, type: "spring", bounce: 0.6 }}
                          >
                            <Star className={cn("w-20 h-20", i < quizScore ? "text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" : "text-muted-foreground/20 fill-muted-foreground/10")} />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-2xl font-bold mb-8">
                        {quizScore === 3 ? "Flawless Victory!" : quizScore === 2 ? "Great Job!" : "Keep practicing!"}
                      </p>
                      <Button onClick={() => setQuizSubmitted(false)} variant="outline" className="rounded-xl font-bold border-2">Retry Quiz</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
                  <p className="font-bold text-muted-foreground text-lg">No boss fight for this quest.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="teacher" className="animate-in fade-in-50 duration-500 m-0">
              <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto">
                <h3 className="text-2xl font-black font-heading mb-8 flex items-center gap-3 tracking-tight text-slate-800 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-800 pb-6">
                  <GraduationCap className="w-8 h-8 text-slate-500" /> Curriculum Alignment
                </h3>
                {mappings && mappings.length > 0 ? (
                  <div className="space-y-6">
                    <p className="text-base font-medium text-slate-600 dark:text-slate-400 mb-6">This lesson satisfies the following expectations:</p>
                    <div className="grid gap-4">
                      {mappings.map(m => (
                        <div key={m.id} className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex flex-col md:flex-row gap-5 items-start">
                          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm font-black text-slate-700 dark:text-slate-300 shrink-0">
                            {m.expectationCode}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{m.strand}</p>
                            <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{m.expectationText}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 font-medium text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-950">No specific curriculum mappings defined for this lesson yet.</p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageTransition>
  );
}
