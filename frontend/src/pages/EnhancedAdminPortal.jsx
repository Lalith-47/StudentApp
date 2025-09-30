import React from "react";
import ModernAdminDashboard from "../components/Admin/ModernAdminDashboard";
import RoleBasedRoute from "../components/Auth/RoleBasedRoute";

const EnhancedAdminPortal = () => {
  return (
    <RoleBasedRoute allowedRoles={["admin"]} fallbackPath="/dashboard">
      <ModernAdminDashboard />
    </RoleBasedRoute>
  );
};

export default EnhancedAdminPortal;
