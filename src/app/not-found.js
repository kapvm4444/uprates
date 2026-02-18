import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4 text-center space-y-6">
            <h1 className="text-9xl font-black text-zinc-800">404</h1>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Page Not Found</h2>
                <p className="text-gray-400">The page you are looking for does not exist or has been moved.</p>
            </div>

        </div>
    );
}
