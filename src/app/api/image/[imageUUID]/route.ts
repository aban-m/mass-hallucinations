"use client";
import { canAccess, getCreationByUUID } from "@/lib/db/queries";
import { fetchImage } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
) {
    const params = useParams<{imageUUID: string}>()
    const { imageUUID } = await params;

    if (!z.string().uuid().safeParse(imageUUID)) {
        return NextResponse.json(null, { status: 400 });
    }

    const creation = await getCreationByUUID(imageUUID!)
    if (!creation) { 
        return NextResponse.json(null, {status: 400})
    }

    const accessible = creation!.isPublic
        || await (async () => {
            const session = await getServerSession()
            return !!(session?.user && canAccess(session.user!, creation))
        })()
    
    if (!accessible) {
        return NextResponse.json(null, {status: 403})
    }

    try {
        const url = await fetchImage({creationId: imageUUID!})
        if (!url) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }
        return NextResponse.redirect(url);

    // } catch (error) {
    } catch {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
}