"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export function SignInForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (!result) {
                setError("No response from server. Please try again later.");
            } else if (result.ok && !result.error) {
                // Successful sign-in
                router.push("/");
                router.refresh();
            } else if (result.error) {
                // Specific error from the sign-in response
                setError(result.error || "Invalid email or password");
            }
        } catch (err) {
            // Catch unexpected errors
            console.error("Unexpected error during sign-in:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


    async function handleOAuthSignIn(provider: "github" | "google") {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn(provider, { callbackUrl: "/", redirect: false });

            if (result?.error) {
                console.error(`Sign-in failed with ${provider}:`, result.error);
                setError(`Failed to sign in with ${provider}. Please try again.`);
            } else if (result?.url) {
                // Redirect manually if `redirect: false` is set
                window.location.href = result.url;
            }
        } catch (error) {
            console.error(`Unexpected sign-in error with ${provider}:`, error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="grid gap-6 p-2 md:p-0 mt-4 md:mt-0">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className={`${playfair.className} text-3xl font-semibold tracking-tight`}>SamPedro</h1>
                <p className="text-sm text-muted-foreground">Enter your credentials to sign in</p>
            </div>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button disabled={isLoading}>
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleOAuthSignIn("github")}
                >
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                    )}{" "}
                    GitHub
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleOAuthSignIn("google")}
                >
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{" "}
                    Google
                </Button>
            </div>
        </div>
    );
}