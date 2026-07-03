import { useState } from "react";
import { useListProjects, useSubmitProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { ExternalLink, Code2, Sparkles, Rocket } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

export default function Projects() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: projects, isLoading, refetch } = useListProjects({}, {
    query: { queryKey: getListProjectsQueryKey({}) }
  });

  const submitProject = useSubmitProject();
  
  const form = useForm({
    defaultValues: {
      studentName: "",
      grade: 6,
      title: "",
      description: "",
      language: "Python",
      projectUrl: ""
    }
  });

  function onSubmit(data: any) {
    submitProject.mutate({ data: { ...data, grade: Number(data.grade) } }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        refetch();
        toast({ title: "Project Submitted!", description: "Your project is now in the showcase." });
      }
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <PageTransition className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-gradient-to-br from-indigo-900 to-violet-950 text-indigo-50 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-indigo-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-[#FFD700]">Hall of Fame</span>
          <h1 className="text-5xl font-black font-heading text-white tracking-tight">Student Showcase</h1>
          <p className="text-xl font-medium text-indigo-200/90 leading-relaxed max-w-xl">Real projects built by code.fun students. Get inspired and share what you've created with the world.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 rounded-2xl relative z-10 bg-gradient-to-r from-[#FFD700] to-orange-400 text-indigo-950 hover:opacity-90 font-black text-lg h-14 px-8 shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform gap-2">
              <Sparkles className="w-5 h-5 fill-indigo-950" /> Submit Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl border-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading">Share your creation</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="studentName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">First Name</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl font-medium" {...field} required /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="grade" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Grade</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl font-medium" type="number" min="4" max="12" {...field} required /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Project Title</FormLabel>
                    <FormControl><Input className="h-12 rounded-xl font-medium" placeholder="My Cool Game" {...field} required /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="language" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Language/Tool</FormLabel>
                    <FormControl><Input className="h-12 rounded-xl font-medium" placeholder="Python, Scratch, HTML..." {...field} required /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Description</FormLabel>
                    <FormControl><Textarea placeholder="What does it do? How did you build it?" className="resize-none rounded-xl font-medium p-4" rows={3} {...field} required /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="projectUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Link (Optional)</FormLabel>
                    <FormControl><Input className="h-12 rounded-xl font-medium" type="url" placeholder="https://scratch.mit.edu/..." {...field} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-14 rounded-xl text-lg font-black bg-primary text-white hover:bg-primary/90" disabled={submitProject.isPending}>
                  {submitProject.isPending ? "Submitting..." : "Submit Project"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div 
        className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="break-inside-avoid bg-card border-2 rounded-3xl p-8 mb-8">
              <Skeleton className="h-8 w-3/4 mb-4 rounded-lg" />
              <Skeleton className="h-20 w-full mb-6 rounded-xl" />
              <Skeleton className="h-6 w-1/2 rounded-md" />
            </div>
          ))
        ) : projects?.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-muted/20 border-2 border-dashed rounded-[3rem]">
            <Rocket className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-3xl font-black mb-3 tracking-tight">The hall is empty</h3>
            <p className="text-lg font-medium text-muted-foreground">Be the first to submit a project to the showcase!</p>
          </div>
        ) : (
          projects?.map((project) => (
            <motion.div variants={itemVariants} key={project.id} className="break-inside-avoid">
              <div className="bg-card border-2 rounded-[2rem] p-8 mb-8 hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 group-hover:rotate-0 duration-500">
                  <Code2 className="w-48 h-48" />
                </div>
                
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {project.language}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest border-2 px-3 py-1 rounded-lg bg-muted/50">
                    Grade {project.grade}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black font-heading mb-3 leading-tight relative z-10 tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-base font-medium text-muted-foreground mb-8 relative z-10 leading-relaxed">{project.description}</p>
                
                <div className="flex items-center justify-between pt-5 border-t-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-sm transform -rotate-3">
                      {project.studentName.charAt(0)}
                    </div>
                    <span className="text-sm font-black">{project.studentName}</span>
                  </div>
                  
                  {project.projectUrl ? (
                    <a href={project.projectUrl} target="_blank" rel="noreferrer" className="bg-muted hover:bg-primary hover:text-white text-foreground text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                      Play <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">
                      {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </PageTransition>
  );
}
