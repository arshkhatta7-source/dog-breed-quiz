import { useState, useEffect, useRef } from "react";
import { getDogCeoApiUrl } from "../lib/dogCeoMapping";

const FALLBACK = "https://place.dog/400/300";

// Module-level cache survives component remounts and navigation
const memoryCache = new Map<string, string>();

function getSessionCache(breedId: string): string | null {
  try { return sessionStorage.getItem(`dbq_img_${breedId}`); } catch { return null; }
}

function setSessionCache(breedId: string, url: string) {
  try { sessionStorage.setItem(`dbq_img_${breedId}`, url); } catch { /* storage full */ }
}

export function useBreedImage(breedId: string): { imageUrl: string; loading: boolean } {
  const getInitial = (): string => {
    if (memoryCache.has(breedId)) return memoryCache.get(breedId)!;
    const s = getSessionCache(breedId);
    if (s) { memoryCache.set(breedId, s); return s; }
    return "";
  };

  const [imageUrl, setImageUrl] = useState<string>(getInitial);
  const [loading, setLoading] = useState<boolean>(!getInitial());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (imageUrl) { setLoading(false); return; }

    const apiUrl = getDogCeoApiUrl(breedId);
    if (!apiUrl) {
      // No Dog CEO slug for this breed — use place.dog
      memoryCache.set(breedId, FALLBACK);
      setSessionCache(breedId, FALLBACK);
      setImageUrl(FALLBACK);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const resolve = (url: string) => {
      memoryCache.set(breedId, url);
      setSessionCache(breedId, url);
      if (!controller.signal.aborted) setImageUrl(url);
    };

    fetch(apiUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) { resolve(FALLBACK); return; }
        return r.json().then((data) => {
          const msg: string = data?.message ?? "";
          resolve(msg.startsWith("http") ? msg : FALLBACK);
        });
      })
      .catch(() => { if (!controller.signal.aborted) resolve(FALLBACK); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [breedId, imageUrl]);

  return { imageUrl: imageUrl || FALLBACK, loading };
}
