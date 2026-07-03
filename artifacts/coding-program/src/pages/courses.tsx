import { useState } from "react";
import { useListCourses, getListCoursesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { BookOpen, Search, ArrowRight, PlayCircle, Code2, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-4xl font-bold font-heading">Course Library</h1>
          <p className="text-lg text-muted-foreground">Find the right path for your grade level and dive into learning.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses by title or language..." 
            className="pl-9 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-card border rounded-lg p-1 overflow-x-auto no-scrollbar shrink-0">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
          <FilterButton active={filter === "elementary"} onClick={() => setFilter("elementary")} className="hover:text-orange-600 active-bg:bg-orange-100">Grades 4-5</FilterButton>
          <FilterButton active={filter === "middle"} onClick={() => setFilter("middle")} className="hover:text-teal-600 active-bg:bg-teal-100">Grades 6-8</FilterButton>
          <FilterButton active={filter === "secondary"} onClick={() => setFilter("secondary")} className="hover:text-indigo-600 active-bg:bg-indigo-100">Grades 9-12</FilterButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6 h-64 flex flex-col">
              <Skeleton className="w-16 h-6 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-auto" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : filteredCourses?.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-card border border-dashed rounded-2xl">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredCourses?.map((course, i) => {
            const isElementary = course.gradeband === "elementary";
            const isMiddle = course.gradeband === "middle";
            const isSecondary = course.gradeband === "secondary";
            
            const bandColor = isElementary ? "text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30" : 
                              isMiddle ? "text-teal-700 bg-teal-100 border-teal-200 dark:text-teal-300 dark:bg-teal-900/30" : 
                              "text-indigo-700 bg-indigo-100 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/30";

            return (
              <Link 
                key={course.id} 
                href={`/courses/${course.id}`}
                className="group flex flex-col bg-card border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
              >
                {/* Course color accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ backgroundColor: course.color }}
                />

                <div className="flex items-start justify-between mb-4 mt-2">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border", bandColor)}>
                    Grade {course.grade}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {course.language.toLowerCase().includes('python') ? <Code2 className="w-4 h-4" /> :
                     course.language.toLowerCase().includes('scratch') ? <Cpu className="w-4 h-4" /> :
                     <Code2 className="w-4 h-4" />}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 font-heading group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <PlayCircle className="w-4 h-4 text-muted-foreground" />
                    {course.lessonCount} Lessons
                  </div>
                  <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
        active ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-muted/50",
        className
      )}
    >
      {children}
    </button>
  );
}
