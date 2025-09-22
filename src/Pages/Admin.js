import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Tag,
  Store,
  Plus,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, Links, Outlet } from "react-router-dom";

const AdminPanel = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md border-r transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b font-bold text-lg">
          Admin Panel
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {/* Dashboard */}
          <Link  to="/Dashboard"
            onClick={closeSidebar}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link >

          {/* Coupons */}
          <div>
            <button
              onClick={() => toggleDropdown("coupons")}
              className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="flex items-center">
                <Tag className="w-5 h-5 mr-3" /> Coupons
              </span>
              {activeDropdown === "coupons" ? <ChevronDown /> : <ChevronRight />}
            </button>
            {activeDropdown === "coupons" && (
              <div className="ml-8 mt-2 space-y-1 text-sm">
                <Link to={"/coupons/create"}
                  onClick={closeSidebar}
                  className="w-full flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Coupon
                </Link>
                <Link to={"coupons/manage"}
                  onClick={closeSidebar}
                  className="w-full flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4 mr-2" /> Manage Coupons
                </Link>
              </div>
            )}
          </div>

          {/* Stores */}
          <div>
            <button
              onClick={() => toggleDropdown("stores")}
              className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="flex items-center">
                <Store className="w-5 h-5 mr-3" /> Stores
              </span>
              {activeDropdown === "stores" ? <ChevronDown /> : <ChevronRight />}
            </button>
            {activeDropdown === "stores" && (
              <div className="ml-8 mt-2 space-y-1 text-sm">
                <button
                  onClick={closeSidebar}
                  className="w-full flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" /> <Link to="/stores/create">Create Store</Link>
                </button>
                <button
                  onClick={closeSidebar}
                  className="w-full flex items-center px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4 mr-2" /> <Link to="/stores/manage">Manage Stores</Link>
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        ></div>
      )}

       {/* Top Navbar */}
      <div className="flex-1 flex flex-col">
       
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-100"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="hidden sm:inline font-medium">John Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow border py-2">
                <button className="w-full flex items-center px-4 py-2 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-2" /> Profile
                </button>
                <button className="w-full flex items-center px-4 py-2 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </button>
                <hr className="my-1" />
                <button className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content Area */}
        <main className="pt-20 px-6 md:ml-64">
          <Outlet /> {/* Render nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;