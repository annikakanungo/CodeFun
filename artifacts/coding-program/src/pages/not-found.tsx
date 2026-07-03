import { Link } from "wouter";
import { BookOpen } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <BookOpen className="w-24 h-24 text-muted-foreground/30 mx-auto" />
        <h1 className="text-5xl font-black font-heading tracking-tight">404 - Lost in the void</h1>
        <p className="text-xl text-muted-foreground font-medium">This page doesn't exist.</p>
        <div className="pt-4">
          <Link href="/" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
