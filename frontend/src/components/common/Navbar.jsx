import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { userStore } from "../../storeData/userStore";
import useCartStore from "../../storeData/cartStore";
import ThemeToggle from "./ThemeToggle";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  Store,
  Dumbbell,
  Users,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAdmin, isTrainer } = userStore();
  const { total, totalQuantity } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formattedTotal = total.toFixed(2);
  const totalItems = totalQuantity;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const getProfileLink = () => {
    if (!user) return "/profile";

    if (isAdmin()) return "/admindashboard";
    if (isTrainer()) return "/trainerdashboard";
    return "/profile";
  };

  const getProfileText = () => {
    if (!user) return "Profile";

    if (isAdmin()) return "Admin Dashboard";
    if (isTrainer()) return "Trainer Dashboard";
    return "Profile";
  };

  const navLinks = [
    { to: "/store", text: "Products", icon: Store },
    { to: "/classes", text: "Classes", icon: Dumbbell },
    { to: "/trainers", text: "Trainers", icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-gradient-to-r from-base-100 via-base-100 to-base-100 shadow-lg border-b border-base-300/30 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                <span className="text-white font-bold text-sm md:text-base">
                  AF
                </span>
              </div>
              <span className="hidden sm:inline text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ABC Fitness
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.to}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-300 font-medium group"
                  >
                    <Icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    {link.text}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Theme Toggle */}
            <motion.div
              className="hidden sm:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Cart for customers only */}
            {user && !isAdmin() && !isTrainer() && (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cart"
                  className="relative inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-lg text-base-content/70 hover:text-base-content bg-base-200/50 hover:bg-primary/10 transition-all duration-300 group"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:text-primary transition-colors" />
                  {totalItems > 0 && (
                    <motion.span
                      className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-primary to-secondary text-white text-xs md:text-sm font-bold rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={totalItems}
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="dropdown dropdown-end">
                <motion.label
                  tabIndex={0}
                  className="cursor-pointer inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-base-200/50 hover:bg-primary/10 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-bold text-sm md:text-base">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </div>
                  <span className="hidden md:inline text-sm font-medium truncate max-w-[100px] lg:max-w-none group-hover:text-primary transition-colors">
                    {user.username}
                  </span>
                  {isAdmin() && (
                    <span className="hidden lg:inline badge badge-secondary badge-sm">
                      Admin
                    </span>
                  )}
                  {isTrainer() && (
                    <span className="hidden lg:inline badge badge-primary badge-sm">
                      Trainer
                    </span>
                  )}
                </motion.label>
                <motion.ul
                  tabIndex={0}
                  className="dropdown-content menu menu-compact p-3 shadow-2xl bg-base-100 rounded-lg w-56 border border-base-300/50 mt-2"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <li className="mb-1">
                    <Link
                      to={getProfileLink()}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-medium">{getProfileText()}</span>
                    </Link>
                  </li>
                  <li className="border-t border-base-300/30">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-all duration-300 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </motion.ul>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm md:text-base hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                >
                  Login
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/50 hover:bg-primary/10 text-base-content/70 hover:text-base-content transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="lg:hidden overflow-hidden bg-base-200/30 border-t border-base-300/30"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="px-4 py-4 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate={mobileMenuOpen ? "visible" : "hidden"}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.to} variants={itemVariants}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base-content/70 hover:text-base-content hover:bg-primary/10 transition-all duration-300 font-medium"
                  >
                    <Icon className="w-5 h-5" />
                    {link.text}
                  </Link>
                </motion.div>
              );
            })}
            <motion.div
              variants={itemVariants}
              className="border-t border-base-300/30 pt-2 mt-2"
            >
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm font-medium text-base-content/70">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
