"use client";
import { trpc } from "@/client/trpc";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

export default function PrivateGalleryPage() {
    const params = useParams()
    const userId = params.userId as string

    const privGal = trpc.privateGallery.useQuery({ownerId: userId})
    return (
        <main>
            <h1>Private Gallery</h1>
            {privGal.data?.map((creation) => (
                <div key={creation.id}>
                    <h2>{creation.id}</h2>
                    <p>{creation.prompt}</p>
                </div>
            ))}
        </main>
    );
}