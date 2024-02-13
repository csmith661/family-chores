import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const groceriesRouter = createTRPCRouter({
  updateGroceries: publicProcedure
    .input(
      z.object({
        grocery_name: z.string().optional(),
        grocery_id: z.number().optional(),
        operation: z.enum(["add", "delete"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.operation === "add" && input.grocery_name) {
        return await ctx.db.grocery.create({
          data: {
            name: input.grocery_name,
          },
        });
      }
      if (input.operation === "delete" && input.grocery_id) {
        return await ctx.db.grocery.delete({
          where: { id: input.grocery_id },
        });
      }
    }),

  getGroceriesBank: publicProcedure
    .input(z.undefined())
    .output(
      z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .array(),
    )
    .query(async ({ ctx }) => {
      const results = await ctx.db.grocery.findMany();

      return results;
    }),
});
