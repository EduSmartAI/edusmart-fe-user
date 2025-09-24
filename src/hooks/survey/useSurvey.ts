"use client";

import { useSurveyStore } from "EduSmart/stores/Survey/SurveyStore";
import {
  Survey1FormValues,
  Survey2FormValues,
  Survey3FormValues,
} from "EduSmart/types";

export function useSurvey() {
  // Hook chỉ sử dụng Store - Store sẽ handle việc call API
  const store = useSurveyStore();

  return {
    // ===== DATA từ Store =====
    survey1Data: store.survey1Data,
    survey2Data: store.survey2Data,
    survey3Data: store.survey3Data,

    // ===== DATA MANAGEMENT METHODS =====
    updateSurveyData: (
      step: number,
      data: Survey1FormValues | Survey2FormValues | Survey3FormValues,
    ) => store.updateSurveyData(step, data),

    // ===== PROGRESS MANAGEMENT =====
    currentStep: store.currentStep,
    completedSteps: store.completedSteps,
    setCurrentStep: store.setCurrentStep,
    goToNextStep: store.goToNextStep,
    goToPreviousStep: store.goToPreviousStep,
    markStepCompleted: store.markStepCompleted,
    getProgress: store.getProgress,
    isStepCompleted: store.isStepCompleted,
    canGoToStep: store.canGoToStep,
    getCompletedStepsCount: store.getCompletedStepsCount,

    // ===== SUBMISSION - Store handles API calls =====
    isSubmitting: store.isSubmitting,
    submitError: store.submitError,
    surveyId: store.surveyId,
    submitSurvey: store.submitSurvey, // Store method calls server action

    // ===== RECOMMENDATIONS - Store handles API calls =====
    recommendations: store.recommendations,
    loadRecommendations: store.loadRecommendations, // Store method calls server action

    // ===== DRAFT MANAGEMENT - Store handles API calls =====
    isDraftSaving: store.isDraftSaving,
    lastSavedAt: store.lastSavedAt,
    saveDraft: store.saveDraft, // Store method calls server action
    loadDraft: store.loadDraft, // Store method calls server action

    // ===== CLIENT API DATA & LOADING STATES =====
    // Form options data
    semesters: store.semesters,
    majors: store.majors,
    technologies: store.technologies,
    learningGoals: store.learningGoals,
    surveyList: store.surveyList,
    interestSurveyDetail: store.interestSurveyDetail,
    habitSurveyDetail: store.habitSurveyDetail,

    // Loading states
    isLoadingSemesters: store.isLoadingSemesters,
    isLoadingMajors: store.isLoadingMajors,
    isLoadingTechnologies: store.isLoadingTechnologies,
    isLoadingLearningGoals: store.isLoadingLearningGoals,
    isLoadingSurveyList: store.isLoadingSurveyList,
    isLoadingInterestSurvey: store.isLoadingInterestSurvey,
    isLoadingHabitSurvey: store.isLoadingHabitSurvey,

    // Client API methods
    loadSemesters: store.loadSemesters,
    loadMajors: store.loadMajors,
    loadTechnologies: store.loadTechnologies,
    loadLearningGoals: store.loadLearningGoals,
    loadSurveyList: store.loadSurveyList,
    loadInterestSurvey: store.loadInterestSurvey,
    loadHabitSurvey: store.loadHabitSurvey,
    initializeFormData: store.initializeFormData,

    // ===== UTILITY =====
    resetSurvey: store.resetSurvey,
    clearSurveyData: store.clearSurveyData,
    getAllSurveyData: store.getAllSurveyData,
  };
}
