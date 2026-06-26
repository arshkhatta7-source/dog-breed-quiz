import { useBreedImage } from "../hooks/useBreedImage";

interface BreedImageProps {
  breedId: string;
  breedName: string;
  className?: string;
}

export function BreedImage({ breedId, breedName, className = "" }: BreedImageProps) {
  const { imageUrl, loading } = useBreedImage(breedId);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={`${breedName} dog`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://place.dog/400/300";
        }}
      />
    </div>
  );
}
