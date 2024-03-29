import { z } from "zod";
import { createTRPCRouter, protectedProcedure,  } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserData: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input,
        },
      });
      return user;
    }),
  
});
