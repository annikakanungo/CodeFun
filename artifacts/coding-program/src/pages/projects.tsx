import { useState } from "react";
import { useListProjects, useSubmitProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { ExternalLink, Code2, Sparkles, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

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

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-indigo-900 text-indigo-50 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <h1 className="text-4xl font-bold font-heading text-white">Student Showcase</h1>
          <p className="text-lg text-indigo-200">Real projects built by code.fun students. Get inspired and share what you've created.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 rounded-xl relative z-10 bg-white text-indigo-900 hover:bg-indigo-50 font-bold gap-2">
              <Sparkles className="w-4 h-4" /> Submit Your Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share your project</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="studentName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input {...field} required /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="grade" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <FormControl><Input type="number" min="4" max="12" {...field} required /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl><Input placeholder="My Cool Game" {...field} required /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="language" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language/Tool</FormLabel>
                    <FormControl><Input placeholder="Python, Scratch, HTML..." {...field} required /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="What does it do? How did you build it?" className="resize-none" rows={3} {...field} required /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="projectUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link (Optional)</FormLabel>
                    <FormControl><Input type="url" placeholder="https://scratch.mit.edu/..." {...field} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={submitProject.isPending}>
                  {submitProject.isPending ? "Submitting..." : "Submit Project"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pt-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="break-inside-avoid bg-card border rounded-2xl p-6 mb-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : projects?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-muted-foreground">Be the first to submit a project to the showcase!</p>
          </div>
        ) : (
          projects?.map((project) => (
            <div key={project.id} className="break-inside-avoid bg-card border rounded-2xl p-6 mb-6 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Code2 className="w-16 h-16" />
              </div>
              
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                  {project.language}
                </span>
                <span className="text-xs text-muted-foreground font-medium border px-2 py-0.5 rounded bg-muted/50">
                  Grade {project.grade}
                </span>
              </div>
              
              <h3 className="text-xl font-bold font-heading mb-2 leading-tight relative z-10">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 relative z-10">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {project.studentName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{project.studentName}</span>
                </div>
                
                {project.projectUrl ? (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
