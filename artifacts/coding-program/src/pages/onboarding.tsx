import { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey, useSaveUserRole } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { GraduationCap, Presentation, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const queryClient = useQueryClient();

  const saveRole = useSaveUserRole();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation('/sign-up');
    }
  }, [isLoaded, isSignedIn, setLocation]);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    saveRole.mutate(
      {
        data: {
          role: selectedRole,
          displayName: user?.firstName ?? undefined
        }
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setLocation(selectedRole === 'teacher' ? '/teacher' : '/');
        }
      }
    );
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const roles = [
    {
      id: 'student' as const,
      title: "I'm a Student",
      description: "Learn to code with fun lessons, earn XP, and build real projects",
      icon: GraduationCap,
      color: "text-amber-400"
    },
    {
      id: 'teacher' as const,
      title: "I'm a Teacher",
      description: "Create lessons, share materials, and guide your students",
      icon: Presentation,
      color: "text-emerald-400"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-white/20">
      {/* Background decoration matching sign-up */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-amber-400/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/3" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-3xl font-black text-white font-heading tracking-tight">
            code<span className="text-amber-400">.</span>fun
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-lg mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white font-heading leading-tight mb-4 tracking-tight">
            Who are you?
          </h1>
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            We'll personalise your experience so you get exactly what you need.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6 w-full mb-12"
        >
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <motion.button
                key={role.id}
                variants={cardVariants}
                onClick={() => setSelectedRole(role.id)}
                whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative p-8 text-left rounded-[2rem] transition-all duration-300 border-2 overflow-hidden group",
                  isSelected 
                    ? "bg-white border-violet-400 shadow-2xl shadow-violet-900/50 scale-[1.02]" 
                    : "bg-white/10 border-white/10 hover:bg-white/15"
                )}
              >
                {isSelected && (
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-violet-600" />
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-lg",
                  isSelected ? "bg-violet-100" : "bg-white/10"
                )}>
                  <Icon className={cn("w-8 h-8", isSelected ? "text-violet-600" : role.color)} />
                </div>
                
                <h2 className={cn(
                  "text-2xl font-black font-heading tracking-tight mb-3 transition-colors duration-300",
                  isSelected ? "text-violet-950" : "text-white"
                )}>
                  {role.title}
                </h2>
                <p className={cn(
                  "text-base font-medium leading-relaxed transition-colors duration-300",
                  isSelected ? "text-slate-600" : "text-white/60"
                )}>
                  {role.description}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="h-20 w-full max-w-sm">
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full"
              >
                <Button 
                  onClick={handleContinue} 
                  disabled={saveRole.isPending}
                  className="w-full h-16 text-lg font-black rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-violet-950 shadow-xl shadow-amber-400/20 hover:shadow-amber-400/40 border-0"
                >
                  {saveRole.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Continue <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 text-sm font-semibold tracking-wide uppercase mt-8"
        >
          Free forever · No credit card
        </motion.p>
      </div>
    </div>
  );
}