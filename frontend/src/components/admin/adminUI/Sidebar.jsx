import React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Dumbbell,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { userStore } from "../../../storeData/userStore";
import { Link } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const { user, logout } = userStore();

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "trainers", label: "Trainers", icon: Dumbbell },
    { id: "classes", label: "Classes", icon: Calendar },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-base-100 border-b border-base-300 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-base-200 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold">Admin</span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-56 bg-base-100 border-r border-base-300 z-50 flex flex-col transition-transform duration-200
                    ${
                      isCollapsed
                        ? "-translate-x-full lg:translate-x-0"
                        : "translate-x-0"
                    }
                `}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-base-300">
          <Link
            to="/"
            className="font-semibold text-base-content hover:text-primary"
          >
            ABC Fitness
          </Link>
          <button
            onClick={() => setIsCollapsed(true)}
            className="lg:hidden p-1 hover:bg-base-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-base-300 text-sm">
          <p className="text-base-content/60">Signed in as</p>
          <p className="font-medium truncate">{user?.name || "Admin"}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                    ${
                                      isActive
                                        ? "bg-primary/10 text-primary border-l-3 border-primary font-medium"
                                        : "text-base-content hover:bg-base-200 border-l-3 border-transparent"
                                    }
                                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-base-300 p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-content hover:bg-base-200 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
