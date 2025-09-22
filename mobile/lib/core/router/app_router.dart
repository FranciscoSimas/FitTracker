import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/workouts/presentation/pages/workout_plans_page.dart';
import '../../features/workouts/presentation/pages/active_workout_page.dart';
import '../../features/exercises/presentation/pages/exercises_page.dart';
import '../../features/evolution/presentation/pages/evolution_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../shared/presentation/layouts/main_layout.dart';
import '../../shared/presentation/layouts/auth_layout.dart';

// Router Provider
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    debugLogDiagnostics: true,
    routes: [
      // Splash Route
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashPage(),
      ),
      
      // Auth Routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const AuthLayout(
          child: LoginPage(),
        ),
      ),
      
      // Main App Routes
      ShellRoute(
        builder: (context, state, child) => MainLayout(child: child),
        routes: [
          // Workout Plans
          GoRoute(
            path: '/workouts',
            name: 'workouts',
            builder: (context, state) => const WorkoutPlansPage(),
          ),
          
          // Active Workout
          GoRoute(
            path: '/active-workout/:planId',
            name: 'active-workout',
            builder: (context, state) {
              final planId = state.pathParameters['planId']!;
              return ActiveWorkoutPage(planId: planId);
            },
          ),
          
          // Exercises
          GoRoute(
            path: '/exercises',
            name: 'exercises',
            builder: (context, state) => const ExercisesPage(),
          ),
          
          // Evolution
          GoRoute(
            path: '/evolution',
            name: 'evolution',
            builder: (context, state) => const EvolutionPage(),
          ),
          
          // Profile
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfilePage(),
          ),
        ],
      ),
    ],
    
    // Error Handling
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Página não encontrada',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'A página que procuras não existe.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go('/workouts'),
              child: const Text('Voltar ao Início'),
            ),
          ],
        ),
      ),
    ),
  );
});

// Navigation Extensions
extension AppRouterExtension on BuildContext {
  void goToWorkouts() => go('/workouts');
  void goToActiveWorkout(String planId) => go('/active-workout/$planId');
  void goToExercises() => go('/exercises');
  void goToEvolution() => go('/evolution');
  void goToProfile() => go('/profile');
  void goToLogin() => go('/login');
  void goToSplash() => go('/splash');
  
  void pushWorkouts() => push('/workouts');
  void pushActiveWorkout(String planId) => push('/active-workout/$planId');
  void pushExercises() => push('/exercises');
  void pushEvolution() => push('/evolution');
  void pushProfile() => push('/profile');
}

