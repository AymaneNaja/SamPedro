'use client'
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SignInForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (result?.error) {
            toast({
                title: "Error",
                description:
                    result.error === "CredentialsSignin" ? "Invalid email or password" : "An error occurred. Please try again.",
                variant: "destructive",
            })
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                    </label>
                </div>
                <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                        Forgot your password?
                    </Link>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Sign in
                </button>
            </div>

            <div className="flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-gray-600">Or continue with</p>
                </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80">
                    Sign up
                </Link>
            </p>
        </form>
    )
}

