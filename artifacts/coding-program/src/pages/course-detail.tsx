import { useParams, Link } from "wouter";
import { useGetCourse, useGetCourseLessons, getGetCourseQueryKey, getGetCourseLessonsQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, BookOpen, Clock, PlayCircle, CheckCircle2, Video, Code, HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <Link href="/courses" className="text-primary hover:underline">Return to Courses</Link>
      </div>
    );
  }

  const isElementary = course.gradeband === "elementary";
  const isMiddle = course.gradeband === "middle";
  
  const bandColor = isElementary ? "text-orange-700 bg-orange-100 border-orange-200" : 
                    isMiddle ? "text-teal-700 bg-teal-100 border-teal-200" : 
                    "text-indigo-700 bg-indigo-100 border-indigo-200";

  return (
    <div className="pb-20">
      {/* Course Header */}
      <div 
        className="pt-10 pb-16 px-6 md:px-10 border-b relative overflow-hidden text-white"
        style={{ backgroundColor: course.color || 'var(--primary)' }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-white/20 border-white/30 text-white shadow-sm")}>
              Grade {course.grade}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-black/30 text-white">
              {course.language}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight">{course.title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Curriculum
              </h2>
              <div className="space-y-4">
                {lessonsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
                ) : lessons?.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">Lessons are being developed for this course.</p>
                ) : (
                  lessons?.map((lesson, index) => (
                    <Link 
                      key={lesson.id} 
                      href={`/lessons/${lesson.id}`}
                      className="group flex gap-4 p-4 rounded-xl border bg-background hover:border-primary/50 hover:shadow-md transition-all block relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted group-hover:bg-primary transition-colors" />
                      
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} min
                          </span>
                          {lesson.hasVideo && (
                            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Video className="w-3.5 h-3.5" /> Video
                            </span>
                          )}
                          {lesson.hasExercises && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Code className="w-3.5 h-3.5" /> Code
                            </span>
                          )}
                          {lesson.hasQuiz && (
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <HelpCircle className="w-3.5 h-3.5" /> Quiz
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold font-heading mb-4">What you'll learn</h3>
              <ul className="space-y-3">
                {course.objectives?.map((obj, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
                {(!course.objectives || course.objectives.length === 0) && (
                  <li className="text-sm text-muted-foreground">Specific objectives coming soon.</li>
                )}
              </ul>
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 border border-dashed">
              <h3 className="font-bold font-heading mb-2">Teacher Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Teaching this in class? Access full lesson plans, curriculum mappings, and assessment ideas.
              </p>
              <Link href="/teacher" className="text-sm font-bold text-primary hover:underline">
                Go to Teacher Hub &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
