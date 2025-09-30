import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  Palette,
  Bell,
  Shield,
  Users,
  Globe,
  Database,
  Mail,
  Key,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit,
  Check,
  X,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";
import apiService from "../../utils/api";

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Theme Settings
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      darkMode: false,
      customCSS: "",
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      systemAlerts: true,
      weeklyReports: true,
      maintenanceAlerts: true,
    },
    
    // Security Settings
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        expiryDays: 90,
      },
      sessionTimeout: 30, // minutes
      twoFactorAuth: false,
      ipWhitelist: [],
      maxLoginAttempts: 5,
      lockoutDuration: 15, // minutes
    },
    
    // User Management Settings
    userManagement: {
      defaultRole: "student",
      allowSelfRegistration: true,
      requireEmailVerification: true,
      autoApproveFaculty: false,
      maxUsersPerCourse: 50,
      userDataRetention: 365, // days
    },
    
    // System Configuration
    system: {
      siteName: "Yukti Learning Platform",
      siteDescription: "Your intelligent learning companion",
      timezone: "Asia/Kolkata",
      language: "en",
      dateFormat: "DD/MM/YYYY",
      currency: "INR",
      maintenanceMode: false,
      debugMode: false,
    },
    
    // Integration Settings
    integrations: {
      email: {
        provider: "smtp",
        host: "smtp.gmail.com",
        port: 587,
        username: "",
        password: "",
        fromEmail: "noreply@yukti.com",
        fromName: "Yukti Platform",
      },
      sms: {
        provider: "twilio",
        accountSid: "",
        authToken: "",
        fromNumber: "",
      },
      storage: {
        provider: "local",
        awsAccessKey: "",
        awsSecretKey: "",
        awsBucket: "",
        awsRegion: "us-east-1",
      },
    },
  });

  const [activeTab, setActiveTab] = useState("theme");
  const [showPassword, setShowPassword] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState("");

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.admin.getSystemSettings();
      if (response.data) {
        setSettings({ ...settings, ...response.data });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      await apiService.admin.updateSystemSettings(settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Reset settings
  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      fetchSettings();
    }
  };

  // Add IP to whitelist
  const addIpToWhitelist = () => {
    if (newIpAddress && !settings.security.ipWhitelist.includes(newIpAddress)) {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          ipWhitelist: [...settings.security.ipWhitelist, newIpAddress],
        },
      });
      setNewIpAddress("");
    }
  };

  // Remove IP from whitelist
  const removeIpFromWhitelist = (ip) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        ipWhitelist: settings.security.ipWhitelist.filter((item) => item !== ip),
      },
    });
  };

  // Update nested setting
  const updateNestedSetting = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    });
  };

  // Update deeply nested setting
  const updateDeepNestedSetting = (category, subCategory, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [subCategory]: {
          ...settings[category][subCategory],
          [key]: value,
        },
      },
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const tabs = [
    { id: "theme", label: "Theme", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "users", label: "User Management", icon: Users },
    { id: "system", label: "System", icon: Settings },
    { id: "integrations", label: "Integrations", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={resetSettings}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Settings Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "theme" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Theme Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateNestedSetting("theme", "primaryColor", e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={settings.theme.primaryColor}
                      onChange={(e) => updateNestedSetting("theme", "primaryColor", e.target.value)}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateNestedSetting("theme", "secondaryColor", e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={settings.theme.secondaryColor}
                      onChange={(e) => updateNestedSetting("theme", "secondaryColor", e.target.value)}
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.theme.darkMode}
                    onChange={(e) => updateNestedSetting("theme", "darkMode", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable Dark Mode
                  </span>
                </label>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom CSS
                </label>
                <textarea
                  value={settings.theme.customCSS}
                  onChange={(e) => updateNestedSetting("theme", "customCSS", e.target.value)}
                  placeholder="/* Custom CSS styles */"
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                />
              </div>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateNestedSetting("notifications", key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Security Configuration
              </h3>
              
              <div className="space-y-6">
                {/* Password Policy */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Password Policy
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Length
                      </label>
                      <Input
                        type="number"
                        value={settings.security.passwordPolicy.minLength}
                        onChange={(e) => updateDeepNestedSetting("security", "passwordPolicy", "minLength", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Days
                      </label>
                      <Input
                        type="number"
                        value={settings.security.passwordPolicy.expiryDays}
                        onChange={(e) => updateDeepNestedSetting("security", "passwordPolicy", "expiryDays", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {Object.entries(settings.security.passwordPolicy)
                      .filter(([key]) => typeof key !== 'number')
                      .map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateDeepNestedSetting("security", "passwordPolicy", key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Session Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Session Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateNestedSetting("security", "sessionTimeout", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Login Attempts
                      </label>
                      <Input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => updateNestedSetting("security", "maxLoginAttempts", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lockout Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.security.lockoutDuration}
                        onChange={(e) => updateNestedSetting("security", "lockoutDuration", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => updateNestedSetting("security", "twoFactorAuth", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable Two-Factor Authentication
                    </span>
                  </label>
                </div>

                {/* IP Whitelist */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    IP Whitelist
                  </h4>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newIpAddress}
                      onChange={(e) => setNewIpAddress(e.target.value)}
                      placeholder="Enter IP address (e.g., 192.168.1.1)"
                      className="flex-1"
                    />
                    <Button onClick={addIpToWhitelist} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {settings.security.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">{ip}</span>
                        <button
                          onClick={() => removeIpFromWhitelist(ip)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                User Management Settings
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Role
                    </label>
                    <select
                      value={settings.userManagement.defaultRole}
                      onChange={(e) => updateNestedSetting("userManagement", "defaultRole", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Users Per Course
                    </label>
                    <Input
                      type="number"
                      value={settings.userManagement.maxUsersPerCourse}
                      onChange={(e) => updateNestedSetting("userManagement", "maxUsersPerCourse", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.userManagement.allowSelfRegistration}
                      onChange={(e) => updateNestedSetting("userManagement", "allowSelfRegistration", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Allow Self Registration
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.userManagement.requireEmailVerification}
                      onChange={(e) => updateNestedSetting("userManagement", "requireEmailVerification", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Require Email Verification
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.userManagement.autoApproveFaculty}
                      onChange={(e) => updateNestedSetting("userManagement", "autoApproveFaculty", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Auto Approve Faculty Registration
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Data Retention (days)
                  </label>
                  <Input
                    type="number"
                    value={settings.userManagement.userDataRetention}
                    onChange={(e) => updateNestedSetting("userManagement", "userDataRetention", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                System Configuration
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <Input
                      value={settings.system.siteName}
                      onChange={(e) => updateNestedSetting("system", "siteName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.system.timezone}
                      onChange={(e) => updateNestedSetting("system", "timezone", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.system.siteDescription}
                    onChange={(e) => updateNestedSetting("system", "siteDescription", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.system.language}
                      onChange={(e) => updateNestedSetting("system", "language", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.system.dateFormat}
                      onChange={(e) => updateNestedSetting("system", "dateFormat", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.system.currency}
                      onChange={(e) => updateNestedSetting("system", "currency", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => updateNestedSetting("system", "maintenanceMode", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Maintenance Mode
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.system.debugMode}
                      onChange={(e) => updateNestedSetting("system", "debugMode", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Debug Mode
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="space-y-6">
            {/* Email Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Email Configuration
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider
                    </label>
                    <select
                      value={settings.integrations.email.provider}
                      onChange={(e) => updateDeepNestedSetting("integrations", "email", "provider", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="smtp">SMTP</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailgun">Mailgun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Email
                    </label>
                    <Input
                      type="email"
                      value={settings.integrations.email.fromEmail}
                      onChange={(e) => updateDeepNestedSetting("integrations", "email", "fromEmail", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Host
                    </label>
                    <Input
                      value={settings.integrations.email.host}
                      onChange={(e) => updateDeepNestedSetting("integrations", "email", "host", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SMTP Port
                    </label>
                    <Input
                      type="number"
                      value={settings.integrations.email.port}
                      onChange={(e) => updateDeepNestedSetting("integrations", "email", "port", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <Input
                      value={settings.integrations.email.username}
                      onChange={(e) => updateDeepNestedSetting("integrations", "email", "username", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settings.integrations.email.password}
                        onChange={(e) => updateDeepNestedSetting("integrations", "email", "password", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Storage Configuration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Storage Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Provider
                  </label>
                  <select
                    value={settings.integrations.storage.provider}
                    onChange={(e) => updateDeepNestedSetting("integrations", "storage", "provider", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="local">Local Storage</option>
                    <option value="aws">AWS S3</option>
                    <option value="google">Google Cloud</option>
                    <option value="azure">Azure Blob</option>
                  </select>
                </div>

                {settings.integrations.storage.provider === "aws" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        AWS Access Key
                      </label>
                      <Input
                        value={settings.integrations.storage.awsAccessKey}
                        onChange={(e) => updateDeepNestedSetting("integrations", "storage", "awsAccessKey", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        AWS Secret Key
                      </label>
                      <Input
                        type="password"
                        value={settings.integrations.storage.awsSecretKey}
                        onChange={(e) => updateDeepNestedSetting("integrations", "storage", "awsSecretKey", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        S3 Bucket
                      </label>
                      <Input
                        value={settings.integrations.storage.awsBucket}
                        onChange={(e) => updateDeepNestedSetting("integrations", "storage", "awsBucket", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        AWS Region
                      </label>
                      <Input
                        value={settings.integrations.storage.awsRegion}
                        onChange={(e) => updateDeepNestedSetting("integrations", "storage", "awsRegion", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SystemSettings;
