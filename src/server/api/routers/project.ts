import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the Clerk user
      const clerk = await clerkClient();
      if (!ctx.user.userId) {
        throw new Error("User not authenticated");
      }
      const clerkUser = await clerk.users.getUser(ctx.user.userId);
      
      // Get the email from the Clerk user
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        throw new Error("User email not found");
      }
      
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userToProjects: {
            create: {
              user: {
                connect: {
                  email: email,
                }
              }
            },
          },
        },
      });

      return project;
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
      const projects = await ctx.db.project.findMany({
        where: {
          userToProjects: {
            some: {
              user: {
                email: ctx.user.email,
              },
            },
            deletedAt: null,
          },
        },
      });
    }),
});
