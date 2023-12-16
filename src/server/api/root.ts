import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { choresRouter } from "./routers/chores";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chores: choresRouter,
  user: userRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
