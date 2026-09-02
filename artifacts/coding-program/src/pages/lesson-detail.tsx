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
import { ArrowLeft, Play, Code, CheckCircle, HelpCircle, BookOpen, GraduationCap, Star, Zap, Lock, UserPlus, LogIn, Trophy, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useUser } from "@clerk/react";

type CodeRunResult = {
  status: "success" | "error";
  message: string;
  output?: string;
};

const isBrowserPreview = (language: string) => {
  const normalized = language.toLowerCase();
  return normalized.includes("html") || normalized.includes("javascript");
};

const createJavaScriptPreview = (exerciseId: number, code: string) => `<!doctype html>
<html>
  <body style="margin:0;padding:16px;font-family:system-ui,sans-serif;background:#f8fafc;color:#172033">
    <div id="app"></div>
    <script>
      const messages = [];
      const originalLog = console.log;
      console.log = (...values) => {
        messages.push(values.map(value => typeof value === "object" ? JSON.stringify(value) : String(value)).join(" "));
        originalLog(...values);
      };
      try {
        new Function(${JSON.stringify(code)})();
        window.parent.postMessage({ type: "code-fun-preview", exerciseId: ${exerciseId}, status: "success", output: messages.join("\\n") }, "*");
      } catch (error) {
        window.parent.postMessage({ type: "code-fun-preview", exerciseId: ${exerciseId}, status: "error", output: error instanceof Error ? error.message : String(error) }, "*");
      }
    </script>
  </body>
</html>`;

function LessonGate({ lessonTitle, courseId }: { lessonTitle?: string; courseId?: number }) {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Blurred lesson preview */}
        <div className="relative">
          {/* Top bar */}
          <div className="px-6 py-5 border-b border-border flex items-center gap-4">
            <Link href={courseId ? `/courses/${courseId}` : "/courses"}>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="h-5 w-64 bg-muted rounded-md blur-sm" />
            </div>
          </div>

          {/* Blurred content preview */}
          <div className="p-6 select-none pointer-events-none blur-sm opacity-40">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded-lg" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-muted rounded-xl" />)}
              </div>
              <div className="space-y-2">
                {[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 - i * 8}%` }} />)}
              </div>
            </div>
          </div>

          {/* Gate overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.7) 20%, hsl(var(--background) / 0.97) 40%)' }}>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md mt-32"
            >
              <div className="bg-white rounded-3xl shadow-2xl shadow-violet-200 border border-violet-100 overflow-hidden">
                {/* Top gradient strip */}
                <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-amber-400" />

                <div className="p-8 text-center">
                  {/* Lock icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-300"
                  >
                    <Lock className="w-8 h-8 text-white" />
                  </motion.div>

                  {lessonTitle && (
                    <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Lesson locked</p>
                  )}
                  <h2 className="text-2xl font-black text-[#1a0a2e] mb-3 leading-tight">
                    {lessonTitle ? `"${lessonTitle}"` : 'This lesson'} is free —<br />
                    <span className="text-violet-600">you just need an account</span>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                    Create your free code.fun account to unlock every lesson, earn XP, collect badges, and track your progress.
                  </p>

                  {/* Perks */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { icon: Trophy, label: 'Earn badges', color: 'text-amber-500 bg-amber-50' },
                      { icon: Zap, label: 'Track XP', color: 'text-violet-500 bg-violet-50' },
                      { icon: Flame, label: 'Keep streaks', color: 'text-orange-500 bg-orange-50' },
                    ].map(({ icon: Icon, label, color }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3">
                    <Link href="/sign-up">
                      <Button className="w-full h-12 text-base font-black rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:opacity-90 text-violet-900 shadow-lg shadow-amber-200 border-0 gap-2">
                        <UserPlus className="w-5 h-5" />
                        Create Free Account
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button variant="ghost" className="w-full h-11 text-sm font-bold text-violet-700 hover:text-violet-900 hover:bg-violet-50 gap-2 rounded-xl">
                        <LogIn className="w-4 h-4" />
                        Already have an account? Sign in
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Free forever. No credit card. No ads.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default function LessonDetail() {
  const { id } = useParams();
  const lessonId = Number(id);
  const { isSignedIn, isLoaded } = useUser();
  
  const [activeTab, setActiveTab] = useState("content");
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [draftCode, setDraftCode] = useState<Record<number, string>>({});
  const [codeRunResults, setCodeRunResults] = useState<Record<number, CodeRunResult>>({});
  const [previewCode, setPreviewCode] = useState<Record<number, string>>({});
  const [readingMode, setReadingMode] = useState(false);

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

  useEffect(() => {
    setReadingMode(window.localStorage.getItem("codefun-reading-mode") === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("codefun-reading-mode", String(readingMode));
  }, [readingMode]);

  useEffect(() => {
    const handlePreviewMessage = (event: MessageEvent<{
      type?: string;
      exerciseId?: number;
      status?: "success" | "error";
      output?: string;
    }>) => {
      if (
        event.data?.type !== "code-fun-preview" ||
        typeof event.data.exerciseId !== "number" ||
        !event.data.status
      ) return;

      const exerciseId = event.data.exerciseId;
      const status = event.data.status;
      setCodeRunResults((current) => ({
        ...current,
        [exerciseId]: {
          status,
          message: status === "success"
            ? "Your JavaScript ran in the safe browser preview."
            : "Your JavaScript has an error. Read the message and try again.",
          output: event.data.output,
        },
      }));
    };

    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, []);

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

  const handleQuizSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const answers = quiz?.questions.reduce<Record<number, number>>((result, question) => {
      const answer = formData.get(`q-${question.id}`);
      if (typeof answer === "string") result[question.id] = Number(answer);
      return result;
    }, {}) ?? {};
    const correctAnswers = quiz?.questions.filter((question) => answers[question.id] === question.correctIndex).length ?? 0;
    const percentage = quiz?.questions.length ? correctAnswers / quiz.questions.length : 0;
    setQuizAnswers(answers);
    setQuizScore(Math.round(percentage * 3));
    setQuizSubmitted(true);
  };

  const handleRunExercise = (exercise: NonNullable<typeof exercises>[number]) => {
    const code = (draftCode[exercise.id] ?? exercise.starterCode).trim();
    const language = exercise.language.toLowerCase();

    if (!code) {
      setCodeRunResults((current) => ({
        ...current,
        [exercise.id]: { status: "error", message: "Add some code before you run it." },
      }));
      return;
    }

    if (language.includes("javascript")) {
      setPreviewCode((current) => ({ ...current, [exercise.id]: createJavaScriptPreview(exercise.id, code) }));
      setCodeRunResults((current) => ({
        ...current,
        [exercise.id]: { status: "success", message: "Running your JavaScript in a safe browser preview..." },
      }));
      return;
    }

    if (language.includes("html")) {
      setPreviewCode((current) => ({ ...current, [exercise.id]: code }));
      setCodeRunResults((current) => ({
        ...current,
        [exercise.id]: { status: "success", message: "Your HTML preview is ready below." },
      }));
      return;
    }

    const changed = code !== exercise.starterCode.trim();
    setCodeRunResults((current) => ({
      ...current,
      [exercise.id]: changed
        ? {
            status: "success",
            message: "Nice start! You changed the example. Compare your result with the expected outcome and test one more case.",
            output: exercise.expectedOutput ?? undefined,
          }
        : {
            status: "error",
            message: "Make one small change to the example, then run it again.",
          },
    }));
  };

  // Show gate for signed-out users (wait for Clerk to load first)
  if (isLoaded && !isSignedIn) {
    return <LessonGate lessonTitle={lesson?.title} courseId={lesson?.courseId ?? undefined} />;
  }

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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              aria-pressed={readingMode}
              onClick={() => setReadingMode((current) => !current)}
              className="gap-2 rounded-xl font-black text-sm h-12 px-5 border-2 w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4" /> {readingMode ? "Exit reading mode" : "Reading mode"}
            </Button>
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
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b-2 rounded-none h-auto p-0 bg-transparent gap-2 md:gap-6 overflow-x-auto no-scrollbar">
            <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider">
              <BookOpen className="w-5 h-5 mr-2 mb-0.5" /> Lesson
            </TabsTrigger>
            {lesson.hasExercises && (
              <TabsTrigger value="exercises" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider">
                <Code className="w-5 h-5 mr-2 mb-0.5" /> Practice
              </TabsTrigger>
            )}
            {lesson.hasQuiz && (
              <TabsTrigger value="quiz" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider">
                <HelpCircle className="w-5 h-5 mr-2 mb-0.5" /> Quiz
              </TabsTrigger>
            )}
            <TabsTrigger value="teacher" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-slate-500 data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-300 rounded-none px-2 py-4 font-black text-sm md:text-base text-muted-foreground uppercase tracking-wider ml-auto">
              <GraduationCap className="w-5 h-5 mr-2 mb-0.5" /> Teachers
            </TabsTrigger>
          </TabsList>

          <div className="mt-10">
            <TabsContent value="content" className="space-y-10 animate-in fade-in-50 duration-500 m-0">
              {readingMode && (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl px-5 py-4 text-sm font-bold text-primary flex items-center gap-3">
                  <BookOpen className="w-5 h-5 shrink-0" />
                  Reading mode is on: larger text, wider spacing, and fewer distractions.
                </div>
              )}
              <div className={cn(
                "bg-card border-2 rounded-3xl p-8 md:p-12 shadow-sm",
                readingMode && "md:p-16 shadow-none"
              )}>
                <div
                  className={cn(
                    "prose prose-lg dark:prose-invert max-w-none font-sans font-medium text-foreground/90 leading-relaxed marker:text-primary",
                    readingMode && "max-w-3xl mx-auto text-xl leading-[2]"
                  )}
                  dangerouslySetInnerHTML={{ __html: lesson.content || "<p>No content provided.</p>" }}
                />
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
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs font-bold text-slate-400">
                          {isBrowserPreview(exercise.language) ? "Safe browser preview" : "Guided practice"}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleRunExercise(exercise)}
                          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-xs rounded-lg shadow-lg"
                        >
                          {isBrowserPreview(exercise.language) ? "Run Preview" : "Check My Work"}
                          <Play className="w-3 h-3 ml-1 fill-white" />
                        </Button>
                      </div>
                      <textarea
                        aria-label={`Code editor for ${exercise.title}`}
                        value={draftCode[exercise.id] ?? exercise.starterCode}
                        onChange={(event) => setDraftCode((current) => ({
                          ...current,
                          [exercise.id]: event.target.value,
                        }))}
                        spellCheck={false}
                        className="text-green-400 font-mono text-sm min-h-[260px] resize-y overflow-auto p-4 flex-1 outline-none font-medium leading-relaxed bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-inner focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                      {codeRunResults[exercise.id] && (
                        <div
                          role="status"
                          className={cn(
                            "mt-3 rounded-xl border px-4 py-3 text-sm font-semibold",
                            codeRunResults[exercise.id].status === "success"
                              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                              : "border-rose-400/40 bg-rose-400/10 text-rose-200"
                          )}
                        >
                          <p>{codeRunResults[exercise.id].message}</p>
                          {codeRunResults[exercise.id].output && (
                            <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-300">
                              Expected outcome: {codeRunResults[exercise.id].output}
                            </pre>
                          )}
                        </div>
                      )}
                      {previewCode[exercise.id] && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-600 bg-white">
                          <iframe
                            title={`Preview for ${exercise.title}`}
                            srcDoc={previewCode[exercise.id]}
                            sandbox="allow-scripts"
                            className="h-48 w-full"
                          />
                        </div>
                      )}
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
                        <HelpCircle className="w-8 h-8 text-primary" /> Quick Quiz
                      </h3>
                      <div className="space-y-12">
                        {quiz.questions.map((q, i) => (
                          <div key={q.id} className="space-y-5 bg-muted/20 p-6 rounded-2xl border-2">
                            <p className="font-bold text-lg leading-snug"><span className="text-primary font-black mr-3 text-xl">{i + 1}.</span>{q.question}</p>
                            <div className="space-y-3">
                              {q.options.map((opt, j) => (
                                <label key={j} className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 group">
                                  <input type="radio" name={`q-${q.id}`} value={j} className="w-5 h-5 accent-primary border-2" required />
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
                      <p className="text-lg font-bold text-muted-foreground mb-6">
                        {quiz.questions.filter((question) => quizAnswers[question.id] === question.correctIndex).length} of {quiz.questions.length} correct
                      </p>
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
                      <div className="text-left space-y-3 mb-8">
                        {quiz.questions.map((question) => {
                          const isCorrect = quizAnswers[question.id] === question.correctIndex;
                          return (
                            <div key={question.id} className={cn(
                              "rounded-xl border-2 px-4 py-3 text-sm font-semibold",
                              isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
                            )}>
                              <p>{isCorrect ? "Correct" : "Not quite"}: {question.question}</p>
                              {!isCorrect && <p className="mt-1">Correct answer: {question.options[question.correctIndex]}</p>}
                            </div>
                          );
                        })}
                      </div>
                      <Button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        variant="outline"
                        className="rounded-xl font-bold border-2"
                      >
                        Retry Quiz
                      </Button>
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
