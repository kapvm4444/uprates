import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateReviewOptions = action({
    args: {
        businessName: v.string(),
        businessType: v.string(),
        answers: v.array(v.object({ question: v.string(), answer: v.string() })),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            // Return mock data if no key, useful for dev
            console.warn("OPENAI_API_KEY not found, returning mock reviews");
            return [
                `I had a great experience with ${args.businessName}. The service was excellent and I would highly recommend them.`,
                `Professional and efficient. ${args.businessName} delivered exactly what I needed.`,
                `Very satisfied with the quality of service at ${args.businessName}. Will definitely return.`,
                `Amazing experience! The team at ${args.businessName} was helpful and knowledgeable.`
            ];
        }

        const prompt = `Generate 4 distinct, positive Google review options for a business named "${args.businessName}" which offers "${args.businessType}".
    
    Context from user experience:
    ${args.answers.map(a => `- ${a.question}: ${a.answer}`).join("\n")}
    
    Return ONLY a JSON array of strings, where each string is a review option. No markdown formatting.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates Google reviews." },
                    { role: "user", content: prompt },
                ],
            }),
        });

        const json = await response.json();
        if (json.error) {
            throw new Error(json.error.message || "OpenAI API error");
        }

        const content = json.choices[0].message.content;
        try {
            const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanContent);
            if (Array.isArray(parsed)) return parsed;
            throw new Error("Not an array");
        } catch (e) {
            console.error("Failed to parse OpenAI response", content);
            // Fallback
            return [
                `Great service at ${args.businessName}!`,
                `Highly recommend ${args.businessName}.`,
                `Excellent experience with ${args.businessName}.`,
                `Very professional team at ${args.businessName}.`
            ];
        }
    },
});
