/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { TRPCClientError } from "@trpc/client";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */


// t is just a custom variable name that holds all the tRPC utilities
// t.thing	What it does
// t.router()	Creates a new tRPC router
// t.procedure	Starts defining a query or mutation
// t.middleware()	Creates a middleware like your isAuthenticated example
// t.mergeRouters()	Combines multiple routers


const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */



// A middleware is like a gatekeeper or checkpoint in your application that runs before the main logic.

// You can think of it as:
// “Before you enter the room (handler), let me check your ticket (authentication).”

// Middleware is a function that:

// Runs before your API endpoint.

// Middleware Flow (in tRPC):


// Client → Middleware → (passes?) → Handler → Response
//                    → (fails?) → Error → Response

// next() is a function that tells tRPC:
// “I'm done with this middleware, you can go to the next step now.”



const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  const user = await auth() 
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" ,
      message: 'You must be logged in'
    });
  }
  return next({ // continues to the next procedure or middleware
    ctx:{
      ...ctx,  // Take existing context
      user   // Add/override user key
    }
  }); 
});

// ctx is just a shared object that holds useful data for each request, like:
// The logged-in user

// The database connection

// The request session

// Anything you want to access in middleware or procedures



const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure.use(isAuthenticated);
//procedure is like a api endpoint
//use is used to attach middleware to the procedure
//protectedProcedure is a procedure that is protected by authentication we created it 
