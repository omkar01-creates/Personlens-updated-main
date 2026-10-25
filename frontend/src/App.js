import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PersonalityTest from "./pages/PersonalityTest";
import Processing from "./pages/Processing";
import Results from "./pages/Results";
import VoiceAnalyzer from "./pages/VoiceAnalyzer";
import Reports from "./pages/Reports";
import Report from "./pages/Report";
import HistoryPage from "./pages/History";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/personality-test"
              element={<PersonalityTest />}
            />

            <Route
              path="/processing"
              element={<Processing />}
            />

            <Route
              path="/results"
              element={<Results />}
            />

            <Route
              path="/voice-analyzer"
              element={<VoiceAnalyzer />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/reports/:id"
              element={<Report />}
            />

            <Route
              path="/history"
              element={<HistoryPage />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />
          </Route>

          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/users/:id"
              element={<AdminUserDetail />}
            />

            <Route
              path="/admin/reports"
              element={<AdminReports />}
            />

            <Route
              path="/admin/analytics"
              element={<AdminAnalytics />}
            />

            <Route
              path="/admin/feedback"
              element={<AdminFeedback />}
            />

            <Route
              path="/admin/settings"
              element={<AdminSettings />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;