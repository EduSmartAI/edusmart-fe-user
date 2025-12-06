/**
 * Learning Path Data Cleanup Utility
 *
 * Centralized function to safely clear/reset all learning path related data
 * Use cases:
 * - User clicks exit button during assessment
 * - User clicks home button
 * - User clicks "Khám phá ngay" to start fresh
 * - User completes learning path and wants to start new one
 * - Error recovery scenarios
 */

import { useSurveyStore } from "EduSmart/stores/Survey/SurveyStore";
import { useQuizStore } from "EduSmart/stores/Quiz/QuizStore";
import { usePracticeTestStore } from "EduSmart/stores/PracticeTest/PracticeTestStore";

/**
 * All localStorage keys used in learning path flow
 * Centralized to avoid missing any keys during cleanup
 */
export const LEARNING_PATH_STORAGE_KEYS = {
  // Learning Path Progress
  CURRENT_STEP: "learning_path_current_step",
  COMPLETED_STEPS: "learning_path_completed_steps",
  LEARNING_PATH_ID: "learning_path_id",

  // Flow State
  FLOW_STATE: "learning-path-flow-state",

  // Survey Related
  SURVEY_COMPLETED: "survey_completed",
  SURVEY_STEP: "survey_step",
  SURVEY_STORAGE: "survey-storage", // Zustand persist key
  SURVEY_DATA: "survey_data",

  // Quiz Related
  QUIZ_COMPLETED: "quiz_completed",
  QUIZ_STORE: "quiz-store", // Zustand persist key

  // Practice Test Related
  PRACTICE_TEST_STORAGE: "practice-test-storage", // Zustand persist key

  // Session Storage (temporary data)
  ASSESSMENT_COMPLETED: "learning-path-assessment-completed",
} as const;

/**
 * Options for cleanup behavior
 */
export interface CleanupOptions {
  /**
   * Clear Zustand stores (survey, quiz, practice test)
   * Default: true
   */
  clearStores?: boolean;

  /**
   * Clear localStorage keys
   * Default: true
   */
  clearLocalStorage?: boolean;

  /**
   * Clear sessionStorage keys
   * Default: true
   */
  clearSessionStorage?: boolean;

  /**
   * Log cleanup actions to console
   * Default: true in development, false in production
   */
  verbose?: boolean;

  /**
   * Callback function to execute after cleanup
   */
  onComplete?: () => void;

  /**
   * Callback function to execute if cleanup fails
   */
  onError?: (error: Error) => void;
}

/**
 * Safe localStorage wrapper to prevent errors in SSR or when localStorage is unavailable
 */
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get localStorage item "${key}":`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage item "${key}":`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove localStorage item "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
      return false;
    }
  },
};

/**
 * Safe sessionStorage wrapper
 */
const safeSessionStorage = {
  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove sessionStorage item "${key}":`, error);
      return false;
    }
  },
};

/**
 * Main cleanup function - clears all learning path related data
 *
 * @param options - Cleanup options
 * @returns Object with success status and any errors encountered
 */
export function clearLearningPathData(options: CleanupOptions = {}): {
  success: boolean;
  errors: Error[];
} {
  const {
    clearStores = true,
    clearLocalStorage = true,
    clearSessionStorage = true,
    verbose = process.env.NODE_ENV === "development",
    onComplete,
    onError,
  } = options;

  const errors: Error[] = [];

  if (verbose) {
    console.log("🧹 Starting learning path data cleanup...");
  }

  try {
    // 1. Clear Zustand Stores
    if (clearStores) {
      try {
        // Reset Survey Store
        const surveyStore = useSurveyStore.getState();
        surveyStore.resetSurvey();

        // Reset Quiz Store
        const quizStore = useQuizStore.getState();
        if (quizStore.resetSeries) {
          quizStore.resetSeries();
        }

        // Reset Practice Test Store
        const practiceTestStore = usePracticeTestStore.getState();
        if (practiceTestStore.reset) {
          practiceTestStore.reset();
        }

        if (verbose) {
          console.log("✅ Zustand stores reset");
        }
      } catch (error) {
        const err = new Error(`Failed to reset Zustand stores: ${error}`);
        errors.push(err);
        console.error(err);
      }
    }

    // 2. Clear localStorage keys
    if (clearLocalStorage) {
      try {
        let removedCount = 0;
        Object.values(LEARNING_PATH_STORAGE_KEYS).forEach((key) => {
          if (key !== LEARNING_PATH_STORAGE_KEYS.ASSESSMENT_COMPLETED) {
            if (safeLocalStorage.removeItem(key)) {
              removedCount++;
            }
          }
        });

        if (verbose) {
          console.log(`✅ Removed ${removedCount} localStorage keys`);
        }
      } catch (error) {
        const err = new Error(`Failed to clear localStorage: ${error}`);
        errors.push(err);
        console.error(err);
      }
    }

    // 3. Clear sessionStorage keys
    if (clearSessionStorage) {
      try {
        safeSessionStorage.removeItem(
          LEARNING_PATH_STORAGE_KEYS.ASSESSMENT_COMPLETED,
        );

        if (verbose) {
          console.log("✅ sessionStorage cleared");
        }
      } catch (error) {
        const err = new Error(`Failed to clear sessionStorage: ${error}`);
        errors.push(err);
        console.error(err);
      }
    }

    if (verbose) {
      console.log("✅ Learning path data cleanup completed successfully");
    }

    // Execute completion callback
    if (onComplete) {
      try {
        onComplete();
      } catch (error) {
        console.error("Error in onComplete callback:", error);
      }
    }

    return {
      success: errors.length === 0,
      errors,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    errors.push(err);

    console.error("❌ Critical error during cleanup:", err);

    // Execute error callback
    if (onError) {
      try {
        onError(err);
      } catch (callbackError) {
        console.error("Error in onError callback:", callbackError);
      }
    }

    return {
      success: false,
      errors,
    };
  }
}

/**
 * Check if localStorage is available and working
 * Useful for debugging and error handling
 */
export function checkLocalStorageHealth(): {
  available: boolean;
  writable: boolean;
  readable: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let available = false;
  let writable = false;
  let readable = false;

  // Check if localStorage exists
  if (typeof window === "undefined") {
    errors.push("Running in SSR environment (window is undefined)");
    return { available, writable, readable, errors };
  }

  if (typeof localStorage === "undefined") {
    errors.push("localStorage is not defined");
    return { available, writable, readable, errors };
  }

  available = true;

  // Test write
  const testKey = "__learning_path_test__";
  const testValue = "test";

  try {
    localStorage.setItem(testKey, testValue);
    writable = true;
  } catch (error) {
    errors.push(`localStorage write failed: ${error}`);
  }

  // Test read
  try {
    const value = localStorage.getItem(testKey);
    if (value === testValue) {
      readable = true;
    } else {
      errors.push("localStorage read returned unexpected value");
    }
  } catch (error) {
    errors.push(`localStorage read failed: ${error}`);
  }

  // Cleanup test key
  try {
    localStorage.removeItem(testKey);
  } catch (error) {
    errors.push(`localStorage cleanup failed: ${error}`);
  }

  return { available, writable, readable, errors };
}

/**
 * Get all learning path related data from localStorage
 * Useful for debugging
 */
export function getLearningPathStorageSnapshot(): Record<
  string,
  string | null
> {
  const snapshot: Record<string, string | null> = {};

  Object.entries(LEARNING_PATH_STORAGE_KEYS).forEach(([name, key]) => {
    snapshot[name] = safeLocalStorage.getItem(key);
  });

  return snapshot;
}

/**
 * Validate learning path data integrity
 * Checks if data is in expected format
 */
export function validateLearningPathData(): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check completed steps format
  const completedStepsStr = safeLocalStorage.getItem(
    LEARNING_PATH_STORAGE_KEYS.COMPLETED_STEPS,
  );
  if (completedStepsStr) {
    try {
      const parsed = JSON.parse(completedStepsStr);
      if (!Array.isArray(parsed)) {
        issues.push("completed_steps is not an array");
      } else if (!parsed.every((step) => typeof step === "number")) {
        issues.push("completed_steps contains non-number values");
      }
    } catch (error) {
      issues.push(`completed_steps is not valid JSON: ${error}`);
    }
  }

  // Check current step format
  const currentStep = safeLocalStorage.getItem(
    LEARNING_PATH_STORAGE_KEYS.CURRENT_STEP,
  );
  if (currentStep) {
    const stepNum = parseInt(currentStep, 10);
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 3) {
      issues.push(`current_step has invalid value: ${currentStep}`);
    }
  }

  // Check flow state format
  const flowStateStr = safeLocalStorage.getItem(
    LEARNING_PATH_STORAGE_KEYS.FLOW_STATE,
  );
  if (flowStateStr) {
    try {
      const parsed = JSON.parse(flowStateStr);
      if (typeof parsed !== "object" || parsed === null) {
        issues.push("flow_state is not an object");
      }
    } catch (error) {
      issues.push(`flow_state is not valid JSON: ${error}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Export safe storage wrappers for use in other parts of the app
 */
export { safeLocalStorage, safeSessionStorage };
