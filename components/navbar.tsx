"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, ShoppingCart, Menu, Search, Heart, User, ChevronDown, LogOut, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignInForm } from "./auth/sign-in-modal"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCartQuery, useGetFavoritesQuery } from "@/redux/productsApi"
import { Playfair_Display } from "next/font/google"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useFetchCategoriesQuery } from "@/redux/productsApi"
import { categoryIcons } from "./sidebar"

const playfair = Playfair_Display({ subsets: ["latin"] })

const Navbar = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [isSignInVisible, setIsSignInVisible] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { data: cartItems } = useGetCartQuery(session?.user?.id, { skip: !session?.user?.id })
  const { data: favorites } = useGetFavoritesQuery(session?.user?.id, { skip: !session?.user?.id })
  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery()

  const cartItemsCount = cartItems?.length || 0
  const favoritesCount = favorites?.length || 0

  useEffect(() => {
    const shouldHideSignIn = pathname.includes("sign-up") || pathname.includes("sign-in")
    setIsSignInVisible(!shouldHideSignIn)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const navItems = [
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ]

  const UserMenu = () => {
    if (status === "loading") {
      return <Skeleton className="h-10 w-10 rounded-full" />
    }

    if (status === "authenticated" && session.user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback>{session.user.name ? session.user.name[0].toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem className="flex flex-col items-start">
              <div className="font-medium">{session.user.name}</div>
              <div className="text-xs text-muted-foreground">{session.user.email}</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/favorites" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onSelect={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return null
  }

  return (
    <motion.nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center">
                      {" "}
                      {/* Updated line */}
                      <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.span
                          className={`${playfair.className} text-3xl font-bold text-primary`}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          SamPedro
                        </motion.span>
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Button key={item.name} variant="ghost" className="w-full justify-start text-lg" asChild>
                          <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            {item.name}
                          </Link>
                        </Button>
                      ))}
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories">
                        <AccordionTrigger className="text-lg">Categories</AccordionTrigger>
                        <AccordionContent>
                          {isCategoriesLoading ? (
                            <div className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {categories?.map((category: { name: string; image: string }) => {
                                const Icon = categoryIcons[category.name] || categoryIcons.default
                                return (
                                  <Button key={category.name} variant="ghost" className="w-full justify-start" asChild>
                                    <Link
                                      href={`/categories/${category.name}`}
                                      className="flex items-center space-x-2"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <Icon className="h-4 w-4" />
                                      <span className="capitalize">{category.name.replace("-", " ")}</span>
                                    </Link>
                                  </Button>
                                )
                              })}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="pt-4 border-t">
                      <Button
                        variant="ghost"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full justify-start"
                      >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="ml-2">Toggle theme</span>
                      </Button>
                    </div>

                    {status === "authenticated" && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                            <AvatarFallback>
                              {session?.user?.name ? session?.user?.name[0].toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{session?.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => signOut()}>
                          Sign Out
                        </Button>
                      </div>
                    )}

                    {!session && (
                      <div className="mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full">Sign In</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sign In</DialogTitle>
                              <DialogDescription>Sign in to your account to access all features.</DialogDescription>
                            </DialogHeader>
                            <SignInForm onClose={() => setIsMobileMenuOpen(false)} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${playfair.className} text-2xl md:text-3xl font-bold text-primary`}
                >
                  SamPedro
                </motion.span>
              </motion.div>
            </Link>
          </div>

          <div className={`hidden md:flex items-center space-x-1  ${playfair.className} `}>
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button variant="ghost" className="relative text-xl font-semibold group ">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/search")} className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {status === "authenticated" && favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {status === "authenticated" && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <div className="hidden md:block">
              {status === "authenticated" ? (
                <UserMenu />
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Sign In</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign In</DialogTitle>
                      <DialogDescription>Sign in to your account to access all features.</DialogDescription>
                    </DialogHeader>
                    <SignInForm onClose={() => setIsSignInVisible(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

