import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BreedCard } from "../components/BreedCard";
import { calculateMatches, type MatchResult, type QuizAnswers } from "../lib/matching";
import { motion } from "framer-motion";
import { Share2, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [, setLocation] = useLocation();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      // Try localStorage first (more reliable on deployed sites), fall back to sessionStorage
      const saved =
        localStorage.getItem("quizAnswers") ||
        sessionStorage.getItem("quizAnswers");

      if (!saved) {
        setError("no-answers");
        setLoading(false);
        return;
      }

      const answers: QuizAnswers = JSON.parse(saved);
      const results = calculateMatches(answers);

      if (!results || results.length === 0) {
        setError("no-results");
        setLoading(false);
        return;
      }

      setMatches(results);
      setLoading(false);
    } catch (e) {
      console.error("Results page error:", e);
      setError("crash");
      setLoading(false);
    }
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "My perfect dog breed match!",
      text: `I just found my perfect dog breed match on DogBreedQuiz! My top match is the ${matches[0]?.breed.name}. Find yours at DogBreedQuiz.`,
      url: window.location.origin,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast({ title: "Link copied!", description: "Share link copied to clipboard." });
      }
    } catch {
      // user cancelled share
    }
  };

  const handleRetake = () => {
    try { localStorage.removeItem("quizAnswers"); } catch { /* ignore */ }
    try { sessionStorage.removeItem("quizAnswers"); } catch { /* ignore */ }
    setLocation("/quiz");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Calculating your matches…</p>
        </div>
      </div>
    );
  }

  // Error / no-answers state
  if (error || matches.length === 0) {
    const isNoAnswers = error === "no-answers";
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-card rounded-3xl p-10 shadow-lg border border-border">
          <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
            {isNoAnswers ? "Quiz answers not found" : "Something went wrong"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isNoAnswers
              ? "It looks like your quiz answers weren't saved. Please retake the quiz to see your results."
              : "We couldn't calculate your breed matches. Please try the quiz again."}
          </p>
          <Button
            onClick={handleRetake}
            size="lg"
            className="rounded-full px-8"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Retake the Quiz
          </Button>
        </div>
      </div>
    );
  }

  const hasProtectionBreed = matches.some(m => m.breed.isProtectionBreed);

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
              Based on your lifestyle and preferences, here are the dogs most likely to thrive in your home.
            </p>
          </motion.div>
        </div>

        {hasProtectionBreed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 rounded-2xl border-2 border-orange-400 bg-orange-50 p-6"
            data-testid="protection-breed-warning"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-orange-800 text-lg mb-1">Protection Breed Notice</p>
                <p className="text-orange-700 text-sm leading-relaxed">
                  One or more of your matches is a protection or guard breed. These dogs require an experienced owner, early socialization, and consistent firm training. They are not recommended for first-time owners or homes with small children without proper precautions and professional guidance.
                </p>
              </div>
            </div>
          </motion.div>
        )}

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

        <div className="text-center mb-6">
          <Link href="/browse" className="text-sm text-primary hover:underline font-medium" data-testid="results-browse-all">
            Browse All 120 Breeds →
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 border-t border-border">
          <Button
            onClick={handleShare}
            size="lg"
            className="rounded-full px-8 w-full sm:w-auto"
            data-testid="results-btn-share"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share My Results
          </Button>
          <Button
            onClick={handleRetake}
            variant="outline"
            size="lg"
            className="rounded-full px-8 w-full sm:w-auto"
            data-testid="results-btn-retake"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
