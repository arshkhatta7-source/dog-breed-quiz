import { useRoute, Link } from "wouter";
import { breeds } from "../data/breeds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BreedDetail() {
  const [, params] = useRoute("/breed/:breedSlug");
  const breedSlug = params?.breedSlug;
  const breed = breeds.find(b => b.id === breedSlug);

  if (!breed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Breed not found</h1>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[40vh] md:h-[55vh] w-full bg-muted">
        <img
          src={breed.imageUrl}
          alt={breed.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://place.dog/800/500";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/60 backdrop-blur-md hover:bg-background/80"
          >
            <Link href="/results">
              <ArrowLeft className="h-5 w-5" />
            </Link>
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
                {breed.name}
              </h1>
              <p className="text-xl text-muted-foreground">{breed.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {breed.beginnerFriendly ? (
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-100 text-green-800 border-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Great for Beginners
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-amber-100 text-amber-800 border-amber-300">
                  <XCircle className="w-4 h-4 mr-2" />
                  Experienced Owners
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {breed.temperament.map((temp) => (
              <Badge key={temp} variant="outline" className="px-3 py-1 text-sm bg-background">
                {temp}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Size</div>
              <div className="font-semibold text-foreground">{breed.size}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Weight</div>
              <div className="font-semibold text-foreground">{breed.weightRange}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Lifespan</div>
              <div className="font-semibold text-foreground">{breed.lifespan}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Energy</div>
              <div className="font-semibold text-foreground">{breed.exercise}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Grooming</div>
              <div className="font-semibold text-foreground">{breed.grooming}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Shedding</div>
              <div className="font-semibold text-foreground">
                {breed.groomingLevel === 0 ? "Very Low" : breed.groomingLevel === 1 ? "Low" : breed.groomingLevel === 2 ? "Moderate" : "High"}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Hypoallergenic</div>
              <div className="font-semibold text-foreground">
                {breed.hypoallergenic >= 2 ? "Yes" : breed.hypoallergenic === 1 ? "Somewhat" : "No"}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Climate</div>
              <div className="font-semibold text-foreground capitalize">{breed.climatePreference}</div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-serif font-bold mb-4">About the {breed.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {breed.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="p-4 bg-muted/40 rounded-2xl text-center">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Good with Kids</div>
              <div className="font-semibold text-foreground">
                {breed.goodWithKids === 3 ? "Excellent" : breed.goodWithKids === 2 ? "Good" : breed.goodWithKids === 1 ? "With Care" : "Not Recommended"}
              </div>
            </div>
            <div className="p-4 bg-muted/40 rounded-2xl text-center">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Good with Pets</div>
              <div className="font-semibold text-foreground">
                {breed.goodWithPets === 3 ? "Excellent" : breed.goodWithPets === 2 ? "Good" : breed.goodWithPets === 1 ? "With Care" : "Not Recommended"}
              </div>
            </div>
            <div className="p-4 bg-muted/40 rounded-2xl text-center">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Tolerates Alone Time</div>
              <div className="font-semibold text-foreground">
                {breed.toleratesAlone === 3 ? "Very Well" : breed.toleratesAlone === 2 ? "Moderate" : breed.toleratesAlone === 1 ? "Somewhat" : "Needs Company"}
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-2xl p-6 md:p-8 mb-10 border border-primary/20">
            <h3 className="font-bold text-primary mb-2">Fun Fact</h3>
            <p className="text-foreground font-medium leading-relaxed">{breed.funFact}</p>
          </div>

          <div className="flex justify-center pt-6 border-t border-border">
            <Button asChild size="lg" className="rounded-full px-10" data-testid="breed-detail-quiz-cta">
              <Link href="/quiz">Take the Matchmaker Quiz</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
