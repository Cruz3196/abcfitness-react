import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { userStore } from '../../storeData/userStore';

const ForgotPasswordForm = () => {
    const { forgotPassword, isLoading } = userStore();
    
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await forgotPassword(email);

        if (success) {
            setIsSubmitted(true);
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
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.98 }
    };

    const successVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const checkVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const inputVariants = {
        focus: { 
            scale: 1.02,
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    if (isSubmitted) {
        return (
            <motion.div 
                className="card w-96 lg:w-[28rem] bg-base-100 shadow-xl"
                variants={successVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="card-body text-center p-8 lg:p-10">
                    <motion.div 
                        variants={checkVariants} 
                        className="text-success text-6xl lg:text-7xl mb-6"
                    >
                        <motion.div variants={pulseVariants} animate="animate">
                            <CheckCircle className="w-16 h-16 lg:w-20 lg:h-20 mx-auto" />
                        </motion.div>
                    </motion.div>
                    
                    <motion.h2 
                        className="card-title justify-center mb-6 text-2xl lg:text-3xl" 
                        variants={itemVariants}
                    >
                        Email Sent!
                    </motion.h2>
                    
                    <motion.p 
                        className="text-gray-600 mb-8 text-base lg:text-lg" 
                        variants={itemVariants}
                    >
                        We've sent a password reset link to{' '}
                        <motion.strong 
                            className="text-primary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {email}
                        </motion.strong>. 
                        Please check your email and follow the instructions.
                    </motion.p>
                    
                    <motion.div variants={itemVariants}>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Link to="/login" className="btn btn-primary h-12 text-base w-full">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Login
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

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
                    Reset Password
                </motion.h2>
                
                <motion.p 
                    className="text-gray-600 text-center mb-8 text-base lg:text-lg" 
                    variants={itemVariants}
                >
                    Enter your email address and we'll send you a link to reset your password.
                </motion.p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div className="form-control" variants={itemVariants}>
                        <label className="label">
                            <span className="label-text text-base">Email Address</span>
                        </label>
                        <div className="relative">
                            <motion.input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variants={inputVariants}
                                whileFocus="focus"
                                required
                            />
                            <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        </div>
                    </motion.div>

                    <motion.div className="form-control mt-8" variants={itemVariants}>
                        <motion.button 
                            type="submit" 
                            className={`btn btn-primary h-12 text-base ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {isLoading ? (
                                <motion.div className="flex items-center gap-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Send className="w-4 h-4" />
                                    </motion.span>
                                    Sending...
                                </motion.div>
                            ) : (
                                <motion.div className="flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Send Reset Link
                                </motion.div>
                            )}
                        </motion.button>
                    </motion.div>
                </form>

                <motion.div className="text-center mt-6" variants={itemVariants}>
                    <motion.div 
                        className="inline-flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/login" className="link link-secondary text-base">
                            <ArrowLeft className="w-5 h-5 inline mr-2" />
                            Back to Login
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordForm;