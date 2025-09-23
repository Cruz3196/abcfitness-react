import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // API call to login endpoint
            console.log('Logging in with:', formData);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02,
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.98 }
    };

    return (
        <motion.div 
            className="card w-96 lg:w-[28rem] bg-base-100 shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
            <div className="card-body p-8 lg:p-10">
                <motion.h2 
                    className="card-title justify-center mb-6 text-2xl lg:text-3xl"
                    variants={itemVariants}
                >
                    Login
                </motion.h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                whileFocus={{ 
                                    scale: 1.01,
                                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                                }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full pl-12 pr-12 h-12 text-base"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                whileFocus={{ 
                                    scale: 1.01,
                                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                                }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                            <motion.button
                                type="button"
                                className="absolute right-4 top-4"
                                onClick={() => setShowPassword(!showPassword)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.1 }}
                            >
                                <motion.div
                                    key={showPassword ? 'eye-off' : 'eye'}
                                    initial={{ rotate: 180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </motion.div>
                            </motion.button>
                        </div>
                        <label className="label">
                            <motion.div
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link to="/forgot-password" className="label-text-alt link link-hover text-sm">
                                    Forgot password?
                                </Link>
                            </motion.div>
                        </label>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div 
                        className="form-control mt-8"
                        variants={itemVariants}
                    >
                        <motion.button 
                            type="submit" 
                            className={`btn btn-primary h-12 text-base ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
                            transition={isLoading ? { repeat: Infinity, duration: 1 } : {}}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </motion.div>
                </form>

                {/* Divider */}
                <motion.div 
                    className="divider"
                    variants={itemVariants}
                >
                    OR
                </motion.div>

                {/* Sign Up Link */}
                <motion.div 
                    className="text-center"
                    variants={itemVariants}
                >
                    <p className="text-sm">
                        Don't have an account?{' '}
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block"
                        >
                            <Link to="/signup" className="link link-primary font-semibold">
                                Sign up here
                            </Link>
                        </motion.span>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoginForm;