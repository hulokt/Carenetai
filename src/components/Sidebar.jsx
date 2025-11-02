import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import {
  IconLayoutDashboard,
  IconFolder,
  IconCalendarCheck,
  IconUser,
  IconLogout,
  IconPlus,
} from "@tabler/icons-react";
import Logo from "./Logo";

const NavButton = ({ icon: Icon, name, isActive, disabled, handleClick, label }) => (
  <div className="relative group">
    <button
      className={`
        relative w-full flex items-center justify-center p-3.5 rounded-xl
        transition-all duration-300 ease-out
        ${!disabled && "cursor-pointer hover:-translate-y-0.5"}
        ${disabled && "opacity-50 cursor-not-allowed"}
        ${!isActive && "bg-white/50 hover:bg-white/80 shadow-sm hover:shadow-md"}
      `}
      style={isActive === name ? { 
        background: 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)',
        boxShadow: '0 10px 25px rgba(31, 78, 137, 0.3)'
      } : {}}
      onClick={handleClick}
      disabled={disabled}
      title={label}
    >
      <Icon
        size={24}
        className="transition-all duration-300"
        style={{
          color: isActive === name ? 'white' : '#6B7280',
          transform: isActive === name ? 'scale(1.1)' : 'scale(1)'
        }}
        onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#1F4E89', e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#6B7280', e.currentTarget.style.transform = 'scale(1)')}
      />
      {isActive === name && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full"></div>
      )}
    </button>
    
    {/* Tooltip */}
    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
    </div>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState("dashboard");
  const { authenticated, logout } = usePrivy();

  // Sync active state with current route on mount and navigation
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setIsActive("dashboard");
    } else if (path.startsWith("/medical-records")) {
      setIsActive("records");
    } else if (path.startsWith("/screening-schedules")) {
      setIsActive("screening");
    } else if (path.startsWith("/profile")) {
      setIsActive("profile");
    }
  }, [location.pathname]);

  const navItems = [
    { name: "dashboard", icon: IconLayoutDashboard, link: "/", label: "Dashboard" },
    { name: "records", icon: IconFolder, link: "/medical-records", label: "Medical Records" },
    { name: "screening", icon: IconCalendarCheck, link: "/screening-schedules", label: "Screenings" },
    { name: "profile", icon: IconUser, link: "/profile", label: "Profile" },
  ];

  const handleLogout = () => {
    if (authenticated) {
      logout();
    }
  };

  const handleAddRecord = () => {
    // Navigate to medical records page and trigger modal
    navigate("/medical-records", { state: { openModal: true } });
  };

  return (
    <div className="sticky top-6 flex h-[calc(100vh-48px)] flex-col w-20">
      {/* Logo Section - Clickable to Add Record */}
      <div className="mb-8 relative group animate-fade-in-up">
        <button
          onClick={handleAddRecord}
          className="flex justify-center w-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          title="Add New Record"
        >
          <Logo size="default" showText={false} />
        </button>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
          Add New Record
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 flex flex-col items-center gap-2 bg-white/60 backdrop-blur-xl rounded-3xl p-3 shadow-premium border border-white/40 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col w-full gap-2">
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <NavButton
                icon={item.icon}
                name={item.name}
                label={item.label}
                isActive={isActive}
                handleClick={() => {
                  setIsActive(item.name);
                  navigate(item.link);
                }}
              />
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Logout Button */}
        <div className="relative group w-full animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            className="w-full flex items-center justify-center p-3.5 rounded-xl bg-red-50 hover:bg-red-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            onClick={handleLogout}
            title="Logout"
          >
            <IconLogout
              size={24}
              className="text-red-600 group-hover:text-red-700 group-hover:scale-110 transition-all duration-300"
            />
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
            Logout
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
