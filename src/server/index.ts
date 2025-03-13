import { router, publicProcedure, protectedProcedure } from "./trpc"

let x = 1

export const appRouter = router({
    ping: publicProcedure
        .query(() => { 
            x += 1
            return `Pong ${x}`
        }),
    reset: protectedProcedure
        .mutation(() => {
            x = 1
            return `Reset ${x}`
        })
})

export type AppRouter = typeof appRouter
