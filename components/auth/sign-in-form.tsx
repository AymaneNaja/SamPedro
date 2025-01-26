"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Playfair_Display } from "next/font/google"
import { useToast } from "@/hooks/use-toast"

const playfair = Playfair_Display({ subsets: ["latin"] })

export function SignInForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            })

            if (result?.error) {
                toast({
                    title: "Error",
                    description: "Invalid email or password",
                    variant: "destructive",
                })
            } else {
                router.push("/dashboard")
            }
        } catch (error) {
            console.error("Sign-in error:", error)
            toast({
                title: "Error",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
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
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("github")}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                    )}{" "}
                    GitHub
                </Button>
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("google")}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{" "}
                    Google
                </Button>
            </div>
        </div>
    )
}

