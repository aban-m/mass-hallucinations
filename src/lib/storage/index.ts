import { creation } from "@/lib/db/schema";
import { db  } from "@/lib/db";
import { eq } from "drizzle-orm";
import { GenerateImageDto } from "../common/dtos";

export async function fetchImage({creationId, data}:{ 
    creationId?: string, 
    data?: GenerateImageDto, 
    commit?: boolean 
}): Promise<string> {
    console.log(creationId)
    // first, retrieve the prompt
    let actualData = data
    if (creationId){
        // use sql-like drizzle to retrieve from id
        const creationRecord = (await db.select().from(creation).where(eq(creation.id, creationId!)).limit(1))[0]
        if (!creationRecord) {
            throw new Error("Creation not found")
        }
        actualData = creationRecord
    }
    return (async () =>  buildImageUrl(actualData!))()
    
}


async function buildImageUrl(actualData: GenerateImageDto): Promise<string> {
    const url = `https://image.pollinations.ai/prompt/${actualData.prompt}?seed=${actualData.seed}`
    console.log(url)
    await new Promise((resolve) => setTimeout(resolve, 2000))       // TODO: Implement this. Must wait until the data is actually generated.
    return url
}

