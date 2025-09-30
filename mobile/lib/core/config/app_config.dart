class AppConfig {
  static const String appName = 'Smart Student Hub';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  
  // API Configuration
  static const String baseUrl = 'https://your-api-domain.com/api';
  static const String apiVersion = 'v1';
  static const Duration apiTimeout = Duration(seconds: 30);
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language';
  
  // Hive Box Names
  static const String userBox = 'user_box';
  static const String activitiesBox = 'activities_box';
  static const String portfolioBox = 'portfolio_box';
  static const String settingsBox = 'settings_box';
  
  // File Upload
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedDocumentTypes = ['pdf', 'doc', 'docx', 'txt'];
  static const List<String> allowedVideoTypes = ['mp4', 'avi', 'mov'];
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Cache Duration
  static const Duration cacheExpiry = Duration(hours: 24);
  static const Duration imageCacheExpiry = Duration(days: 7);
  
  // Notification
  static const String notificationChannelId = 'smart_student_hub_channel';
  static const String notificationChannelName = 'Smart Student Hub Notifications';
  static const String notificationChannelDescription = 'Notifications for activity approvals and updates';
  
  // Deep Links
  static const String deepLinkScheme = 'smartstudenthub';
  static const String deepLinkHost = 'app.smartstudenthub.com';
  
  // Social Media
  static const String websiteUrl = 'https://smartstudenthub.com';
  static const String supportEmail = 'support@smartstudenthub.com';
  static const String privacyPolicyUrl = 'https://smartstudenthub.com/privacy';
  static const String termsOfServiceUrl = 'https://smartstudenthub.com/terms';
  
  // Feature Flags
  static const bool enableBiometricAuth = true;
  static const bool enableOfflineMode = true;
  static const bool enablePushNotifications = true;
  static const bool enableAnalytics = true;
  static const bool enableCrashReporting = true;
  
  // UI Configuration
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 12.0;
  static const double defaultElevation = 2.0;
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
}


