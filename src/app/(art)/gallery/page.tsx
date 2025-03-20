"use client";
import { trpc } from "@/client/trpc";
import CreationGroup from "@/components/CreationGroup";
import { GetGalleryDto } from "@/lib/common/dtos";
import { useState } from "react";
export default function GalleryPage() {
  const [params, setParams] = useState<GetGalleryDto>({which: "PUBLIC"})

  const {data: gallery} = trpc.gallery.useQuery(params)

  return (
    <div className="flex flex-col items-center justify-center p-6">
        {gallery && <CreationGroup creations={gallery.data.map((d) => d.creation)} />}
          </div>
  );
}
