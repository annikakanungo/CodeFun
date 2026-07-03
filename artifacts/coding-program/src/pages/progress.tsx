import { useParams, Link } from "wouter";
import { useGetStudentProgress, getGetStudentProgressQueryKey } from "@workspace/api-client-react";
import { Trophy, Star, BookOpen, Clock, Activity, Code } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function Progress() {
  const { studentId } = useParams();
  const id = studentId || "demo-student";

  const { data: progress, isLoading } = useGetStudentProgress(id, {
    query: { enabled: !!id, queryKey: getGetStudentProgressQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl md:col-span-2" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!progress) {
    return <div className="p-10 text-center">Progress not found</div>;
  }

  const completionPercent = progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100) 
    : 0;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Student Card */}
      <div className="bg-card border-2 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-inner">
          <span className="text-4xl font-bold font-heading">{id.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold font-heading mb-2">My Profile</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {progress.currentGrade && (
              <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold uppercase tracking-wider">
                Grade {progress.currentGrade}
              </span>
            )}
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> Learner
            </span>
          </div>
        </div>
        <div className="shrink-0 w-full md:w-48">
          <div className="bg-muted/50 rounded-xl p-4 text-center border">
            <p className="text-3xl font-black text-primary mb-1">{progress.completedLessons}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lessons Finished</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Stats */}
        <div className="md:col-span-2 space-y-8">
          {/* Progress Bar */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Overall Progress
            </h2>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>{completionPercent}% Complete</span>
              <span className="text-muted-foreground">{progress.completedLessons} / {progress.totalLessons} Lessons</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            {completionPercent === 100 && (
              <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <Trophy className="w-4 h-4" /> Amazing work! You've completed all available lessons!
              </p>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Completions
            </h2>
            {progress.recentCompletions && progress.recentCompletions.length > 0 ? (
              <div className="space-y-4">
                {progress.recentCompletions.map((record) => (
                  <div key={record.id} className="flex gap-4 p-4 rounded-xl border bg-muted/20 items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">Lesson {record.lessonId}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(record.completedAt), { addSuffix: true })}
                      </p>
                    </div>
                    {record.score !== null && (
                      <div className="text-xs font-bold bg-muted px-2 py-1 rounded">Score: {record.score}%</div>
                    )}
                    <Link href={`/lessons/${record.lessonId}`} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                      <Code className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">Complete some lessons to see your activity here.</p>
            )}
          </div>
        </div>

        {/* Sidebar: Badges */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {progress.badges.length > 0 ? (
                progress.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2 shadow-inner">
                      <Star className="w-6 h-6 text-amber-600 dark:text-amber-400 fill-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200">{badge}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center p-6 border border-dashed rounded-xl bg-muted/20">
                  <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Keep learning to earn badges!</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
