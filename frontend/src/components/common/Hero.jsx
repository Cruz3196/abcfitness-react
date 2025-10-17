import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import HeroImage from '../../../assets/abcfitnesshero.jpg'
import { Link } from 'react-router-dom'

const Hero = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        // Ensure component is mounted before animating
        const timer = setTimeout(() => setIsLoaded(true), 50)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="hero min-h-96 bg-base-200">
            <div className="hero-content w-full max-w-7xl px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Image - shows first on mobile */}
                    <motion.div
                        className="flex justify-center lg:justify-end order-1 lg:order-2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={isLoaded && imageLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <img
                        src={HeroImage}
                        className="rounded-lg shadow-2xl max-w-full h-auto object-cover"
                        alt="ABC Fitness gym interior"
                        onLoad={() => setImageLoaded(true)}
                        loading="eager"
                        style={{ minHeight: '200px' }}
                        />
                    </motion.div>

                    {/* Text content - shows second on mobile */}
                    <div className="max-w-lg order-2 lg:order-1">
                        <motion.h1
                        className="text-5xl font-bold leading-tight mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                        Transform Your Fitness Journey
                        </motion.h1>
                        <motion.p
                        className="text-lg py-6 opacity-80"
                        initial={{ opacity: 0, y: -20 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        >
                        Join ABC Fitness and discover a community dedicated to helping you achieve
                        your health and wellness goals. Expert trainers, state-of-the-art equipment,
                        and personalized programs await you.
                        </motion.p>
                        <motion.button
                        className="btn btn-primary btn-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        <Link to="/store">Shop Now</Link>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero