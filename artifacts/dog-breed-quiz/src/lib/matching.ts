import { breeds, type Breed } from "../data/breeds";

export interface QuizAnswers {
  space: number;          // 0=studio, 1=apartment, 2=house-small, 3=house-large, 4=farm
  activity: number;       // 0=couch, 1=light, 2=moderate, 3=very-active
  aloneHours: number;     // 0=0-2hrs, 1=2-4hrs, 2=4-6hrs, 3=6+hrs
  experience: number;     // 0=never, 1=childhood, 2=adult-1-2, 3=experienced
  allergies: number;      // 0=need-hypo, 1=no-allergies, 2=not-sure
  household: string;      // "solo"|"partner"|"young-kids"|"older-kids"|"elderly"
  otherPets: string;      // "none"|"cats"|"small-animals"|"other-dogs"
  grooming: number;       // 0=hate-shedding, 1=some-ok, 2=love-grooming, 3=dont-care
  sizePreference: number; // 0=tiny, 1=small, 2=medium, 3=large, 4=giant, 5=no-preference
  budget: number;         // 0=under-50, 1=50-100, 2=100-200, 3=over-200
  priority: string;       // "protection"|"playful"|"calm"|"intelligent"|"affection"
  climate: string;        // "hot"|"cold"|"moderate"|"urban"|"suburban"
}

export interface MatchResult {
  breed: Breed;
  score: number;
  matchReasons: string[];
}

export function calculateMatches(answers: QuizAnswers): MatchResult[] {
  const scored = breeds.map(breed => {
    let score = 0;

    // Q1 Space — map 4-farm to 3 max for breed scale
    const spaceVal = Math.min(answers.space, 3);
    const spaceDiff = Math.abs(breed.spaceNeeded - spaceVal);
    score += (3 - spaceDiff) * 2;

    // Q2 Activity/Exercise — most important dimension
    const actDiff = Math.abs(breed.exerciseLevel - answers.activity);
    score += (3 - actDiff) * 3;

    // Q3 Alone time
    const aloneDiff = Math.abs(breed.toleratesAlone - answers.aloneHours);
    score += (3 - aloneDiff) * 2;
    if (answers.aloneHours >= 2 && breed.toleratesAlone === 0) score -= 5;

    // Q4 Experience — map: never=beginner needs 3, experienced=ok with hard breeds
    const expMapped = answers.experience; // 0=never owns, 3=experienced
    const expDiff = Math.abs(breed.beginnerScore - (3 - expMapped));
    score += (3 - expDiff) * 2;
    if (breed.isProtectionBreed && answers.experience === 0) score -= 8;

    // Q5 Allergies
    if (answers.allergies === 0) {
      score += breed.hypoallergenic * 2;
      if (breed.hypoallergenic === 0) score -= 6;
    } else if (answers.allergies === 2) {
      // not sure — prefer hypoallergenic slightly
      score += breed.hypoallergenic;
    } else {
      score += 3;
    }

    // Q6 Household
    if (answers.household === "young-kids" || answers.household === "older-kids") {
      score += breed.goodWithKids;
      if (breed.isProtectionBreed && answers.household === "young-kids") score -= 5;
    } else if (answers.household === "elderly") {
      if (breed.exerciseLevel <= 1) score += 3;
      else if (breed.exerciseLevel === 3) score -= 2;
      else score += 1;
    } else {
      score += 2;
    }

    // Q7 Other pets
    if (answers.otherPets !== "none") {
      score += breed.goodWithPets;
      if (answers.otherPets === "small-animals" && breed.goodWithPets < 2) score -= 3;
      if (answers.otherPets === "cats" && breed.goodWithPets >= 2) score += 1;
    } else {
      score += 2;
    }

    // Q8 Grooming preference
    if (answers.grooming === 0) {
      score += (3 - breed.groomingLevel);
      if (breed.hypoallergenic >= 2) score += 2;
    } else if (answers.grooming === 1) {
      score += breed.groomingLevel <= 2 ? 2 : 1;
    } else if (answers.grooming === 2) {
      score += breed.groomingLevel;
    } else {
      score += 2;
    }

    // Q9 Size preference
    if (answers.sizePreference !== 5) {
      const sizeDiff = Math.abs(breed.sizeCategory - answers.sizePreference);
      score += (4 - sizeDiff) * 2;
    } else {
      score += 4;
    }

    // Q10 Budget
    const budgetScore = answers.budget >= breed.costLevel ? 3 : 3 - (breed.costLevel - answers.budget);
    score += Math.max(0, budgetScore);

    // Q11 Priority
    if (answers.priority === "protection") {
      score += breed.protectionInstinct * 2;
      if (!breed.isProtectionBreed && breed.protectionInstinct === 0) score -= 1;
    } else if (answers.priority === "playful") {
      score += breed.exerciseLevel;
    } else if (answers.priority === "calm") {
      score += (3 - breed.exerciseLevel);
    } else if (answers.priority === "intelligent") {
      const trainability = breed.beginnerScore >= 2 ? 3 : breed.beginnerScore === 1 ? 2 : 1;
      score += trainability;
    } else if (answers.priority === "affection") {
      score += breed.goodWithKids;
    }

    // Q12 Climate
    const bc = breed.climatePreference;
    const isWarmClimate = answers.climate === "hot" || answers.climate === "urban" || answers.climate === "suburban";
    const isColdClimate = answers.climate === "cold";
    if (isWarmClimate) {
      if (bc === "hot") score += 3;
      else if (bc === "cold") score -= 2;
      else score += 1;
    } else if (isColdClimate) {
      if (bc === "cold") score += 3;
      else if (bc === "hot") score -= 2;
      else score += 1;
    } else {
      score += 2;
    }

    const maxPossible = 85;
    const percentage = Math.min(100, Math.max(1, Math.round((score / maxPossible) * 100)));

    const matchReasons = generateMatchReasons(breed, answers);

    return { breed, score: percentage, matchReasons };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

function generateMatchReasons(breed: Breed, answers: QuizAnswers): string[] {
  const reasons: string[] = [];

  // Space
  if (answers.space <= 1 && breed.spaceNeeded <= 1) {
    reasons.push("Thrives in apartment living — no yard needed");
  } else if (answers.space >= 3 && breed.spaceNeeded >= 2) {
    reasons.push("Loves having open space and room to roam freely");
  } else if (answers.space === 4 && breed.spaceNeeded === 3) {
    reasons.push("Built for farm and rural life — needs the space");
  }

  // Activity
  if (answers.activity === 0 && breed.exerciseLevel === 0) {
    reasons.push("Low-energy and perfectly happy with minimal daily exercise");
  } else if (answers.activity === 3 && breed.exerciseLevel === 3) {
    reasons.push("Built for high-intensity activity — hiking, running, and outdoor sports");
  } else if (answers.activity >= 2 && breed.exerciseLevel >= 2) {
    reasons.push("Energetic and thrives with an active owner who loves the outdoors");
  } else if (answers.activity <= 1 && breed.exerciseLevel <= 1) {
    reasons.push("Matches your relaxed lifestyle — content with short, gentle walks");
  }

  // Experience
  if (answers.experience === 0 && breed.beginnerScore >= 2) {
    reasons.push("Easy to train and highly recommended for first-time dog owners");
  } else if (answers.experience >= 2 && breed.isProtectionBreed) {
    reasons.push("Rewards experienced handlers with fierce, unwavering loyalty");
  } else if (answers.experience >= 2 && breed.exerciseLevel === 3) {
    reasons.push("High-energy working breed that thrives with an experienced, active owner");
  }

  // Allergies
  if (answers.allergies === 0 && breed.hypoallergenic >= 2) {
    reasons.push("Low-shedding, allergy-friendly coat — great for sensitive households");
  } else if (answers.allergies === 2 && breed.hypoallergenic >= 2) {
    reasons.push("Minimal shedding coat reduces allergy risk significantly");
  }

  // Household
  if ((answers.household === "young-kids" || answers.household === "older-kids") && breed.goodWithKids >= 2) {
    reasons.push("Famously patient and gentle with children of all ages");
  } else if (answers.household === "elderly" && breed.exerciseLevel <= 1) {
    reasons.push("Calm and low-maintenance — perfect companion for a quieter home");
  } else if (answers.household === "solo" && breed.toleratesAlone >= 2) {
    reasons.push("Independent enough to be happy even when you need solo time");
  }

  // Alone time
  if (answers.aloneHours >= 2 && breed.toleratesAlone >= 2) {
    reasons.push("Independent enough to handle time alone without separation anxiety");
  } else if (answers.aloneHours <= 1 && breed.toleratesAlone === 0) {
    reasons.push("Loves constant companionship — thrives when you are always home");
  }

  // Budget
  if (answers.budget === 0 && breed.costLevel === 0) {
    reasons.push("Naturally low-cost breed — easy on a tight budget");
  }

  // Priority
  if (answers.priority === "protection" && breed.protectionInstinct >= 2) {
    reasons.push("Natural guardian instinct — fiercely protective of home and family");
  } else if (answers.priority === "calm" && breed.exerciseLevel <= 1) {
    reasons.push("Calm, low-key, and perfectly suited for a relaxed household");
  } else if (answers.priority === "affection" && breed.goodWithKids >= 2) {
    reasons.push("Deeply affectionate — lives to love and be loved by their family");
  } else if (answers.priority === "intelligent" && breed.beginnerScore >= 2) {
    reasons.push("Highly intelligent and responds beautifully to consistent training");
  } else if (answers.priority === "playful" && breed.exerciseLevel >= 2) {
    reasons.push("Playful, energetic, and always ready for the next adventure");
  }

  // Climate
  if (answers.climate === "cold" && breed.climatePreference === "cold") {
    reasons.push("Bred for cold climates — thrives in snow and winter weather");
  } else if (answers.climate === "hot" && breed.climatePreference === "hot") {
    reasons.push("Well-suited to warm weather and hot climates");
  }

  // Grooming
  if (answers.grooming === 0 && breed.groomingLevel <= 1) {
    reasons.push("Minimal grooming needs — no fuss, easy coat maintenance");
  } else if (answers.grooming === 2 && breed.groomingLevel >= 2) {
    reasons.push("Gorgeous coat that loves regular brushing and grooming sessions");
  }

  // Other pets
  if (answers.otherPets === "cats" && breed.goodWithPets >= 2) {
    reasons.push("Generally cat-friendly with proper introduction and socialization");
  } else if (answers.otherPets === "other-dogs" && breed.goodWithPets >= 2) {
    reasons.push("Social and friendly with other dogs — great for multi-dog households");
  } else if (answers.otherPets === "small-animals" && breed.goodWithPets >= 2) {
    reasons.push("Tolerant of small animals — safer around rabbits and birds");
  }

  if (reasons.length === 0) {
    reasons.push("Well-balanced temperament that suits your overall lifestyle perfectly");
  }

  return reasons.slice(0, 3);
}
