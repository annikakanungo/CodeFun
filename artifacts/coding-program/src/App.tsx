import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';

import { Shell } from '@/components/layout/Shell';
import Home from '@/pages/home';
import Courses from '@/pages/courses';
import CourseDetail from '@/pages/course-detail';
import LessonDetail from '@/pages/lesson-detail';
import Projects from '@/pages/projects';
import TeacherHub from '@/pages/teacher';
import Progress from '@/pages/progress';
import SignUpPage from '@/pages/sign-up';
import SignInPage from '@/pages/sign-in';

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#7c3aed',
    colorForeground: '#1a0a2e',
    colorMutedForeground: '#6b7280',
    colorDanger: '#ef4444',
    colorBackground: '#ffffff',
    colorInput: '#f5f3ff',
    colorInputForeground: '#1a0a2e',
    colorNeutral: '#e5e7eb',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl shadow-violet-100',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#1a0a2e] font-black font-heading',
    headerSubtitle: 'text-[#6b7280]',
    socialButtonsBlockButtonText: 'text-[#1a0a2e] font-medium',
    formFieldLabel: 'text-[#1a0a2e] font-medium',
    footerActionLink: 'text-[#7c3aed] font-semibold hover:text-[#6d28d9]',
    footerActionText: 'text-[#6b7280]',
    dividerText: 'text-[#6b7280]',
    identityPreviewEditButton: 'text-[#7c3aed]',
    formFieldSuccessText: 'text-green-600',
    alertText: 'text-[#1a0a2e]',
    logoBox: 'mb-2',
    logoImage: 'h-10 w-auto',
    socialButtonsBlockButton: 'border border-[#e5e7eb] hover:bg-violet-50 transition-colors',
    formButtonPrimary: 'bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors font-bold',
    formFieldInput: 'bg-[#f5f3ff] border-[#e5e7eb] text-[#1a0a2e]',
    footerAction: 'bg-violet-50',
    dividerLine: 'bg-[#e5e7eb]',
    alert: 'bg-red-50 border-red-200',
    otpCodeFieldInput: 'border-[#e5e7eb] bg-[#f5f3ff]',
    formFieldRow: 'gap-3',
    main: 'gap-4',
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppRoutes() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/lessons/:id" component={LessonDetail} />
        <Route path="/projects" component={Projects} />
        <Route path="/teacher" component={TeacherHub} />
        <Route path="/progress/:studentId" component={Progress} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route component={AppRoutes} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
