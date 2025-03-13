import { creation } from "@/lib/db/schema";
import { db  } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function retrieveImage(creationId: string, prompt: string | null): Promise<string>;
export async function retrieveImage(creationId: string | null, prompt: string): Promise<string>;

export async function retrieveImage(creationId: string | null, prompt: string | null) {
    // first, retrieve the prompt
    let actualPrompt = prompt;
    if (!actualPrompt) {
        // use sql-like drizzle to retrieve from id
        const creationRecord = (await db.select().from(creation).where(eq(creation.id, creationId!)).limit(1))[0]
        if (!creationRecord) {
            throw new Error("Creation not found")
        }
        actualPrompt = creationRecord.prompt
    }
    return (async () =>  buildImageUrl(actualPrompt))()
    
}


function buildImageUrl(creationId: string): string {
    return `https://image.pollinations.ai/prompt/${creationId}`
}

