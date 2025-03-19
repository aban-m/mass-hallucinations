"use client";

import { trpc } from "@/client/trpc";
import CreationGroup from "@/components/CreationGroup";
import { Creation } from "@/lib/db/schema";
import { useParams } from "next/navigation";

export default function ProfilePage() {
    const { userUUID } = useParams<{userUUID: string}>()
    const {data: userProfile, isLoading, error }= trpc.userGallery.useQuery(userUUID)

    return (userProfile && (<>
        <h1>{userProfile.user.name}</h1>
        <CreationGroup creations={userProfile!.creations.data} />
    </>))
    

}