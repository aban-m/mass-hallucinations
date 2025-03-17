import { fetchImage } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { imageUUID?: string } }
) {
    const { imageUUID } = await params;
    if (!imageUUID) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    try {
        const url = await fetchImage(imageUUID, null)
        if (!url) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }
        return NextResponse.redirect(url);
    } catch (error) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
}