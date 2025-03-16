import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession, Session } from "next-auth"
import { eq } from "drizzle-orm"
import { transmittedUser } from "../../next-auth";

interface Context {
    user: transmittedUser
}

const t = initTRPC.context<Context>().create()

export const router = t.router

export const baseProcedure = t.procedure

export const publicProcedure = baseProcedure


// authedProcedure:
// Populates the context with session, but does not complain
// if the session is empty.
export const authedProcedure = baseProcedure.use(async (opts) => {
    const session = await getServerSession()
    if (!session) {
        return opts.next()
    }
    return opts.next({ctx: {...opts.ctx, user: session.user}})
})

// After population, it will complain if the session is empty
export const protectedProcedure = authedProcedure.use(async (opts) => {
    if (!opts.ctx.user) {
        throw new TRPCError({code: 'UNAUTHORIZED', message: 'Unauthorized'})
    }
    return opts.next()
})

// Requires admin privileges.
export const adminProcedure = protectedProcedure.use(async (opts) => {
    const { ctx } = opts
    if (!ctx.user.isAdmin) {
        throw new TRPCError({code: "FORBIDDEN", message: 'Forbidden'})
    }
    return opts.next()
})