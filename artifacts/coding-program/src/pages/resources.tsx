import { useState } from "react";
import { useListResources, getListResourcesQueryKey } from "@workspace/api-client-react";
import { Link, ExternalLink, Globe, Play, BookOpen, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-4xl font-bold font-heading">Free Resources</h1>
        <p className="text-lg text-muted-foreground">Curated tools, platforms, and guides to help you practice coding outside of structured lessons.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input 
          placeholder="Search resources..." 
          className="max-w-md bg-card border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap border transition-colors ${
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card hover:bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6 h-48 flex flex-col">
              <Skeleton className="w-12 h-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : filtered?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No resources found matching your search.
          </div>
        ) : (
          filtered?.map((resource) => {
            // Determine icon based on category/platform
            let Icon = Globe;
            if (resource.category.includes('video')) Icon = Play;
            if (resource.category.includes('book') || resource.category.includes('docs')) Icon = BookOpen;
            if (resource.category.includes('tool') || resource.platform === 'Scratch') Icon = Layers;

            return (
              <a 
                key={resource.id} 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col bg-card border rounded-2xl p-6 hover:border-primary/50 hover:shadow-md transition-all h-full relative"
              >
                {resource.isFree && (
                  <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Free</span>
                )}
                
                <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors flex items-start gap-2">
                  {resource.title} <ExternalLink className="w-3 h-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {resource.description}
                </p>
                
                <div className="flex items-center gap-2 mt-auto pt-4 border-t text-xs font-medium text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded capitalize">{resource.category}</span>
                  <span className="bg-muted px-2 py-1 rounded">Grades {resource.gradeMin}-{resource.gradeMax}</span>
                  {resource.platform && <span className="bg-muted px-2 py-1 rounded truncate max-w-[100px]">{resource.platform}</span>}
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
