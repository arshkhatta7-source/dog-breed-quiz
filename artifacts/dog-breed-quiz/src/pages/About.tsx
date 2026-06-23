import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            How We Find Your Perfect Match
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Choosing a dog is a major life decision. We built DogBreedQuiz to help you look past aesthetics and find a breed that truly fits your lifestyle.
            </p>
            
            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm mb-10">
              <h2 className="text-2xl font-bold font-serif mb-4 mt-0">The Science of Matching</h2>
              <p className="text-muted-foreground mb-6">
                Our algorithm scores 50 of the most popular dog breeds across 7 key dimensions:
              </p>
              <ul className="space-y-3 mb-0 text-muted-foreground">
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Living space requirements</li>
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Daily exercise needs</li>
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Tolerance for being left alone</li>
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Owner experience level</li>
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Financial cost of care</li>
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Hypoallergenic traits</li>
                <li className="flex items-start"><span className="text-primary mr-2 font-bold">•</span> Compatibility with kids and pets</li>
              </ul>
            </div>

            <p className="text-muted-foreground mb-10 leading-relaxed">
              When you take the quiz, we map your answers to these dimensions and calculate a compatibility score for every breed. The result? A personalized list of dogs that will thrive in your home, making both you and your new best friend happy.
            </p>

            <div className="text-center">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-md">
                <Link href="/quiz">Find My Match</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
