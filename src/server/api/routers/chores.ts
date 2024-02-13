import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

dayjs.extend(weekOfYear);

const ChoreReturnSchema = z.object({
  id: z.number(),
  assigned_day: z.number(),
  finished: z.boolean(),
  chore: z.object({ assignee: z.string(), chore_name: z.string() }),
});

export const choresRouter = createTRPCRouter({
  getChoresBank: publicProcedure
    .input(z.undefined())
    .output(
      z
        .object({
          id: z.number(),
          chore_name: z.string(),
          assignee: z.string(),
        })
        .array(),
    )
    .query(async ({ ctx }) => {
      const results = await ctx.db.chore.findMany();

      return results;
    }),
  addChoreToBank: publicProcedure
    .input(z.object({ chore_name: z.string(), assignee: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.chore.create({ data: input });
    }),
  deleteChoreFromBank: publicProcedure
    .input(z.object({ chore_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.chore.delete({ where: { id: input.chore_id } });
    }),

  addChoreToDay: publicProcedure
    .input(z.object({ chore_id: z.number(), dayOfTheWeekInt: z.number() }))
    .output(
      z.object({
        id: z.number(),
        chore_name: z.string(),
        assigned_day: z.number(),
        assignee: z.string(),
        finished: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newChore = await ctx.db.selectedChore.create({
        data: {
          chore_id: input.chore_id,
          assigned_day: input.dayOfTheWeekInt,
          finished: false,
        },
        select: {
          id: true,
          assigned_day: true,
          finished: true,
          chore: { select: { assignee: true, chore_name: true } },
        },
      });

      const validatedReturn = ChoreReturnSchema.parse(newChore);

      //add nonsense comments here
      const synthesizedNewChore = {
        id: validatedReturn.id,
        chore_name: validatedReturn.chore.chore_name,
        assigned_day: validatedReturn.assigned_day,
        assignee: validatedReturn.chore.assignee,
        finished: validatedReturn.finished,
      };

      return synthesizedNewChore;
    }),

  getAllAddedChores: publicProcedure
    .input(z.undefined())
    .output(
      z.record(
        z
          .object({
            id: z.number(),
            chore_name: z.string(),
            assignee: z.string(),
            finished: z.boolean(),
          })
          .array(),
      ),
    )
    .query(async ({ ctx }) => {
      const addedChores = await ctx.db.selectedChore.findMany({
        select: {
          id: true,
          assigned_day: true,
          finished: true,
          chore: { select: { chore_name: true, assignee: true } },
        },
      });

      const validatedReturn = ChoreReturnSchema.array().parse(addedChores);
      const returnObject: Record<
        string,
        {
          id: number;
          chore_name: string;
          assignee: string;
          finished: boolean;
        }[]
      > = {};

      validatedReturn.forEach((choreInfo) => {
        if (returnObject[choreInfo.assigned_day.toString()]) {
          returnObject[choreInfo.assigned_day.toString()]?.push({
            chore_name: choreInfo.chore.chore_name,
            id: choreInfo.id,
            assignee: choreInfo.chore.assignee,
            finished: choreInfo.finished,
          });
        } else {
          returnObject[choreInfo.assigned_day.toString()] = [
            {
              chore_name: choreInfo.chore.chore_name,
              id: choreInfo.id,
              assignee: choreInfo.chore.assignee,
              finished: choreInfo.finished,
            },
          ];
        }
      });

      return returnObject;
    }),
  updateChore: publicProcedure
    .input(
      z.object({
        chore_id: z.number(),
        operation: z.enum(["complete", "delete"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.operation === "complete") {
        return await ctx.db.selectedChore.update({
          where: { id: input.chore_id },
          data: { finished: true },
        });
      }
      if (input.operation === "delete") {
        return await ctx.db.selectedChore.delete({
          where: { id: input.chore_id },
        });
      }
    }),
});
