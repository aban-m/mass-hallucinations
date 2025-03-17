"use client";
import { trpc } from "@/client/trpc";
import CreationGroup from "@/components/CreationGroup";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

export default function PrivateGalleryPage() {
    const params = useParams()
    const userId = params.userId as string

    const privGal = trpc.privateGallery.useQuery(userId)
    return (
        <main>
            <h1>Private Gallery</h1>
            {privGal.data ? <CreationGroup creations={privGal.data!} /> : <p>NODATA</p>}
        </main>
    );
}