import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { userStore } from "../../storeData/userStore";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading, user } = userStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  // Validation rules
  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please provide a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    let error = "";
    if (name === "username") error = validateUsername(value);
    else if (name === "email") error = validateEmail(value);
    else if (name === "password") error = validatePassword(value);
    else if (name === "confirmPassword")
      error = validateConfirmPassword(formData.password, value);

    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Check password strength
  const getPasswordStrength = (password) => {
    if (!password)
      return { strength: 0, label: "No password", color: "bg-gray-300" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;

    if (strength <= 1)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (strength <= 2)
      return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 3)
      return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate all fields
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setValidationErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      toast.error("Please fix the errors above");
      return;
    }

    const success = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      toast.success("Account created successfully!");
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSignUp} className="card-body gap-4">
        {/* Username Field */}
        <motion.div className="form-control" variants={itemVariants}>
          <label className="label">
            <span className="label-text font-semibold">Username</span>
            <span className="label-text-alt text-xs text-gray-500">
              3-30 chars, alphanumeric
            </span>
          </label>
          <div className="relative">
            <motion.input
              type="text"
              name="username"
              placeholder="username"
              className={`input input-bordered w-full pl-12 ${
                touched.username && validationErrors.username
                  ? "input-error"
                  : ""
              }`}
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            {touched.username && !validationErrors.username && (
              <Check className="absolute right-4 top-4 h-5 w-5 text-green-500" />
            )}
          </div>
          {touched.username && validationErrors.username && (
            <motion.p
              className="text-error text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-4 w-4" /> {validationErrors.username}
            </motion.p>
          )}
          {touched.username &&
            !validationErrors.username &&
            formData.username && (
              <motion.p
                className="text-success text-sm mt-1 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Check className="h-4 w-4" /> Username is valid
              </motion.p>
            )}
        </motion.div>

        {/* Email Field */}
        <motion.div className="form-control" variants={itemVariants}>
          <label className="label">
            <span className="label-text font-semibold">Email</span>
            <span className="label-text-alt text-xs text-gray-500">
              Valid email required
            </span>
          </label>
          <div className="relative">
            <motion.input
              type="email"
              name="email"
              placeholder="email@example.com"
              className={`input input-bordered w-full pl-12 ${
                touched.email && validationErrors.email ? "input-error" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            {touched.email && !validationErrors.email && (
              <Check className="absolute right-4 top-4 h-5 w-5 text-green-500" />
            )}
          </div>
          {touched.email && validationErrors.email && (
            <motion.p
              className="text-error text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-4 w-4" /> {validationErrors.email}
            </motion.p>
          )}
          {touched.email && !validationErrors.email && formData.email && (
            <motion.p
              className="text-success text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Check className="h-4 w-4" /> Email is valid
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div className="form-control" variants={itemVariants}>
          <label className="label">
            <span className="label-text font-semibold">Password</span>
            <span className="label-text-alt text-xs text-gray-500">
              {passwordStrength.label && `Strength: ${passwordStrength.label}`}
            </span>
          </label>
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`input input-bordered w-full pl-12 pr-12 ${
                touched.password && validationErrors.password
                  ? "input-error"
                  : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${passwordStrength.color}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(passwordStrength.strength / 4) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-xs mt-1 text-gray-600">
                <p>Password must contain:</p>
                <ul className="ml-4 space-y-1 mt-1">
                  <li
                    className={`flex items-center gap-2 ${formData.password.length >= 6 ? "text-green-600" : "text-gray-400"}`}
                  >
                    {formData.password.length >= 6 ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    At least 6 characters
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[a-z]/.test(formData.password) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Lowercase letter (a-z)
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[A-Z]/.test(formData.password) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Uppercase letter (A-Z)
                  </li>
                  <li
                    className={`flex items-center gap-2 ${/\d/.test(formData.password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/\d/.test(formData.password) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Number (0-9)
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {touched.password && validationErrors.password && (
            <motion.p
              className="text-error text-sm mt-2 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-4 w-4" /> {validationErrors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div className="form-control" variants={itemVariants}>
          <label className="label">
            <span className="label-text font-semibold">Confirm Password</span>
          </label>
          <div className="relative">
            <motion.input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              className={`input input-bordered w-full pl-12 pr-12 ${
                touched.confirmPassword && validationErrors.confirmPassword
                  ? "input-error"
                  : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
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
          {touched.confirmPassword && validationErrors.confirmPassword && (
            <motion.p
              className="text-error text-sm mt-1 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-4 w-4" />{" "}
              {validationErrors.confirmPassword}
            </motion.p>
          )}
          {touched.confirmPassword &&
            !validationErrors.confirmPassword &&
            formData.confirmPassword && (
              <motion.p
                className="text-success text-sm mt-1 flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Check className="h-4 w-4" /> Passwords match
              </motion.p>
            )}
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
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </motion.div>

        <motion.p className="text-sm text-center mt-4" variants={itemVariants}>
          Already have an account?
          <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
            <Link to="/login" className="link link-secondary ml-1">
              Login
            </Link>
          </motion.span>
        </motion.p>
      </form>
    </motion.div>
  );
};

export default SignUpForm;
