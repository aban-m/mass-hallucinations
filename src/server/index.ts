import { router, publicProcedure, protectedProcedure } from "./trpc"

export const appRouter = router({
    ping: protectedProcedure
        .query(() => { 
            return "pong"
        })
})

export type AppRouter = typeof appRouter
