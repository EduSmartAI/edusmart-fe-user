/**
 * Survey Business Logic Service
 *
 * Tập trung xử lý các business logic phức tạp của Survey system
 * - Validation logic
 * - Calculation logic
 * - Recommendation algorithms
 * - Progress tracking algorithms
 */

import {
  Survey1FormValues,
  Survey2FormValues,
  Survey3FormValues,
  StudyHabitAnswer,
} from "EduSmart/types";

export interface SurveyAnalysisResult {
  careerMatchScore: number;
  skillGap: string[];
  recommendedPath: RecommendedLearningPath;
  studyTimeEstimate: number; // weeks
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
}

export interface RecommendedLearningPath {
  phase1: LearningPhase;
  phase2: LearningPhase;
  phase3: LearningPhase;
}

export interface LearningPhase {
  title: string;
  duration: number; // weeks
  topics: string[];
  prerequisites: string[];
}

export class SurveyBusinessLogic {
  /**
   * Phân tích toàn bộ survey data và tạo recommendations
   */
  static analyzeSurveyData(
    survey1: Survey1FormValues,
    survey2: Survey2FormValues,
    survey3: Survey3FormValues,
  ): SurveyAnalysisResult {
    const careerMatchScore = this.calculateCareerMatch(survey1, survey2);
    const skillGap = this.identifySkillGaps(survey1, survey2);
    const difficultyLevel = this.determineDifficultyLevel(survey2);
    const studyTimeEstimate = this.calculateStudyTime(survey2, survey3);
    const recommendedPath = this.generateLearningPath(survey1, survey2);

    return {
      careerMatchScore,
      skillGap,
      recommendedPath,
      studyTimeEstimate,
      difficultyLevel,
    };
  }

  /**
   * Tính toán độ phù hợp với career đã chọn dựa trên futureOrientation
   */
  private static calculateCareerMatch(
    survey1: Survey1FormValues,
    survey2: Survey2FormValues,
  ): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const futureOrientation = (survey1 as any).futureOrientation || "";
    const allTechnologies = [
      ...survey2.programmingLanguages,
      ...survey2.frameworks,
      ...survey2.tools,
      ...survey2.platforms,
      ...survey2.databases,
    ];

    // Define required skills for each career path
    const careerRequirements: Record<string, string[]> = {
      frontend: ["javascript", "html", "css", "react", "vue", "angular"],
      backend: ["node", "python", "java", "c#", "php", "go"],
      fullstack: ["javascript", "node", "react", "vue", "database"],
      mobile: ["react-native", "flutter", "swift", "kotlin", "java"],
      devops: ["docker", "kubernetes", "aws", "linux", "jenkins"],
      data: ["python", "r", "sql", "pandas", "numpy", "tensorflow"],
    };

    // Try to match future orientation with career paths
    let targetCareer = "";
    for (const [career] of Object.entries(careerRequirements)) {
      if (futureOrientation.toLowerCase().includes(career)) {
        targetCareer = career;
        break;
      }
    }

    if (!targetCareer) {
      // Default scoring if no specific career found
      return allTechnologies.length > 0 ? 60 : 20;
    }

    const requiredSkills = careerRequirements[targetCareer] || [];
    const matchingTechs = allTechnologies.filter((tech) =>
      requiredSkills.some((skill) =>
        tech.technologyName.toLowerCase().includes(skill.toLowerCase()),
      ),
    );

    const matchScore =
      requiredSkills.length > 0
        ? Math.round((matchingTechs.length / requiredSkills.length) * 100)
        : 50;

    return Math.min(matchScore, 100);
  }

  /**
   * Xác định skill gaps cần bổ sung dựa trên futureOrientation
   */
  private static identifySkillGaps(
    survey1: Survey1FormValues,
    survey2: Survey2FormValues,
  ): string[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const futureOrientation = (survey1 as any).futureOrientation || "";
    const allTechnologies = [
      ...survey2.programmingLanguages,
      ...survey2.frameworks,
      ...survey2.tools,
      ...survey2.platforms,
      ...survey2.databases,
    ];

    const careerRequirements: Record<string, string[]> = {
      frontend: ["HTML/CSS", "JavaScript", "React/Vue", "TypeScript", "Git"],
      backend: [
        "Node.js/Python",
        "Database",
        "API Design",
        "Authentication",
        "Testing",
      ],
      fullstack: [
        "Frontend Frameworks",
        "Backend Development",
        "Database Design",
        "DevOps Basic",
      ],
      mobile: ["React Native/Flutter", "Mobile UI/UX", "App Store Deployment"],
      devops: ["Docker", "Cloud Services", "CI/CD", "Monitoring", "Security"],
      data: [
        "Python/R",
        "SQL",
        "Data Visualization",
        "Machine Learning",
        "Statistics",
      ],
    };

    // Try to identify career from futureOrientation
    let requiredSkills: string[] = [];
    for (const [career, skills] of Object.entries(careerRequirements)) {
      if (futureOrientation.toLowerCase().includes(career)) {
        requiredSkills = skills;
        break;
      }
    }

    if (requiredSkills.length === 0) {
      // Default skills for general programming
      requiredSkills = [
        "Programming Language",
        "Version Control",
        "Database",
        "Web Development",
      ];
    }

    const currentSkillNames = allTechnologies.map((tech) =>
      tech.technologyName.toLowerCase(),
    );

    return requiredSkills.filter(
      (skill) =>
        !currentSkillNames.some(
          (current) =>
            current.includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(current),
        ),
    );
  }

  /**
   * Xác định difficulty level dựa trên kinh nghiệm
   */
  private static determineDifficultyLevel(
    survey2: Survey2FormValues,
  ): "Beginner" | "Intermediate" | "Advanced" {
    const allTechnologies = [
      ...survey2.programmingLanguages,
      ...survey2.frameworks,
      ...survey2.tools,
      ...survey2.platforms,
      ...survey2.databases,
    ];

    // Count technologies with intermediate+ level
    const advancedTechs = allTechnologies.filter(
      (tech) =>
        tech.level === "intermediate" ||
        tech.level === "advanced" ||
        tech.level === "expert",
    );

    if (allTechnologies.length === 0) return "Beginner";
    if (advancedTechs.length === 0) return "Beginner";
    if (advancedTechs.length <= 3) return "Intermediate";
    return "Advanced";
  }

  /**
   * Tính toán thời gian học ước tính
   */
  private static calculateStudyTime(
    survey2: Survey2FormValues,
    survey3: Survey3FormValues,
  ): number {
    const allTechnologies = [
      ...survey2.programmingLanguages,
      ...survey2.frameworks,
      ...survey2.tools,
      ...survey2.platforms,
      ...survey2.databases,
    ];
    const studyHabits = survey3.studyHabits || [];

    // Base time calculation
    let baseWeeks = 12; // Default for beginners

    // Adjust based on current knowledge
    const advancedTechs = allTechnologies.filter(
      (tech) =>
        tech.level === "intermediate" ||
        tech.level === "advanced" ||
        tech.level === "expert",
    );

    if (advancedTechs.length > 3) baseWeeks -= 4;
    if (advancedTechs.length > 6) baseWeeks -= 4;

    // Adjust based on study habits
    const studyHoursPerWeek = this.getStudyHoursFromHabits(studyHabits);
    if (studyHoursPerWeek > 20) baseWeeks -= 2;
    if (studyHoursPerWeek < 10) baseWeeks += 4;

    return Math.max(baseWeeks, 8); // Minimum 8 weeks
  }

  /**
   * Tạo learning path cụ thể dựa trên futureOrientation
   */
  private static generateLearningPath(
    survey1: Survey1FormValues,
    survey2: Survey2FormValues,
  ): RecommendedLearningPath {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const futureOrientation = (survey1 as any).futureOrientation || "";
    const difficulty = this.determineDifficultyLevel(survey2);

    // Generate phases based on career orientation and difficulty
    if (futureOrientation.toLowerCase().includes("frontend")) {
      return this.generateFrontendPath(difficulty);
    } else if (futureOrientation.toLowerCase().includes("backend")) {
      return this.generateBackendPath(difficulty);
    } else if (futureOrientation.toLowerCase().includes("fullstack")) {
      return this.generateFullstackPath(difficulty);
    } else {
      return this.generateGenericPath(difficulty);
    }
  }

  private static generateFrontendPath(
    difficulty: "Beginner" | "Intermediate" | "Advanced",
  ): RecommendedLearningPath {
    if (difficulty === "Beginner") {
      return {
        phase1: {
          title: "Web Fundamentals",
          duration: 4,
          topics: [
            "HTML5 Structure",
            "CSS3 Styling",
            "JavaScript Basics",
            "DOM Manipulation",
          ],
          prerequisites: [],
        },
        phase2: {
          title: "Modern Frontend",
          duration: 6,
          topics: [
            "React.js",
            "State Management",
            "Component Design",
            "API Integration",
          ],
          prerequisites: ["HTML", "CSS", "JavaScript"],
        },
        phase3: {
          title: "Advanced Topics",
          duration: 4,
          topics: [
            "TypeScript",
            "Testing",
            "Performance Optimization",
            "Deployment",
          ],
          prerequisites: ["React.js"],
        },
      };
    }
    // Add other difficulty levels...
    return this.generateGenericPath(difficulty);
  }

  private static generateBackendPath(
    difficulty: "Beginner" | "Intermediate" | "Advanced",
  ): RecommendedLearningPath {
    // Implementation cho backend có thể bổ sung sau
    return this.generateGenericPath(difficulty);
  }

  private static generateFullstackPath(
    difficulty: "Beginner" | "Intermediate" | "Advanced",
  ): RecommendedLearningPath {
    // Implementation cho fullstack có thể bổ sung sau
    return this.generateGenericPath(difficulty);
  }

  private static generateGenericPath(
    difficulty: "Beginner" | "Intermediate" | "Advanced",
  ): RecommendedLearningPath {
    // Dùng difficulty để tinh chỉnh thời lượng mỗi phase
    const [d1, d2, d3] =
      difficulty === "Beginner"
        ? [4, 6, 4]
        : difficulty === "Intermediate"
        ? [3, 5, 4]
        : [2, 4, 4];

    return {
      phase1: {
        title: `Foundation (${difficulty})`,
        duration: d1,
        topics: ["Programming Basics", "Problem Solving", "Git & GitHub"],
        prerequisites: [],
      },
      phase2: {
        title: "Core Skills",
        duration: d2,
        topics: ["Main Technology Stack", "Database Basics", "API Development"],
        prerequisites: ["Programming Basics"],
      },
      phase3: {
        title: "Professional Skills",
        duration: d3,
        topics: ["Testing", "Deployment", "Code Quality", "Team Collaboration"],
        prerequisites: ["Core Skills"],
      },
    };
  }

  private static getStudyHoursFromHabits(
    studyHabits: StudyHabitAnswer[],
  ): number {
    // Heuristic đơn giản: càng chọn nhiều mục → giả định cam kết thời gian cao hơn
    if (!studyHabits || studyHabits.length === 0) return 15;
    const selections = studyHabits.reduce(
      (sum, a) => sum + (a.selectedAnswers?.length ?? 0),
      0,
    );
    // Giới hạn 12–22 giờ/tuần
    return Math.max(12, Math.min(22, 12 + selections));
  }

  /**
   * Validate survey data completeness
   */
  static validateSurveyCompleteness(
    survey1?: Survey1FormValues | null,
    survey2?: Survey2FormValues | null,
    survey3?: Survey3FormValues | null,
  ): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    if (!survey1) {
      missingFields.push("Thông tin cơ bản");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(survey1 as any).semester) missingFields.push("Kỳ học");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(survey1 as any).learningGoal) missingFields.push("Mục tiêu học tập");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((survey1 as any).hasFutureOrientation === undefined)
        missingFields.push("Định hướng tương lai");
    }

    if (!survey2) {
      missingFields.push("Kiến thức kỹ thuật");
    }

    if (!survey3) {
      missingFields.push("Thói quen học tập");
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Calculate progress percentage
   */
  static calculateOverallProgress(
    survey1?: Survey1FormValues | null,
    survey2?: Survey2FormValues | null,
    survey3?: Survey3FormValues | null,
  ): number {
    let progress = 0;

    if (survey1) progress += 33.33;
    if (survey2) progress += 33.33;
    if (survey3) progress += 33.34;

    return Math.round(progress);
  }

  /**
   * Generate personalized study plan
   */
  static generateStudyPlan(
    analysis: SurveyAnalysisResult,
    survey3: Survey3FormValues,
  ): {
    dailyHours: number;
    weeklySchedule: string[];
    milestones: { week: number; goal: string }[];
  } {
    const studyHabits = survey3.studyHabits || [];
    const availableHours = this.getStudyHoursFromHabits(studyHabits);

    return {
      dailyHours: Math.ceil(availableHours / 7),
      weeklySchedule: [
        "Monday: Theory & Concepts",
        "Tuesday: Hands-on Practice",
        "Wednesday: Project Work",
        "Thursday: Review & Debug",
        "Friday: Build Features",
        "Weekend: Portfolio & Practice",
      ],
      milestones: [
        { week: 2, goal: "Complete fundamental concepts" },
        { week: 4, goal: "Build first project" },
        { week: 8, goal: "Master core technologies" },
        { week: 12, goal: "Deploy portfolio project" },
      ],
    };
  }
}