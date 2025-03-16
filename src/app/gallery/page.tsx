"use client";
import { trpc } from "@/client/trpc"

export default function PublicGalleryPage() {
    const pubGal = trpc.publicGallery.useQuery();
    return (
        <main>
            <h1>Public Gallery</h1>
            {pubGal.data?.map((creation) => (
                <div key={creation.id}>
                    <h2>{creation.id}</h2>
                    <p>{creation.prompt}</p>
                </div>
            ))}
        </main>
    );
}