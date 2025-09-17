// Utility functions for authentication and data management

export const clearUserData = () => {
  // Clear all localStorage data
  localStorage.removeItem('tdp_exercises');
  localStorage.removeItem('tdp_workout_plans');
  localStorage.removeItem('tdp_completed_workouts');
  localStorage.removeItem('tdp_body_weights');
  localStorage.removeItem('currentUserId');
  
  console.log('User data cleared from localStorage');
};

export const setCurrentUserId = (userId: string) => {
  localStorage.setItem('currentUserId', userId);
  console.log('Current user ID set:', userId);
};

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem('currentUserId');
};

export const isUserChanged = (newUserId: string): boolean => {
  const currentUserId = getCurrentUserId();
  return currentUserId !== null && currentUserId !== newUserId;
};
