import React, { useState, useEffect } from "react";
import { adminStore } from "../storeData/adminStore";
import { productStore } from "../storeData/productStore";

// Admin UI components
import { Sidebar } from "../components/admin/adminUI/Sidebar";
import { RevenueChart } from "../components/admin/charts/RevenueChart";
import { MonthlyTrendsChart } from "../components/admin/charts/MonthlyTrendsChart";
import { ProductCategoriesChart } from "../components/admin/charts/ProductCategoriesChart";
import { ClassesTab } from "../components/admin/tabs/ClassesTab";
import { ProductsTab } from "../components/admin/tabs/ProductsTab";
import { TrainersTab } from "../components/admin/tabs/TrainersTab";
import { UsersTab } from "../components/admin/tabs/UsersTab";
import { OrdersTab } from "../components/admin/tabs/OrdersTab";

// Additional imports that might be needed
import ProductForm from "../components/admin/ProductForm";
import ProductEditForm from "../components/admin/ProductEditForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Get store data
  const {
    dashboardStats,
    fetchDashboardStats,
    fetchAllUsers,
    fetchAllTrainers,
    fetchClassInsights,
    fetchAllOrders,
    deleteUser,
    changeUserStatus,
  } = adminStore();

  const {
    products,
    categories,
    fetchAllProducts,
    deleteProduct,
    toggleFeaturedProduct,
  } = productStore();

  // Fetch data based on active tab
  // Note: ProtectedRoute ensures only admins reach this component
  useEffect(() => {
    switch (activeTab) {
      case "overview":
        fetchDashboardStats();
        fetchAllProducts();
        break;
      case "users":
        fetchAllUsers();
        break;
      case "products":
        fetchAllProducts();
        break;
      case "trainers":
        fetchAllTrainers();
        break;
      case "classes":
        fetchClassInsights();
        break;
      case "orders":
        fetchAllOrders();
        break;
      default:
        break;
    }
  }, [
    activeTab,
    fetchDashboardStats,
    fetchAllUsers,
    fetchAllProducts,
    fetchAllTrainers,
    fetchClassInsights,
    fetchAllOrders,
  ]);

  // Handler functions
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      await deleteProduct(productId);
    }
  };

  const handleToggleFeatured = async (productId) => {
    await toggleFeaturedProduct(productId);
  };

  const handleDeleteUser = async (userId, username) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    ) {
      await deleteUser(userId);
    }
  };

  const handlePromoteUser = async (userId, username) => {
    if (window.confirm(`Promote "${username}" to trainer role?`)) {
      await changeUserStatus(userId);
    }
  };

  const getTabTitle = () => {
    const titles = {
      overview: "Overview",
      users: "Users",
      products: "Products",
      orders: "Orders",
      trainers: "Trainers",
      classes: "Classes",
    };
    return titles[activeTab] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="lg:ml-56 pt-14 lg:pt-0">
        {/* Page Header */}
        <div className="bg-base-100 border-b border-base-300 px-4 lg:px-6 py-4">
          <h1 className="text-lg font-semibold text-base-content">
            {getTabTitle()}
          </h1>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {/* Tab Content */}
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                  <p className="text-sm text-base-content/60">Total Users</p>
                  <p className="text-2xl font-semibold">
                    {dashboardStats?.users?.totalUsers || 0}
                  </p>
                  <p className="text-xs text-success">
                    +{dashboardStats?.users?.newUsersThisMonth || 0} this month
                  </p>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                  <p className="text-sm text-base-content/60">Trainers</p>
                  <p className="text-2xl font-semibold">
                    {dashboardStats?.users?.totalTrainers || 0}
                  </p>
                  <p className="text-xs text-base-content/50">Active</p>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                  <p className="text-sm text-base-content/60">Revenue</p>
                  <p className="text-2xl font-semibold">
                    $
                    {(
                      (dashboardStats?.financials?.totalProductRevenue || 0) +
                      (dashboardStats?.financials?.totalClassRevenue || 0)
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-base-content/50">
                    Products + Classes
                  </p>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                  <p className="text-sm text-base-content/60">Products</p>
                  <p className="text-2xl font-semibold">
                    {products?.length || 0}
                  </p>
                  <p className="text-xs text-base-content/50">In catalog</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                  <RevenueChart dashboardStats={dashboardStats} />
                </div>
                <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                  <ProductCategoriesChart
                    products={products}
                    categories={categories}
                  />
                </div>
              </div>

              {/* Monthly Trends Chart */}
              <div className="bg-base-100 border border-base-300 rounded-lg p-4">
                <MonthlyTrendsChart />
              </div>
            </div>
          )}

          {/* Users Tab - CHANGED FROM UserTab TO UsersTab */}
          {activeTab === "users" && (
            <UsersTab
              onDeleteUser={handleDeleteUser}
              onPromoteUser={handlePromoteUser}
            />
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductsTab
              setShowProductForm={setShowProductForm}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
              handleToggleFeatured={handleToggleFeatured}
            />
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && <OrdersTab />}

          {/* Trainers Tab */}
          {activeTab === "trainers" && <TrainersTab />}

          {/* Classes Tab */}
          {activeTab === "classes" && <ClassesTab />}
        </main>
      </div>

      {/* Modals */}
      {showProductForm && (
        <ProductForm
          isOpen={showProductForm}
          onClose={() => setShowProductForm(false)}
        />
      )}

      {showEditForm && editingProduct && (
        <ProductEditForm
          isOpen={showEditForm}
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowEditForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
