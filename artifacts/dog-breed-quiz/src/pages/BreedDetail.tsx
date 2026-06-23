import { useRoute, Link } from "wouter";
import { breeds } from "../data/breeds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-muted">
        <img 
          src={breed.imageUrl} 
          alt={breed.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <Button asChild variant="secondary" size="icon" className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80">
            <Link href="/results"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        <motion.div 
          className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
                {breed.name}
              </h1>
              <p className="text-xl text-muted-foreground">{breed.tagline}</p>
            </div>
            {breed.beginnerFriendly && (
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent text-accent-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Great for Beginners
              </Badge>
            )}
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
              <div className="text-sm text-muted-foreground mb-1">Size</div>
              <div className="font-semibold text-foreground">{breed.size}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-1">Weight</div>
              <div className="font-semibold text-foreground">{breed.weightRange}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-1">Lifespan</div>
              <div className="font-semibold text-foreground">{breed.lifespan}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-1">Energy Level</div>
              <div className="font-semibold text-foreground">{breed.exercise}</div>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
            <h2 className="text-2xl font-serif font-bold mb-4">About the {breed.name}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {breed.description}
            </p>
          </div>

          <div className="bg-primary/10 rounded-2xl p-6 md:p-8 mb-10 border border-primary/20">
            <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
              Fun Fact
            </h3>
            <p className="text-foreground font-medium">{breed.funFact}</p>
          </div>

          <div className="flex justify-center pt-6 border-t border-border">
            <Button asChild size="lg" className="rounded-full px-10">
              <Link href="/quiz">Take the Matchmaker Quiz</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
