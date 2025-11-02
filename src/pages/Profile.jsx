import React, { useEffect } from "react";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";
import { 
  IconMail, 
  IconUser, 
  IconCalendar, 
  IconMapPin,
  IconEdit,
  IconShield,
  IconBell,
  IconHeart
} from "@tabler/icons-react";

const Profile = () => {
  const { currentUser, fetchUserByEmail } = useStateContext();
  const { user } = usePrivy();

  useEffect(() => {
    if (!currentUser) {
      fetchUserByEmail(user?.email?.address);
    }
  }, [currentUser, fetchUserByEmail, user]);

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value, iconColor, style }) => (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`} style={style}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-lg font-bold text-gray-900 font-jakarta truncate">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/40 p-8 animate-fade-in-up overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -mr-48 -mt-48" style={{ background: 'linear-gradient(to bottom right, rgba(31, 78, 137, 0.1), rgba(107, 165, 217, 0.1))' }}></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-premium-lg relative" style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8, #4A8BC2)' }}>
                <span className="text-7xl">👤</span>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, #4A8BC2, #6BA5D9)' }}>
                  <IconHeart size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 font-jakarta">
                {currentUser.username}
              </h1>
              <p className="text-gray-600 text-lg mb-4">Healthcare Professional</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-2 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: '#1F4E89' }}>
                  Premium Member
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold text-sm">
                  Active
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <IconEdit size={20} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <InfoCard
          icon={IconMail}
          label="Email Address"
          value={currentUser.createdBy}
          iconColor="bg-gradient-to-br"
          style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8)' }}
        />
        <InfoCard
          icon={IconUser}
          label="Username"
          value={currentUser.username}
          iconColor="bg-gradient-to-br"
          style={{ background: 'linear-gradient(to bottom right, #2E6BA8, #4A8BC2)' }}
        />
        <InfoCard
          icon={IconCalendar}
          label="Age"
          value={`${currentUser.age} years old`}
          iconColor="bg-gradient-to-br"
          style={{ background: 'linear-gradient(to bottom right, #4A8BC2, #6BA5D9)' }}
        />
        <InfoCard
          icon={IconMapPin}
          label="Location"
          value={currentUser.location}
          iconColor="bg-gradient-to-br"
          style={{ background: 'linear-gradient(to bottom right, #6BA5D9, #A5C9F0)' }}
        />
      </div>

      {/* Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Security */}
        <button className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium transition-all duration-300 hover:-translate-y-1 text-left group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8)' }}>
            <IconShield size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-jakarta">Security</h3>
          <p className="text-sm text-gray-600">Manage your password and security settings</p>
        </button>

        {/* Notifications */}
        <button className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium transition-all duration-300 hover:-translate-y-1 text-left group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #4A8BC2, #6BA5D9)' }}>
            <IconBell size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-jakarta">Notifications</h3>
          <p className="text-sm text-gray-600">Configure your notification preferences</p>
        </button>

        {/* Privacy */}
        <button className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-6 hover:shadow-premium transition-all duration-300 hover:-translate-y-1 text-left group">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #6BA5D9, #A5C9F0)' }}>
            <IconShield size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-jakarta">Privacy</h3>
          <p className="text-sm text-gray-600">Control your privacy and data settings</p>
        </button>
      </div>
    </div>
  );
};

export default Profile;
