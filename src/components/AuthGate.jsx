import React, { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { IconHeart, IconFolder, IconCalendarCheck, IconBrain, IconShieldCheck, IconSparkles, IconBrandGithub, IconBrandTwitter, IconMail } from "@tabler/icons-react";
import Logo from "./Logo";

const AuthGate = ({ children }) => {
  const { ready, authenticated, login } = usePrivy();
  const loginTriggered = useRef(false);

  // Auto-trigger login modal when not authenticated (only once)
  useEffect(() => {
    if (ready && !authenticated && !loginTriggered.current) {
      loginTriggered.current = true;
      // Small delay to ensure Privy is fully ready
      setTimeout(() => {
        login();
      }, 100);
    }
  }, [ready, authenticated, login]);

  // Show blurred content while not authenticated
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #E8F1FA, #F5F9FC, #FFFFFF)' }}>
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 mx-auto" style={{ borderColor: 'rgba(31, 78, 137, 0.2)', borderTopColor: '#1F4E89' }}></div>
          <p className="font-semibold text-lg" style={{ color: '#1F4E89' }}>Loading Carenetai...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <>
        {/* Beautiful Branded Landing Screen */}
        <div className="fixed inset-0 z-0 overflow-y-auto" style={{ background: 'linear-gradient(to bottom right, #E8F1FA, #F5F9FC, #FFFFFF)' }}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(31, 78, 137, 0.15)' }}></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(74, 139, 194, 0.15)' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-float-slow" style={{ backgroundColor: 'rgba(107, 165, 217, 0.10)' }}></div>
          </div>

          <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
            <div className="max-w-6xl w-full">
              {/* Main Content Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                  {/* Logo */}
                  <div className="inline-flex items-center justify-center mb-6">
                    <Logo size="huge" showText={false} />
                  </div>

                  {/* Brand Name */}
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 font-jakarta" style={{ color: '#1F4E89' }}>
                    Carenetai
                  </h1>
                  
                  {/* Slogan */}
                  <p className="text-2xl md:text-3xl text-gray-700 font-semibold italic mb-3">
                    A community for cancer
                  </p>
                  
                  {/* Subtitle */}
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    AI-powered healthcare management platform supporting cancer patients with comprehensive tools and community support
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  {/* Feature 1 */}
                  <div className="rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(to bottom right, #E8F1FA, #F0F6FB)', border: '1px solid rgba(31, 78, 137, 0.2)' }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8)' }}>
                      <IconFolder size={28} className="text-white" stroke={2} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-jakarta">Medical Records</h3>
                    <p className="text-gray-600 text-sm">
                      Securely store and manage all your medical records in one place with easy access anytime
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(to bottom right, #E8F1FA, #F0F6FB)', border: '1px solid rgba(31, 78, 137, 0.2)' }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #2E6BA8, #4A8BC2)' }}>
                      <IconCalendarCheck size={28} className="text-white" stroke={2} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-jakarta">Smart Scheduling</h3>
                    <p className="text-gray-600 text-sm">
                      Track screenings, appointments, and treatments with intelligent reminders and progress monitoring
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(to bottom right, #E8F1FA, #F0F6FB)', border: '1px solid rgba(31, 78, 137, 0.2)' }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #4A8BC2, #6BA5D9)' }}>
                      <IconBrain size={28} className="text-white" stroke={2} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-jakarta">AI Assistance</h3>
                    <p className="text-gray-600 text-sm">
                      Get personalized treatment insights and recommendations powered by advanced AI technology
                    </p>
                  </div>
                </div>

                {/* Additional Features */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                  <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 border border-gray-200">
                    <IconShieldCheck size={20} style={{ color: '#1F4E89' }} />
                    <span className="text-sm font-semibold text-gray-700">Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 border border-gray-200">
                    <IconSparkles size={20} style={{ color: '#1F4E89' }} />
                    <span className="text-sm font-semibold text-gray-700">AI-Powered Insights</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 border border-gray-200">
                    <IconHeart size={20} style={{ color: '#1F4E89' }} />
                    <span className="text-sm font-semibold text-gray-700">Community Support</span>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                  <button
                    onClick={() => login()}
                    className="inline-flex items-center gap-3 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ background: 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1A3D6D, #2E6BA8, #3A7BAE)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1F4E89, #2E6BA8, #4A8BC2)'}
                  >
                    <IconSparkles size={24} />
                    Get Started - Join Carenetai
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Join our community and start managing your healthcare journey today
                  </p>
                </div>

                {/* Builder Credit */}
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <p className="text-center text-gray-600 text-sm">
                    Built with <IconHeart size={16} className="inline text-red-500" fill="currentColor" /> by{" "}
                    <span className="font-bold" style={{ color: '#1F4E89' }}>
                      Khaled Hegazy
                    </span>
                  </p>
                  <p className="text-center text-gray-400 text-xs mt-2">
                    Empowering cancer patients with technology and compassion
                  </p>
                </div>
              </div>

              {/* Footer with Branding */}
              <footer className="mt-8 animate-fade-in-up">
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-premium border border-white/40">
                  {/* Main Footer Content */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    {/* Brand Section */}
                    <div className="space-y-3 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
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
                    <div className="space-y-3 text-center md:text-left">
                      <h4 className="text-base font-bold text-gray-900 font-jakarta">What You'll Get</h4>
                      <ul className="space-y-2">
                        <li className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-2">
                          <IconFolder size={16} style={{ color: '#1F4E89' }} />
                          Medical Records Management
                        </li>
                        <li className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-2">
                          <IconCalendarCheck size={16} style={{ color: '#1F4E89' }} />
                          Smart Screening Schedules
                        </li>
                        <li className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-2">
                          <IconBrain size={16} style={{ color: '#1F4E89' }} />
                          AI-Powered Insights
                        </li>
                        <li className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-2">
                          <IconHeart size={16} style={{ color: '#1F4E89' }} />
                          Community Support
                        </li>
                      </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="space-y-3 text-center md:text-left">
                      <h4 className="text-base font-bold text-gray-900 font-jakarta">Connect With Us</h4>
                      <p className="text-sm text-gray-500">
                        Join our community and stay updated with the latest healthcare insights.
                      </p>
                      <div className="flex gap-3 justify-center md:justify-start pt-2">
                        <button className="p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(to bottom right, #1F4E89, #2E6BA8)' }}>
                          <IconMail size={20} className="text-white" />
                        </button>
                        <button className="p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(to bottom right, #2E6BA8, #4A8BC2)' }}>
                          <IconBrandTwitter size={20} className="text-white" />
                        </button>
                        <button className="p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ background: 'linear-gradient(to bottom right, #4A8BC2, #6BA5D9)' }}>
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

              {/* Footer Note */}
              <p className="text-center text-gray-600 text-sm mt-6">
                By signing up, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // User is authenticated, show normal content
  return <>{children}</>;
};

export default AuthGate;

