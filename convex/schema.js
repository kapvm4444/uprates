import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businesses: defineTable({
    uniqueID: v.string(),
    name: v.string(),
    slug: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    type: v.array(v.string()), // Categories
    googleLink: v.optional(v.string()),
    reviewPageLink: v.optional(v.string()), // Is this redundant if we have slug? keeping as requested
    questions: v.array(
      v.object({
        question: v.string(),
        answers: v.array(v.string()), // Dropdown options
      }),
    ),
    colorScheme: v.union(
      v.literal("zinc"),
      v.literal("red"),
      v.literal("rose"),
      v.literal("orange"),
      v.literal("green"),
      v.literal("blue"),
      v.literal("yellow"),
      v.literal("violet")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(), // Storing hashed password
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    passwordChangedAt: v.optional(v.number()),
    deleteAt: v.optional(v.number()),
  }).index("by_email", ["email"]),
});
