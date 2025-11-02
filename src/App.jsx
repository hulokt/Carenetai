import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Navbar, Footer } from "./components";
import { Home, Profile, Onboarding } from "./pages";
import MedicalRecords from "./pages/records/index";
import ScreeningSchedule from "./pages/ScreeningSchedule";
import SingleRecordDetails from "./pages/records/single-record-details";
import { useStateContext } from "./context";
import AuthGate from "./components/AuthGate";

const App = () => {
  const { user, currentUser, loadingUser } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect to onboarding if:
    // 1. User is authenticated
    // 2. We're not loading user data
    // 3. There's no currentUser
    // 4. We're not already on the onboarding page
    const currentPath = window.location.pathname;
    if (user && !currentUser && !loadingUser && currentPath !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [user, currentUser, loadingUser]);

  return (
    <AuthGate>
      {/* Modern Background with Gradient Mesh */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #F8FAFB, #EEF5FA, #E8F1FA)' }}></div>
          <div className="absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float" style={{ backgroundColor: 'rgba(31, 78, 137, 0.3)' }}></div>
          <div className="absolute top-0 right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-delayed" style={{ backgroundColor: 'rgba(74, 139, 194, 0.3)' }}></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-slow" style={{ backgroundColor: 'rgba(107, 165, 217, 0.3)' }}></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative flex min-h-screen p-6 gap-6">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden sm:block">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-[1400px] mx-auto w-full">
          <Navbar />

            {/* Routes Container */}
            <div className="animate-fade-in-up">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route
              path="/medical-records/:id"
              element={<SingleRecordDetails />}
            />
            <Route path="/screening-schedules" element={<ScreeningSchedule />} />
          </Routes>
            </div>

            {/* Footer - Hidden on onboarding, screening schedules, and profile pages */}
            {location.pathname !== "/onboarding" && 
             location.pathname !== "/screening-schedules" && 
             location.pathname !== "/profile" && <Footer />}
          </div>
        </div>
      </div>
    </AuthGate>
  );
};

export default App;
