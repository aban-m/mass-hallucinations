import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

type ImageWithLoaderProps = {
  src: string;
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
        "relative flex items-center justify-center",
        divProps?.className
      )}
    >
      {loading && (
        <Skeleton
          className={cn("absolute w-full h-full rounded-md", className)}
        />
      )}
      {loading && <Loader2 className="absolute animate-spin text-gray-500" />}
      <img
        {...imgProps}
        src={src}
        className={cn(
          "",
          loading ? "opacity-0" : "opacity-100",
          imgProps?.className
        )}
      />
    </div>
  );
}
