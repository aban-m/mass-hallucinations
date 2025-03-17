"use client";
import { trpc } from "@/client/trpc";
import CreationGroup from "@/components/CreationGroup";
import CreationView from "@/components/CreationView";

export default function PublicGalleryPage() {
  const pubGal = trpc.publicGallery.useQuery();
  return (
    <main>
      <h1>Public Gallery</h1>
      {pubGal.data ? (
        <CreationGroup creations={pubGal.data!} />
      ) : (
        <p>NO DATA</p>
      )}
    </main>
  );
}
