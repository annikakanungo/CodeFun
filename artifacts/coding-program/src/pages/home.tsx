import { useGetProgramStats, useGetRecentActivity, getGetProgramStatsQueryKey, getGetRecentActivityQueryKey } from "@workspace/api-client-react";
import { Code, BookOpen, Trophy, ArrowRight, Activity, Users } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetProgramStats({
    query: { queryKey: getGetProgramStatsQueryKey() },
  });

  const { data: activities, isLoading: activityLoading } = useGetRecentActivity({ limit: 5 }, {
    query: { queryKey: getGetRecentActivityQueryKey({ limit: 5 }) },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-12 shadow-xl shadow-primary/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight">
            Learn to build <br/> real things with code.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-medium">
            From your first block of code in Grade 4 to deploying full apps in Grade 12. 
            CodePath is your free, open path to mastering software.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/courses" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Start Learning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 bg-primary-foreground/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-foreground/30 transition-colors">
              See Student Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Grade Progression Journey */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-heading">Your Coding Journey</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Elementary */}
          <div className="relative p-6 rounded-2xl border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-100 dark:bg-orange-900/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs font-bold mb-4 tracking-wider uppercase">Grades 4-5</span>
              <h3 className="text-xl font-bold mb-2">Elementary</h3>
              <p className="text-muted-foreground text-sm mb-4">Discover the magic of code. Learn the logic of programming through visual blocks and interactive puzzles.</p>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Visual Logic</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Algorithms</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Creative Coding</li>
              </ul>
            </div>
          </div>

          {/* Middle */}
          <div className="relative p-6 rounded-2xl border-2 border-teal-200 bg-teal-50/50 dark:bg-teal-950/20 overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-100 dark:bg-teal-900/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-xs font-bold mb-4 tracking-wider uppercase">Grades 6-8</span>
              <h3 className="text-xl font-bold mb-2">Middle School</h3>
              <p className="text-muted-foreground text-sm mb-4">Write real syntax. Build websites, script simple games, and start thinking like a software engineer.</p>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Python Basics</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> HTML/CSS</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Interactive Scripts</li>
              </ul>
            </div>
          </div>

          {/* Secondary */}
          <div className="relative p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-bold mb-4 tracking-wider uppercase">Grades 9-12</span>
              <h3 className="text-xl font-bold mb-2">Secondary</h3>
              <p className="text-muted-foreground text-sm mb-4">Build for the real world. Master web development, work with APIs, and ship actual software.</p>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> JavaScript/React</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> API Integration</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> App Deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-heading">Program Impact</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={BookOpen} label="Courses" value={stats?.totalCourses} isLoading={statsLoading} />
            <StatCard icon={Code} label="Lessons" value={stats?.totalLessons} isLoading={statsLoading} />
            <StatCard icon={Users} label="Students" value={stats?.totalStudents} isLoading={statsLoading} />
            <StatCard icon={Trophy} label="Projects" value={stats?.totalProjects} isLoading={statsLoading} />
          </div>
          
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Students by Grade</h3>
            {statsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="flex items-end gap-2 h-40 pt-4">
                {stats?.gradeBreakdown?.map((b) => {
                  const maxCount = Math.max(...(stats.gradeBreakdown?.map(x => x.studentCount) || [1]));
                  const heightPercentage = Math.max((b.studentCount / maxCount) * 100, 5);
                  
                  let barColor = "bg-primary";
                  if (b.grade >= 4 && b.grade <= 5) barColor = "bg-orange-400";
                  if (b.grade >= 6 && b.grade <= 8) barColor = "bg-teal-400";
                  if (b.grade >= 9 && b.grade <= 12) barColor = "bg-indigo-500";

                  return (
                    <div key={b.grade} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="absolute -top-8 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {b.studentCount}
                      </div>
                      <div 
                        className={cn("w-full rounded-t-sm transition-all duration-500 group-hover:brightness-110", barColor)}
                        style={{ height: `${heightPercentage}%` }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">G{b.grade}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Recent Activity
          </h2>
          <div className="bg-card border rounded-2xl p-6 space-y-6">
            {activityLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : activities?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent activity.</p>
            ) : (
              activities?.map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-border last:before:hidden">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-background z-10",
                    activity.type === "project_submitted" ? "border-indigo-500 text-indigo-500" :
                    activity.type === "badge_earned" ? "border-amber-500 text-amber-500" :
                    "border-teal-500 text-teal-500"
                  )}>
                    {activity.type === "project_submitted" ? <Code className="w-4 h-4" /> :
                     activity.type === "badge_earned" ? <Trophy className="w-4 h-4" /> :
                     <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activity.studentName ? <span className="font-bold">{activity.studentName}</span> : "A student"}
                      {" "}{activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Grade {activity.grade}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, isLoading }: { icon: any, label: string, value?: number, isLoading: boolean }) {
  return (
    <div className="bg-card border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <div className="text-2xl font-bold font-heading">{value || 0}</div>
      )}
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}
