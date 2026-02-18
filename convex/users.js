import { mutation, query, action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";

// --- Public Queries ---

export const get = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const remove = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// --- Internal Mutations (DB Access) ---

export const createInternal = internalMutation({
    args: {
        name: v.string(),
        email: v.string(),
        password: v.string(), // Hashed
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
        if (existing) throw new Error("User already exists");

        return await ctx.db.insert("users", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const getByEmailInternal = internalQuery({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    }
});

// --- Public Actions (Business Logic + Hashing) ---

export const create = action({
    args: {
        name: v.string(),
        email: v.string(),
        password: v.string(),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(args.password, salt);

        return await ctx.runMutation(internal.users.createInternal, {
            name: args.name,
            email: args.email,
            password: hashedPassword,
            active: args.active,
        });
    },
});

export const login = action({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getByEmailInternal, { email: args.email });

        if (!user) return null;
        if (!user.active) return null;

        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) return null;

        // Return safe user object (remove password)
        const { password, ...safeUser } = user;
        return safeUser;
    },
});
