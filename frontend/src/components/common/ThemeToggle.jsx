import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = ({ size = "md", className = "" }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const toggleVariants = {
        light: { 
            rotate: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        },
        night: { 
            rotate: 180,
            scale: 1.1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case "sm": return "btn-sm";
            case "lg": return "btn-lg";
            case "xl": return "btn-xl";
            default: return "";
        }
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className={`btn btn-ghost btn-circle ${getSizeClasses()} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to night mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to night mode"}
        >
            <motion.div
                variants={toggleVariants}
                animate={isDarkMode ? "night" : "light"}
                className="flex items-center justify-center"
            >
                {isDarkMode ? (
                    <Moon className="w-5 h-5" />
                ) : (
                    <Sun className="w-5 h-5" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;