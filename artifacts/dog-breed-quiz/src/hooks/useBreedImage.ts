import { useEffect, useState } from "react";

const FALLBACK = "";
const imageCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

// Dog CEO uses a different order and spelling for some breeds than our display names.
const DOG_CEO_ROUTES: Record<string, string> = {
  "labrador retriever": "labrador",
  "golden retriever": "retriever/golden",
  "german shepherd": "german/shepherd",
  "french bulldog": "bulldog/french",
  bulldog: "bulldog/english",
  poodle: "poodle/standard",
  "yorkshire terrier": "terrier/yorkshire",
  "siberian husky": "husky",
  "great dane": "dane/great",
  "doberman pinscher": "doberman",
  "shih tzu": "shihtzu",
  "border collie": "collie/border",
  "cocker spaniel": "spaniel/cocker",
  "australian shepherd": "australian/shepherd",
  "pembroke welsh corgi": "pembroke",
  "bernese mountain dog": "mountain/bernese",
  "saint bernard": "stbernard",
  "shiba inu": "shiba",
  "alaskan malamute": "malamute",
  "shar pei": "sharpei",
  "afghan hound": "hound/afghan",
  bloodhound: "hound/blood",
  "irish setter": "setter/irish",
  "bichon frise": "frise/bichon",
  "miniature schnauzer": "schnauzer/miniature",
  "belgian malinois": "malinois",
  "boston terrier": "terrier/boston",
  "rhodesian ridgeback": "ridgeback/rhodesian",
  "old english sheepdog": "sheepdog/english",
  "west highland white terrier": "terrier/westhighland",
  "scottish terrier": "terrier/scottish",
  "italian greyhound": "greyhound/italian",
  "irish wolfhound": "wolfhound/irish",
  "tibetan mastiff": "mastiff/tibetan",
  "english springer spaniel": "springer/english",
  "miniature pinscher": "pinscher/miniature",
  "bull terrier": "bullterrier",
  "english setter": "setter/english",
  "gordon setter": "setter/gordon",
  "norwegian elkhound": "elkhound/norwegian",
  "australian cattle dog": "cattledog/australian",
  "cardigan welsh corgi": "corgi/cardigan",
  "giant schnauzer": "schnauzer/giant",
  "flat-coated retriever": "retriever/flatcoated",
  "welsh springer spaniel": "spaniel/welsh",
  labradoodle: "labradoodle",
  cockapoo: "cockapoo",
  cavapoo: "cavapoo",
  puggle: "puggle",
  "american pit bull terrier": "pitbull",
  "caucasian shepherd": "ovcharka/caucasian",
  "english mastiff": "mastiff/english",
  bullmastiff: "mastiff/bull",
  "american eskimo dog": "eskimo",
  komondor: "komondor",
  kuvasz: "kuvasz",
  havanese: "havanese",
  papillon: "papillon",
  "belgian tervuren": "tervuren",
  "belgian sheepdog": "groenendael",
};

function normalizeBreedName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image request failed: ${response.status}`);
  return response.json();
}

async function fetchBreedImage(breedName: string): Promise<string> {
  const normalizedName = normalizeBreedName(breedName);
  const dogCeoRoute = DOG_CEO_ROUTES[normalizedName];

  if (dogCeoRoute) {
    try {
      const result = (await fetchJson(
        `https://dog.ceo/api/breed/${dogCeoRoute}/images/random`,
      )) as { message?: string; status?: string };

      if (result.status === "success" && result.message) {
        return result.message;
      }
    } catch {
      // Try Wikipedia below if Dog CEO is temporarily unavailable.
    }
  }

  // Wikipedia's summary endpoint covers the less common breeds not in Dog CEO.
  try {
    const result = (await fetchJson(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        breedName.replace(/ /g, "_"),
      )}`,
    )) as { thumbnail?: { source?: string } };

    if (result.thumbnail?.source) return result.thumbnail.source;
  } catch {
    // The component will show a neutral placeholder instead of a repeated photo.
  }

  return FALLBACK;
}

function loadBreedImage(breedName: string): Promise<string> {
  const key = normalizeBreedName(breedName);
  const cached = imageCache.get(key);
  if (cached !== undefined) return Promise.resolve(cached);

  const pending = pendingRequests.get(key);
  if (pending) return pending;

  const request = fetchBreedImage(breedName)
    .then((src) => {
      imageCache.set(key, src);
      pendingRequests.delete(key);
      return src;
    })
    .catch(() => {
      pendingRequests.delete(key);
      return FALLBACK;
    });

  pendingRequests.set(key, request);
  return request;
}

export function useBreedImage(breedName: string, enabled = true) {
  const [src, setSrc] = useState(() => imageCache.get(normalizeBreedName(breedName)) ?? FALLBACK);
  const [loading, setLoading] = useState(enabled && !src);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const cached = imageCache.get(normalizeBreedName(breedName));
    if (cached !== undefined) {
      setSrc(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadBreedImage(breedName).then((imageSrc) => {
      if (cancelled) return;
      setSrc(imageSrc);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [breedName, enabled]);

  return { src, loading };
}

export { FALLBACK as BREED_IMAGE_FALLBACK };
