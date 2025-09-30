import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Sun,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Key,
  Server,
  Globe,
  Mail,
  Smartphone,
  Monitor,
  Palette,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Users,
  Calendar,
  Clock,
  Zap,
  Activity,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const SystemSettings = ({ activeSubModule }) => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    general: {
      siteName: "Yukti Learning Platform",
      siteDescription: "Advanced learning management system",
      timezone: "UTC",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      maxFileSize: 10,
      allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png"],
    },
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      accentColor: "#10B981",
      darkMode: false,
      sidebarCollapsed: false,
      animations: true,
      compactMode: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      announcementAlerts: true,
      courseUpdates: true,
      systemAlerts: true,
      weeklyDigest: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      passwordRequireSpecial: true,
      loginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: "",
      sslEnforcement: true,
      auditLogging: true,
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      mailgunApiKey: "",
      awsAccessKey: "",
      awsSecretKey: "",
      stripeApiKey: "",
      paypalClientId: "",
      zoomApiKey: "",
      slackWebhook: "",
    },
  });

  // Handle Setting Change
  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  // Reset Settings
  const handleResetSettings = () => {
    setHasChanges(false);
    // Reset to default values
  };

  // Render General Settings
  const renderGeneralSettings = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Name *
            </label>
            <Input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
              placeholder="Enter site name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone *
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Shanghai">Shanghai</option>
              <option value="Asia/Kolkata">India</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Description
          </label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter site description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => handleSettingChange("general", "language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => handleSettingChange("general", "dateFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD MMM YYYY">DD MMM YYYY</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Format
            </label>
            <select
              value={settings.general.timeFormat}
              onChange={(e) => handleSettingChange("general", "timeFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max File Size (MB)
            </label>
            <Input
              type="number"
              value={settings.general.maxFileSize}
              onChange={(e) => handleSettingChange("general", "maxFileSize", parseInt(e.target.value))}
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Allowed File Types
            </label>
            <Input
              type="text"
              value={settings.general.allowedFileTypes.join(", ")}
              onChange={(e) => handleSettingChange("general", "allowedFileTypes", e.target.value.split(", "))}
              placeholder="pdf, doc, docx, jpg, png"
            />
          </div>
        </div>
      </div>
    </Card>
  );

  // Render Theme Settings
  const renderThemeSettings = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => handleSettingChange("theme", "primaryColor", e.target.value)}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <Input
                type="text"
                value={settings.theme.primaryColor}
                onChange={(e) => handleSettingChange("theme", "primaryColor", e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
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
                onChange={(e) => handleSettingChange("theme", "secondaryColor", e.target.value)}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <Input
                type="text"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleSettingChange("theme", "secondaryColor", e.target.value)}
                placeholder="#8B5CF6"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Accent Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => handleSettingChange("theme", "accentColor", e.target.value)}
                className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <Input
                type="text"
                value={settings.theme.accentColor}
                onChange={(e) => handleSettingChange("theme", "accentColor", e.target.value)}
                placeholder="#10B981"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Display Options
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.theme.darkMode}
                onChange={(e) => handleSettingChange("theme", "darkMode", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Enable Dark Mode
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.theme.sidebarCollapsed}
                onChange={(e) => handleSettingChange("theme", "sidebarCollapsed", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Collapsed Sidebar by Default
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.theme.animations}
                onChange={(e) => handleSettingChange("theme", "animations", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Enable Animations
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.theme.compactMode}
                onChange={(e) => handleSettingChange("theme", "compactMode", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Compact Mode
              </span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render Notification Settings
  const renderNotificationSettings = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Notification Channels
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Push Notifications
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                SMS Notifications
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Notification Types
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.announcementAlerts}
                onChange={(e) => handleSettingChange("notifications", "announcementAlerts", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Announcement Alerts
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.courseUpdates}
                onChange={(e) => handleSettingChange("notifications", "courseUpdates", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Course Updates
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.systemAlerts}
                onChange={(e) => handleSettingChange("notifications", "systemAlerts", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                System Alerts
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.weeklyDigest}
                onChange={(e) => handleSettingChange("notifications", "weeklyDigest", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Weekly Digest
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.marketingEmails}
                onChange={(e) => handleSettingChange("notifications", "marketingEmails", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Marketing Emails
              </span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  // Render Security Settings
  const renderSecuritySettings = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Authentication
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Enable Two-Factor Authentication
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.sslEnforcement}
                onChange={(e) => handleSettingChange("security", "sslEnforcement", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Enforce SSL/HTTPS
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.auditLogging}
                onChange={(e) => handleSettingChange("security", "auditLogging", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Enable Audit Logging
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </label>
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password Min Length
            </label>
            <Input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleSettingChange("security", "passwordMinLength", parseInt(e.target.value))}
              placeholder="8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Login Attempts
            </label>
            <Input
              type="number"
              value={settings.security.loginAttempts}
              onChange={(e) => handleSettingChange("security", "loginAttempts", parseInt(e.target.value))}
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lockout Duration (minutes)
            </label>
            <Input
              type="number"
              value={settings.security.lockoutDuration}
              onChange={(e) => handleSettingChange("security", "lockoutDuration", parseInt(e.target.value))}
              placeholder="15"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            IP Whitelist (comma-separated)
          </label>
          <textarea
            value={settings.security.ipWhitelist}
            onChange={(e) => handleSettingChange("security", "ipWhitelist", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="192.168.1.1, 10.0.0.1"
          />
        </div>
      </div>
    </Card>
  );

  // Render Integration Settings
  const renderIntegrationSettings = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Analytics ID
            </label>
            <Input
              type="text"
              value={settings.integrations.googleAnalytics}
              onChange={(e) => handleSettingChange("integrations", "googleAnalytics", e.target.value)}
              placeholder="GA-XXXXXXXXX-X"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facebook Pixel ID
            </label>
            <Input
              type="text"
              value={settings.integrations.facebookPixel}
              onChange={(e) => handleSettingChange("integrations", "facebookPixel", e.target.value)}
              placeholder="XXXXXXXXXXXXXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mailgun API Key
            </label>
            <div className="relative">
              <Input
                type="password"
                value={settings.integrations.mailgunApiKey}
                onChange={(e) => handleSettingChange("integrations", "mailgunApiKey", e.target.value)}
                placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="pr-10"
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stripe API Key
            </label>
            <div className="relative">
              <Input
                type="password"
                value={settings.integrations.stripeApiKey}
                onChange={(e) => handleSettingChange("integrations", "stripeApiKey", e.target.value)}
                      placeholder="sk_test_..."
                className="pr-10"
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AWS Access Key
            </label>
            <Input
              type="text"
              value={settings.integrations.awsAccessKey}
              onChange={(e) => handleSettingChange("integrations", "awsAccessKey", e.target.value)}
              placeholder="AKIAIOSFODNN7EXAMPLE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AWS Secret Key
            </label>
            <div className="relative">
              <Input
                type="password"
                value={settings.integrations.awsSecretKey}
                onChange={(e) => handleSettingChange("integrations", "awsSecretKey", e.target.value)}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                className="pr-10"
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slack Webhook URL
          </label>
          <Input
            type="url"
            value={settings.integrations.slackWebhook}
            onChange={(e) => handleSettingChange("integrations", "slackWebhook", e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
          />
        </div>
      </div>
    </Card>
  );

  // Render Content Based on Active Sub Module
  const renderContent = () => {
    switch (activeSubModule) {
      case "general-settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                General Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure basic platform settings and preferences
              </p>
            </div>
            {renderGeneralSettings()}
          </div>
        );

      case "theme-settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Theme Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize the appearance and theme of your platform
              </p>
            </div>
            {renderThemeSettings()}
          </div>
        );

      case "notification-settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notification Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure notification preferences and channels
              </p>
            </div>
            {renderNotificationSettings()}
          </div>
        );

      case "security-settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Security Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure security policies and authentication settings
              </p>
            </div>
            {renderSecuritySettings()}
          </div>
        );

      case "integration-settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Integration Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Configure third-party integrations and API keys
              </p>
            </div>
            {renderIntegrationSettings()}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a settings category
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from the sidebar to configure settings
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubModule}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Save Actions */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <AlertCircle className="w-4 h-4 mr-2" />
              You have unsaved changes
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSettings}
                disabled={saving}
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SystemSettings;