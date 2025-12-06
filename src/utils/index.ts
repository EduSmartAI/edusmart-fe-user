/**
 * Utility Functions Index
 * Centralized exports for all utility functions
 */

// Learning Path Cleanup Utilities
export {
  clearLearningPathData,
  checkLocalStorageHealth,
  getLearningPathStorageSnapshot,
  validateLearningPathData,
  safeLocalStorage,
  safeSessionStorage,
  LEARNING_PATH_STORAGE_KEYS,
  type CleanupOptions,
} from "./learningPathCleanup";

// Common Functions
export * from "./commonFunction";

// Ant Design Validation
export * from "./antValidation";

// Quiz Utilities
export * from "./quiz";
