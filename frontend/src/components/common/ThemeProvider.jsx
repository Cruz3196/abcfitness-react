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
                return savedTheme === 'dark';
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
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme to localStorage:', error);
        }

        // Apply theme to document - using actual DaisyUI theme names
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        
        // Optional: Add class to html for custom CSS if needed
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
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
        setIsDarkMode(theme === 'dark');
    };

    return (
        <ThemeContext.Provider value={{ 
            isDarkMode, 
            toggleTheme, 
            setTheme,
            currentTheme: isDarkMode ? 'dark' : 'light'
        }}>
            {children}
        </ThemeContext.Provider>
    );
};