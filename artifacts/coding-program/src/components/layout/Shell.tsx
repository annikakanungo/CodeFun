import { Link, useLocation } from "wouter";
import { BookOpen, Home, Code, Lightbulb, Presentation, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: Code },
  { href: "/resources", label: "Resources", icon: Lightbulb },
  { href: "/progress/demo-student", label: "My Progress", icon: Trophy },
  { href: "/teacher", label: "Teacher Hub", icon: Presentation },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Mobile Nav */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl font-heading text-primary">
          <Code className="w-6 h-6" />
          code.fun
        </Link>
      </header>

      {/* Sidebar Nav */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card shrink-0 sticky top-0 h-[100dvh] p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-heading text-primary mb-8 px-2">
          <Code className="w-8 h-8" />
          code.fun
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? location === "/" : location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 border-t">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grade Band</p>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" title="Elementary (4-5)" />
              <div className="w-3 h-3 rounded-full bg-teal-500" title="Middle (6-8)" />
              <div className="w-3 h-3 rounded-full bg-indigo-600" title="Secondary (9-12)" />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around p-2 z-50">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
