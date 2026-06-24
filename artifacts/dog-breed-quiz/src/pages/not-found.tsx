import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center bg-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <p className="text-8xl mb-6" role="img" aria-label="Lost dog">🐾</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          Oops! Page not found.
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Looks like this page ran off chasing a squirrel. Let's get you back on the right track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto" data-testid="404-btn-home">
            <Link href="/">Back to Homepage</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto" data-testid="404-btn-quiz">
            <Link href="/quiz">Take the Quiz</Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/browse" className="text-primary hover:underline">Browse All Breeds</Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
        </div>
      </motion.div>
    </div>
  );
}
