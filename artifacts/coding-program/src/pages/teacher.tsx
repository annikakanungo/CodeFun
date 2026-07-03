import { useState } from "react";
import { useListTeacherPlans, getListTeacherPlansQueryKey } from "@workspace/api-client-react";
import { BookOpen, GraduationCap, CheckSquare, Target, Clock, Presentation } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TeacherHub() {
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);

  const { data: plans, isLoading } = useListTeacherPlans(
    { grade: selectedGrade },
    { query: { queryKey: getListTeacherPlansQueryKey({ grade: selectedGrade }) } }
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-slate-50 p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-700">
            <Presentation className="w-3 h-3" /> For Educators
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white">Teacher Hub</h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Ready-to-use lesson plans, assessment rubrics, and Ontario curriculum mappings to help you bring coding into your classroom.
          </p>
        </div>
        <div className="w-32 h-32 shrink-0 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
          <GraduationCap className="w-16 h-16 text-slate-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">Filter by Grade:</span>
        <FilterBtn active={selectedGrade === undefined} onClick={() => setSelectedGrade(undefined)}>All Grades</FilterBtn>
        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
          <FilterBtn key={g} active={selectedGrade === g} onClick={() => setSelectedGrade(g)}>Grade {g}</FilterBtn>
        ))}
      </div>

      {/* Plans List */}
      <div className="space-y-6 pt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : plans?.length === 0 ? (
          <div className="py-20 text-center border border-dashed rounded-3xl bg-muted/20">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No lesson plans found</h3>
            <p className="text-muted-foreground">Select a different grade or check back soon.</p>
          </div>
        ) : (
          plans?.map((plan) => (
            <div key={plan.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8 bg-muted/10 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full">Grade {plan.grade}</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Clock className="w-4 h-4" /> {plan.durationMinutes} min
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-heading text-foreground mb-2">{plan.title}</h2>
              </div>
              
              <div className="p-6 md:p-8">
                <Accordion type="multiple" className="w-full" defaultValue={["objectives"]}>
                  <AccordionItem value="objectives" className="border-none mb-4">
                    <AccordionTrigger className="bg-muted/30 px-4 py-3 rounded-lg hover:bg-muted/50 hover:no-underline font-bold">
                      <div className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Learning Objectives</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-4">
                      <ul className="space-y-3">
                        {plan.objectives.map((obj, i) => (
                          <li key={i} className="flex gap-3 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> {obj}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="activities" className="border-none mb-4">
                    <AccordionTrigger className="bg-muted/30 px-4 py-3 rounded-lg hover:bg-muted/50 hover:no-underline font-bold">
                      <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-500" /> Lesson Activities</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-4">
                      <ol className="space-y-4 list-decimal list-inside text-sm pl-2 marker:font-bold marker:text-muted-foreground">
                        {plan.activities.map((act, i) => (
                          <li key={i} className="pl-2 leading-relaxed">{act}</li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="assessment" className="border-none">
                    <AccordionTrigger className="bg-muted/30 px-4 py-3 rounded-lg hover:bg-muted/50 hover:no-underline font-bold">
                      <div className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-amber-500" /> Assessment Ideas</div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-4">
                      <ul className="space-y-3">
                        {plan.assessmentIdeas.map((idea, i) => (
                          <li key={i} className="flex gap-3 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /> {idea}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full shrink-0 transition-colors ${
        active 
          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" 
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );
}
