"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepOptions({
    themeStyle,
    loading,
    generatedOptions,
    handleSelectOption
}) {
    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
        >
            <Card className={`border-2 ${themeStyle.border} bg-background/60 backdrop-blur-xl shadow-xl`}>
                <CardHeader>
                    <CardTitle style={{ fontFamily: "var(--font-gotham)" }}>Choose a Review</CardTitle>
                    <CardDescription className="text-base text-muted-foreground font-medium">
                        Select the one that best matches your experience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-24 w-full rounded-xl bg-muted/50 animate-pulse border border-muted" />
                        ))
                    ) : (
                        generatedOptions.map((option, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleSelectOption(option, i)}
                                className={cn(
                                    "group relative cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md bg-background border-input hover:border-foreground/50",
                                    "hover:bg-accent/50"
                                )}
                            >
                                <p className="text-sm leading-relaxed pr-8 font-medium">{option}</p>
                                <div className="absolute right-4 top-4">
                                    <Copy className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
