import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../../storeData/userStore";
import useCartStore from "../../storeData/cartStore";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, ShoppingCart, LogOut, User, ChevronDown } from "lucide-react";
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
    if (isAdmin()) return "Dashboard";
    if (isTrainer()) return "Dashboard";
    return "My Account";
  };

  const navLinks = [
    { to: "/store", text: "Shop" },
    { to: "/classes", text: "Classes" },
    { to: "/trainers", text: "Trainers" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-300">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-content font-bold text-sm">AF</span>
            </div>
            <span className="hidden sm:inline text-lg font-bold text-base-content">
              ABC Fitness
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Account Dropdown */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="flex items-center gap-1 cursor-pointer text-sm hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300 mt-2"
                >
                  <li>
                    <Link to={getProfileLink()} className="text-sm">
                      {getProfileText()}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-error"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Cart - customers only */}
            {user && !isAdmin() && !isTrainer() && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-content text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-base-300">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-base-content/70 hover:text-primary hover:bg-base-200 rounded-lg transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
