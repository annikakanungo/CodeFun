import { useState } from "react";
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
import { ArrowLeft, Play, Code, CheckCircle, HelpCircle, BookOpen, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LessonDetail() {
  const { id } = useParams();
  const lessonId = Number(id);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("content");

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
        toast({
          title: "Lesson completed!",
          description: "Great job! Your progress has been saved.",
        });
      }
    });
  };

  if (lessonLoading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!lesson) return <div className="p-10 text-center">Lesson not found</div>;

  return (
    <div className="pb-20 bg-muted/20 min-h-screen">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/courses/${lesson.courseId}`} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Lesson {lesson.order}</p>
              <h1 className="text-xl font-bold font-heading">{lesson.title}</h1>
            </div>
          </div>
          <Button onClick={handleCompleteLesson} disabled={recordProgress.isPending} className="gap-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Mark Complete
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {lesson.videoUrl && (
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border shadow-lg relative group flex items-center justify-center">
            {/* Fake video player since we don't have real videos */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-center space-y-4 transition-transform group-hover:scale-105 duration-300">
                <div className="w-20 h-20 rounded-full bg-primary/90 text-white flex items-center justify-center mx-auto shadow-xl shadow-primary/20 backdrop-blur-sm cursor-pointer hover:bg-primary transition-colors">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <h3 className="text-white font-medium text-lg">Play Video Lesson</h3>
                <p className="text-white/60 text-sm">{lesson.durationMinutes} minutes</p>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
            <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium">
              <BookOpen className="w-4 h-4 mr-2" /> Concept
            </TabsTrigger>
            {lesson.hasExercises && (
              <TabsTrigger value="exercises" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium">
                <Code className="w-4 h-4 mr-2" /> Code Practice
              </TabsTrigger>
            )}
            {lesson.hasQuiz && (
              <TabsTrigger value="quiz" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium">
                <HelpCircle className="w-4 h-4 mr-2" /> Knowledge Check
              </TabsTrigger>
            )}
            <TabsTrigger value="teacher" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium ml-auto">
              <GraduationCap className="w-4 h-4 mr-2" /> For Teachers
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="content" className="space-y-8 animate-in fade-in-50 duration-500 m-0">
              <div className="bg-card border rounded-2xl p-8 shadow-sm">
                <div className="prose dark:prose-invert max-w-none font-sans" dangerouslySetInnerHTML={{ __html: lesson.content || "<p>No content provided.</p>" }} />
              </div>

              {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h3 className="font-bold text-primary mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {lesson.objectives.map((obj, i) => (
                      <li key={i} className="flex gap-2 text-sm font-medium">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" /> {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="exercises" className="space-y-6 animate-in fade-in-50 duration-500 m-0">
              {exercisesLoading ? (
                <Skeleton className="h-64 w-full rounded-2xl" />
              ) : exercises?.map((exercise) => (
                <div key={exercise.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div>
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mr-2",
                        exercise.difficulty === "beginner" ? "bg-emerald-100 text-emerald-800" :
                        exercise.difficulty === "intermediate" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      )}>{exercise.difficulty}</span>
                      <span className="font-bold">{exercise.title}</span>
                    </div>
                    <span className="text-xs font-mono bg-background px-2 py-1 rounded border">{exercise.language}</span>
                  </div>
                  <div className="grid md:grid-cols-2 min-h-[300px] divide-y md:divide-y-0 md:divide-x">
                    <div className="p-6 bg-background space-y-4">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Instructions</h4>
                      <p className="text-sm leading-relaxed">{exercise.instructions}</p>
                    </div>
                    <div className="bg-[#1e1e1e] p-4 flex flex-col relative group">
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" className="h-7 text-xs rounded-md">Run Code</Button>
                      </div>
                      <pre className="text-gray-300 font-mono text-sm overflow-auto p-2 flex-1 outline-none font-medium" contentEditable suppressContentEditableWarning spellCheck={false}>
                        {exercise.starterCode}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="quiz" className="animate-in fade-in-50 duration-500 m-0">
              {quizLoading ? (
                <Skeleton className="h-64 w-full rounded-2xl" />
              ) : quiz ? (
                <div className="bg-card border rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" /> Lesson Quiz
                  </h3>
                  <div className="space-y-8">
                    {quiz.questions.map((q, i) => (
                      <div key={q.id} className="space-y-3">
                        <p className="font-medium"><span className="text-muted-foreground mr-2">{i + 1}.</span>{q.question}</p>
                        <div className="space-y-2 pl-6">
                          {q.options.map((opt, j) => (
                            <label key={j} className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-muted transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                              <input type="radio" name={`q-${q.id}`} className="mt-1" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full rounded-xl">Submit Answers</Button>
                  </div>
                </div>
              ) : (
                <p>No quiz available for this lesson.</p>
              )}
            </TabsContent>

            <TabsContent value="teacher" className="animate-in fade-in-50 duration-500 m-0">
              <div className="bg-card border rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Curriculum Alignment
                </h3>
                {mappings && mappings.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">This lesson satisfies the following specific curriculum expectations:</p>
                    <div className="grid gap-4">
                      {mappings.map(m => (
                        <div key={m.id} className="p-4 rounded-xl border bg-muted/20 flex gap-4 items-start">
                          <div className="px-2 py-1 bg-background border rounded font-mono text-xs font-bold shrink-0">{m.expectationCode}</div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{m.strand}</p>
                            <p className="text-sm">{m.expectationText}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specific curriculum mappings defined for this lesson yet.</p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
