import { breeds, type Breed } from "../data/breeds";

export interface QuizAnswers {
  space: number;
  exercise: number;
  experience: number;
  aloneTime: number;
  budget: number;
  allergies: number;
  household: string; // "adults", "kids", "pets", "both"
}

export interface MatchResult {
  breed: Breed;
  score: number;
  matchReasons: string[];
}

export function calculateMatches(answers: QuizAnswers): MatchResult[] {
  const scoredBreeds = breeds.map(breed => {
    let score = 0;
    const maxScore = 7 * 3; // 7 dimensions, max diff is 3
    const matchReasons: string[] = [];

    // 1. Space
    const spaceDiff = Math.abs(breed.spaceNeeded - answers.space);
    score += (3 - spaceDiff);
    if (spaceDiff <= 1) matchReasons.push("Fits your living space perfectly");

    // 2. Exercise
    const exerciseDiff = Math.abs(breed.exerciseLevel - answers.exercise);
    score += (3 - exerciseDiff);
    if (exerciseDiff === 0) matchReasons.push("Matches your activity level");

    // 3. Experience
    const expDiff = Math.abs(breed.beginnerScore - answers.experience);
    score += (3 - expDiff);
    if (expDiff <= 1 && answers.experience === 3) matchReasons.push("Great for first-time owners");

    // 4. Alone Time
    const aloneDiff = Math.abs(breed.toleratesAlone - answers.aloneTime);
    score += (3 - aloneDiff);
    
    // 5. Budget (if you have high budget, you can afford expensive dogs)
    const costDiff = answers.budget >= breed.costLevel ? 0 : Math.abs(breed.costLevel - answers.budget);
    score += (3 - costDiff);

    // 6. Allergies
    const allergyDiff = Math.abs(breed.hypoallergenic - answers.allergies);
    score += (3 - allergyDiff);
    if (answers.allergies === 3 && breed.hypoallergenic >= 2) matchReasons.push("Allergy-friendly");

    // 7. Household
    let houseDiff = 0;
    if (answers.household === "kids" || answers.household === "both") {
      houseDiff += Math.abs(breed.goodWithKids - 3); // want 3
      if (breed.goodWithKids >= 2) matchReasons.push("Excellent with children");
    }
    if (answers.household === "pets" || answers.household === "both") {
      houseDiff += Math.abs(breed.goodWithPets - 3); // want 3
      if (breed.goodWithPets >= 2) matchReasons.push("Great with other pets");
    }
    // normalize houseDiff to max 3
    if (answers.household === "both") houseDiff = houseDiff / 2;
    score += (3 - houseDiff);

    const percentage = Math.round((score / maxScore) * 100);

    return { breed, score: percentage, matchReasons: matchReasons.slice(0, 3) };
  });

  return scoredBreeds.sort((a, b) => b.score - a.score).slice(0, 3);
}
