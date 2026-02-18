import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    location: v.object({ lat: v.number(), lng: v.number() }),
    type: v.array(v.string()),
    googleLink: v.optional(v.string()), // Made optional
    reviewPageLink: v.optional(v.string()), // Made optional
    questions: v.array(
      v.object({
        question: v.string(),
        answers: v.array(v.string()),
      })
    ),
    colorScheme: v.string(), // Validated in UI, enforced as string here
    // bgColor removed
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Slug already taken");

    // Use default location if 0,0 provided (UI handles logic, but DB just stores)

    const id = await ctx.db.insert("businesses", {
      ...args,
      uniqueID: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

export const get = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("businesses"),
    updates: v.object({
      name: v.optional(v.string()),
      slug: v.optional(v.string()), // Added slug update
      location: v.optional(v.object({ lat: v.number(), lng: v.number() })), // Added location update
      type: v.optional(v.array(v.string())), // Added type update
      googleLink: v.optional(v.string()),
      reviewPageLink: v.optional(v.string()),
      questions: v.optional(v.array(
        v.object({
          question: v.string(),
          answers: v.array(v.string()),
        })
      )),
      colorScheme: v.optional(v.string()),
      // bgColor removed
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
