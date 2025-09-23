import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
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
        
        // Add your signup logic here
        try {
            // API call to signup endpoint
            console.log('Signing up with:', formData);
        } catch (error) {
            console.error('Signup error:', error);
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
                    Sign Up
                </motion.h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text text-base">Username</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={formData.username}
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
                                <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Email Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text text-base">Email</span>
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
                                transition={{ delay: 0.4 }}
                            >
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Phone Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text text-base">Phone</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={formData.phone}
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
                                transition={{ delay: 0.5 }}
                            >
                                <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text text-base">Password</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full pl-12 h-12 text-base"
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
                                transition={{ delay: 0.6 }}
                            >
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Confirm Password Input */}
                    <motion.div 
                        className="form-control"
                        variants={itemVariants}
                    >
                        <label className="label">
                            <span className="label-text text-base">Confirm Password</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={formData.confirmPassword}
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
                                transition={{ delay: 0.7 }}
                            >
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            </motion.div>
                        </div>
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
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
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

                {/* Login Link */}
                <motion.div 
                    className="text-center"
                    variants={itemVariants}
                >
                    <p className="text-sm">
                        Already have an account?{' '}
                        <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                            className="inline"
                        >
                            <Link to="/login" className="link link-primary font-semibold">
                                Login here
                            </Link>
                        </motion.div>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SignUpForm;