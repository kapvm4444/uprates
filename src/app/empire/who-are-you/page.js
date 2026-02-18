"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export default function SecurityCheck() {
    const [isOpen, setIsOpen] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // Prevent closing by clicking outside
    const handleOpenChange = (open) => {
        if (!open) {
            // Force it open if they try to close it without success
            setIsOpen(true);
        }
    };

    const checkCredentials = () => {
        if (username === "please" && password === "allow") {
            toast.success("Access Granted");
            sessionStorage.setItem("empire_access", "granted");
            router.push("/empire/login");
        } else {
            toast.error("Access Denied");
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Security Check</DialogTitle>
                        <DialogDescription>
                            Identify yourself to proceed to the Empire.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Who are you?
                            </Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="col-span-3"
                                autoComplete="off"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="secret" className="text-right">
                                Secret
                            </Label>
                            <Input
                                id="secret"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={checkCredentials}>Verify</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
