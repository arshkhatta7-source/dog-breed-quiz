import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { breeds } from "../data/breeds";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, GitCompareArrows } from "lucide-react";
import { useCompare } from "../context/CompareContext";

type SizeFilter = "all" | "Small" | "Medium" | "Large" | "Giant";
type EnergyFilter = "all" | "Low" | "Moderate" | "High" | "Very High";
type HypoFilter = "all" | "yes" | "no";
type BeginnerFilter = "all" | "yes" | "no";
type CategoryFilter = "all" | "purebred" | "designer" | "protection";

const DESIGNER_IDS = new Set([
  "goldendoodle","labradoodle","cockapoo","cavapoo","bernedoodle",
  "aussiedoodle","pomsky","morkie","maltipoo","sheepadoodle",
  "schnoodle","yorkipoo","puggle","shorkie","cavachon",
]);

function getCategory(id: string, isProtection: boolean): CategoryFilter {
  if (isProtection) return "protection";
  if (DESIGNER_IDS.has(id)) return "designer";
  return "purebred";
}

export default function BrowseBreeds() {
  const [, setLocation] = useLocation();
  const { compareIds, toggleCompare, isInCompare, clearCompare } = useCompare();
  const [search, setSearch] = useState("");
  const [size, setSize] = useState<SizeFilter>("all");
  const [energy, setEnergy] = useState<EnergyFilter>("all");
  const [hypo, setHypo] = useState<HypoFilter>("all");
  const [beginner, setBeginner] = useState<BeginnerFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    return breeds.filter(b => {
      if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (size !== "all" && b.size !== size) return false;
      if (energy !== "all" && b.exercise !== energy) return false;
      if (hypo === "yes" && b.hypoallergenic < 2) return false;
      if (hypo === "no" && b.hypoallergenic >= 2) return false;
      if (beginner === "yes" && !b.beginnerFriendly) return false;
      if (beginner === "no" && b.beginnerFriendly) return false;
      if (category !== "all" && getCategory(b.id, b.isProtectionBreed) !== category) return false;
      return true;
    });
  }, [search, size, energy, hypo, beginner, category]);

  const hasFilters = search || size !== "all" || energy !== "all" || hypo !== "all" || beginner !== "all" || category !== "all";

  const clearAll = () => {
    setSearch("");
    setSize("all");
    setEnergy("all");
    setHypo("all");
    setBeginner("all");
    setCategory("all");
  };

  function FilterChip<T extends string>({
    value, current, onClick, label,
  }: { value: T; current: T; onClick: (v: T) => void; label: string }) {
    const active = value === current;
    return (
      <button
        onClick={() => onClick(value)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
          active
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
        }`}
        data-testid={`filter-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4 pb-32">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
              Browse All Breeds
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore all 120 breeds or filter down to find your perfect match.
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by breed name..."
            className="pl-10 pr-10 h-12 text-base rounded-full border-2 focus-visible:ring-primary"
            data-testid="breed-search-input"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              data-testid="breed-search-clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {(["all","purebred","designer","protection"] as CategoryFilter[]).map(v => (
                <FilterChip key={v} value={v} current={category} onClick={setCategory}
                  label={v === "all" ? "All" : v === "purebred" ? "Purebred" : v === "designer" ? "Designer / Mixed" : "Protection"} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {(["all","Small","Medium","Large","Giant"] as SizeFilter[]).map(v => (
                <FilterChip key={v} value={v} current={size} onClick={setSize}
                  label={v === "all" ? "Any size" : v} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Energy Level</p>
            <div className="flex flex-wrap gap-2">
              {(["all","Low","Moderate","High","Very High"] as EnergyFilter[]).map(v => (
                <FilterChip key={v} value={v} current={energy} onClick={setEnergy}
                  label={v === "all" ? "Any energy" : v} />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hypoallergenic</p>
              <div className="flex gap-2">
                {(["all","yes","no"] as HypoFilter[]).map(v => (
                  <FilterChip key={v} value={v} current={hypo} onClick={setHypo}
                    label={v === "all" ? "Any" : v === "yes" ? "Yes" : "No"} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Beginner Friendly</p>
              <div className="flex gap-2">
                {(["all","yes","no"] as BeginnerFilter[]).map(v => (
                  <FilterChip key={v} value={v} current={beginner} onClick={setBeginner}
                    label={v === "all" ? "Any" : v === "yes" ? "Yes" : "No"} />
                ))}
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="pt-1 border-t border-border">
              <button
                onClick={clearAll}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                data-testid="filter-clear-all"
              >
                <X className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground font-medium">
            {filtered.length} breed{filtered.length !== 1 ? "s" : ""} found
          </p>
          <Button asChild size="sm" className="rounded-full" data-testid="browse-take-quiz-cta">
            <Link href="/quiz">Take the Quiz Instead</Link>
          </Button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-semibold text-foreground mb-2">No breeds match your filters</p>
            <p className="text-muted-foreground mb-6">Try adjusting or clearing your filters.</p>
            <Button variant="outline" onClick={clearAll} className="rounded-full">Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((breed, i) => {
              const selected = isInCompare(breed.id);
              const maxReached = compareIds.length >= 3 && !selected;

              return (
                <motion.div
                  key={breed.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.4) }}
                >
                  <div
                    className={`group bg-card border-2 rounded-2xl overflow-hidden transition-all duration-200 h-full flex flex-col ${
                      selected
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    }`}
                    data-testid={`breed-grid-card-${breed.id}`}
                  >
                    <Link href={`/breed/${breed.id}`} className="block">
                      <div className="relative h-44 bg-muted overflow-hidden shrink-0">
                        <img
                          src={breed.imageUrl}
                          alt={breed.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://place.dog/300/200";
                          }}
                        />
                        {breed.isProtectionBreed && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                            Guard
                          </div>
                        )}
                        {breed.beginnerFriendly && !breed.isProtectionBreed && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                            Beginner OK
                          </div>
                        )}
                        {selected && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                            ✓ Comparing
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/breed/${breed.id}`}>
                        <h3 className="font-bold text-foreground text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                          {breed.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {breed.tagline}
                        </p>
                      </Link>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">{breed.size}</Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">{breed.exercise}</Badge>
                        {breed.hypoallergenic >= 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 text-teal-700 border-teal-300 bg-teal-50">
                            Hypo
                          </Badge>
                        )}
                      </div>

                      <button
                        onClick={() => toggleCompare(breed.id)}
                        disabled={maxReached}
                        className={`mt-auto w-full text-sm font-medium py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 ${
                          selected
                            ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                            : maxReached
                            ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            : "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                        }`}
                        data-testid={`compare-toggle-${breed.id}`}
                      >
                        <GitCompareArrows className="h-3.5 w-3.5" />
                        {selected ? "Remove from compare" : maxReached ? "Max 3 breeds" : "Add to compare"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating compare bar */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-primary/30 shadow-xl"
            data-testid="compare-floating-bar"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  Comparing {compareIds.length}/3:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {compareIds.map(id => {
                    const b = breeds.find(br => br.id === id);
                    if (!b) return null;
                    return (
                      <div key={id} className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full pl-2 pr-1 py-1">
                        <span className="text-sm font-medium text-foreground">{b.name}</span>
                        <button
                          onClick={() => toggleCompare(id)}
                          className="text-muted-foreground hover:text-foreground rounded-full p-0.5 transition-colors"
                          data-testid={`compare-bar-remove-${id}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompare}
                  className="text-muted-foreground rounded-full"
                  data-testid="compare-bar-clear"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-6 gap-2"
                  onClick={() => setLocation("/compare")}
                  data-testid="compare-bar-go"
                >
                  <GitCompareArrows className="h-4 w-4" />
                  Compare Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
