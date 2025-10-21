// Survey hooks - Architecture: Component → Hook → Store → Server Action
export { useSurvey } from "./useSurvey";

// Note:
// - Removed useSurveyData - consolidated into useSurvey
// - Removed useSurveyProgress - progress logic handled by Store directly
// Following proper layered architecture: Component → Hook → Store → Server Action
