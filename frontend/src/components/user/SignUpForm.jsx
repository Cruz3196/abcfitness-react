import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { userStore } from "../../storeData/userStore";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

const SignUpForm = () => {
    const navigate = useNavigate();
    const { signup, isLoading, user } = userStore();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        const success = await signup({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });

        if (success) {
            toast.success('Account created successfully!');
            // if success then will redirect to profile 
            navigate("/profile");
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
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

    const inputVariants = {
        focus: { 
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div 
            className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <form onSubmit={handleSignUp} className="card-body">
                <motion.div className="form-control" variants={itemVariants}>
                    <label className="label">
                        <span className="label-text">Username</span>
                    </label>
                    <div className="relative">
                        <motion.input 
                            type="text" 
                            name="username" 
                            placeholder="username" 
                            className="input input-bordered w-full pl-12" 
                            value={formData.username} 
                            onChange={handleChange}
                            required 
                        />
                        <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    </div>
                </motion.div>
                
                <motion.div className="form-control" variants={itemVariants}>
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <div className="relative">
                        <motion.input 
                            type="email" 
                            name="email" 
                            placeholder="email" 
                            className="input input-bordered w-full pl-12" 
                            value={formData.email} 
                            onChange={handleChange}
                            required 
                        />
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    </div>
                </motion.div>
                
                <motion.div className="form-control" variants={itemVariants}>
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                        <motion.input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="password" 
                            className="input input-bordered w-full pl-12 pr-12" 
                            value={formData.password} 
                            onChange={handleChange}
                            variants={inputVariants}
                            required 
                        />
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <motion.button
                            type="button"
                            className="absolute right-4 top-4"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </motion.button>
                    </div>
                </motion.div>
                
                <motion.div className="form-control" variants={itemVariants}>
                    <label className="label">
                        <span className="label-text">Confirm Password</span>
                    </label>
                    <div className="relative">
                        <motion.input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword" 
                            placeholder="confirm password" 
                            className="input input-bordered w-full pl-12 pr-12" 
                            value={formData.confirmPassword} 
                            onChange={handleChange}
                            required 
                        />
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <motion.button
                            type="button"
                            className="absolute right-4 top-4"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </motion.button>
                    </div>
                </motion.div>
                
                <motion.div className="form-control mt-6" variants={itemVariants}>
                    <motion.button 
                        className="btn btn-primary" 
                        type="submit" 
                        disabled={isLoading}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {isLoading ? (
                            <motion.span 
                                className="loading loading-spinner"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        ) : 'Sign Up'}
                    </motion.button>
                </motion.div>
                
                <motion.p 
                    className="text-sm text-center mt-4"
                    variants={itemVariants}
                >
                    Already have an account? 
                    <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                        <Link to="/login" className="link link-secondary ml-1">Login</Link>
                    </motion.span>
                </motion.p>
            </form>
        </motion.div>
    );
};

export default SignUpForm;