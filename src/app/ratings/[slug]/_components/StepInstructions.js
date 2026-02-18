"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function StepInstructions({
    business,
    themeStyle,
    setStep
}) {
    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <Card className="border-0 shadow-lg bg-background/90 backdrop-blur-md overflow-hidden mb-6">
                <CardHeader className="text-center pb-2">
                    <div className={`mx-auto bg-green-100 text-green-600 rounded-full p-3 w-fit mb-2`}>
                        <Check className="h-6 w-6" />
                    </div>
                    <CardTitle style={{ fontFamily: "var(--font-gotham)" }}>Review Copied!</CardTitle>
                    <CardDescription>Follow the instructions below to post it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* GIF Container with Cropping via overflow and scale */}
                    <div className="relative rounded-lg overflow-hidden border bg-black aspect-video flex items-center justify-center">
                        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                            <Image
                                src="/animations/ratings-animation.gif"
                                alt="Instructions"
                                fill
                                className="object-cover scale-105" // Gentle scale to hide watermarks without losing content
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className="text-sm text-left space-y-2 bg-muted/50 p-4 rounded-lg">
                        <p>1. Click <b>"Post on Google Maps"</b> below.</p>
                        <p>2. Select the stars (★★★★★).</p>
                        <p>3. Long press the text box and <b>Paste</b> your review.</p>
                    </div>
                </CardContent>
            </Card>

            <Link href={business.googleLink || "#"} target="_blank">
                <Button size="lg" className={`w-full text-lg h-14 gap-2 shadow-lg animate-pulse hover:animate-none ${themeStyle.btn} text-white font-bold tracking-wide`} style={{ fontFamily: "var(--font-gotham)" }}>
                    <ExternalLink className="h-5 w-5" />
                    POST ON GOOGLE MAPS
                </Button>
            </Link>

            <Button variant="ghost" onClick={() => setStep(2)} className="w-full">
                Back to Review Options
            </Button>
        </motion.div>
    );
}
