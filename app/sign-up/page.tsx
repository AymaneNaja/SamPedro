import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Playfair_Display } from 'next/font/google'

export const metadata: Metadata = {
  title: "Sign Up | SamPedro",
  description: "Create an account to get started with WildCherries.",
}
const playfair = Playfair_Display({ subsets: ['latin'] })

export default function SignUpPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900  rounded-md bg-cover" style={{ backgroundImage: `url(${'https://images.unsplash.com/photo-1495462911434-be47104d70fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhc2hpb24lMjBtb25vY2hyb21lfGVufDB8fDB8fHww'})` }} />
        <div className="relative z-20 flex items-center text-3xl font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
          SamPedro
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              {`At SamPedro, we believe shopping should be more than a transaction; it should be an experience. That's why we've curated a platform that combines convenience, style, and variety to bring you the best in online retail.`}
            </p>
            <footer className="text-sm">Badr Naja, Product Manager</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

          <SignUpForm />

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

