import { db } from "./index";
import { randomUUID } from "crypto";
import { creation, user } from "./schema";

async function seed() {
    try {
        console.log("Clearing database...");
        await db.delete(creation);
        await db.delete(user);

        console.log("Seeding database...");
        // Create sample users
        const user1 = await db.insert(user).values({
            id: randomUUID(),
            email: "demo@example.com",
            name: "Demo User",
            isAdmin: true,
            credit: 100,
            canAccess: { ids: [] }
        }).returning({id: creation.id})

        const user2 = await db.insert(user).values({
            id: randomUUID(),
            email: "alice@example.com",
            name: "Alice Johnson",
            isAdmin: false,
            credit: 50,
            canAccess: { ids: [] }
        }).returning({id: creation.id})


        // Create sample creations
        await db.insert(creation).values({
            id: randomUUID(),
            userId: user1[0].id,
            isPublic: true,
            title: "Mountain Landscape",
            description: "A beautiful mountain landscape at sunset",
            prompt: "Mountain landscape with sunset, dramatic lighting, photorealistic",
            seed: 12345,
            extraArgs: { width: 1024, height: 768 }
        });

        await db.insert(creation).values({
            id: randomUUID(),
            userId: user2[0].id,
            isPublic: true,
            title: "Space Scene",
            description: "Deep space nebula visualization",
            prompt: "Colorful space nebula with stars, cosmic, ethereal",
            seed: 67890,
            extraArgs: { width: 1024, height: 1024 }
        });

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
