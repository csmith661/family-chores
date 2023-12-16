import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const choresRouter = createTRPCRouter({
  getChoresBank: publicProcedure
    .input(z.undefined())
    .output(z.object({id: z.number(), chore_name: z.string(), assignee: z.string()}).array())
    .query(async ({ ctx,  }) => {
      const results = await ctx.db.chore.findMany()

      return results
    }),
    addChoreToBank: publicProcedure
    .input(z.object({ chore_name: z.string(), assignee: z.string()}))
    .mutation(async ({ctx, input}) => {
        await ctx.db.chore.create({data: input})
    }),

    addChoreToDay: publicProcedure
    .input(z.object({chore_id: z.number(), dayOfTheWeekInt: z.number(), currentWeekInt: z.number()}))
    .mutation(async({ctx, input}) => {
         await ctx.db.selectedChore.create({data: {chore_id: input.chore_id, assigned_day: input.dayOfTheWeekInt, weekId: input.currentWeekInt}})
    }),

    getAllAddedChores: publicProcedure
    .input(z.undefined())
    .mutation(async({ctx, input}) => {
         const addedChores = await ctx.db.selectedChore.findMany({select: {id: true, assigned_day: true, chore: {select:{chore_name: true, assignee: true}}}})
        const returnObject: Record<string, {id: number, chore_name: string, assignee: string,}[]> = {}
        addedChores.forEach((choreInfo)=> returnObject[choreInfo.assigned_day.toString()]?.push({chore_name: choreInfo.chore.chore_name, id: choreInfo.id, assignee: choreInfo.chore.assignee}) )
        return returnObject
    })
  
});
