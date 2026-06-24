import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "../components/ProgressBar";
import type { QuizAnswers } from "../lib/matching";

interface QuizOption {
  label: string;
  value: number | string;
}

interface Question {
  id: string;
  title: string;
  options: QuizOption[];
}

const questions: Question[] = [
  {
    id: "space",
    title: "What is your living situation?",
    options: [
      { label: "Studio apartment", value: 0 },
      { label: "Standard apartment", value: 1 },
      { label: "House with small yard", value: 2 },
      { label: "House with large yard", value: 3 },
      { label: "Farm or rural property", value: 4 },
    ]
  },
  {
    id: "activity",
    title: "How active is your lifestyle?",
    options: [
      { label: "Couch potato — I prefer relaxing", value: 0 },
      { label: "Lightly active — short daily walks", value: 1 },
      { label: "Moderately active — 1 hour exercise daily", value: 2 },
      { label: "Very active — hiking, running, outdoor sports", value: 3 },
    ]
  },
  {
    id: "aloneHours",
    title: "How many hours will the dog be alone daily?",
    options: [
      { label: "0–2 hours (usually home)", value: 0 },
      { label: "2–4 hours", value: 1 },
      { label: "4–6 hours", value: 2 },
      { label: "6+ hours", value: 3 },
    ]
  },
  {
    id: "experience",
    title: "What is your experience with dogs?",
    options: [
      { label: "Never owned a dog", value: 0 },
      { label: "Had a dog as a child", value: 1 },
      { label: "Owned 1–2 dogs as an adult", value: 2 },
      { label: "Experienced with multiple breeds", value: 3 },
    ]
  },
  {
    id: "allergies",
    title: "Do you or anyone in your home have dog allergies?",
    options: [
      { label: "Yes — need hypoallergenic breed", value: 0 },
      { label: "No allergies", value: 1 },
      { label: "Not sure", value: 2 },
    ]
  },
  {
    id: "household",
    title: "Who lives in your household?",
    options: [
      { label: "Just me", value: "solo" },
      { label: "Me and my partner", value: "partner" },
      { label: "Family with young children (under 8)", value: "young-kids" },
      { label: "Family with older children (8+)", value: "older-kids" },
      { label: "Elderly family members", value: "elderly" },
    ]
  },
  {
    id: "otherPets",
    title: "Do you have other pets?",
    options: [
      { label: "No other pets", value: "none" },
      { label: "Cats", value: "cats" },
      { label: "Small animals (rabbits, birds, etc.)", value: "small-animals" },
      { label: "Other dogs", value: "other-dogs" },
    ]
  },
  {
    id: "grooming",
    title: "How do you feel about grooming and shedding?",
    options: [
      { label: "I hate shedding — want minimal grooming", value: 0 },
      { label: "Some grooming is fine", value: 1 },
      { label: "I love grooming and brushing", value: 2 },
      { label: "Shedding does not bother me at all", value: 3 },
    ]
  },
  {
    id: "sizePreference",
    title: "What size dog do you prefer?",
    options: [
      { label: "Tiny (under 10 lbs)", value: 0 },
      { label: "Small (10–25 lbs)", value: 1 },
      { label: "Medium (25–50 lbs)", value: 2 },
      { label: "Large (50–90 lbs)", value: 3 },
      { label: "Giant (90+ lbs)", value: 4 },
      { label: "No preference", value: 5 },
    ]
  },
  {
    id: "budget",
    title: "What is your monthly budget for dog care?",
    options: [
      { label: "Under $50", value: 0 },
      { label: "$50–$100", value: 1 },
      { label: "$100–$200", value: 2 },
      { label: "Over $200", value: 3 },
    ]
  },
  {
    id: "priority",
    title: "What is most important to you in a dog?",
    options: [
      { label: "Loyalty and protection", value: "protection" },
      { label: "Playfulness and energy", value: "playful" },
      { label: "Calm and low maintenance", value: "calm" },
      { label: "Intelligence and trainability", value: "intelligent" },
      { label: "Affection and companionship", value: "affection" },
    ]
  },
  {
    id: "climate",
    title: "Where do you live?",
    options: [
      { label: "Hot climate", value: "hot" },
      { label: "Cold climate", value: "cold" },
      { label: "Moderate climate", value: "moderate" },
      { label: "Urban city", value: "urban" },
      { label: "Suburban area", value: "suburban" },
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
      setTimeout(() => setCurrentStep(prev => prev + 1), 280);
    } else {
      sessionStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
      setTimeout(() => setLocation("/results"), 280);
    }
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id as keyof QuizAnswers];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 px-4 md:py-16">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={currentStep + 1} totalSteps={questions.length} />

        <div className="relative min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Card className="border-0 shadow-lg bg-card overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <p className="text-sm font-medium text-primary mb-3 uppercase tracking-widest">
                    Question {currentStep + 1} of {questions.length}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8 leading-tight">
                    {currentQuestion.title}
                  </h2>

                  <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={currentAnswer === option.value ? "default" : "outline"}
                        className={`h-auto py-4 px-6 justify-start text-left text-base font-medium transition-all duration-150 ${
                          currentAnswer === option.value
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
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="text-muted-foreground"
                    data-testid="quiz-btn-back"
                  >
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
