import { useMemo } from "react";
import { useLocation, Link } from "wouter";
import { breeds, type Breed } from "../data/breeds";
import { useCompare } from "../context/CompareContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const costLabels = ["Under $50/mo", "$50–$100/mo", "$100–$200/mo", "$200+/mo"];
const trainabilityLabels = ["Challenging", "Moderate", "Good", "Excellent"];
const ratingLabels = ["Not Recommended", "With Care", "Good", "Excellent"];
const sheddingLabels = ["Very Low", "Low", "Moderate", "High"];

type RatingVal = 0 | 1 | 2 | 3;

function ratingColor(val: RatingVal, higher = true): string {
  if (higher) {
    if (val === 3) return "text-green-700 bg-green-50 border-green-200";
    if (val === 2) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (val === 1) return "text-orange-700 bg-orange-50 border-orange-200";
    return "text-red-700 bg-red-50 border-red-200";
  } else {
    if (val === 0) return "text-green-700 bg-green-50 border-green-200";
    if (val === 1) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (val === 2) return "text-orange-700 bg-orange-50 border-orange-200";
    return "text-red-700 bg-red-50 border-red-200";
  }
}

interface Row {
  label: string;
  render: (b: Breed) => { text: string; color?: string };
}

const rows: Row[] = [
  {
    label: "Size",
    render: b => ({ text: b.size }),
  },
  {
    label: "Energy Level",
    render: b => ({ text: b.exercise }),
  },
  {
    label: "Lifespan",
    render: b => ({ text: b.lifespan }),
  },
  {
    label: "Grooming Needs",
    render: b => ({ text: b.grooming }),
  },
  {
    label: "Shedding Level",
    render: b => ({
      text: sheddingLabels[b.groomingLevel],
      color: ratingColor(b.groomingLevel as RatingVal, false),
    }),
  },
  {
    label: "Good with Kids",
    render: b => ({
      text: ratingLabels[b.goodWithKids],
      color: ratingColor(b.goodWithKids as RatingVal),
    }),
  },
  {
    label: "Good with Other Pets",
    render: b => ({
      text: ratingLabels[b.goodWithPets],
      color: ratingColor(b.goodWithPets as RatingVal),
    }),
  },
  {
    label: "Beginner Friendly",
    render: b => ({
      text: b.beginnerFriendly ? "Yes" : "No",
      color: b.beginnerFriendly
        ? "text-green-700 bg-green-50 border-green-200"
        : "text-orange-700 bg-orange-50 border-orange-200",
    }),
  },
  {
    label: "Monthly Cost",
    render: b => ({ text: costLabels[b.costLevel] }),
  },
  {
    label: "Trainability",
    render: b => ({
      text: trainabilityLabels[b.beginnerScore],
      color: ratingColor(b.beginnerScore as RatingVal),
    }),
  },
  {
    label: "Hypoallergenic",
    render: b => ({
      text: b.hypoallergenic >= 2 ? "Yes" : b.hypoallergenic === 1 ? "Somewhat" : "No",
      color: b.hypoallergenic >= 2
        ? "text-green-700 bg-green-50 border-green-200"
        : b.hypoallergenic === 1
        ? "text-yellow-700 bg-yellow-50 border-yellow-200"
        : "text-red-700 bg-red-50 border-red-200",
    }),
  },
  {
    label: "Protection Instinct",
    render: b => ({
      text: b.isProtectionBreed ? "High" : b.protectionInstinct >= 2 ? "Moderate" : "Low",
      color: b.isProtectionBreed
        ? "text-orange-700 bg-orange-50 border-orange-200"
        : undefined,
    }),
  },
];

export default function Compare() {
  const [location] = useLocation();
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { toast } = useToast();

  const urlParams = useMemo(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const b = params.get("b");
    return b ? b.split(",").filter(Boolean) : null;
  }, [location]);

  const activeIds = urlParams ?? compareIds;
  const activeBreeds = useMemo(
    () => activeIds.map(id => breeds.find(b => b.id === id)).filter(Boolean) as Breed[],
    [activeIds]
  );

  const handleShare = async () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}compare?b=${activeIds.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share this link to show your comparison." });
    } catch {
      toast({ title: "Could not copy link", description: url, variant: "destructive" });
    }
  };

  if (activeBreeds.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl mb-4">🐾</p>
        <h2 className="text-2xl font-bold font-serif mb-2">No breeds selected</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Go to Browse Breeds and click the Compare button on up to 3 breeds to see a side-by-side comparison.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/browse">Browse Breeds</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="rounded-full shrink-0">
              <Link href="/browse">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Breed Comparison
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Comparing {activeBreeds.length} breed{activeBreeds.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={handleShare}
              data-testid="compare-btn-share"
            >
              <Share2 className="h-4 w-4" />
              Share Comparison
            </Button>
            {!urlParams && (
              <Button
                variant="ghost"
                className="rounded-full gap-2 text-muted-foreground"
                onClick={() => {
                  clearCompare();
                  window.history.back();
                }}
                data-testid="compare-btn-clear"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Breed headers */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 md:p-5 w-36 md:w-48 shrink-0 text-sm font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                  Trait
                </th>
                {activeBreeds.map(breed => (
                  <th key={breed.id} className="p-3 md:p-5 align-top">
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-muted shrink-0 mx-auto">
                        <img
                          src={breed.imageUrl}
                          alt={breed.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://place.dog/200/200";
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-foreground text-sm md:text-base leading-tight">
                          {breed.name}
                        </p>
                        {breed.isProtectionBreed && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50 mt-1">
                            Guard Breed
                          </Badge>
                        )}
                      </div>
                      {!urlParams && (
                        <button
                          onClick={() => toggleCompare(breed.id)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                          data-testid={`compare-remove-${breed.id}`}
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      )}
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={row.label}
                  className={`border-b border-border last:border-0 ${rowIdx % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                >
                  <td className="p-4 md:p-5 text-sm font-semibold text-muted-foreground whitespace-nowrap">
                    {row.label}
                  </td>
                  {activeBreeds.map(breed => {
                    const { text, color } = row.render(breed);
                    return (
                      <td key={breed.id} className="p-3 md:p-5 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                            color ?? "text-foreground bg-background border-border"
                          }`}
                        >
                          {text}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fun fact row */}
        <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: `repeat(${activeBreeds.length}, 1fr)` }}>
          {activeBreeds.map(breed => (
            <motion.div
              key={breed.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/8 border border-primary/20 rounded-2xl p-4"
            >
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Fun Fact — {breed.name}</p>
              <p className="text-sm text-foreground leading-relaxed">{breed.funFact}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/browse">Add More Breeds</Link>
          </Button>
          <Button asChild className="rounded-full px-8">
            <Link href="/quiz">Take the Matchmaker Quiz</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
