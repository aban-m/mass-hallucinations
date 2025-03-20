"use client";
import { trpc } from "@/client/trpc";
import CreationGroup from "@/components/CreationGroup";
import { GetGalleryDto } from "@/lib/common/dtos";
import { useState } from "react";

export default function GalleryPage() {
  const [params, setParams] = useState<GetGalleryDto>({which: "PUBLIC"})

  const {data: gallery} = trpc.gallery.useQuery(params)
  if (!gallery) {
    return <p>Loading...</p>
  }

  return (
    <div className="w-full">
        <CreationGroup creations={gallery.data.map((d) => d.creation)} />
      </div>
  );
}
