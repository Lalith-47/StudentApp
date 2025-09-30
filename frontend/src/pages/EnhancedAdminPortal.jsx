const EnhancedAdminPortal = () => {
  return (
    <RoleBasedRoute allowedRoles={["admin"]} fallbackPath="/dashboard">
      <ModernAdminDashboard />
    </RoleBasedRoute>
  );
};

export default EnhancedAdminPortal;
