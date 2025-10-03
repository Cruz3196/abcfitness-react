import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { userStore } from '../../storeData/userStore';
import toast from 'react-hot-toast';

const ResetPasswordForm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, isLoading } = userStore();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        
        const success = await resetPassword(token, password);

        if (success) {
            navigate('/login');
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.98 }
    };

    const inputVariants = {
        focus: { 
            scale: 1.02,
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    const iconVariants = {
        hover: { 
            scale: 1.2,
            rotate: 10,
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.9 }
    };

    return (
        <motion.div 
            className="card w-96 lg:w-[28rem] bg-base-100 shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="card-body p-8 lg:p-10">
                <motion.h2 
                    className="card-title justify-center mb-6 text-2xl lg:text-3xl"
                    variants={itemVariants}
                >
                    Set New Password
                </motion.h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Input */}
                    <motion.div className="form-control" variants={itemVariants}>
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                className="input input-bordered w-full pl-12 pr-12 h-12 text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variants={inputVariants}
                                whileFocus="focus"
                                required
                            />
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            <motion.button 
                                type="button" 
                                className="absolute right-4 top-4" 
                                onClick={() => setShowPassword(!showPassword)}
                                variants={iconVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Confirm New Password Input */}
                    <motion.div className="form-control" variants={itemVariants}>
                        <label className="label">
                            <span className="label-text">Confirm New Password</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                variants={inputVariants}
                                whileFocus="focus"
                                required
                            />
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        </div>
                    </motion.div>

                    {/* Password Strength Indicator */}
                    {password && (
                        <motion.div 
                            className="text-sm"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex gap-2 mb-2">
                                <motion.div 
                                    className={`h-2 flex-1 rounded ${password.length >= 6 ? 'bg-success' : 'bg-gray-300'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                />
                                <motion.div 
                                    className={`h-2 flex-1 rounded ${password.length >= 8 ? 'bg-success' : 'bg-gray-300'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                />
                                <motion.div 
                                    className={`h-2 flex-1 rounded ${/(?=.*[a-zA-Z])(?=.*\d)/.test(password) ? 'bg-success' : 'bg-gray-300'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                />
                            </div>
                            <motion.div 
                                className="text-xs text-gray-500"
                                variants={itemVariants}
                            >
                                Password strength: {password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password) ? 'Strong' : 
                                                 password.length >= 6 ? 'Medium' : 'Weak'}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Match Indicator */}
                    {confirmPassword && (
                        <motion.div 
                            className={`text-xs ${password === confirmPassword ? 'text-success' : 'text-error'}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </motion.div>
                    )}

                    <motion.div className="form-control mt-8" variants={itemVariants}>
                        <motion.button 
                            type="submit" 
                            className={`btn btn-primary h-12 text-base ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading || password !== confirmPassword}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {isLoading ? (
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    Resetting...
                                </motion.span>
                            ) : 'Reset Password'}
                        </motion.button>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPasswordForm;