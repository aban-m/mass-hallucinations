import { trpc } from "@/client/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function PrivateGalleryPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { userId } = router.query;

    const privGal = trpc.privateGallery.useQuery(
        { ownerId: userId as string, visitorId: session?.user?.id || null },
        { enabled: !!userId }
    );

    return (
        <main>
            <h1>Private Gallery</h1>
            {privGal.data?.map((creation) => (
                <div key={creation.id}>
                    <h2>{creation.title}</h2>
                    <p>{creation.description}</p>
                </div>
            ))}
        </main>
    );
}