"use client";
import { trpc } from "@/client/trpc";
import CreationGroup from "@/components/CreationGroup";
import { GalleryDto } from "@/lib/common/dtos";
import { useState } from "react";

export default function GalleryPage() {
  const [params, setParams] = useState<GalleryDto>({public: true, mine: false, fromUsers: []})

  const gallery = trpc.gallery.useQuery(params)
  if (!gallery.data) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <h1>Gallery</h1>
      
      <div>
        <CreationGroup creations={gallery.data!} />
      </div>
    </main>
  );
}
