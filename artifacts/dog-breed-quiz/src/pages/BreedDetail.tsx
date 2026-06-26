import { useRoute, Link } from "wouter";
import { breeds, type Breed } from "../data/breeds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BreedImage } from "../components/BreedImage";

const naturalTitles: Record<string, string> = {
  "german-shepherd":    "German Shepherd Dog — Temperament, Care and Is It Right For You?",
  "labrador-retriever": "Labrador Retriever — Friendly Family Dog or Too Energetic For You?",
  "french-bulldog":     "French Bulldog — Perfect Apartment Dog? Pros, Cons and Full Guide",
  "golden-retriever":   "Golden Retriever — Best Family Dog? Temperament, Cost and Care",
  "poodle":             "Poodle — The Hypoallergenic Genius: Is a Poodle Right for Your Home?",
  "beagle":             "Beagle — Curious, Fun and Loud? The Complete Beagle Guide",
  "rottweiler":         "Rottweiler — Loyal Guardian or Too Much Dog? Everything You Need to Know",
  "bulldog":            "English Bulldog — Low-Energy Apartment Dog or High-Maintenance Pet?",
  "yorkshire-terrier":  "Yorkshire Terrier — Tiny Dog, Big Personality: Is a Yorkie Right for You?",
  "boxer":              "Boxer — Energetic Family Dog or Too Boisterous for Your Home?",
  "dachshund":          "Dachshund — Long Body, Big Heart: Is a Dachshund the Right Dog for You?",
  "siberian-husky":     "Siberian Husky — Stunning and Wild: Can You Handle a Husky?",
  "great-dane":         "Great Dane — Gentle Giant or Too Big? The Full Great Dane Guide",
  "doberman-pinscher":  "Doberman Pinscher — Elite Guard Dog or Loving Family Companion?",
  "shih-tzu":           "Shih Tzu — Royal Lap Dog or High-Maintenance Pet?",
  "border-collie":      "Border Collie — World's Smartest Dog: Is a Border Collie Right for You?",
  "chihuahua":          "Chihuahua — Tiny But Fierce: The Complete Chihuahua Guide",
  "pomeranian":         "Pomeranian — Fluffy, Feisty and Fabulous: Is a Pomeranian Right for You?",
  "australian-shepherd":"Australian Shepherd — High-Energy Herder: Can You Keep Up With an Aussie?",
  "pembroke-welsh-corgi":"Pembroke Welsh Corgi — Royal Herder or Couch Dog? The Full Corgi Guide",
  "bernese-mountain-dog":"Bernese Mountain Dog — Gentle Giant for Cold Climates? Full Breed Guide",
  "shiba-inu":          "Shiba Inu — Bold, Independent and Cat-Like: Is a Shiba Inu Right for You?",
  "goldendoodle":       "Goldendoodle — Hypoallergenic Family Dog or Overhyped Hybrid?",
  "labradoodle":        "Labradoodle — Is a Labradoodle Truly Hypoallergenic and Kid-Friendly?",
  "cavalier-king-charles":"Cavalier King Charles Spaniel — Best Lap Dog? Full Breed Guide",
  "cane-corso":         "Cane Corso — Powerful Protector: Should You Own a Cane Corso?",
  "belgian-malinois":   "Belgian Malinois — Military Dog at Home: Is a Malinois Right for You?",
  "akita":              "Akita — Fierce Loyalty and Independent Spirit: The Full Akita Guide",
};

function getPageTitle(breed: Breed): string {
  if (naturalTitles[breed.id]) return naturalTitles[breed.id];
  if (breed.isProtectionBreed) return `${breed.name} — Protection Breed Guide: Is It Right for You?`;
  if (breed.beginnerFriendly) return `${breed.name} — ${breed.tagline}`;
  return `${breed.name} — Full Breed Guide: Temperament, Care and More`;
}

function getMetaDesc(breed: Breed): string {
  return `Learn everything about the ${breed.name}: temperament, size, grooming, energy level, lifespan, cost, and whether it matches your lifestyle. Compare with 120 breeds on DogBreedQuiz.`;
}

function getSimilarBreeds(breed: Breed): Breed[] {
  return breeds
    .filter(b => b.id !== breed.id && b.sizeCategory === breed.sizeCategory && Math.abs(b.exerciseLevel - breed.exerciseLevel) <= 1)
    .slice(0, 3);
}

function generateFAQ(breed: Breed): { q: string; a: string }[] {
  const costLabels = ["under $50", "$50–$100", "$100–$200", "over $200"];
  const faq: { q: string; a: string }[] = [];

  faq.push({
    q: `Is the ${breed.name} good for apartments?`,
    a: breed.spaceNeeded <= 1
      ? `Yes, the ${breed.name} is well suited to apartment living. ${breed.exercise === "Low" ? "Their low energy needs make them especially adaptable to smaller spaces." : "With regular daily exercise and mental stimulation, they adapt well to apartment life."}`
      : `The ${breed.name} generally does better with more space — ideally a house with a yard. They need room to move and may become frustrated or destructive in a small apartment without adequate exercise.`,
  });

  faq.push({
    q: `Is the ${breed.name} good with children?`,
    a: breed.goodWithKids >= 2
      ? `Yes, the ${breed.name} is generally known for being patient and gentle with children. As with any dog, early socialization and teaching children how to interact respectfully are important.`
      : breed.isProtectionBreed
      ? `The ${breed.name} is a protection breed that requires careful management around children. They are not recommended for homes with young kids without significant experience and proper training.`
      : `The ${breed.name} can do okay with children with proper introductions and supervision, but they are not typically considered a top family breed for homes with very young children.`,
  });

  faq.push({
    q: `How much does a ${breed.name} cost per month?`,
    a: `The estimated monthly cost of owning a ${breed.name} is ${costLabels[breed.costLevel]}. This covers food, basic veterinary care, and grooming. ${breed.costLevel >= 2 ? "Larger breeds, frequent grooming, or potential health issues can push costs higher." : "They are considered a relatively affordable breed to maintain."}`,
  });

  faq.push({
    q: `Is the ${breed.name} easy to train?`,
    a: breed.beginnerScore >= 2
      ? `Yes, the ${breed.name} is highly trainable and responds well to consistent, positive reinforcement training. They are considered a good choice for first-time owners.`
      : breed.beginnerScore === 1
      ? `The ${breed.name} can be trained but requires patience and consistency. They may have a stubborn or independent streak. Some prior experience with dogs is helpful.`
      : `The ${breed.name} is considered a challenging breed to train and is best suited to experienced owners who can provide firm, consistent guidance from puppyhood.`,
  });

  return faq;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left py-4 flex items-start justify-between gap-3 hover:text-primary transition-colors"
        aria-expanded={open}
      >
        <h3 className="font-semibold text-foreground text-sm leading-snug">{q}</h3>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 mt-0.5 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

export default function BreedDetail() {
  const [, params] = useRoute("/breed/:breedSlug");
  const breedSlug = params?.breedSlug;
  const breed = breeds.find(b => b.id === breedSlug);

  const similarBreeds = useMemo(() => breed ? getSimilarBreeds(breed) : [], [breed]);
  const faq = useMemo(() => breed ? generateFAQ(breed) : [], [breed]);

  const pageTitle = breed ? getPageTitle(breed) : "Breed Not Found | DogBreedQuiz";
  const pageDesc = breed ? getMetaDesc(breed) : "";
  const canonical = breed ? `/breed/${breed.id}` : undefined;

  const schema = breed ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": pageTitle,
    "description": pageDesc,
    "url": `https://dogbreedquiz.replit.app/breed/${breed.id}`,
    "publisher": { "@type": "Organization", "name": "DogBreedQuiz", "url": "https://dogbreedquiz.replit.app" },
  } : undefined;

  useSEO({ title: pageTitle, description: pageDesc, canonical, schema });

  if (!breed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Breed not found</h1>
        <Button asChild><Link href="/">Return Home</Link></Button>
      </div>
    );
  }

  const sheddingLabels = ["Very Low", "Low", "Moderate", "High"];
  const ratingLabels = ["Not Recommended", "With Care", "Good", "Excellent"];
  const trainabilityLabels = ["Challenging", "Moderate", "Good", "Excellent"];
  const costLabels = ["Under $50/month", "$50–$100/month", "$100–$200/month", "$200+/month"];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero image */}
      <div className="relative h-[40vh] md:h-[55vh] w-full bg-muted">
        <BreedImage breedId={breed.id} breedName={breed.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Button asChild variant="secondary" size="icon" className="rounded-full bg-background/60 backdrop-blur-md hover:bg-background/80">
            <Link href="/browse"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 -mt-28 relative z-10">
        <motion.div
          className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link href="/browse" className="hover:text-primary transition-colors">Browse Breeds</Link>
            <span>›</span>
            <span className="text-foreground font-medium">{breed.name}</span>
          </nav>

          {/* Protection warning */}
          {breed.isProtectionBreed && (
            <div className="mb-8 rounded-2xl border-2 border-orange-400 bg-orange-50 p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">⚠️</span>
                <div>
                  <p className="font-bold text-orange-800 mb-0.5">Protection Breed Notice</p>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    This is a protection or guard breed. Requires an experienced owner, early socialization, and firm consistent training. Not recommended for first-time owners or homes with small children without proper precautions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title and badges */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 leading-tight">{pageTitle}</h1>
              <p className="text-lg text-muted-foreground">{breed.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {breed.beginnerFriendly ? (
                <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-green-100 text-green-800 border-green-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Great for Beginners
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 border-amber-300">
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />Experienced Owners
                </Badge>
              )}
            </div>
          </div>

          {/* Temperament tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {breed.temperament.map((temp) => (
              <Badge key={temp} variant="outline" className="px-3 py-1 text-sm">{temp}</Badge>
            ))}
          </div>

          {/* Characteristics table */}
          <div className="mb-10">
            <h2 className="text-xl font-bold font-serif text-foreground mb-4">Breed Characteristics</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Size", breed.size],
                    ["Weight", breed.weightRange],
                    ["Lifespan", breed.lifespan],
                    ["Energy Level", breed.exercise],
                    ["Grooming", breed.grooming],
                    ["Shedding", sheddingLabels[breed.groomingLevel]],
                    ["Hypoallergenic", breed.hypoallergenic >= 2 ? "Yes" : breed.hypoallergenic === 1 ? "Somewhat" : "No"],
                    ["Good with Kids", ratingLabels[breed.goodWithKids]],
                    ["Good with Pets", ratingLabels[breed.goodWithPets]],
                    ["Trainability", trainabilityLabels[breed.beginnerScore]],
                    ["Handles Alone Time", breed.toleratesAlone === 3 ? "Very well" : breed.toleratesAlone === 2 ? "Moderate" : breed.toleratesAlone === 1 ? "Somewhat" : "Needs company"],
                    ["Monthly Cost", costLabels[breed.costLevel]],
                    ["Climate", breed.climatePreference.charAt(0).toUpperCase() + breed.climatePreference.slice(1)],
                  ].map(([label, value], i) => (
                    <tr key={label} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="px-4 py-3 font-semibold text-muted-foreground w-1/2">{label}</td>
                      <td className="px-4 py-3 text-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* About section */}
          <div className="mb-10">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">About the {breed.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{breed.description}</p>
          </div>

          {/* Compatibility */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Good with Kids", val: ratingLabels[breed.goodWithKids] },
              { label: "Good with Other Pets", val: ratingLabels[breed.goodWithPets] },
              { label: "Tolerates Alone Time", val: breed.toleratesAlone === 3 ? "Very Well" : breed.toleratesAlone === 2 ? "Moderate" : breed.toleratesAlone === 1 ? "Somewhat" : "Needs Company" },
            ].map(({ label, val }) => (
              <div key={label} className="p-4 bg-muted/40 rounded-2xl text-center">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
                <div className="font-semibold text-foreground">{val}</div>
              </div>
            ))}
          </div>

          {/* Fun fact */}
          <div className="bg-primary/10 rounded-2xl p-6 md:p-8 mb-10 border border-primary/20">
            <h3 className="font-bold text-primary mb-2 text-sm uppercase tracking-wider">Fun Fact</h3>
            <p className="text-foreground font-medium leading-relaxed">{breed.funFact}</p>
          </div>

          {/* Quiz CTA */}
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 mb-10 text-center">
            <p className="font-semibold text-foreground mb-2">Wondering if the {breed.name} is your perfect match?</p>
            <p className="text-sm text-muted-foreground mb-4">Take our free 12-question quiz to find out — and see how the {breed.name} scores against your lifestyle.</p>
            <Button asChild className="rounded-full px-8" data-testid="breed-detail-quiz-cta">
              <Link href="/quiz">Take the Quiz to See If This Breed Matches You</Link>
            </Button>
          </div>

          {/* Breed FAQ */}
          <div className="mb-10">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">{breed.name} — Frequently Asked Questions</h2>
            <div className="bg-muted/30 rounded-2xl px-5 border border-border">
              {faq.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
            </div>
          </div>

          {/* Similar breeds */}
          {similarBreeds.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Similar Breeds You Might Like</h2>
              <p className="text-sm text-muted-foreground mb-5">Similar in size and energy level to the {breed.name}.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarBreeds.map(similar => (
                  <Link key={similar.id} href={`/breed/${similar.id}`}>
                    <div className="group bg-muted/40 border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-md transition-all cursor-pointer">
                      <div className="relative h-32 bg-muted overflow-hidden">
                        <BreedImage breedId={similar.id} breedName={similar.name} />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{similar.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{similar.tagline}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-border">
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/browse">Browse All Breeds</Link>
            </Button>
            <Button asChild className="rounded-full px-6">
              <Link href="/quiz">Take the Quiz</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
