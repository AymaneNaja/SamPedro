'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../ui/button"

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return false
    }
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validatePassword()) {
      setIsLoading(false)
      return
    }

    try {
      // Your signup logic here
      console.log("Signing up...", { name, email, password })
      router.push("/profile")
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not sign up",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid gap-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoCapitalize="none"
          autoComplete="name"
          autoCorrect="off"
          disabled={isLoading}
          required
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Your email"
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
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect="off"
          disabled={isLoading}
          required
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          placeholder="Confirm your password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect="off"
          disabled={isLoading}
          required
        />
      </div>
      <Button disabled={isLoading}>Sign up</Button>
      <p className="mt-4 text-center text-sm text-gray-600">Or continue with</p>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </form>
  )
}

