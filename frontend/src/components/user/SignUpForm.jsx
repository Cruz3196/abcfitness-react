import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../../storeData/userStore";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const SignUpForm = () => {
    const navigate = useNavigate();
    const { signup, isLoading, user } = userStore(); // Use 'user' instead of 'isAuthenticated'
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
            // Navigate to login page so they can sign in with their new account
            toast.success('Account created! Please log in.');
            navigate("/login");
        }
    };

    return (
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSignUp} className="card-body">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Username</span>
                    </label>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="username" 
                        className="input input-bordered" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="email" 
                        className="input input-bordered" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="password" 
                            className="input input-bordered w-full pr-10" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Confirm Password</span>
                    </label>
                    <div className="relative">
                        <input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword" 
                            placeholder="confirm password" 
                            className="input input-bordered w-full pr-10" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="form-control mt-6">
                    <button 
                        className="btn btn-primary" 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
                    </button>
                </div>
                
                <p className="text-sm text-center mt-4">
                    Already have an account? 
                    <Link to="/login" className="link link-secondary ml-1">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default SignUpForm;