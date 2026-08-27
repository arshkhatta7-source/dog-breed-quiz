import { useEffect, useRef, useState } from "react";
import { useBreedImage } from "../hooks/useBreedImage";

interface BreedImageProps {
  breedId?: string;
  breedName: string;
  className?: string;
  size?: string;
}

export function BreedImage({ breedName, className = "", size }: BreedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { src, loading } = useBreedImage(breedName, isVisible);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {src ? (
        <img
          src={src}
          alt={`${breedName} dog`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-stone-200 ${
            loading ? "animate-pulse" : ""
          }`}
          role="img"
          aria-label={`${breedName} image unavailable`}
        />
      )}
    </div>
  );
}
