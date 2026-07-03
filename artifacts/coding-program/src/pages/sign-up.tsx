import { SignUp } from '@clerk/react';
import { Link } from 'wouter';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-amber-400/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/3" />
        </div>

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            <span className="font-medium">Back to code.fun</span>
          </Link>

          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-semibold px-4 py-2 rounded-full tracking-wider uppercase">
              Free Forever
            </span>
          </div>

          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Start your<br />
            <span className="text-amber-400">coding</span><br />
            journey
          </h1>

          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            Join thousands of students in Grades 4–12 learning to build real things with code — completely free.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: '⚡', title: 'Grade 4–12 curriculum', desc: 'From Python basics to full-stack apps and AI' },
            { icon: '🏆', title: 'Earn XP and badges', desc: 'Level up as you complete lessons and projects' },
            { icon: '🚀', title: 'Real projects', desc: 'Build things you can actually show people' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 bg-white/10 rounded-2xl p-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-white font-bold">{item.title}</p>
                <p className="text-white/65 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-violet-50/50">
        {/* Mobile back link */}
        <div className="lg:hidden w-full max-w-sm mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-900 transition-colors font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <span className="text-3xl font-black text-violet-700">code<span className="text-amber-500">.</span>fun</span>
          </div>
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
          />
        </div>
      </div>
    </div>
  );
}
