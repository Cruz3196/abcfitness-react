import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            // Check localStorage first
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'night';
            }
            
            // Fall back to system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (error) {
            console.error('Error reading theme from localStorage:', error);
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('theme', isDarkMode ? 'night' : 'light');
        } catch (error) {
            console.error('Error saving theme to localStorage:', error);
        }

        // Apply theme to document - using "night" instead of "dark"
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'night' : 'light');
        
        // Optional: Add class to html for custom CSS if needed
        if (isDarkMode) {
            document.documentElement.classList.add('night');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('night');
        }
    }, [isDarkMode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                setIsDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const setTheme = (theme) => {
        setIsDarkMode(theme === 'night');
    };

    return (
        <ThemeContext.Provider value={{ 
            isDarkMode, 
            toggleTheme, 
            setTheme,
            currentTheme: isDarkMode ? 'night' : 'light'
        }}>
            {children}
        </ThemeContext.Provider>
    );
};