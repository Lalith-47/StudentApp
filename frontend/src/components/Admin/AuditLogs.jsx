import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  RefreshCw,
  Eye,
  Search,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    category: "",
    severity: "",
    performedBy: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const severityColors = {
    low: "text-green-600 bg-green-100",
    medium: "text-yellow-600 bg-yellow-100",
    high: "text-orange-600 bg-orange-100",
    critical: "text-red-600 bg-red-100",
  };

  const severityIcons = {
    low: <CheckCircle className="w-4 h-4" />,
    medium: <Info className="w-4 h-4" />,
    high: <AlertTriangle className="w-4 h-4" />,
    critical: <AlertTriangle className="w-4 h-4" />,
  };

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for now - replace with actual API call
      const mockLogs = [
        {
          id: "1",
          action: "user_created",
          category: "User Management",
          severity: "medium",
          description: "New faculty user created: john.doe@university.edu",
          performedBy: "admin@test.com",
          timestamp: new Date().toISOString(),
          details: {
            userId: "user123",
            userName: "John Doe",
            userRole: "faculty",
          },
        },
        {
          id: "2",
          action: "system_settings_updated",
          category: "System Configuration",
          severity: "high",
          description: "System security settings updated",
          performedBy: "admin@test.com",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: {
            settingName: "password_policy",
            oldValue: "6 characters",
            newValue: "8 characters",
          },
        },
        {
          id: "3",
          action: "bulk_grades_uploaded",
          category: "Academic Management",
          severity: "low",
          description: "Bulk grades uploaded for CS101 course",
          performedBy: "faculty@test.com",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: {
            courseId: "cs101",
            courseName: "Introduction to Computer Science",
            recordsCount: 150,
          },
        },
      ];

      setAuditLogs(mockLogs);
    } catch (err) {
      console.error("Error loading audit logs:", err);
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.action || log.action === filters.action) &&
      (!filters.category || log.category === filters.category) &&
      (!filters.severity || log.severity === filters.severity) &&
      (!filters.performedBy || log.performedBy === filters.performedBy);

    return matchesSearch && matchesFilters;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading audit logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button onClick={loadAuditLogs} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audit Logs
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system activities and user actions
          </p>
        </div>
        <Button onClick={loadAuditLogs} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="User Management">User Management</option>
              <option value="System Configuration">System Configuration</option>
              <option value="Academic Management">Academic Management</option>
              <option value="Security">Security</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Performed By
            </label>
            <Input
              type="text"
              placeholder="User email..."
              value={filters.performedBy}
              onChange={(e) =>
                setFilters({ ...filters, performedBy: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Audit Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No audit logs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No logs match your current filters.
            </p>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          severityColors[log.severity]
                        }`}
                      >
                        {severityIcons[log.severity]}
                        {log.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {log.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {log.description}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {log.performedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
