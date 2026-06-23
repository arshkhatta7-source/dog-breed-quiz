import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "../components/ProgressBar";
import type { QuizAnswers } from "../lib/matching";

const questions = [
  {
    id: "space",
    title: "What kind of living space do you have?",
    options: [
      { label: "Apartment", value: 0 },
      { label: "House with a small yard", value: 1 },
      { label: "House with a large yard", value: 3 },
    ]
  },
  {
    id: "exercise",
    title: "How much daily exercise can you provide?",
    options: [
      { label: "Under 30 minutes", value: 0 },
      { label: "30-60 minutes", value: 1 },
      { label: "1-2 hours", value: 2 },
      { label: "More than 2 hours", value: 3 },
    ]
  },
  {
    id: "experience",
    title: "What is your experience with dogs?",
    options: [
      { label: "First-time owner", value: 3 },
      { label: "Some experience", value: 2 },
      { label: "Experienced owner", value: 0 },
    ]
  },
  {
    id: "aloneTime",
    title: "How much time will the dog spend alone?",
    options: [
      { label: "Rarely (I work from home)", value: 0 },
      { label: "A few hours a day", value: 1 },
      { label: "Most of the day", value: 3 },
    ]
  },
  {
    id: "budget",
    title: "Monthly budget for dog care (food, vet, etc)?",
    options: [
      { label: "Under $100", value: 0 },
      { label: "$100 - $200", value: 1 },
      { label: "$200 - $400", value: 2 },
      { label: "Over $400", value: 3 },
    ]
  },
  {
    id: "allergies",
    title: "Do you need a hypoallergenic dog?",
    options: [
      { label: "Yes, I have allergies", value: 3 },
      { label: "No allergies", value: 0 },
    ]
  },
  {
    id: "household",
    title: "Who else lives in your household?",
    options: [
      { label: "Just adults", value: "adults" },
      { label: "Kids", value: "kids" },
      { label: "Other pets", value: "pets" },
      { label: "Kids and other pets", value: "both" },
    ]
  }
];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const handleSelect = (value: number | string) => {
    const currentQ = questions[currentStep];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      sessionStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
      setTimeout(() => setLocation("/results"), 300);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 md:py-16">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={currentStep + 1} totalSteps={questions.length} />
        
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Card className="border-0 shadow-lg bg-card overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 leading-tight">
                    {currentQuestion.title}
                  </h2>
                  
                  <div className="flex flex-col gap-4">
                    {currentQuestion.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={answers[currentQuestion.id as keyof QuizAnswers] === option.value ? "default" : "outline"}
                        className={`h-auto py-4 px-6 justify-start text-left text-lg font-medium transition-all ${
                          answers[currentQuestion.id as keyof QuizAnswers] === option.value 
                            ? "ring-2 ring-primary ring-offset-2" 
                            : "hover:bg-accent hover:text-accent-foreground border-2"
                        }`}
                        onClick={() => handleSelect(option.value)}
                        data-testid={`quiz-option-${idx}`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {currentStep > 0 && (
                <div className="mt-6 flex justify-center">
                  <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="text-muted-foreground">
                    Back to previous question
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
