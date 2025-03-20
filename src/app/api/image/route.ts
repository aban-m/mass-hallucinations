import { canAccess, getCreationByUUID } from "@/lib/db/queries";
import { fetchImage } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
    request: NextRequest
) {
    const params = request.nextUrl.searchParams
    const id = params.get("id")
    console.log(id)
    if (!z.string().uuid().safeParse(id)) {
        return NextResponse.json({'error': 'Invalid UUID'}, { status: 400 });
    }

    const creation = await getCreationByUUID(id!)
    if (!creation) { 
        return NextResponse.json({'error': 'Could not find creation'}, {status: 404})
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
        const url = await fetchImage({creationId: id!})
        if (!url) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }
        return NextResponse.redirect(url);

    // } catch (error) {
    } catch {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
}