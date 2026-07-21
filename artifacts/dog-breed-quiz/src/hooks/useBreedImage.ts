const FALLBACK = "https://place.dog/300/200";

/**
 * Converts a breed name to an Unsplash Source URL.
 * Unsplash Source works as a direct img src — no fetch needed.
 * Example: "Golden Retriever" → https://source.unsplash.com/300x200/?golden-retriever-dog
 */
export function getBreedImageUrl(breedName: string, size = "300x200"): string {
  const query = breedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") + "-dog";
  return `https://source.unsplash.com/${size}/?${encodeURIComponent(query)}`;
}

export { FALLBACK as BREED_IMAGE_FALLBACK };
