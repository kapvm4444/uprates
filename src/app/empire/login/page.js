"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const login = useAction(api.users.login);

  useEffect(() => {
    // Check if security gate was passed
    const access = sessionStorage.getItem("empire_access");
    if (access !== "granted") {
      router.push("/empire/who-are-you");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      if (user) {
        toast.success("Welcome back, Commander.");
        sessionStorage.setItem("empire_user", JSON.stringify(user));
        router.push("/empire");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check console.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Empire Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the control panel.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="control@khush.pro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
