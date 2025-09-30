import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Edit,
  Trash2,
  Key,
  UserCheck,
  UserX,
  Search,
  Filter,
  RefreshCw,
  Shield,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  MoreVertical,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";
import apiService from "../../utils/api";

const FacultyAdminManagement = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "",
    phone: "",
    isActive: true,
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search or filters change
  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((user) =>
        statusFilter === "active" ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.getUsers({
        page: 1,
        limit: 100,
        role: "faculty,admin", // Only get faculty and admin users
      });
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error("Failed to load faculty and admin users:", error);
      // Set dummy data for development
      setUsers([
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@yukti.com",
          role: "faculty",
          department: "Computer Science",
          phone: "+91 98765 43210",
          isActive: true,
          lastLoginFormatted: "2 hours ago",
          createdAtFormatted: "Jan 15, 2024",
          avatar: null,
        },
        {
          id: 2,
          name: "Dr. Michael Chen",
          email: "michael.chen@yukti.com",
          role: "faculty",
          department: "Mathematics",
          phone: "+91 98765 43211",
          isActive: true,
          lastLoginFormatted: "1 day ago",
          createdAtFormatted: "Feb 20, 2024",
          avatar: null,
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@yukti.com",
          role: "admin",
          department: "Administration",
          phone: "+91 98765 43212",
          isActive: true,
          lastLoginFormatted: "30 minutes ago",
          createdAtFormatted: "Dec 1, 2023",
          avatar: null,
        },
        {
          id: 4,
          name: "Dr. Priya Patel",
          email: "priya.patel@yukti.com",
          role: "faculty",
          department: "Physics",
          phone: "+91 98765 43213",
          isActive: false,
          lastLoginFormatted: "1 week ago",
          createdAtFormatted: "Mar 10, 2024",
          avatar: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.createUser(formData);

      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "faculty",
          department: "",
          phone: "",
          isActive: true,
        });
        loadUsers(); // Reload users
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.updateUser(
        selectedUser.id,
        formData
      );

      if (response.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        loadUsers(); // Reload users
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.deleteUser(
        selectedUser.id
      );

      if (response.success) {
        setShowDeleteModal(false);
        setSelectedUser(null);
        loadUsers(); // Reload users
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.updateUserStatus(
        user.id,
        {
          isActive: !user.isActive,
        }
      );

      if (response.success) {
        loadUsers(); // Reload users
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.resetUserPassword(
        user.id,
        {
          newPassword: "TempPassword123!",
        }
      );

      if (response.success) {
        alert(
          "Password reset successfully. New temporary password sent to user's email."
        );
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department || "",
      phone: user.phone || "",
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? Shield : GraduationCap;
  };

  const getRoleColor = (role) => {
    return role === "admin"
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Faculty & Admin Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage faculty and admin accounts
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Faculty/Admin</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or department..."
              className="pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Roles</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            variant="outline"
            onClick={loadUsers}
            className="flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {filteredUsers.map((user, index) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="flex flex-col space-y-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm md:text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        <RoleIcon className="w-3 h-3 inline mr-1" />
                        {user.role}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {user.isActive ? (
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 inline mr-1" />
                        )}
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    {user.department && (
                      <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{user.department}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Joined: {user.createdAtFormatted}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Last login: {user.lastLoginFormatted}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(user)}
                      className="flex-1 min-w-0 hover:bg-blue-50 hover:border-blue-300 text-xs"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(user)}
                      className={`${
                        user.isActive
                          ? "hover:bg-red-50 hover:border-red-300"
                          : "hover:bg-green-50 hover:border-green-300"
                      }`}
                      title={user.isActive ? "Deactivate" : "Activate"}
                    >
                      {user.isActive ? (
                        <UserX className="w-3 h-3 md:w-4 md:h-4" />
                      ) : (
                        <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResetPassword(user)}
                      className="hover:bg-yellow-50 hover:border-yellow-300"
                      title="Reset Password"
                    >
                      <Key className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDeleteModal(user)}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      title="Delete User"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  Create New User
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="Enter department"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Active account
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleCreateUser}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create User"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit User
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="Enter department"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="editIsActive"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Active account
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleUpdateUser}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update User"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete{" "}
                <strong>{selectedUser?.name}</strong>? This action cannot be
                undone.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={handleDeleteUser}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete User"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyAdminManagement;
