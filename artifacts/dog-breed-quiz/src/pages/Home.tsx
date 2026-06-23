import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-semibold tracking-wide">
            DogBreedQuiz
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-foreground mb-6 leading-tight">
            Find Your Perfect <br/><span className="text-primary">Dog Breed</span> Match.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Take our short, science-backed quiz to discover which dog breeds best fit your lifestyle, living space, and personality.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all" data-testid="home-btn-start">
              <Link href="/quiz">
                Start the Quiz
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg" data-testid="home-btn-about">
              <Link href="/about">
                How it works
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {[
            { title: "7 Simple Questions", desc: "Tell us about your home, activity level, and preferences." },
            { title: "Smart Matching", desc: "Our algorithm compares your answers against 50+ breeds." },
            { title: "Meet Your Match", desc: "Get personalized recommendations and learn about your new best friend." }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-card rounded-2xl shadow-sm border border-card-border/50 text-left">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
