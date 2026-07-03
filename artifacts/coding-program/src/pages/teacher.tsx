import { useState } from "react";
import { useListTeacherPlans, getListTeacherPlansQueryKey } from "@workspace/api-client-react";
import { BookOpen, GraduationCap, CheckSquare, Target, Clock, Presentation, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TeacherHub() {
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);

  const { data: plans, isLoading } = useListTeacherPlans(
    { grade: selectedGrade },
    { query: { queryKey: getListTeacherPlansQueryKey({ grade: selectedGrade }) } }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-[#1e0a3c] text-slate-50 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 blur-2xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20 shadow-sm">
            <Presentation className="w-4 h-4" /> For Educators
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-heading text-white tracking-tight">Teacher Hub</h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-xl">
            Ready-to-use lesson plans, assessment rubrics, and curriculum mappings to help you bring coding into your classroom.
          </p>
        </div>
        <div className="w-40 h-40 shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
          <GraduationCap className="w-20 h-20 text-[#FFD700] fill-[#FFD700]/20" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground mr-2 shrink-0">Filter Grade:</span>
        <FilterBtn active={selectedGrade === undefined} onClick={() => setSelectedGrade(undefined)}>All</FilterBtn>
        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
          <FilterBtn key={g} active={selectedGrade === g} onClick={() => setSelectedGrade(g)}>G{g}</FilterBtn>
        ))}
      </div>

      {/* Plans List */}
      <div className="space-y-8 pt-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border-2 rounded-3xl p-8">
              <Skeleton className="h-10 w-1/3 mb-5" />
              <Skeleton className="h-5 w-full mb-3" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))
        ) : plans?.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-[3rem] bg-muted/20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-3xl font-black tracking-tight mb-2">No plans found</h3>
            <p className="text-lg text-muted-foreground font-medium">Select a different grade or check back soon.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            {plans?.map((plan) => (
              <motion.div variants={itemVariants} key={plan.id} className="bg-card border-2 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="p-8 md:p-10 bg-muted/30 border-b-2">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm">Grade {plan.grade}</span>
                    <span className="flex items-center gap-1.5 text-sm font-black text-slate-500 uppercase tracking-widest">
                      <Clock className="w-4 h-4" /> {plan.durationMinutes} min
                    </span>
                  </div>
                  <h2 className="text-3xl font-black font-heading text-foreground tracking-tight">{plan.title}</h2>
                </div>
                
                <div className="p-8 md:p-10 bg-card">
                  <Accordion type="multiple" className="w-full" defaultValue={["objectives"]}>
                    <AccordionItem value="objectives" className="border-none mb-6">
                      <AccordionTrigger className="bg-muted/50 px-6 py-4 rounded-xl hover:bg-muted hover:no-underline font-black text-lg">
                        <div className="flex items-center gap-3"><Target className="w-6 h-6 text-primary" /> Learning Objectives</div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-6 px-6">
                        <ul className="space-y-4">
                          {plan.objectives.map((obj, i) => (
                            <li key={i} className="flex gap-4 text-base font-medium leading-relaxed">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" /> {obj}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="activities" className="border-none mb-6">
                      <AccordionTrigger className="bg-muted/50 px-6 py-4 rounded-xl hover:bg-muted hover:no-underline font-black text-lg">
                        <div className="flex items-center gap-3"><BookOpen className="w-6 h-6 text-emerald-500" /> Lesson Activities</div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-6 px-6">
                        <ol className="space-y-6 list-decimal list-inside text-base font-medium pl-2 marker:font-black marker:text-emerald-500">
                          {plan.activities.map((act, i) => (
                            <li key={i} className="pl-3 leading-relaxed">{act}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="assessment" className="border-none">
                      <AccordionTrigger className="bg-muted/50 px-6 py-4 rounded-xl hover:bg-muted hover:no-underline font-black text-lg">
                        <div className="flex items-center gap-3"><CheckSquare className="w-6 h-6 text-amber-500" /> Assessment Ideas</div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-6 px-6">
                        <ul className="space-y-4">
                          {plan.assessmentIdeas.map((idea, i) => (
                            <li key={i} className="flex gap-4 text-base font-medium leading-relaxed">
                              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" /> {idea}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

function FilterBtn({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-2.5 text-sm font-black uppercase tracking-widest rounded-xl shrink-0 transition-all",
        active 
          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md" 
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
