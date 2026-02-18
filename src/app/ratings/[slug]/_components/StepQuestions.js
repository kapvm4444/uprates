"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function StepQuestions({
    business,
    themeStyle,
    answers,
    customAnswers,
    handleAnswerChange,
    handleCustomAnswerChange,
    handleGenerate,
    loading
}) {
    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`border-2 ${themeStyle.border} bg-background/60 backdrop-blur-xl shadow-xl`}>
                <CardHeader>
                    <CardTitle style={{ fontFamily: "var(--font-gotham)" }}>Tell us about your experience</CardTitle>
                    <CardDescription className="text-base text-muted-foreground font-medium">
                        Answer a few quick questions to help us write your review.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {business.questions.map((q, i) => (
                        <div key={i} className="space-y-3">
                            <Label className="text-base font-bold text-foreground/90">{q.question}</Label>
                            <Select onValueChange={(val) => handleAnswerChange(i, val)} value={answers[i] || ""}>
                                <SelectTrigger className={`w-full border-input focus:ring-offset-0 ${themeStyle.ring} font-medium`}>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {q.answers.map((ans, j) => (
                                        <SelectItem key={j} value={ans}>{ans}</SelectItem>
                                    ))}
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>

                            {answers[i] === "Other" && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                    <Input
                                        placeholder="Please specify..."
                                        value={customAnswers[i] || ""}
                                        onChange={(e) => handleCustomAnswerChange(i, e.target.value)}
                                        className={`border-input focus-visible:ring-offset-0 focus-visible:ring-1 ${themeStyle.ring}`}
                                    />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button
                        className={`w-full text-lg h-12 ${themeStyle.btn} text-white font-bold tracking-wide`}
                        style={{ fontFamily: "var(--font-gotham)" }}
                        disabled={loading}
                        onClick={handleGenerate}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Crafting your review...
                            </>
                        ) : (
                            "GENERATE REVIEW"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
