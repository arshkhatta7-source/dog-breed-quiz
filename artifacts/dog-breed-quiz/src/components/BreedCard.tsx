import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Breed } from "../data/breeds";
import { motion } from "framer-motion";

interface BreedCardProps {
  breed: Breed;
  score: number;
  matchReasons: string[];
  rank: number;
}

export function BreedCard({ breed, score, matchReasons, rank }: BreedCardProps) {
  const labels = ["Your Perfect Match", "Runner Up", "Also Great"];
  const label = labels[rank - 1] || "Great Choice";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.4 }}
    >
      <Card className="overflow-hidden border-2 transition-all hover:shadow-md group" data-testid={`breed-card-${breed.id}`}>
        <div className="md:flex">
          <div className="relative h-64 md:h-auto md:w-2/5 shrink-0 overflow-hidden">
            <img 
              src={breed.imageUrl} 
              alt={breed.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center gap-1.5">
              <span className="text-primary">#{rank}</span>
              <span className="text-foreground">{label}</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold shadow-sm">
              {score}% Match
            </div>
          </div>
          
          <CardContent className="p-6 md:p-8 flex flex-col justify-between flex-1">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold font-serif text-foreground">{breed.name}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{breed.tagline}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">{breed.size}</Badge>
                <Badge variant="outline">{breed.grooming} Grooming</Badge>
                <Badge variant="outline">{breed.exercise} Energy</Badge>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-sm mb-2 text-foreground">Why you match:</h4>
                <ul className="space-y-1.5">
                  {matchReasons.map((reason, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Button asChild className="w-full md:w-auto self-start" variant={rank === 1 ? "default" : "outline"}>
              <Link href={`/breed/${breed.id}`}>
                Learn more about {breed.name}
              </Link>
            </Button>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
