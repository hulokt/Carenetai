import React from 'react';
import { IconHeart, IconBrandGithub, IconBrandTwitter, IconMail } from '@tabler/icons-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="mt-16 mb-6 animate-fade-in-up">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-premium border border-white/40">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Logo size="default" showText={false} />
              <h3 className="text-2xl font-bold font-jakarta" style={{ color: '#1F4E89' }}>
                Carenetai
              </h3>
            </div>
            <p className="text-sm text-gray-600 italic font-medium">
              A community for cancer
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering patients with AI-driven healthcare management and community support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 font-jakarta">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/medical-records" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Medical Records
                </a>
              </li>
              <li>
                <a href="/screening-schedules" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Screenings
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-gray-900 font-jakarta">Connect With Us</h4>
            <p className="text-sm text-gray-500">
              Join our community and stay updated with the latest healthcare insights.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group" style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8)' }}>
                <IconMail size={20} className="text-white" />
              </button>
              <button className="p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group" style={{ background: 'linear-gradient(to bottom right, #2E6BA8, #4A8BC2)' }}>
                <IconBrandTwitter size={20} className="text-white" />
              </button>
              <button className="p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group" style={{ background: 'linear-gradient(to bottom right, #4A8BC2, #6BA5D9)' }}>
                <IconBrandGithub size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                      © {new Date().getFullYear()} <span className="font-semibold" style={{ color: '#1F4E89' }}>Carenetai</span>. All rights reserved.
                    </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <IconHeart size={16} className="text-red-500 animate-pulse" fill="currentColor" />
            <span>for the cancer community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

