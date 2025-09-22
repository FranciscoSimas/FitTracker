class AppConstants {
  // App Info
  static const String appName = 'FitTracker';
  static const String appVersion = '1.0.0';
  
  // Supabase Configuration
  static const String supabaseUrl = 'https://your-project.supabase.co';
  static const String supabaseAnonKey = 'your-anon-key';
  
  // API Endpoints
  static const String baseUrl = 'https://your-project.supabase.co/rest/v1';
  
  // Storage Keys
  static const String userPrefsKey = 'user_preferences';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language';
  static const String unitsKey = 'units';
  
  // Database Tables
  static const String usersTable = 'users';
  static const String exercisesTable = 'exercises';
  static const String workoutPlansTable = 'workout_plans';
  static const String completedWorkoutsTable = 'completed_workouts';
  static const String bodyWeightsTable = 'body_weights';
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
  
  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double borderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double largeBorderRadius = 16.0;
  
  // Breakpoints
  static const double mobileBreakpoint = 600;
  static const double tabletBreakpoint = 900;
  static const double desktopBreakpoint = 1200;
  
  // Chart Colors
  static const List<String> chartColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];
  
  // Muscle Groups
  static const List<String> muscleGroups = [
    'Peito',
    'Costas',
    'Ombros',
    'Bícep',
    'Trícep',
    'Pernas',
    'Core',
  ];
  
  // Units
  static const String kgUnit = 'kg';
  static const String lbUnit = 'lb';
  static const String cmUnit = 'cm';
  static const String inUnit = 'in';
}

