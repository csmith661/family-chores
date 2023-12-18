import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear)


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
    .input(z.object({chore_id: z.number(), dayOfTheWeekInt: z.number(), }))
    .output(z.object({id: z.number(), chore_name: z.string(), assigned_day: z.number(), assignee: z.string(), finished: z.boolean()}))
    .mutation(async({ctx, input}) => {
      const newChore = await ctx.db.selectedChore.create({data: {chore_id: input.chore_id, assigned_day: input.dayOfTheWeekInt, finished: false}, select: {id: true, assigned_day: true, finished: true, chore: {select: {assignee: true, chore_name: true}}}})
      
      const synthesizedNewChore = {
        id: newChore.id,
        chore_name: newChore.chore.chore_name,
        assigned_day: newChore.assigned_day,
        assignee: newChore.chore.assignee,
        finished: newChore.finished
      }
      
      return synthesizedNewChore
    }),

    getAllAddedChores: publicProcedure
    .input(z.undefined())
    .output((z.record(z.object({id: z.number(), chore_name: z.string(), assignee: z.string(), finished: z.boolean()}).array())))
    .query(async({ctx, input}) => {
         const addedChores = await ctx.db.selectedChore.findMany({select: {id: true, assigned_day: true, finished: true, chore: {select:{chore_name: true, assignee: true}}}})
        const returnObject: Record<string, {id: number, chore_name: string, assignee: string, finished: boolean}[]> = {}
        console.log(addedChores)
        addedChores.forEach((choreInfo)=> {
          
          if(returnObject[choreInfo.assigned_day.toString()]){
            returnObject[choreInfo.assigned_day.toString()]?.push({chore_name: choreInfo.chore.chore_name, id: choreInfo.id, assignee: choreInfo.chore.assignee, finished: choreInfo.finished})
          } else{
            returnObject[choreInfo.assigned_day.toString()] = [{chore_name: choreInfo.chore.chore_name, id: choreInfo.id, assignee: choreInfo.chore.assignee, finished: choreInfo.finished}]

          }
        })
       

        return returnObject
        
    }),
    updateChore: publicProcedure
    .input(z.object({chore_id: z.number(), operation: z.enum([ "complete", "delete"])}))
    .mutation(async({ctx, input})=>{

      if(input.operation === 'complete'){
        return await ctx.db.selectedChore.update({where: {id: input.chore_id}, data: {finished: true}})
      }
      if(input.operation === 'delete'){
        return await ctx.db.selectedChore.delete({where: {id: input.chore_id}})
      }
    })
  
});
