import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context";
import {
  IconLayoutDashboard,
  IconFolder,
  IconCalendarCheck,
  IconUser,
  IconMenu2,
  IconX,
  IconBell,
  IconSearch,
} from "@tabler/icons-react";
import Logo from "./Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const { fetchUsers, users, fetchUserRecords, currentUser } = useStateContext();

  const navItems = [
    { name: "Dashboard", icon: IconLayoutDashboard, link: "/" },
    { name: "Records", icon: IconFolder, link: "/medical-records" },
    { name: "Screening", icon: IconCalendarCheck, link: "/screening-schedules" },
    { name: "Profile", icon: IconUser, link: "/profile" },
  ];

  const fetchUserInfo = useCallback(async () => {
    if (!user) return;

    try {
      await fetchUsers();
      const existingUser = users.find(
        (u) => u.createdBy === user.email.address,
      );
      if (existingUser) {
        await fetchUserRecords(user.email.address);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [user, fetchUsers, users, fetchUserRecords]);

  useEffect(() => {
    if (authenticated && user) {
      fetchUserInfo();
    }
  }, [authenticated, user, fetchUserInfo]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.includes("medical-records")) return "Medical Records";
    if (path.includes("screening-schedules")) return "Screening Schedule";
    if (path.includes("profile")) return "Profile";
    return "Carenetai";
  };

  return (
    <div className="mb-8">
      {/* Desktop Navbar */}
      <div className="hidden sm:flex items-center justify-between bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow-premium border border-white/40 animate-fade-in-up">
        {/* Page Title Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold font-jakarta" style={{ color: '#1F4E89' }}>
            {getPageTitle()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-700">{currentUser?.username || user?.email?.address?.split('@')[0] || 'User'}</span>
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="p-3 rounded-xl bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
            <IconSearch size={22} className="text-gray-600 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#1F4E89'} onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'} />
          </button>

          {/* Notifications */}
          <button className="relative p-3 rounded-xl bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
            <IconBell size={22} className="text-gray-600 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#1F4E89'} onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 shadow-lg" style={{ background: 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)', boxShadow: '0 10px 25px rgba(31, 78, 137, 0.3)' }}>
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <IconUser size={20} className="text-white" />
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold leading-tight">
                {currentUser?.username || 'User'}
              </p>
              <p className="text-xs opacity-90 leading-tight">
                {currentUser?.location || 'Healthcare'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-premium border border-white/40">
          <Logo size="small" showText={true} />
          
          <button
          onClick={() => setToggleDrawer((prev) => !prev)}
            className="p-2 rounded-xl bg-white hover:bg-gray-50 shadow-sm transition-all duration-300"
          >
            {toggleDrawer ? (
              <IconX size={24} className="text-gray-700" />
            ) : (
              <IconMenu2 size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-0 z-50 transition-all duration-500 ${
            toggleDrawer ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
              toggleDrawer ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setToggleDrawer(false)}
          ></div>

          {/* Drawer Content */}
          <div
            className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-500 ${
              toggleDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Logo size="default" showText={true} />
                <button
                  onClick={() => setToggleDrawer(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <IconX size={24} className="text-gray-700" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center gap-3 rounded-xl p-4 mt-4" style={{ background: 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)' }}>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <IconUser size={24} className="text-white" />
                </div>
                <div className="text-white">
                  <p className="font-semibold">
                    {currentUser?.username || 'User'}
                  </p>
                  <p className="text-sm opacity-90">
                    {user?.email?.address || 'user@carenetai.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.link;
                
                return (
                  <button
                    key={item.name}
                onClick={() => {
                      navigate(item.link);
                  setToggleDrawer(false);
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl mb-2
                      transition-all duration-300 group
                      ${!isActive && "hover:bg-gray-50"}
                    `}
                    style={isActive ? {
                      background: 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)',
                      boxShadow: '0 10px 25px rgba(31, 78, 137, 0.3)',
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                    } : {
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <Icon
                      size={24}
                      className="transition-all duration-300"
                      style={{ color: isActive ? 'white' : '#4B5563' }}
                      onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#1F4E89')}
                      onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#4B5563')}
                />
                    <span
                      className="font-semibold transition-all duration-300"
                      style={{ color: isActive ? 'white' : '#374151' }}
                      onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#1F4E89')}
                      onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#374151')}
                >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
