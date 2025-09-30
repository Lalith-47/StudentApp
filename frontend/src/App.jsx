import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";
import RoleProtectedRoute from "./components/Auth/RoleProtectedRoute";
import ThemeFavicon from "./components/ThemeFavicon";
import ErrorBoundary from "./components/ErrorBoundary";
import PerformanceMonitor from "./components/UI/PerformanceMonitor";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy load pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const Quiz = React.lazy(() => import("./pages/Quiz"));
const Roadmap = React.lazy(() => import("./pages/Roadmap"));
const Colleges = React.lazy(() => import("./pages/Colleges"));
const Chatbot = React.lazy(() => import("./pages/Chatbot"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const MentorPortal = React.lazy(() => import("./pages/MentorPortal"));
const FacultyPortal = React.lazy(() => import("./pages/FacultyPortal"));
const EnhancedFacultyPortal = React.lazy(() =>
  import("./pages/EnhancedFacultyPortal")
);
const EnhancedStudentPortal = React.lazy(() =>
  import("./pages/EnhancedStudentPortal")
);
const EnhancedAdminPortal = React.lazy(() =>
  import("./pages/EnhancedAdminPortal")
);
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeFavicon />
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <ErrorBoundary>
            <PerformanceMonitor enabled={import.meta.env.DEV} />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="quiz" element={<Quiz />} />
                  <Route path="roadmap" element={<Roadmap />} />
                  <Route path="colleges" element={<Colleges />} />
                  <Route path="chatbot" element={<Chatbot />} />
                  <Route
                    path="dashboard"
                    element={
                      <RoleProtectedRoute allowedRoles={["student"]}>
                        <EnhancedStudentPortal />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="mentor"
                    element={
                      <RoleProtectedRoute allowedRoles={["mentor"]}>
                        <MentorPortal />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="faculty"
                    element={
                      <RoleProtectedRoute allowedRoles={["faculty", "admin"]}>
                        <EnhancedFacultyPortal />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="student"
                    element={
                      <RoleProtectedRoute allowedRoles={["student", "admin"]}>
                        <EnhancedStudentPortal />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route
                    path="admin"
                    element={
                      <RoleProtectedRoute allowedRoles={["admin"]}>
                        <EnhancedAdminPortal />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
