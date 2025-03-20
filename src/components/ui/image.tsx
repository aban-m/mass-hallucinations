import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

type ImageWithLoaderProps = {
  src: string | undefined;
  className?: string;
  loading: boolean;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
};
export function ImageWithLoader({
  src,
  className,
  loading,
  imgProps,
  divProps,
}: ImageWithLoaderProps) {
  return (
    <div
      {...divProps}
      className={cn(
        "relative flex items-center justify-center w-full",
        divProps?.className
      )}
    >
      {loading ? (
        <>
          {/* Skeleton should preserve aspect ratio */}
          <Skeleton
            className={cn("absolute w-full h-full rounded-md", className)}
          />
          <Loader2 className="absolute animate-spin text-gray-500" />
        </>
      ) : null}
      <img
        {...imgProps}
        src={src}
        className={cn(
          "object-cover", // Ensure the image covers the space correctly
          imgProps?.className
        )}
      />
    </div>
  );
}