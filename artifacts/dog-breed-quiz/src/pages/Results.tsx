import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BreedCard } from "../components/BreedCard";
import { calculateMatches, type MatchResult, type QuizAnswers } from "../lib/matching";
import { motion } from "framer-motion";
import { Share2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [, setLocation] = useLocation();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = sessionStorage.getItem("quizAnswers");
    if (!saved) {
      setLocation("/quiz");
      return;
    }

    try {
      const answers: QuizAnswers = JSON.parse(saved);
      const results = calculateMatches(answers);
      setMatches(results);
    } catch (e) {
      setLocation("/quiz");
    }
  }, [setLocation]);

  const handleShare = async () => {
    const shareData = {
      title: 'My perfect dog breed match!',
      text: `I just found my perfect dog breed match on DogBreedQuiz! My top match is the ${matches[0]?.breed.name}.`,
      url: window.location.origin
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard.",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetake = () => {
    sessionStorage.removeItem("quizAnswers");
    setLocation("/quiz");
  };

  if (matches.length === 0) return null;

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Your Perfect Matches
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on your lifestyle and preferences, we found the dogs most likely to thrive in your home.
            </p>
          </motion.div>
        </div>

        <div className="space-y-8 mb-12">
          {matches.map((match, idx) => (
            <BreedCard 
              key={match.breed.id}
              breed={match.breed}
              score={match.score}
              matchReasons={match.matchReasons}
              rank={idx + 1}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 border-t border-border">
          <Button onClick={handleShare} size="lg" className="rounded-full px-8 w-full sm:w-auto" data-testid="results-btn-share">
            <Share2 className="mr-2 h-5 w-5" />
            Share My Results
          </Button>
          <Button onClick={handleRetake} variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto" data-testid="results-btn-retake">
            <RefreshCw className="mr-2 h-5 w-5" />
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
