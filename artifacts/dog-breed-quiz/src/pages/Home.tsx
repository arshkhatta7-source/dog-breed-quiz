import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useSEO } from "../hooks/useSEO";
import { breeds } from "../data/breeds";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { getBreedImageUrl, BREED_IMAGE_FALLBACK } from "../hooks/useBreedImage";

const POPULAR_IDS = [
  "golden-retriever",
  "labrador-retriever",
  "french-bulldog",
  "german-shepherd",
  "poodle",
  "beagle",
];

const faqs = [
  {
    q: "How does DogBreedQuiz work?",
    a: "DogBreedQuiz asks you 12 questions about your lifestyle — your living space, activity level, hours alone, experience with dogs, budget, and more. Our algorithm then scores all 120 breeds across those dimensions and shows your top 3 matches, with specific reasons why each breed suits you."
  },
  {
    q: "How many dog breeds are included?",
    a: "DogBreedQuiz covers 120 dog breeds across three categories: popular purebreds (like Golden Retrievers and Poodles), designer and mixed breeds (like Goldendoodles and Cavapoos), and protection and guard breeds (like the Belgian Malinois and Rottweiler)."
  },
  {
    q: "Is this quiz completely free?",
    a: "Yes, DogBreedQuiz is completely free to use. No account, no email required. Just answer 12 questions and get your personalized breed matches instantly."
  },
  {
    q: "What if I am a first-time dog owner?",
    a: "One of the 12 questions asks about your experience level. If you're a first-time owner, our algorithm strongly favors beginner-friendly breeds and automatically down-scores complex or protection breeds that require experienced handling."
  },
  {
    q: "Can I compare dog breeds side by side?",
    a: "Yes! After browsing breeds, you can select up to 3 breeds to compare in a detailed side-by-side table covering size, energy, lifespan, grooming, shedding, compatibility with kids and pets, trainability, monthly cost, and more. You can also share your comparison via a shareable link."
  },
  {
    q: "How accurate is the breed matching?",
    a: "Our matching is based on factual breed data across 12 lifestyle dimensions, not personality quizzes or vague traits. Each dimension is weighted by importance (e.g., activity level is weighted 3×). While no quiz can guarantee a perfect fit, our results are meaningfully more accurate than 'what's cute' or 'what's popular' methods."
  },
  {
    q: "What is the best dog breed for apartments?",
    a: "Some of the best apartment dogs include the French Bulldog, Cavalier King Charles Spaniel, Bichon Frisé, Shih Tzu, and Pug. These breeds have low-to-moderate exercise needs, tolerate smaller spaces, and tend to be quiet. Take our quiz to get a personalized recommendation based on your full lifestyle."
  },
  {
    q: "What dog breeds are good for families with kids?",
    a: "Golden Retrievers, Labrador Retrievers, Beagles, Cavalier King Charles Spaniels, and Boxers consistently rank among the best family dogs with children. Our quiz factors in your household composition and prioritizes breeds known for patience and gentleness with kids."
  }
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left py-5 flex items-start justify-between gap-4 hover:text-primary transition-colors"
        aria-expanded={open}
      >
        <h3 className="font-semibold text-foreground text-base leading-snug">{q}</h3>
        <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-5 text-muted-foreground text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DogBreedQuiz",
  "url": "https://dogbreedquiz.replit.app",
  "description": "Free dog breed matchmaker quiz — find your perfect dog breed match across 120 breeds.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://dogbreedquiz.replit.app/browse?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
};

export default function Home() {
  useSEO({
    title: "DogBreedQuiz — Find Your Perfect Dog Breed Match (Free Quiz)",
    description: "Take our free 12-question quiz to find the perfect dog breed for your lifestyle. Compare 120+ breeds including Golden Retrievers, Poodles, French Bulldogs, and more.",
    canonical: "/",
    schema: { "@context": "https://schema.org", "@graph": [homepageSchema, faqSchema] },
  });

  const popularBreeds = POPULAR_IDS.map(id => breeds.find(b => b.id === id)).filter(Boolean);

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16 px-4" aria-label="Hero">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block mb-4 px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-semibold tracking-wide">
              120 Dog Breeds · Free Quiz
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-foreground mb-6 leading-tight">
              Find Your Perfect <br /><span className="text-primary">Dog Breed</span> Match.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Answer 12 questions about your lifestyle and we'll match you with the dog breeds most likely to thrive in your home — with specific reasons why.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all" data-testid="home-btn-start">
                <Link href="/quiz">Start the Free Quiz</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg" data-testid="home-btn-browse">
                <Link href="/browse">Browse All 120 Breeds</Link>
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
              { step: "1", title: "12 Simple Questions", desc: "Tell us about your home, activity level, experience, and preferences." },
              { step: "2", title: "Smart Matching", desc: "Our algorithm scores 120 breeds across 12 lifestyle dimensions — weighted by importance." },
              { step: "3", title: "Meet Your Match", desc: "Get your top 3 personalized recommendations with specific reasons why each breed suits you." }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-card rounded-2xl shadow-sm border border-border text-left">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mb-4">
                  {feature.step}
                </div>
                <h2 className="font-bold text-lg mb-2">{feature.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Breeds */}
      <section className="py-20 px-4 bg-muted/30" aria-label="Most popular breeds">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">Most Popular Breeds</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six of the most searched and loved dog breeds — click any to read the full guide.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {popularBreeds.map((breed, i) => (
              <motion.div
                key={breed!.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link href={`/breed/${breed!.id}`}>
                  <div className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className="relative h-36 md:h-44 bg-muted overflow-hidden">
                      <img
                        src={getBreedImageUrl(breed!.name)}
                        alt={breed!.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          if (el.src !== BREED_IMAGE_FALLBACK) el.src = BREED_IMAGE_FALLBACK;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{breed!.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{breed!.tagline}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link href="/browse">View All 120 Breeds →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4" aria-label="Frequently asked questions">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about DogBreedQuiz.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl px-6 shadow-sm">
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="rounded-full px-10 shadow-md">
              <Link href="/quiz">Find My Perfect Breed →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border bg-muted/20" aria-label="Site footer">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">DogBreedQuiz</span>
            <span>·</span>
            <span>Find your perfect dog breed match</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/quiz" className="hover:text-primary transition-colors">Take the Quiz</Link>
            <Link href="/browse" className="hover:text-primary transition-colors">Browse Breeds</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
          <p>© {new Date().getFullYear()} DogBreedQuiz</p>
        </div>
      </footer>
    </div>
  );
}
