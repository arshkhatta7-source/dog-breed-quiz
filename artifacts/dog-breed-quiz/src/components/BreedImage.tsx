import { getBreedImageUrl, BREED_IMAGE_FALLBACK } from "../hooks/useBreedImage";

interface BreedImageProps {
  breedId?: string;
  breedName: string;
  className?: string;
  size?: string;
}

export function BreedImage({ breedName, className = "", size }: BreedImageProps) {
  const src = getBreedImageUrl(breedName, size);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src={src}
        alt={`${breedName} dog`}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          if (el.src !== BREED_IMAGE_FALLBACK) el.src = BREED_IMAGE_FALLBACK;
        }}
      />
    </div>
  );
}
