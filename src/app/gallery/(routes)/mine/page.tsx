"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPrivateGalleryPage() {
    const session = useSession()
    const router = useRouter()

    if (!session.data) {
        return <>
            <h1>NOT LOGGED IN</h1>
            <Link href='/login'>Login here</Link>
        </>
    }

    return redirect(`/gallery/${session.data.user.id}`)
}