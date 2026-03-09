import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Farms from "./pages/Farms";
import Services from "./pages/Services";
import Payments from "./pages/Payments";
import Iot from "./pages/Iot";
import Weather from "./pages/Weather";
import MyBookings from "@/pages/MyBookings";
import { Navigate } from "react-router-dom";
import { authService } from "@/services/auth";
import AppLayout from "@/components/layout/AppLayout";

// Admin Module Imports
import AdminLayout from "./modules/admin/AdminLayout";
import AdminDashboard from "./modules/admin/pages/Dashboard";
import AdminUsers from "./modules/admin/pages/Users";
import AdminFarms from "./modules/admin/pages/Farms";
import AdminSensors from "./modules/admin/pages/Sensors";
import AdminPilots from "./modules/admin/pages/Pilots";
import AdminBookings from "./modules/admin/pages/Bookings";
import AdminTransactions from "./modules/admin/pages/Transactions";
import AdminCrops from "./modules/admin/pages/Crops";
import AdminContent from "./modules/admin/pages/Content";

// Farmer Module Imports
import FarmerLayout from "./modules/farmer/FarmerLayout";
import FarmerDashboard from "./modules/farmer/pages/Dashboard";
import FarmerFarms from "./modules/farmer/pages/Farms";
import FarmerAddFarm from "./modules/farmer/pages/AddFarm";
import FarmerServices from "./modules/farmer/pages/Services";
import FarmerBookService from "./modules/farmer/pages/BookService";
import FarmerReports from "./modules/farmer/pages/Reports";
import FarmerNDVI from "./modules/farmer/pages/NDVI";
import FarmerWeather from "./modules/farmer/pages/Weather";
import FarmerIoT from "./modules/farmer/pages/IoT";
import FarmerAlerts from "./modules/farmer/pages/Alerts";

// Pilot Module Imports
import PilotLayout from "./modules/pilot/PilotLayout";
import PilotDashboard from "./modules/pilot/pages/Dashboard";
import PilotBookings from "./modules/pilot/pages/Bookings";
import PilotMissionDetail from "./modules/pilot/pages/MissionDetail";
import PilotJobs from "./modules/pilot/pages/Jobs"; // Keep for backward compat if needed

// Agronomist Module Imports
import AgronomistLayout from "./modules/agronomist/AgronomistLayout";
import AgronomistDashboard from "./modules/agronomist/pages/Dashboard";
import AgronomistFarms from "./modules/agronomist/pages/Farms";
import AgronomistAdvisories from "./modules/agronomist/pages/Advisories";
import AgronomistAdvisoryDetail from "./modules/agronomist/pages/AdvisoryDetail";
import AgronomistCreateAdvisory from "./modules/agronomist/pages/CreateAdvisory";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />

    <Routes>
      {/* ✅ FIX: Root route always shows Index page - no redirect logic */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />

      <Route element={<ProtectedRoute allowedRoles={['admin', 'Admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="farms" element={<AdminFarms />} />
          <Route path="sensors" element={<AdminSensors />} />
          <Route path="pilots" element={<AdminPilots />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="crops" element={<AdminCrops />} />
          <Route path="content" element={<AdminContent />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<FarmerDashboard />} />
          <Route path="farms" element={<FarmerFarms />} />
          <Route path="farms/add" element={<FarmerAddFarm />} />
          <Route path="ndvi" element={<FarmerNDVI />} />
          <Route path="weather" element={<FarmerWeather />} />
          <Route path="iot" element={<FarmerIoT />} />
          <Route path="services" element={<FarmerServices />} />
          <Route path="bookings/new" element={<FarmerBookService />} />
          <Route path="reports" element={<FarmerReports />} />
          <Route path="alerts" element={<FarmerAlerts />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['pilot']} />}>
        <Route path="/pilot" element={<PilotLayout />}>
          <Route index element={<PilotDashboard />} />
          <Route path="jobs" element={<PilotBookings />} />
          <Route path="bookings/:id" element={<PilotMissionDetail />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['agronomist']} />}>
        <Route path="/agronomist" element={<AgronomistLayout />}>
          <Route index element={<AgronomistDashboard />} />
          <Route path="farms" element={<AgronomistFarms />} />
          <Route path="farms/:farmId/advisory/new" element={<AgronomistCreateAdvisory />} />
          <Route path="advisories" element={<AgronomistAdvisories />} />
          <Route path="advisories/:id" element={<AgronomistAdvisoryDetail />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

  </TooltipProvider>
);

export default App;
