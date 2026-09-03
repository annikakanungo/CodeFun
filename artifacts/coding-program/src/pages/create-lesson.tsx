import { useState } from 'react';
import { useUser } from '@clerk/react';
import { useGetMe, getGetMeQueryKey, useTeacherCreateLesson, useListCourses, getListCoursesQueryKey } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, type Variants } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Plus, X, BookOpen, Target, GraduationCap, Lightbulb, Lock, Loader2, Check } from 'lucide-react';
import { useLocation } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateLesson() {
  const { isLoaded, isSignedIn } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: me, isLoading: meLoading, isError: meFailed, error: meError } = useGetMe({
    query: { enabled: isSignedIn, queryKey: getGetMeQueryKey() } 
  });

  const { data: courses, isLoading: coursesLoading } = useListCourses({}, { 
    query: { enabled: isSignedIn, queryKey: getListCoursesQueryKey() } 
  });

  const createLesson = useTeacherCreateLesson();

  const [courseId, setCourseId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [content, setContent] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['']);

  const addObjective = () => setObjectives([...objectives, '']);
  const updateObjective = (index: number, val: string) => setObjectives(objectives.map((o, i) => i === index ? val : o));
  const removeObjective = (index: number) => setObjectives(objectives.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) return;

    createLesson.mutate(
      {
        data: {
          courseId: Number(courseId),
          title,
          description: description || undefined,
          content: content || undefined,
          objectives: objectives.filter(o => o.trim() !== ''),
          durationMinutes: durationMinutes ? Number(durationMinutes) : 45,
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Lesson Published", description: "Your new lesson is live and ready for students." });
          setLocation(`/courses/${courseId}`);
        },
        onError: (error) => {
          toast({
            title: "Could not publish lesson",
            description: error instanceof Error ? error.message : "Please finish teacher setup and try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  // Auth Guards
  if (isLoaded && !isSignedIn) {
    return (
      <PageTransition className="flex-1 flex flex-col items-center justify-center p-6 min-h-[80vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-violet-100 dark:border-violet-900/50 p-10 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-amber-400" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-300">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black font-heading mb-4 text-violet-950 dark:text-white tracking-tight">Teachers Only</h2>
          <p className="text-muted-foreground mb-10 font-medium text-lg leading-relaxed">
            Please sign in to your teacher account to create and manage lessons.
          </p>
          <Button onClick={() => setLocation('/sign-in')} className="w-full h-14 text-lg font-black rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-violet-950 hover:opacity-90 shadow-xl shadow-amber-200/50 border-0">
            Sign In
          </Button>
        </motion.div>
      </PageTransition>
    );
  }

  if (meLoading || !isLoaded) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 min-h-screen">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-80 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (meFailed && meError?.status !== 404) {
    return (
      <PageTransition className="flex-1 flex flex-col items-center justify-center p-6 min-h-[80vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-rose-100 dark:border-rose-900/50 p-10 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 to-orange-500" />
          <h2 className="text-3xl font-black font-heading mb-4 text-violet-950 dark:text-white tracking-tight">We couldn't verify your account</h2>
          <p className="text-muted-foreground mb-10 font-medium text-lg leading-relaxed">
            Please refresh the page and try again. If the problem continues, sign out and sign back in.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full h-14 text-lg font-black rounded-2xl bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200 border-0">
            Refresh
          </Button>
        </motion.div>
      </PageTransition>
    );
  }

  if (!me) {
    return (
      <PageTransition className="flex-1 flex flex-col items-center justify-center p-6 min-h-[80vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-amber-100 dark:border-amber-900/50 p-10 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-300">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black font-heading mb-4 text-violet-950 dark:text-white tracking-tight">Finish teacher setup</h2>
          <p className="text-muted-foreground mb-10 font-medium text-lg leading-relaxed">
            Choose “I’m a Teacher” during account setup before publishing lessons.
          </p>
          <Button onClick={() => setLocation('/onboarding')} className="w-full h-14 text-lg font-black rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-violet-950 hover:opacity-90 shadow-xl shadow-amber-200/50 border-0">
            Set up teacher account
          </Button>
        </motion.div>
      </PageTransition>
    );
  }

  if (me.role !== 'teacher') {
    return (
      <PageTransition className="flex-1 flex flex-col items-center justify-center p-6 min-h-[80vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-violet-100 dark:border-violet-900/50 p-10 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-300">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black font-heading mb-4 text-violet-950 dark:text-white tracking-tight">This area is for teachers</h2>
          <p className="text-muted-foreground mb-10 font-medium text-lg leading-relaxed">
            It looks like you're signed in as a student. Head back home to continue your coding quest.
          </p>
          <Button onClick={() => setLocation('/')} className="w-full h-14 text-lg font-black rounded-2xl bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200 border-0">
            Back to Dashboard
          </Button>
        </motion.div>
      </PageTransition>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.3 } }
  };

  return (
    <PageTransition className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <div className="mb-10 flex items-center gap-4">
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground">Create a Lesson</h1>
        <span className="bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm mt-2">
          Teacher Only
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form Column */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basics Section */}
            <motion.div variants={itemVariants} className="bg-card rounded-[2rem] p-8 border-2 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8 pb-5 border-b-2">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-2xl font-black font-heading tracking-tight">1. Lesson Basics</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold mb-2 block text-slate-700 dark:text-slate-300">Select Course <span className="text-destructive">*</span></label>
                  <Select value={courseId} onValueChange={setCourseId} required disabled={coursesLoading}>
                    <SelectTrigger className="h-14 rounded-2xl border-2 px-4 shadow-sm">
                      <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Choose a course..."} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      {courses?.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()} className="font-medium rounded-lg">
                          <span className="font-bold text-foreground">{c.title}</span> 
                          <span className="text-muted-foreground ml-2 text-xs uppercase tracking-wider font-bold">Grade {c.grade}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block text-slate-700 dark:text-slate-300">Lesson Title <span className="text-destructive">*</span></label>
                  <Input className="h-14 rounded-2xl border-2 px-4 shadow-sm text-base font-medium" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Introduction to Python Functions" required />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block text-slate-700 dark:text-slate-300">Description</label>
                  <Textarea className="rounded-2xl border-2 p-4 shadow-sm text-base font-medium resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="A short, catchy summary of what students will learn" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block text-slate-700 dark:text-slate-300">Duration (minutes)</label>
                  <Input type="number" className="h-14 rounded-2xl border-2 px-4 shadow-sm text-base font-medium w-full md:w-1/3" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} />
                </div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div variants={itemVariants} className="bg-card rounded-[2rem] p-8 border-2 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8 pb-5 border-b-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black font-heading tracking-tight">2. Written Lesson</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold mb-2 block text-slate-700 dark:text-slate-300">Lesson Text</label>
                  <Textarea className="rounded-2xl border-2 p-5 shadow-sm text-base font-medium min-h-[300px] leading-relaxed" value={content} onChange={e => setContent(e.target.value)} placeholder="Welcome to this lesson!&#10;&#10;Explain one idea at a time. Add a short example, then tell students what to try." />
                  <p className="text-xs text-muted-foreground mt-3 font-semibold flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Use short paragraphs, clear headings, examples, and simple instructions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Objectives Section */}
            <motion.div variants={itemVariants} className="bg-card rounded-[2rem] p-8 border-2 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8 pb-5 border-b-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-black font-heading tracking-tight">3. Learning Objectives</h2>
              </div>
              <div className="space-y-4">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent flex items-center justify-center font-black text-sm text-slate-500 shrink-0">
                      {i + 1}
                    </div>
                    <Input className="h-14 rounded-2xl border-2 px-4 shadow-sm text-base font-medium flex-1" value={obj} onChange={e => updateObjective(i, e.target.value)} placeholder="e.g. Understand how to declare a variable" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeObjective(i)} className="w-12 h-12 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" disabled={objectives.length === 1 && !objectives[0]}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addObjective} className="rounded-2xl border-2 border-dashed h-14 w-full mt-6 font-bold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 shadow-sm">
                  <Plus className="w-5 h-5 mr-2" /> Add Objective
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" disabled={createLesson.isPending || !courseId || !title} className="w-full h-16 text-lg font-black rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-violet-950 shadow-xl shadow-amber-400/20 hover:shadow-amber-400/40 hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100 border-0 mt-4">
                {createLesson.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publish Lesson"}
              </Button>
            </motion.div>

          </form>
        </motion.div>

        {/* Tips Column */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-900 rounded-[2.5rem] p-8 border border-violet-100 dark:border-slate-700 shadow-xl sticky top-24">
            <div className="w-14 h-14 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center shadow-md mb-6 border border-violet-100 dark:border-slate-800">
              <Lightbulb className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black font-heading mb-6 text-violet-950 dark:text-white tracking-tight">Pro Tips</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block mb-1">Be Specific</strong>
                  Keep objectives measurable. Start with action verbs like "Build", "Understand", or "Identify".
                </p>
              </li>
              <li className="flex gap-4">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block mb-1">Bite-sized Chunks</strong>
                  Break down content into short, readable paragraphs. Use headings to organize.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white block mb-1">Easy to Follow</strong>
                  Explain one idea at a time and give students a small task they can try right away.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}