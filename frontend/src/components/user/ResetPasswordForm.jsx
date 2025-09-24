import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { userStore } from '../../storeData/userStore'; // Import your Zustand store
import toast from 'react-hot-toast';

const ResetPasswordForm = () => {
    const { token } = useParams(); // Get the token from the URL
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
    const containerVariants = { /* ... */ };
    const itemVariants = { /* ... */ };
    const buttonVariants = { /* ... */ };

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
                        <label className="label"><span className="label-text">New Password</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                <button type="button" className="absolute right-4 top-4" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Confirm New Password Input */}
                    <motion.div className="form-control" variants={itemVariants}>
                        <label className="label"><span className="label-text">Confirm New Password</span></label>
                            <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        </div>
                    </motion.div>

                    <motion.div className="form-control mt-8" variants={itemVariants}>
                        <button 
                            type="submit" 
                            className={`btn btn-primary h-12 text-base ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPasswordForm;
