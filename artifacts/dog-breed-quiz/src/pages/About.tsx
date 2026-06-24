import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSEO } from "../hooks/useSEO";
import { Dog, Brain, Heart, Shield } from "lucide-react";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does DogBreedQuiz work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DogBreedQuiz asks you 12 questions about your lifestyle, living space, activity level, and preferences. Our algorithm then scores all 120 breeds across 12 dimensions and returns your top 3 matches with specific reasons why each breed suits you."
      }
    },
    {
      "@type": "Question",
      "name": "How many breeds does DogBreedQuiz include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DogBreedQuiz includes 120 dog breeds across three categories: popular purebreds, designer and mixed breeds, and protection and guard breeds."
      }
    }
  ]
};

export default function About() {
  useSEO({
    title: "About DogBreedQuiz — How We Help You Find the Perfect Dog",
    description: "DogBreedQuiz helps people find their perfect dog breed match using a 12-question lifestyle quiz and smart matching algorithm across 120 breeds.",
    canonical: "/about",
    schema: faqSchema,
  });

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground">About</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            About DogBreedQuiz
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            We help people find their perfect dog breed match — one that truly fits their lifestyle, not just looks good in photos.
          </p>

          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm mb-10">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Choosing a dog is one of the most important decisions you'll make. The wrong match leads to frustration for both owner and dog — and sadly, millions of dogs are surrendered to shelters each year because the fit wasn't right. DogBreedQuiz was built to change that. By matching your lifestyle to 120 dog breeds across 12 smart dimensions, we give you data-driven recommendations you can actually trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Brain, title: "Smart Matching Algorithm", desc: "12 lifestyle dimensions scored and weighted for each of 120 breeds, so your results reflect real compatibility — not popularity." },
              { icon: Dog, title: "120 Breeds Covered", desc: "From tiny Chihuahuas to giant Kangals, popular Goldens to rare Xoloitzcuintlis — we cover purebreds, designer mixes, and protection breeds." },
              { icon: Heart, title: "Personalized Reasons", desc: "Every result explains exactly why that breed fits you — not generic descriptions, but specific reasons tied to your actual answers." },
              { icon: Shield, title: "Honest Protection Warnings", desc: "For guard and protection breeds, we display clear warnings about experience requirements, so every match is a safe one." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-muted/40 rounded-2xl p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm mb-12">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-4">The 12 Matching Dimensions</h2>
            <p className="text-muted-foreground mb-6">When you take the quiz, we evaluate your match across these dimensions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Living space requirements",
                "Daily exercise and activity needs",
                "Tolerance for being left alone",
                "Owner experience level",
                "Allergy and hypoallergenic needs",
                "Household composition (kids, elderly)",
                "Compatibility with other pets",
                "Grooming preferences",
                "Size preference",
                "Monthly budget for care",
                "Primary priority (protection, calm, playful, etc.)",
                "Climate and environment",
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold shrink-0">✓</span>
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button asChild size="lg" className="rounded-full px-10 shadow-md">
              <Link href="/quiz">Take the Free Quiz</Link>
            </Button>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/browse" className="text-primary hover:underline">Browse All 120 Breeds</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
