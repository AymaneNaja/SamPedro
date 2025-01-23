"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

interface LoadingScreenProps {
    isLoading: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {

    return (
        <AnimatePresence>

            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold text-primary mb-8`}>SamPedro</h1>
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    </motion.div>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-4 text-muted-foreground"
                    >
                        Loading your experience...
                    </motion.p>
                </div>
            </motion.div>

        </AnimatePresence>
    )
}

export default LoadingScreen

