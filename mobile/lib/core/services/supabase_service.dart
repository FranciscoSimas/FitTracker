import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../constants/app_constants.dart';

class SupabaseService {
  static final SupabaseClient _client = Supabase.instance.client;
  static final GoogleSignIn _googleSignIn = GoogleSignIn();
  
  // Get current user
  static User? get currentUser => _client.auth.currentUser;
  
  // Check if user is authenticated
  static bool get isAuthenticated => currentUser != null;
  
  // Sign in with Google
  static Future<AuthResponse?> signInWithGoogle() async {
    try {
      // Trigger Google Sign In
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null;
      
      // Get authentication details
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      
      // Create credentials
      final AuthResponse response = await _client.auth.signInWithIdToken(
        provider: OAuthProvider.google,
        idToken: googleAuth.idToken!,
        accessToken: googleAuth.accessToken,
      );
      
      return response;
    } catch (e) {
      print('Error signing in with Google: $e');
      return null;
    }
  }
  
  // Sign out
  static Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      await _client.auth.signOut();
    } catch (e) {
      print('Error signing out: $e');
    }
  }
  
  // Get user profile
  static Future<Map<String, dynamic>?> getUserProfile() async {
    if (!isAuthenticated) return null;
    
    try {
      final response = await _client
          .from(AppConstants.usersTable)
          .select()
          .eq('id', currentUser!.id)
          .single();
      
      return response;
    } catch (e) {
      print('Error getting user profile: $e');
      return null;
    }
  }
  
  // Update user profile
  static Future<bool> updateUserProfile(Map<String, dynamic> data) async {
    if (!isAuthenticated) return false;
    
    try {
      await _client
          .from(AppConstants.usersTable)
          .update(data)
          .eq('id', currentUser!.id);
      
      return true;
    } catch (e) {
      print('Error updating user profile: $e');
      return false;
    }
  }
  
  // Get exercises
  static Future<List<Map<String, dynamic>>> getExercises() async {
    try {
      final response = await _client
          .from(AppConstants.exercisesTable)
          .select()
          .order('name');
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error getting exercises: $e');
      return [];
    }
  }
  
  // Get workout plans
  static Future<List<Map<String, dynamic>>> getWorkoutPlans() async {
    if (!isAuthenticated) return [];
    
    try {
      final response = await _client
          .from(AppConstants.workoutPlansTable)
          .select()
          .eq('user_id', currentUser!.id)
          .order('created_at', ascending: false);
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error getting workout plans: $e');
      return [];
    }
  }
  
  // Get completed workouts
  static Future<List<Map<String, dynamic>>> getCompletedWorkouts() async {
    if (!isAuthenticated) return [];
    
    try {
      final response = await _client
          .from(AppConstants.completedWorkoutsTable)
          .select()
          .eq('user_id', currentUser!.id)
          .order('date', ascending: false);
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error getting completed workouts: $e');
      return [];
    }
  }
  
  // Save completed workout
  static Future<bool> saveCompletedWorkout(Map<String, dynamic> workout) async {
    if (!isAuthenticated) return false;
    
    try {
      await _client
          .from(AppConstants.completedWorkoutsTable)
          .insert({
            ...workout,
            'user_id': currentUser!.id,
          });
      
      return true;
    } catch (e) {
      print('Error saving completed workout: $e');
      return false;
    }
  }
  
  // Get body weights
  static Future<List<Map<String, dynamic>>> getBodyWeights() async {
    if (!isAuthenticated) return [];
    
    try {
      final response = await _client
          .from(AppConstants.bodyWeightsTable)
          .select()
          .eq('user_id', currentUser!.id)
          .order('date', ascending: false);
      
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error getting body weights: $e');
      return [];
    }
  }
  
  // Save body weight
  static Future<bool> saveBodyWeight(Map<String, dynamic> bodyWeight) async {
    if (!isAuthenticated) return false;
    
    try {
      await _client
          .from(AppConstants.bodyWeightsTable)
          .insert({
            ...bodyWeight,
            'user_id': currentUser!.id,
          });
      
      return true;
    } catch (e) {
      print('Error saving body weight: $e');
      return false;
    }
  }
  
  // Listen to auth state changes
  static Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;
}

