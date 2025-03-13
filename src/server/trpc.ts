import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession, Session } from "next-auth"

interface Context {
    authSession: Session
}

const t = initTRPC.context<Context>().create()

export const router = t.router

export const baseProcedure = t.procedure

export const publicProcedure = baseProcedure

export const authedProcedure = baseProcedure.use(async (opts) => {
    const session = await getServerSession()
    return opts.next({ctx: {...opts.ctx, authSession: session}})
})

export const protectedProcedure = authedProcedure.use(async (opts) => {
    const { ctx } = opts
    if (ctx.authSession?.user?.email !== 'aban.salah.mahmoud@gmail.com') {
        throw new TRPCError({code: 'FORBIDDEN', message: 'Forbidden'})
    }
    return opts.next()
})