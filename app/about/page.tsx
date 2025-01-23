"use client"

import Image from "next/image"
import { motion, useAnimation } from "framer-motion"
import founderImg from "@/public/founder.jpg"
import { useEffect } from "react"
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
export default function AboutPage() {
    const controls = useAnimation()

    useEffect(() => {
        controls.start((i) => ({
            opacity: 1,
            transition: { delay: i * 0.02 },
        }))
    }, [controls])

    const description = `Hi, I'm Ayman—the founder of SamPedro. I'm a Moroccan full-stack developer, a fifth-year medical student, and someone who's deeply passionate about innovation, creativity, and making life easier for others. With a love for fashion, design, and technology, I've always believed that style and functionality should go hand in hand.

When I'm not coding or studying medicine, you'll find me playing the piano, painting, or exploring new places. I started SamPedro to combine my technical skills with my passion for creating something meaningful. My goal is to offer you a seamless and enjoyable shopping experience, blending modern aesthetics with powerful technology to meet your every need.

Thank you for being part of this journey. Together, we're building more than just an e-commerce platform—we're building a community of people who value quality, innovation, and style.`

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-5xl tracking-wide text-center pb-10"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                About SamPedro
            </motion.h1>
            <div className="grid md:grid-cols-2 gap-8 items-center ">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="font-serif text-3xl tracking-wide "
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        SamPedro
                    </motion.span>
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="mb-4">
                        {`   SamPedro was born out of a passion for bringing high-quality, unique products to our customers. Founded in
            2025, we've quickly grown to become a leading online destination for fashion, accessories, and lifestyle
            products.`}
                    </p>
                    <p className="mb-4">
                        Our mission is to provide an exceptional shopping experience, offering carefully curated items that blend
                        style, quality, and affordability. We believe that everyone deserves access to products that make them feel
                        confident and express their individuality.
                    </p>
                    <p>
                        {`       At SamPedro, we're committed to sustainability and ethical practices. We work closely with our suppliers to
            ensure fair labor practices and minimize our environmental impact.`}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <div className="relative w-56 h-56 mx-auto mb-4 rounded-full overflow-hidden">
                        <Image src={founderImg.src || "/placeholder.svg"} alt="Founder's Picture" layout="fill" objectFit="cover" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Aymane Naja</h3>
                    <p className="text-muted-foreground mb-4">Founder & CEO</p>
                    <div className="text-left">
                        {description.split("").map((char, index) => (
                            <motion.span key={index} initial={{ opacity: 0 }} custom={index} animate={controls}>
                                {char}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

