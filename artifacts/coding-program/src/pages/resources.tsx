import { useState } from "react";
import { useListResources, getListResourcesQueryKey } from "@workspace/api-client-react";
import { ExternalLink, Globe, Play, BookOpen, Layers, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Resources() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: resources, isLoading } = useListResources({}, {
    query: { queryKey: getListResourcesQueryKey({}) }
  });

  const categories = ["all", ...new Set(resources?.map(r => r.category) || [])];

  const filtered = resources?.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <div className="max-w-2xl space-y-3">
        <span className="text-[#a855f7] font-black uppercase tracking-widest text-sm bg-[#a855f7]/10 px-4 py-1.5 rounded-full inline-block">Extra Loot</span>
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight">Free Tools & Tutorials</h1>
        <p className="text-lg font-medium text-muted-foreground leading-relaxed">Curated tools, platforms, and guides to help you practice coding outside of structured lessons.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-card border-2 p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search loot..." 
            className="pl-11 h-12 bg-muted/50 border-none rounded-xl text-base font-medium shadow-none focus-visible:ring-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border-2 rounded-3xl p-8 h-56 flex flex-col">
              <Skeleton className="w-14 h-14 rounded-2xl mb-5" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : filtered?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-card border-2 border-dashed rounded-[3rem]">
            <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl font-bold text-muted-foreground">No resources found matching your search.</p>
          </div>
        ) : (
          filtered?.map((resource) => {
            let Icon = Globe;
            if (resource.category.includes('video')) Icon = Play;
            if (resource.category.includes('book') || resource.category.includes('docs')) Icon = BookOpen;
            if (resource.category.includes('tool') || resource.platform === 'Scratch') Icon = Layers;

            return (
              <motion.a 
                variants={itemVariants}
                key={resource.id} 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col bg-card border-2 rounded-3xl p-8 hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full relative hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                
                {resource.isFree && (
                  <span className="absolute top-6 right-6 bg-[#22c55e]/10 text-[#16a34a] border border-[#22c55e]/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-sm">Free</span>
                )}
                
                <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary text-muted-foreground group-hover:text-white transition-colors mb-6 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-rotate-3">
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors flex items-start gap-2 tracking-tight leading-tight">
                  {resource.title} <ExternalLink className="w-4 h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                
                <p className="text-sm font-medium text-muted-foreground mb-8 flex-1 leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="flex items-center gap-2 mt-auto pt-5 border-t-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span className="bg-muted px-2.5 py-1.5 rounded-md">{resource.category}</span>
                  <span className="bg-muted px-2.5 py-1.5 rounded-md">Grades {resource.gradeMin}-{resource.gradeMax}</span>
                  {resource.platform && <span className="bg-muted px-2.5 py-1.5 rounded-md truncate max-w-[100px]">{resource.platform}</span>}
                </div>
              </motion.a>
            );
          })
        )}
      </motion.div>
    </PageTransition>
  );
}
