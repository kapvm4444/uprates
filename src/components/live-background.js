"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LiveBackground({ theme = "zinc" }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const colorMap = {
        zinc: "from-zinc-500/10 to-transparent",
        red: "from-red-500/10 to-transparent",
        rose: "from-rose-500/10 to-transparent",
        orange: "from-orange-500/10 to-transparent",
        green: "from-green-500/10 to-transparent",
        blue: "from-blue-500/10 to-transparent",
        yellow: "from-yellow-500/10 to-transparent",
        violet: "from-violet-500/10 to-transparent",
    };

    const gradientColor = colorMap[theme] || colorMap.zinc;

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", handleMouseMove);
            return () => window.removeEventListener("mousemove", handleMouseMove);
        }
    }, []);

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-background">
            {/* 45-degree Striped Pattern */}
            <div
                className="absolute inset-0 opacity-10 dark:opacity-5"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                -45deg,
                currentColor 0,
                currentColor 1px,
                transparent 1px,
                transparent 40px
            )`,
                    color: "var(--foreground)"
                }}
            />

            {/* Animated Gradient Orbs for subtle color */}
            <motion.div
                className={`absolute w-[800px] h-[800px] rounded-full bg-gradient-radial ${gradientColor} opacity-40 blur-3xl`}
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                transition={{
                    type: "spring",
                    damping: 50,
                    stiffness: 50,
                    mass: 0.1
                }}
            />

            <motion.div
                className={`absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial ${gradientColor} opacity-20 blur-3xl`}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        </div>
    );
}
