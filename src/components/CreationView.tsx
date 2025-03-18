import Image, { ImageProps } from "next/image";
import { creation } from "@/lib/db/schema";
import { forwardRef } from "react";

type CreationViewProps = Omit<ImageProps & (typeof creation.$inferSelect), "src" | "alt">;

const CreationView = forwardRef<HTMLDivElement, CreationViewProps>(({ id, title, prompt, ...props }, ref) => {
  return (
    <div ref={ref}>
      <Image 
        src={`/api/image/${id}`}
        alt={title}
        unoptimized
        width={480} 
        height={360}
        {...props}
      />
      <p>{title}</p>
      <i>Prompt: {prompt}</i>
    </div>
  );
});

export default CreationView;
