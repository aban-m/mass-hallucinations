import { creation } from "@/lib/db/schema";
import { db  } from "@/lib/db";
import { eq } from "drizzle-orm";
import { GenerateImageDto } from "../common/dtos";

export async function fetchImage(creationId: string, data: null): Promise<string>;
export async function fetchImage(creationId: null, data: GenerateImageDto): Promise<string>;

export async function fetchImage(creationId: string | null, data: GenerateImageDto | null) {
    // first, retrieve the prompt
    let actualData = data
    if (!actualData){
        // use sql-like drizzle to retrieve from id
        const creationRecord = (await db.select().from(creation).where(eq(creation.id, creationId!)).limit(1))[0]
        if (!creationRecord) {
            throw new Error("Creation not found")
        }
        actualData = creationRecord
    }
    return (async () =>  buildImageUrl(actualData))()
    
}


async function buildImageUrl(actualData: GenerateImageDto): Promise<string> {
    const url = `https://image.pollinations.ai/prompt/${actualData.prompt}?seed=${actualData.seed}`
    console.log(url)
    await setTimeout(() => {}, 2000)        // TODO: Implement this. Must wait until the data is actually generated.
    return url
}

