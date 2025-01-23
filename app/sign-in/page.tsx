import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SignInForm } from "@/components/auth/sign-in-form"
import { Playfair_Display } from 'next/font/google'

export const metadata: Metadata = {
    title: "Sign In | SamPedro",
    description: "Sign in to your SamPedro account.",
}
const playfair = Playfair_Display({ subsets: ['latin'] })

export default function SignInPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900  rounded-md bg-cover" style={{ backgroundImage: `url(${'https://images.unsplash.com/photo-1495462911434-be47104d70fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhc2hpb24lMjBtb25vY2hyb21lfGVufDB8fDB8fHww'})` }} />
                <div className="relative z-20 flex items-center text-3xl font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                    SamPedro
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-xl " style={{ fontFamily: "'Playfair Display', serif" }}>
                            &ldquo; SamPedro has streamlined our workflow and boosted our productivity. {`It's`} an essential tool for our {`team's `}success.&rdquo;
                        </p>
                        <footer className="text-sm">Samia Naja, Team Lead</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">


                    </div>
                    <SignInForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="sign-up"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
