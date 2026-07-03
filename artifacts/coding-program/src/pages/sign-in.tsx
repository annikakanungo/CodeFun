import { SignIn } from '@clerk/react';
import { Link } from 'wouter';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-amber-400/10" />
        </div>

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            <span className="font-medium">Back to code.fun</span>
          </Link>

          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Welcome<br />
            back,<br />
            <span className="text-amber-400">coder</span>
          </h1>

          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            Sign in to pick up where you left off. Your XP, badges, and projects are waiting.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-black text-violet-900 text-sm">XP</div>
              <div>
                <p className="text-white font-bold text-sm">Keep your streak alive</p>
                <p className="text-white/60 text-xs">Sign in daily to maintain your progress</p>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-amber-400 rounded-full" />
            </div>
            <p className="text-white/60 text-xs mt-2">300 XP to Level 4</p>
          </div>
        </div>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-violet-50/50">
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
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
          />
        </div>
      </div>
    </div>
  );
}
