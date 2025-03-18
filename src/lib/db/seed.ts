import { db } from "./index";
import { randomUUID } from "crypto";
import { creation, user, userAccess } from "./schema"; // Import userAccess table
import { eq } from "drizzle-orm";

// Generate random boolean
const randomBool = () => Math.random() > 0.5;

// Generate a random number within a range
const randomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

async function seedDatabase() {
    try {
        console.log("Clearing database...");
        await db.delete(userAccess); // Clear user access first (to prevent FK issues)
        await db.delete(creation);
        await db.delete(user);

        console.log("Seeding database...");

        await db.insert(user).values([
            {
                id: '1a737a58-84a2-4546-89e4-51f057bd9345',
                email: 'aban.salah.mahmoud@gmail.com',
                name: 'Aban',
                isAdmin: true,
                username: 'aban',
                credit: 1000
            },
            {
                id: randomUUID(),
                email: 'abandeveloper@gmail.com',
                name: 'Aban2',
                username:'aban2',
                isAdmin: false,
                credit: 10000
            }
        ])

        // Create multiple users
        const users = await Promise.all(
            Array.from({ length: 10 }, (_, i) => db.insert(user).values({
                id: randomUUID(),
                email: `user${i}@example.com`,
                name: `User ${i}`,
                username: `user-${i}`,
                isAdmin: i === 0, // First user is admin
                credit: randomInt(10, 200),
            }).returning({ id: user.id }))
        );

        const userIds = users.map(u => u[0].id);

        // Create multiple creations
        const creations = await Promise.all(
            Array.from({ length: 20 }, () => {
                const creatorId = userIds[randomInt(0, userIds.length - 1)];
                return db.insert(creation).values({
                    id: randomUUID(),
                    userId: creatorId,
                    isPublic: randomBool(),
                    title: `Random Art ${randomUUID().slice(0, 5)}`,
                    description: "Some AI-generated madness",
                    prompt: "AI-generated madness",
                    seed: randomInt(1000, 9999),
                    extraArgs: { width: randomInt(512, 2048), height: randomInt(512, 2048) }
                }).returning({ id: creation.id, userId: creation.userId, isPublic: creation.isPublic });
            })
        );

        const privateCreations = creations.filter(c => !c[0].isPublic);

        // Assign random users access to private creations in `user_access`
        await Promise.all(
            userIds.map(async (userId) => {
                const accessibleCreations = privateCreations
                    .filter(() => randomBool()) // Randomly select some private creations
                    .slice(0, randomInt(3, 5)) // Pick 3-5 private ones

                if (accessibleCreations.length > 0) {
                    await db.insert(userAccess).values(
                        accessibleCreations.map((c) => ({
                            id: randomUUID(),
                            userId: userId,
                            creationId: c[0].id
                        }))
                    );
                }
            })
        );

        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
});
