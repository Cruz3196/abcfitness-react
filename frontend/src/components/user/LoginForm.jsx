import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { userStore } from '../../storeData/userStore';
import toast from 'react-hot-toast'; // Add this import

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, user } = userStore();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    // checking if user is authenticated(user exists)
    const isAuthenticated = !!user;

    // If the user is already logged in, redirect them away from the login page
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || "/profile";
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const result = await login(formData.email, formData.password);
            
            if (result) {
                toast.success("Login successful!");
                
                // Redirect based on user role and profile status
                if (result.role === 'admin') {
                    navigate('/admindashboard', { replace: true });
                } else if (result.role === 'trainer') {
                    // Check if trainer needs profile setup
                    if (!result.hasTrainerProfile) {
                        navigate('/trainer-setup', { replace: true });
                    } else {
                        navigate('/trainerdashboard', { replace: true });
                    }
                } else {
                    // For customers or any other role
                    const from = location.state?.from?.pathname || "/profile";
                    navigate(from, { replace: true });
                }
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
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
                    <motion.div className="form-control" variants={itemVariants}>
                        <label className="label"><span className="label-text">Email</span></label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full pl-12 h-12 text-base"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div className="form-control" variants={itemVariants}>
                        <label className="label"><span className="label-text">Password</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full pl-12 pr-12 h-12 text-base"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            <button
                                type="button"
                                className="absolute right-4 top-4"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                        <label className="label">
                            <Link to="/forgot-password" className="label-text-alt link link-hover text-sm">
                                Forgot password?
                            </Link>
                        </label>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div className="form-control mt-8" variants={itemVariants}>
                        <motion.button 
                            type="submit" 
                            className={`btn btn-primary h-12 text-base ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                            variants={buttonVariants}
                            whileHover={!isLoading ? "hover" : {}}
                            whileTap={!isLoading ? "tap" : {}}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </motion.div>
                </form>

                <motion.div className="divider" variants={itemVariants}>OR</motion.div>

                <motion.div className="text-center" variants={itemVariants}>
                    <p className="text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="link link-secondary font-semibold">Sign up here</Link>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoginForm;