import { z } from "zod"

const serverPolicySchema = z.object({
    IMAGE_COST: z.string().transform((val) => Number(val)),
    GUESTS_CAN_GENERATE: z.string().optional().default('0').transform((val) => !!Number(val)),
})

export const serverPolicy = serverPolicySchema.parse(process.env)