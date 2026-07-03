import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Shell } from '@/components/layout/Shell';
import Home from '@/pages/home';
import Courses from '@/pages/courses';
import CourseDetail from '@/pages/course-detail';
import LessonDetail from '@/pages/lesson-detail';
import Projects from '@/pages/projects';
import Resources from '@/pages/resources';
import TeacherHub from '@/pages/teacher';
import Progress from '@/pages/progress';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/lessons/:id" component={LessonDetail} />
        <Route path="/projects" component={Projects} />
        <Route path="/resources" component={Resources} />
        <Route path="/teacher" component={TeacherHub} />
        <Route path="/progress/:studentId" component={Progress} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
