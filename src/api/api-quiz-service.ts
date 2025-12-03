/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @format int32 */
export enum TestType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** @format int32 */
export enum QuestionType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** @format int32 */
export enum ProblemDifficultyLevel {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** @format int32 */
export enum OtherQuestionCode {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
}

/** @format int32 */
export enum LearningGoalType {
  Value0 = 0,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
}

/** @format int32 */
export enum AnswerRuleUnit {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

export interface AdminPracticeTestExample {
  /** @format uuid */
  exampleId?: string;
  /** @format int32 */
  exampleOrder?: number;
  inputData?: string;
  outputData?: string;
  explanation?: string;
}

export interface AdminPracticeTestItem {
  /** @format uuid */
  problemId?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  /** @format int32 */
  totalTestCases?: number;
  /** @format int32 */
  totalExamples?: number;
  /** @format int32 */
  totalTemplates?: number;
  /** @format int32 */
  totalSubmissions?: number;
  /** @format date-time */
  createdAt?: string;
}

export interface AdminPracticeTestSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminPracticeTestSelectResponseEntity;
}

export interface AdminPracticeTestSelectResponseEntity {
  /** @format uuid */
  problemId?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  examples?: AdminPracticeTestExample[];
  testCases?: AdminPracticeTestTestCase[];
  templates?: AdminPracticeTestTemplate[];
  /** @format date-time */
  createdAt?: string;
}

export interface AdminPracticeTestTemplate {
  /** @format uuid */
  templateId?: string;
  /** @format int32 */
  languageId?: number;
  languageName?: string;
  templatePrefix?: string;
  templateSuffix?: string;
  userStubCode?: string;
}

export interface AdminPracticeTestTestCase {
  /** @format uuid */
  testcaseId?: string;
  inputData?: string;
  expectedOutput?: string;
  isPublic?: boolean;
}

export interface AdminPracticeTestsSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminPracticeTestsSelectResponseEntity;
}

export interface AdminPracticeTestsSelectResponseEntity {
  practiceTests?: AdminPracticeTestItem[];
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface AdminQuizItem {
  /** @format uuid */
  quizId?: string;
  /** @format int32 */
  quizType?: number;
  quizTypeName?: string;
  title?: string;
  description?: string;
  /** @format uuid */
  subjectCode?: string;
  subjectCodeName?: string;
  surveyCode?: string;
  /** @format int32 */
  totalQuestions?: number;
  /** @format int32 */
  totalStudentsTaken?: number;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
}

export interface AdminQuizzesSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminQuizzesSelectResponseEntity;
}

export interface AdminQuizzesSelectResponseEntity {
  quizzes?: AdminQuizItem[];
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface AdminStudentSurveyItem {
  /** @format uuid */
  studentQuizId?: string;
  /** @format uuid */
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  /** @format uuid */
  surveyId?: string;
  surveyTitle?: string;
  surveyCode?: string;
  /** @format int32 */
  totalQuestions?: number;
  /** @format int32 */
  totalAnswers?: number;
  /** @format date-time */
  createdAt?: string;
}

export interface AdminStudentSurveysSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminStudentSurveysSelectResponseEntity;
}

export interface AdminStudentSurveysSelectResponseEntity {
  studentSurveys?: AdminStudentSurveyItem[];
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface AdminStudentTestItem {
  /** @format uuid */
  studentTestId?: string;
  /** @format uuid */
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  /** @format uuid */
  testId?: string;
  testName?: string;
  /** @format int32 */
  totalQuizzes?: number;
  /** @format int32 */
  totalQuestions?: number;
  /** @format int32 */
  totalCorrectAnswers?: number;
  /** @format int32 */
  studentLevel?: number;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  /** @format date-span */
  duration?: string;
}

export interface AdminStudentTestSelectDetailResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentTestSelectResponseEntity;
}

export interface AdminStudentTestsSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminStudentTestsSelectResponseEntity;
}

export interface AdminStudentTestsSelectResponseEntity {
  studentTests?: AdminStudentTestItem[];
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface AnswerAddRequest {
  /** @minLength 1 */
  answerText: string;
  isCorrect: boolean;
}

export interface AnswerDetailResponse {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
}

export interface AnswerRuleRequest {
  /** @format int32 */
  numericMin?: number;
  /** @format int32 */
  numericMax?: number;
  unit?: AnswerRuleUnit;
  mappedField?: string;
  formula?: string;
}

export interface AnswerSurveySelects {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
  isCorrect?: boolean;
}

export interface AnswerUpdateRequest {
  /** @format uuid */
  answerId?: string;
  /** @minLength 1 */
  answerText: string;
  isCorrect: boolean;
}

export interface Answers {
  /** @minLength 1 */
  answerText: string;
  isCorrect: boolean;
}

export interface DetailError {
  field?: string;
  messageId?: string;
  errorMessage?: string;
}

export interface GetLatestLessonQuizScoresPayload {
  lessons?: LessonLatestQuizScore[];
}

export interface GetLatestLessonQuizScoresResponseEvent {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: GetLatestLessonQuizScoresPayload;
}

export interface GetLatestModuleQuizScoresPayload {
  modules?: ModuleLatestQuizScore[];
}

export interface GetLatestModuleQuizScoresResponseEvent {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: GetLatestModuleQuizScoresPayload;
}

export interface InsertAnswers {
  answerText?: string;
  isCorrect?: boolean;
}

export interface InsertLearningPathWithPreviousSurveyAndTranscriptCommand {
  /** @format uuid */
  learningGoalId?: string;
  learningGoalName?: string;
  learningGoalType?: LearningGoalType;
}

export interface InsertLearningPathWithPreviousSurveyAndTranscriptResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: InsertLearningPathWithPreviousSurveyAndTranscriptResponseEntity;
}

export interface InsertLearningPathWithPreviousSurveyAndTranscriptResponseEntity {
  /** @format uuid */
  learningPathId?: string;
}

export interface LearningGoal {
  /** @format uuid */
  learningGoalId?: string;
  learningGoalType?: LearningGoalType;
  learningGoalName?: string;
}

export interface LearningGoalSelectsEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: LearningGoalSelectsEventResponseEntity[];
}

export interface LearningGoalSelectsEventResponseEntity {
  /** @format uuid */
  learningGoalId?: string;
  learningGoalName?: string;
  /** @format int32 */
  learningGoalType?: number;
}

export interface LessonLatestQuizScore {
  /** @format uuid */
  lessonId?: string;
  /** @format int32 */
  latestScore100?: number;
  /** @format int32 */
  attemptCount?: number;
}

export interface MajorSelectsEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: MajorSelectsEventResponseEntity[];
}

export interface MajorSelectsEventResponseEntity {
  /** @format uuid */
  majorId?: string;
  majorName?: string;
  majorCode?: string;
  /** @format uuid */
  parentMajorId?: string;
}

export interface ModuleLatestQuizScore {
  /** @format uuid */
  moduleId?: string;
  /** @format int32 */
  latestScore100?: number;
  /** @format int32 */
  attemptCount?: number;
}

export interface OtherQuestion {
  otherQuestionCode?: OtherQuestionCode;
  otherQuestionText?: string;
}

export interface PracticeTestAdminDeleteRequest {
  /** @format uuid */
  problemId?: string;
}

export interface PracticeTestAdminDeleteResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface PracticeTestAdminExamplesInsertRequest {
  /** @format uuid */
  problemId?: string;
  examples?: PracticeTestExampleAddRequestEntity[];
}

export interface PracticeTestAdminExamplesInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface PracticeTestAdminInsertRequest {
  problem: PracticeTestAdminProblemInsertRequest;
  testcases: PracticeTestAdminProblemTestcaseInsertRequest;
  templates: PracticeTestAdminProblemTemplateInsertRequest[];
  examples: PracticeTestAdminProblemExampleInsertRequest[];
  solutions: PracticeTestAdminSolutionInsertRequest[];
}

export interface PracticeTestAdminInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface PracticeTestAdminLanguageInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestAdminLanguageInsertResponseEntity;
}

export interface PracticeTestAdminLanguageInsertResponseEntity {
  /** @format int32 */
  totalLanguagesFromJudge0?: number;
  /** @format int32 */
  existingLanguages?: number;
  /** @format int32 */
  newLanguagesInserted?: number;
}

export interface PracticeTestAdminProblemExampleInsertRequest {
  /** @format int32 */
  exampleOrder?: number;
  inputData?: string;
  outputData?: string;
  explanation?: string;
}

export interface PracticeTestAdminProblemExampleUpdateRequest {
  /** @format uuid */
  exampleId?: string;
  /** @format int32 */
  exampleOrder?: number;
  inputData?: string;
  outputData?: string;
  explanation?: string;
}

export interface PracticeTestAdminProblemInsertRequest {
  title?: string;
  description?: string;
  difficulty?: ProblemDifficultyLevel;
}

export interface PracticeTestAdminProblemTemplateInsertRequest {
  /** @format int32 */
  languageId?: number;
  userTemplatePrefix?: string;
  userTemplateSuffix?: string;
  userStubCode?: string;
}

export interface PracticeTestAdminProblemTemplateUpdateRequest {
  /** @format uuid */
  templateId?: string;
  /** @format int32 */
  languageId?: number;
  userTemplatePrefix?: string;
  userTemplateSuffix?: string;
  userStubCode?: string;
}

export interface PracticeTestAdminProblemTestcaseInsertRequest {
  publicTestcases?: PracticeTestAdminProblemTestcasePublicInsertRequest[];
  privateTestcases?: PracticeTestAdminProblemTestcasePrivateInsertRequest[];
}

export interface PracticeTestAdminProblemTestcasePrivateInsertRequest {
  inputData?: string;
  expectedOutput?: string;
}

export interface PracticeTestAdminProblemTestcasePublicInsertRequest {
  inputData?: string;
  expectedOutput?: string;
}

export interface PracticeTestAdminProblemTestcaseUpdateRequest {
  /** @format uuid */
  testcaseId?: string;
  inputData?: string;
  expectedOutput?: string;
  isPublic?: boolean;
}

export interface PracticeTestAdminProblemUpdateRequest {
  title?: string;
  description?: string;
  difficulty?: string;
}

export interface PracticeTestAdminSolutionInsertRequest {
  /** @format int32 */
  languageId?: number;
  solutionCode?: string;
}

export interface PracticeTestAdminTemplatesInsertRequest {
  /** @format uuid */
  problemId?: string;
  templates?: PracticeTestTemplateAddRequestEntity[];
}

export interface PracticeTestAdminTemplatesInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface PracticeTestAdminTestcasesInsertRequest {
  /** @format uuid */
  problemId?: string;
  publicTestcases?: PracticeTestTestcaseAddRequestEntity[];
  privateTestcases?: PracticeTestTestcaseAddRequestEntity[];
}

export interface PracticeTestAdminTestcasesInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface PracticeTestAdminUpdateRequest {
  /** @format uuid */
  problemId?: string;
  problem?: PracticeTestAdminProblemUpdateRequest;
  testcases?: PracticeTestAdminProblemTestcaseUpdateRequest[];
  templates?: PracticeTestAdminProblemTemplateUpdateRequest[];
  examples?: PracticeTestAdminProblemExampleUpdateRequest[];
}

export interface PracticeTestAdminUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface PracticeTestCodeCheckRequest {
  /** @format uuid */
  problemId: string;
  /** @minLength 1 */
  sourceCode: string;
  /** @format int32 */
  languageId: number;
  /** @minItems 1 */
  inputs: string[];
}

export interface PracticeTestCodeCheckResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestCodeCheckResponseEntity;
}

export interface PracticeTestCodeCheckResponseEntity {
  overallStatus?: string;
  /** @format int32 */
  totalTests?: number;
  /** @format int32 */
  passedTests?: number;
  testCaseResults?: TestCaseExecutionResult[];
}

export interface PracticeTestExampleAddRequestEntity {
  /** @format int32 */
  exampleOrder?: number;
  inputData?: string;
  outputData?: string;
  explanation?: string;
}

export interface PracticeTestLanguageSelectsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestLanguageSelectsResponseEntity[];
}

export interface PracticeTestLanguageSelectsResponseEntity {
  /** @format int32 */
  languageId?: number;
  name?: string;
}

export interface PracticeTestProblemExample {
  /** @format uuid */
  exampleId?: string;
  /** @format int32 */
  exampleOrder?: number;
  inputData?: string;
  outputData?: string;
  explanation?: string;
}

export interface PracticeTestSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestSelectResponseEntity;
}

export interface PracticeTestSelectResponseEntity {
  /** @format uuid */
  problemId?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  examples?: PracticeTestProblemExample[];
  testCases?: PracticeTestSelectTestCaseResponse[];
}

export interface PracticeTestSelectTestCaseResponse {
  /** @format uuid */
  testcaseId?: string;
  /** @format uuid */
  problemId?: string;
  inputData?: string;
  expectedOutput?: string;
}

export interface PracticeTestSelectsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestSelectsResponseEntityPagedResult;
}

export interface PracticeTestSelectsResponseEntity {
  /** @format uuid */
  problemId?: string;
  title?: string;
  description?: string;
  difficulty?: string;
}

export interface PracticeTestSelectsResponseEntityPagedResult {
  items?: PracticeTestSelectsResponseEntity[];
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface PracticeTestStudentAnswerRequest {
  /** @format uuid */
  problemId: string;
  /** @minLength 1 */
  codeSubmission: string;
  /** @format int32 */
  languageId: number;
}

export interface PracticeTestSubmitInsertRequest {
  /** @format uuid */
  problemId: string;
  /** @minLength 1 */
  sourceCode: string;
  /** @format int32 */
  languageId: number;
}

export interface PracticeTestSubmitInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestSubmitInsertResponseEntity;
}

export interface PracticeTestSubmitInsertResponseEntity {
  /** @format uuid */
  submissionId?: string;
  status?: string;
  /** @format int32 */
  passedTests?: number;
  /** @format int32 */
  totalTests?: number;
  /** @format int32 */
  averageTimeMs?: number;
  testResults?: SubmissionTestResultResponse[];
}

export interface PracticeTestTemplateAddRequestEntity {
  /** @format int32 */
  languageId?: number;
  userTemplatePrefix?: string;
  userTemplateSuffix?: string;
  userStubCode?: string;
}

export interface PracticeTestTestcaseAddRequestEntity {
  inputData?: string;
  expectedOutput?: string;
}

export interface PracticeTestUserTemplateCodeSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PracticeTestUserTemplateCodeSelectResponseEntity;
}

export interface PracticeTestUserTemplateCodeSelectResponseEntity {
  userTemplateCode?: string;
}

export interface QuestionAddRequest {
  /** @minLength 1 */
  questionText: string;
  /**
   * @format int32
   * @min 1
   * @max 4
   */
  questionType?: number;
  explanation?: string;
  /** @minItems 2 */
  answers: AnswerAddRequest[];
}

export interface QuestionDeleteResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface QuestionDetailResponse {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  /** @format int32 */
  difficultyLevel?: number;
  answers?: AnswerDetailResponse[];
}

export interface QuestionInsertCommand {
  /** @format uuid */
  quizId?: string;
  questionText?: string;
  explanation?: string;
  answers?: InsertAnswers[];
}

export interface QuestionInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface QuestionSurveySelects {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  answers?: AnswerSurveySelects[];
}

export interface QuestionUpdateCommand {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  explanation?: string;
  answers?: UpdateAnswers[];
}

export interface QuestionUpdateRequest {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  explanation?: string;
  answers?: AnswerUpdateRequest[];
}

export interface QuestionUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface Questions {
  /** @minLength 1 */
  questionText: string;
  /** @format int32 */
  difficultyLevel: number;
  /** @format int32 */
  questionType?: number;
  explanation?: string;
  answers: Answers[];
}

export interface QuestionsCourseResultSelectResponseEntity {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  explanation?: string;
  answers?: StudentQuizCourseAnswerDetailResponse[];
}

export interface QuestionsResultSelectResponseEntity {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  /** @format int32 */
  difficultyLevel?: number;
  explanation?: string;
  answers?: StudentAnswerDetailResponse[];
}

export interface QuizCourseAddQuestionsCommand {
  /** @format uuid */
  quizId: string;
  /** @minItems 1 */
  questions: QuestionAddRequest[];
}

export interface QuizCourseAddQuestionsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface QuizCourseAnswersInsert {
  /** @minLength 1 */
  answerText: string;
  isCorrect: boolean;
}

export interface QuizCourseCheckAttemptCommand {
  /** @format uuid */
  quizId?: string;
  /** @format uuid */
  studentId?: string;
}

export interface QuizCourseCheckAttemptEntity {
  canAttempt?: boolean;
  /** @format uuid */
  studentQuizId?: string;
}

export interface QuizCourseCheckAttemptResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: QuizCourseCheckAttemptEntity;
}

export interface QuizCourseDeleteQuestionsCommand {
  /** @format uuid */
  quizId: string;
  /** @minItems 1 */
  questionIds: string[];
}

export interface QuizCourseDeleteQuestionsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface QuizCourseInsertCommand {
  /** @minLength 1 */
  userEmail: string;
  /** @format int32 */
  durationMinutes: number;
  /** @format int32 */
  passingScorePercentage: number;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  allowRetake: boolean;
  questions: QuizCourseQuestionsInsert[];
}

export interface QuizCourseInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: QuizCourseInsertResponseEntity;
}

export interface QuizCourseInsertResponseEntity {
  /** @format uuid */
  quizId?: string;
}

export interface QuizCourseQuestionsInsert {
  /** @minLength 1 */
  questionText: string;
  /** @format int32 */
  questionType?: number;
  explanation?: string;
  answers: QuizCourseAnswersInsert[];
}

export interface QuizCourseSelectAnswerDetailResponse {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
  isCorrect?: boolean;
}

export interface QuizCourseSelectQueryResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: QuizCourseSelectQueryResponseEntity;
}

export interface QuizCourseSelectQueryResponseEntity {
  /** @format uuid */
  quizId?: string;
  /** @format int32 */
  durationMinutes?: number;
  /** @format int32 */
  passingScorePercentage?: number;
  shuffleQuestions?: boolean;
  showResultsImmediately?: boolean;
  allowRetake?: boolean;
  /** @format int32 */
  totalQuestions?: number;
  questions?: QuizCourseSelectQuestionDetailResponse[];
}

export interface QuizCourseSelectQuestionDetailResponse {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  explanation?: string;
  /** @format int32 */
  questionType?: number;
  answers?: QuizCourseSelectAnswerDetailResponse[];
}

export interface QuizCourseUpdateCommand {
  /** @minItems 1 */
  quizzes: QuizUpdateRequest[];
}

export interface QuizCourseUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface QuizResultSelectResponseEntity {
  /** @format uuid */
  quizId?: string;
  title?: string;
  description?: string;
  /** @format uuid */
  subjectCode?: string;
  subjectCodeName?: string;
  /** @format int32 */
  totalQuestions?: number;
  /** @format int32 */
  totalCorrectAnswers?: number;
  questionResults?: QuestionsResultSelectResponseEntity[];
}

export interface QuizSelectsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: QuizSelectsResponseEntity[];
}

export interface QuizSelectsResponseEntity {
  /** @format uuid */
  quizId?: string;
  title?: string;
  description?: string;
  /** @format uuid */
  subjectCode?: string;
  subjectCodeName?: string;
  /** @format int32 */
  totalQuestions?: number;
}

export interface QuizUpdateRequest {
  /** @format uuid */
  quizId: string;
  /** @format int32 */
  durationMinutes?: number;
  /** @format int32 */
  passingScorePercentage?: number;
  shuffleQuestions?: boolean;
  showResultsImmediately?: boolean;
  allowRetake?: boolean;
  questions?: QuestionUpdateRequest[];
}

export interface QuizzDetailResponse {
  /** @format uuid */
  quizId?: string;
  title?: string;
  description?: string;
  /** @format uuid */
  subjectCode?: string;
  subjectCodeName?: string;
  /** @format int32 */
  totalQuestions?: number;
  questions?: QuestionDetailResponse[];
}

export interface Quizzes {
  /** @minLength 1 */
  title: string;
  /** @minLength 1 */
  description: string;
  /** @format uuid */
  subjectCode: string;
  questions: Questions[];
}

export interface SemesterSelectsEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: SemesterSelectsEventResponseEntity[];
}

export interface SemesterSelectsEventResponseEntity {
  /** @format uuid */
  semesterId?: string;
  semesterName?: string;
  /** @format int32 */
  semesterNumber?: number;
}

export interface StudentAnswerDetailResponse {
  /** @format uuid */
  answerId?: string;
  isCorrectAnswer?: boolean;
  selectedByStudent?: boolean;
  answerText?: string;
}

export interface StudentAnswerRequest {
  /** @format uuid */
  questionId: string;
  /** @format uuid */
  answerId: string;
}

export interface StudentCourseQuizSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentCourseQuizSelectResponseEntity;
}

export interface StudentCourseQuizSelectResponseEntity {
  /** @format uuid */
  quizId?: string;
  /** @format int32 */
  totalQuestions?: number;
  /** @format int32 */
  totalCorrectAnswers?: number;
  questionResults?: QuestionsCourseResultSelectResponseEntity[];
}

export interface StudentInformation {
  /** @format uuid */
  majorId: string;
  /** @format uuid */
  semesterId: string;
  technologies: Technology[];
  learningGoal: LearningGoal;
}

export interface StudentQuizAnswerInsertRequest {
  /** @format uuid */
  questionId: string;
  /** @format uuid */
  answerId?: string;
}

export interface StudentQuizCourseAnswerDetailResponse {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
  isCorrectAnswer?: boolean;
  selectedByStudent?: boolean;
}

export interface StudentQuizCourseInsertCommand {
  /** @format uuid */
  quizId?: string;
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  moduleId?: string;
  /** @format uuid */
  lessonId?: string;
  studentQuizAnswers?: StudentQuizAnswerInsertRequest[];
}

export interface StudentQuizCourseInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentQuizCourseInsertResponseEntity;
}

export interface StudentQuizCourseInsertResponseEntity {
  /** @format uuid */
  studentQuizCourseId?: string;
  suggestedCourses?: SuggestCourseEntity[];
}

export interface StudentSurveyInsertCommand {
  studentInformation: StudentInformation;
  studentSurveys: StudentSurveyInsertRequest[];
  isWantToTakeTest: boolean;
  otherQuestionAnswerCodes?: OtherQuestionCode[];
}

export interface StudentSurveyInsertRequest {
  /** @format uuid */
  surveyId: string;
  /** @minLength 1 */
  surveyCode: string;
  answers: StudentQuizAnswerInsertRequest[];
}

export interface StudentSurveyInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  /** @format uuid */
  response?: string;
}

export interface StudentSurveySelectAnswerResponseEntity {
  /** @format uuid */
  answerId?: string;
  isCorrect?: boolean;
  answerText?: string;
}

export interface StudentSurveySelectDetailResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentSurveySelectDetailResponseEntity;
}

export interface StudentSurveySelectDetailResponseEntity {
  /** @format uuid */
  studentSurveyId?: string;
  /** @format uuid */
  surveyId?: string;
  surveyTitle?: string;
  surveyDescription?: string;
  surveyCode?: string;
  /** @format date-time */
  createdAt?: string;
  questions?: SurveyQuestionDetailResponseEntity[];
}

export type StudentSurveySelectQuery = object;

export interface StudentSurveySelectQuestionResponseEntity {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  answers?: StudentSurveySelectAnswerResponseEntity[];
}

export interface StudentSurveySelectQuizResponseEntity {
  title?: string;
  description?: string;
  questions?: StudentSurveySelectQuestionResponseEntity[];
}

export interface StudentSurveySelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentSurveySelectResponseEntity[];
}

export interface StudentSurveySelectResponseEntity {
  /** @format uuid */
  studentSurveyId?: string;
  survey?: StudentSurveySelectQuizResponseEntity;
}

export interface StudentTestInsertCommand {
  /** @format uuid */
  testId: string;
  /** @format date-time */
  startedAt: string;
  quizIds: string[];
  answers: StudentAnswerRequest[];
  practiceTestAnswers?: PracticeTestStudentAnswerRequest[];
  otherQuestionAnswerCodes?: OtherQuestionCode[];
  learningGoal?: LearningGoal;
}

export interface StudentTestInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  /** @format uuid */
  response?: string;
}

export interface StudentTestSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentTestSelectResponseEntity;
}

export interface StudentTestSelectResponseEntity {
  /** @format uuid */
  studentTestId?: string;
  /** @format uuid */
  testId?: string;
  testName?: string;
  testDescription?: string;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  quizResults?: QuizResultSelectResponseEntity[];
}

export interface SubmissionTestResultResponse {
  /** @format uuid */
  testCaseId?: string;
  isPublic?: boolean;
  inputData?: string;
  expectedOutput?: string;
  actualOutput?: string;
  passed?: boolean;
  status?: string;
}

export interface SuggestCourseEntity {
  /** @format uuid */
  suggestCourseId?: string;
  title?: string;
  description?: string;
  /** @format int32 */
  durationMinutes?: number;
  /** @format int32 */
  level?: number;
  courseImageUrl?: string;
  reason?: string;
}

export interface SurveyAnswerDetailResponse {
  /** @format uuid */
  answerId?: string;
  selectedByStudent?: boolean;
  answerText?: string;
}

export interface SurveyAnswerRequest {
  /** @minLength 1 */
  answerText: string;
  isCorrect?: boolean;
  answerRules?: AnswerRuleRequest[];
}

export interface SurveyDetailSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: SurveyDetailSelectResponseEntityPagedResult;
  otherQuestions?: OtherQuestion[];
}

export interface SurveyDetailSelectResponseEntity {
  /** @format uuid */
  surveyId?: string;
  title?: string;
  description?: string;
  surveyCode?: string;
  questions?: QuestionSurveySelects[];
}

export interface SurveyDetailSelectResponseEntityPagedResult {
  items?: SurveyDetailSelectResponseEntity[];
  /** @format int32 */
  totalCount?: number;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int32 */
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface SurveyInsertCommand {
  /** @minLength 1 */
  title: string;
  /** @minLength 1 */
  description: string;
  /** @minLength 1 */
  surveyCode: string;
  questions: SurveyQuestionRequest[];
}

export interface SurveyInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface SurveyQuestionDetailResponseEntity {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  answers?: SurveyAnswerDetailResponse[];
}

export interface SurveyQuestionRequest {
  /** @minLength 1 */
  questionText: string;
  questionType: QuestionType;
  answers: SurveyAnswerRequest[];
}

export interface SurveySelectsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: SurveySelectsResponseEntity[];
}

export interface SurveySelectsResponseEntity {
  /** @format uuid */
  surveyId?: string;
  title?: string;
  description?: string;
  surveyCode?: string;
}

export interface Technology {
  /** @format uuid */
  technologyId?: string;
  technologyName?: string;
  /**
   * @format int32
   * @min 1
   * @max 4
   */
  technologyType?: number;
}

export interface TechnologySelectsEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: TechnologySelectsEventResponseEntity[];
}

export interface TechnologySelectsEventResponseEntity {
  /** @format uuid */
  technologyId?: string;
  technologyName?: string;
  /** @format int32 */
  technologyType?: number;
}

export interface TestCaseExecutionResult {
  /** @format int32 */
  testCaseNumber?: number;
  input?: string;
  expectedOutput?: string;
  status?: string;
  output?: string;
  error?: string;
  /** @format double */
  executionTime?: number;
  /** @format int32 */
  memory?: number;
}

export interface TestInsertCommand {
  /** @minLength 1 */
  testName: string;
  /** @minLength 1 */
  description: string;
  quizzes: Quizzes[];
}

export interface TestInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface TestSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: TestSelectResponseEntity;
}

export interface TestSelectResponseEntity {
  /** @format uuid */
  testId?: string;
  testName?: string;
  description?: string;
  quizzes?: QuizzDetailResponse[];
}

export interface UpdateAnswers {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
  isCorrect?: boolean;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/quiz";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Quiz Service Swagger
 * @version v1
 * @baseUrl /quiz
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Lấy danh sách ngôn ngữ lập trình từ Judge0 API và thêm các ngôn ngữ mới vào hệ thống. Các ngôn ngữ đã tồn tại sẽ được bỏ qua. (Không spam API này). Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminInsertPracticeLanguageCreate
     * @summary Đồng bộ ngôn ngữ lập trình từ Judge0 (Không spam API này)
     * @request POST:/api/v1/Admin/InsertPracticeLanguage
     * @secure
     */
    v1AdminInsertPracticeLanguageCreate: (params: RequestParams = {}) =>
      this.request<PracticeTestAdminLanguageInsertResponse, any>({
        path: `/api/v1/Admin/InsertPracticeLanguage`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminInsertPracticeTestCreate
     * @summary Tạo bài tập thực hành mới
     * @request POST:/api/v1/Admin/InsertPracticeTest
     * @secure
     */
    v1AdminInsertPracticeTestCreate: (
      body: PracticeTestAdminInsertRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestAdminInsertResponse, any>({
        path: `/api/v1/Admin/InsertPracticeTest`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Thêm các ví dụ minh họa input/output vào bài tập thực hành đã tồn tại. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminInsertPracticeTestExamplesCreate
     * @summary Thêm ví dụ vào bài tập thực hành
     * @request POST:/api/v1/Admin/InsertPracticeTestExamples
     * @secure
     */
    v1AdminInsertPracticeTestExamplesCreate: (
      body: PracticeTestAdminExamplesInsertRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestAdminExamplesInsertResponse, any>({
        path: `/api/v1/Admin/InsertPracticeTestExamples`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Thêm code templates cho các ngôn ngữ lập trình vào bài tập thực hành đã tồn tại. Mỗi ngôn ngữ chỉ có thể có 1 template. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminInsertPracticeTestTemplatesCreate
     * @summary Thêm code templates vào bài tập thực hành
     * @request POST:/api/v1/Admin/InsertPracticeTestTemplates
     * @secure
     */
    v1AdminInsertPracticeTestTemplatesCreate: (
      body: PracticeTestAdminTemplatesInsertRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestAdminTemplatesInsertResponse, any>({
        path: `/api/v1/Admin/InsertPracticeTestTemplates`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Thêm public và private test cases vào bài tập thực hành đã tồn tại. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminInsertPracticeTestTestcasesCreate
     * @summary Thêm test cases vào bài tập thực hành
     * @request POST:/api/v1/Admin/InsertPracticeTestTestcases
     * @secure
     */
    v1AdminInsertPracticeTestTestcasesCreate: (
      body: PracticeTestAdminTestcasesInsertRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestAdminTestcasesInsertResponse, any>({
        path: `/api/v1/Admin/InsertPracticeTestTestcases`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Tạo khảo sát mới với các câu hỏi và câu trả lời tương ứng
     *
     * @tags Admin
     * @name V1AdminInsertSurveyCreate
     * @summary Tạo khảo sát mới
     * @request POST:/api/v1/Admin/InsertSurvey
     * @secure
     */
    v1AdminInsertSurveyCreate: (
      body: SurveyInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<SurveyInsertResponse, any>({
        path: `/api/v1/Admin/InsertSurvey`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminInsertTestCreate
     * @summary Tạo bài kiểm tra đầu vào mới
     * @request POST:/api/v1/Admin/InsertTest
     * @secure
     */
    v1AdminInsertTestCreate: (
      body: TestInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<TestInsertResponse, any>({
        path: `/api/v1/Admin/InsertTest`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags CourseQuiz
     * @name V1CourseQuizCheckStudentQuizAttemptCreate
     * @summary Kiểm tra bài kiểm tra course của sinh viên
     * @request POST:/api/v1/CourseQuiz/CheckStudentQuizAttempt
     * @secure
     */
    v1CourseQuizCheckStudentQuizAttemptCreate: (
      body: QuizCourseCheckAttemptCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuizCourseCheckAttemptResponse, any>({
        path: `/api/v1/CourseQuiz/CheckStudentQuizAttempt`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Teacher cho API
     *
     * @tags CourseQuiz
     * @name V1CourseQuizInsertQuestionsToQuizCourseCreate
     * @summary Thêm câu hỏi mới vào bài kiểm tra
     * @request POST:/api/v1/CourseQuiz/InsertQuestionsToQuizCourse
     * @secure
     */
    v1CourseQuizInsertQuestionsToQuizCourseCreate: (
      body: QuizCourseAddQuestionsCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuizCourseAddQuestionsResponse, any>({
        path: `/api/v1/CourseQuiz/InsertQuestionsToQuizCourse`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseQuiz
     * @name V1CourseQuizInsertQuizCourseCreate
     * @summary API dùng để test thêm mới bài kiểm tra cho khoá học
     * @request POST:/api/v1/CourseQuiz/InsertQuizCourse
     * @secure
     */
    v1CourseQuizInsertQuizCourseCreate: (
      body: QuizCourseInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuizCourseInsertResponse, any>({
        path: `/api/v1/CourseQuiz/InsertQuizCourse`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags CourseQuiz
     * @name V1CourseQuizInsertStudentQuizCourseCreate
     * @summary Lưu câu trả lời của sinh viên trong bài kiếm tra course
     * @request POST:/api/v1/CourseQuiz/InsertStudentQuizCourse
     * @secure
     */
    v1CourseQuizInsertStudentQuizCourseCreate: (
      body: StudentQuizCourseInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<StudentQuizCourseInsertResponse, any>({
        path: `/api/v1/CourseQuiz/InsertStudentQuizCourse`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Dành cho sinh viên đã làm khảo sát và không muốn làm bài test. Hệ thống sẽ tính toán level từ bảng điểm. Cần cấp quyền Student cho API
     *
     * @tags LearningPath
     * @name V1LearningPathInsertLearningPathWithPreviousSurveyAndTranscriptCreate
     * @summary Tạo learning path từ khảo sát đã làm trước đó và bảng điểm (không làm bài test)
     * @request POST:/api/v1/LearningPath/InsertLearningPathWithPreviousSurveyAndTranscript
     * @secure
     */
    v1LearningPathInsertLearningPathWithPreviousSurveyAndTranscriptCreate: (
      body: InsertLearningPathWithPreviousSurveyAndTranscriptCommand,
      params: RequestParams = {},
    ) =>
      this.request<
        InsertLearningPathWithPreviousSurveyAndTranscriptResponse,
        any
      >({
        path: `/api/v1/LearningPath/InsertLearningPathWithPreviousSurveyAndTranscript`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description API này cho phép student kiểm tra code của mình với nhiều test cases (inputs) cùng lúc để xem kết quả thực thi trước khi nộp bài chính thức. Student có thể gửi 1 hoặc nhiều inputs trong một request. Kết quả trả về bao gồm status, output, lỗi (nếu có), thời gian thực thi và memory cho từng test case mà không lưu vào database. Cần cấp quyền cho API
     *
     * @tags PracticeTest
     * @name V1PracticeTestCheckPracticeTestCodeCreate
     * @summary Kiểm tra code với nhiều input tự nhập mà không lưu vào database
     * @request POST:/api/v1/PracticeTest/CheckPracticeTestCode
     * @secure
     */
    v1PracticeTestCheckPracticeTestCodeCreate: (
      body: PracticeTestCodeCheckRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestCodeCheckResponse, any>({
        path: `/api/v1/PracticeTest/CheckPracticeTestCode`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags PracticeTest
     * @name V1PracticeTestSubmitPracticeTestCreate
     * @summary Nộp bài tập thực hành
     * @request POST:/api/v1/PracticeTest/SubmitPracticeTest
     * @secure
     */
    v1PracticeTestSubmitPracticeTestCreate: (
      body: PracticeTestSubmitInsertRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestSubmitInsertResponse, any>({
        path: `/api/v1/PracticeTest/SubmitPracticeTest`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin cho API. Insert question và tất cả answers vào quiz
     *
     * @tags Question
     * @name V1QuestionCreate
     * @summary Thêm câu hỏi và câu trả lời vào quiz
     * @request POST:/api/v1/Question
     * @secure
     */
    v1QuestionCreate: (
      body: QuestionInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuestionInsertResponse, any>({
        path: `/api/v1/Question`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin cho API. Update question và tất cả answers của nó
     *
     * @tags Question
     * @name V1QuestionUpdate
     * @summary Cập nhật câu hỏi và câu trả lời
     * @request PUT:/api/v1/Question
     * @secure
     */
    v1QuestionUpdate: (
      body: QuestionUpdateCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuestionUpdateResponse, any>({
        path: `/api/v1/Question`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin cho API. Delete question và tất cả answers của nó
     *
     * @tags Question
     * @name V1QuestionDelete
     * @summary Xóa câu hỏi và tất cả câu trả lời
     * @request DELETE:/api/v1/Question
     * @secure
     */
    v1QuestionDelete: (
      query?: {
        /** @format uuid */
        questionId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuestionDeleteResponse, any>({
        path: `/api/v1/Question`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags StudentSurvey
     * @name V1StudentSurveyInsertStudentSurveyCreate
     * @summary Lưu câu trả lời phần khảo sát của học sinh
     * @request POST:/api/v1/StudentSurvey/InsertStudentSurvey
     * @secure
     */
    v1StudentSurveyInsertStudentSurveyCreate: (
      body: StudentSurveyInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<StudentSurveyInsertResponse, any>({
        path: `/api/v1/StudentSurvey/InsertStudentSurvey`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags StudentTest
     * @name V1StudentTestInsertStudentTestCreate
     * @summary Lưu câu trả lời của học sinh
     * @request POST:/api/v1/StudentTest/InsertStudentTest
     * @secure
     */
    v1StudentTestInsertStudentTestCreate: (
      body: StudentTestInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<StudentTestInsertResponse, any>({
        path: `/api/v1/StudentTest/InsertStudentTest`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Lấy toàn bộ thông tin chi tiết bao gồm test cases, templates, examples. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminSelectPracticeTestList
     * @summary Chi tiết một bài kiểm tra thực hành
     * @request GET:/api/v1/Admin/SelectPracticeTest
     * @secure
     */
    v1AdminSelectPracticeTestList: (
      query: {
        /** @format uuid */
        ProblemId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminPracticeTestSelectResponse, any>({
        path: `/api/v1/Admin/SelectPracticeTest`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hỗ trợ phân trang và lọc theo độ khó, tìm kiếm theo tiêu đề. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminSelectPracticeTestsList
     * @summary Lấy danh sách tất cả bài kiểm tra thực hành
     * @request GET:/api/v1/Admin/SelectPracticeTests
     * @secure
     */
    v1AdminSelectPracticeTestsList: (
      query?: {
        /** @format int32 */
        PageNumber?: number;
        /** @format int32 */
        PageSize?: number;
        Difficulty?: string;
        SearchTitle?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminPracticeTestsSelectResponse, any>({
        path: `/api/v1/Admin/SelectPracticeTests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hỗ trợ phân trang và lọc theo QuizType, SubjectCode, SurveyCode
     *
     * @tags Admin
     * @name V1AdminSelectQuizzesList
     * @summary Lấy danh sách tất cả quiz/survey
     * @request GET:/api/v1/Admin/SelectQuizzes
     * @secure
     */
    v1AdminSelectQuizzesList: (
      query?: {
        /** @format int32 */
        PageNumber?: number;
        /** @format int32 */
        PageSize?: number;
        QuizType?: any;
        /** @format uuid */
        SubjectCode?: string;
        SurveyCode?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminQuizzesSelectResponse, any>({
        path: `/api/v1/Admin/SelectQuizzes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hỗ trợ phân trang và lọc theo StudentId hoặc SurveyId
     *
     * @tags Admin
     * @name V1AdminSelectStudentSurveysList
     * @summary Lấy danh sách tất cả khảo sát của học sinh
     * @request GET:/api/v1/Admin/SelectStudentSurveys
     * @secure
     */
    v1AdminSelectStudentSurveysList: (
      query?: {
        /** @format uuid */
        StudentId?: string;
        /** @format uuid */
        SurveyId?: string;
        /** @format int32 */
        PageNumber?: number;
        /** @format int32 */
        PageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminStudentSurveysSelectResponse, any>({
        path: `/api/v1/Admin/SelectStudentSurveys`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name V1AdminSelectStudentTestDetailList
     * @summary Chi tiết một bài kiểm tra đầu vào của sinh viên
     * @request GET:/api/v1/Admin/SelectStudentTestDetail
     * @secure
     */
    v1AdminSelectStudentTestDetailList: (
      query: {
        /** @format uuid */
        StudentTestId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminStudentTestSelectDetailResponse, any>({
        path: `/api/v1/Admin/SelectStudentTestDetail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hỗ trợ phân trang và lọc theo StudentId hoặc TestId
     *
     * @tags Admin
     * @name V1AdminSelectStudentTestsList
     * @summary Lấy danh sách tất cả bài kiểm tra của học sinh
     * @request GET:/api/v1/Admin/SelectStudentTests
     * @secure
     */
    v1AdminSelectStudentTestsList: (
      query?: {
        /** @format int32 */
        PageNumber?: number;
        /** @format int32 */
        PageSize?: number;
        /** @format uuid */
        StudentId?: string;
        /** @format uuid */
        TestId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminStudentTestsSelectResponse, any>({
        path: `/api/v1/Admin/SelectStudentTests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags CourseQuiz
     * @name V1CourseQuizGetLatestLessonQuizScoresList
     * @summary Lấy điểm làm bài kiểm tra mới nhất của sinh viên theo lesson
     * @request GET:/api/v1/CourseQuiz/GetLatestLessonQuizScores
     * @secure
     */
    v1CourseQuizGetLatestLessonQuizScoresList: (
      query?: {
        /** @format uuid */
        StudentId?: string;
        /** @format uuid */
        CourseId?: string;
        LessonIds?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLatestLessonQuizScoresResponseEvent, any>({
        path: `/api/v1/CourseQuiz/GetLatestLessonQuizScores`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags CourseQuiz
     * @name V1CourseQuizGetLatestModuleQuizScoresList
     * @summary Lấy điểm làm bài kiểm tra mới nhất của sinh viên theo module
     * @request GET:/api/v1/CourseQuiz/GetLatestModuleQuizScores
     * @secure
     */
    v1CourseQuizGetLatestModuleQuizScoresList: (
      query?: {
        /** @format uuid */
        StudentId?: string;
        /** @format uuid */
        CourseId?: string;
        ModuleIds?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLatestModuleQuizScoresResponseEvent, any>({
        path: `/api/v1/CourseQuiz/GetLatestModuleQuizScores`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseQuiz
     * @name V1CourseQuizSelectQuizCourseList
     * @summary API dùng để test lấy bài kiểm tra cho khoá học
     * @request GET:/api/v1/CourseQuiz/SelectQuizCourse
     * @secure
     */
    v1CourseQuizSelectQuizCourseList: (
      query?: {
        /** @format uuid */
        QuizId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuizCourseSelectQueryResponse, any>({
        path: `/api/v1/CourseQuiz/SelectQuizCourse`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags CourseQuiz
     * @name V1CourseQuizSelectStudentQuizCourseList
     * @summary Hiển thị bài kiểm tra course cho sinh viên
     * @request GET:/api/v1/CourseQuiz/SelectStudentQuizCourse
     * @secure
     */
    v1CourseQuizSelectStudentQuizCourseList: (
      query?: {
        /** @format uuid */
        StudentQuizCourseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentCourseQuizSelectResponse, any>({
        path: `/api/v1/CourseQuiz/SelectStudentQuizCourse`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags ExternalQuiz
     * @name V1ExternalQuizSelectLearningGoalsList
     * @summary Lấy danh sách tất cả các mục tiêu học tập đang có
     * @request GET:/api/v1/ExternalQuiz/SelectLearningGoals
     * @secure
     */
    v1ExternalQuizSelectLearningGoalsList: (params: RequestParams = {}) =>
      this.request<LearningGoalSelectsEventResponse, any>({
        path: `/api/v1/ExternalQuiz/SelectLearningGoals`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags ExternalQuiz
     * @name V1ExternalQuizSelectMajorsList
     * @summary Lấy danh sách tất cả các chuyên ngành trong trường
     * @request GET:/api/v1/ExternalQuiz/SelectMajors
     * @secure
     */
    v1ExternalQuizSelectMajorsList: (params: RequestParams = {}) =>
      this.request<MajorSelectsEventResponse, any>({
        path: `/api/v1/ExternalQuiz/SelectMajors`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags ExternalQuiz
     * @name V1ExternalQuizSelectSemestersList
     * @summary Lấy danh sách tất cả các học kỳ
     * @request GET:/api/v1/ExternalQuiz/SelectSemesters
     * @secure
     */
    v1ExternalQuizSelectSemestersList: (params: RequestParams = {}) =>
      this.request<SemesterSelectsEventResponse, any>({
        path: `/api/v1/ExternalQuiz/SelectSemesters`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags ExternalQuiz
     * @name V1ExternalQuizSelectTechnologiesList
     * @summary Lấy danh sách tất cả các ngôn ngữ lập trình/ framework
     * @request GET:/api/v1/ExternalQuiz/SelectTechnologies
     * @secure
     */
    v1ExternalQuizSelectTechnologiesList: (params: RequestParams = {}) =>
      this.request<TechnologySelectsEventResponse, any>({
        path: `/api/v1/ExternalQuiz/SelectTechnologies`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags PracticeTest
     * @name V1PracticeTestSelectCodeLanguagesList
     * @summary Lấy danh sách các ngôn ngữ lập trình hỗ trợ cho bài tập thực hành
     * @request GET:/api/v1/PracticeTest/SelectCodeLanguages
     * @secure
     */
    v1PracticeTestSelectCodeLanguagesList: (params: RequestParams = {}) =>
      this.request<PracticeTestLanguageSelectsResponse, any>({
        path: `/api/v1/PracticeTest/SelectCodeLanguages`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags PracticeTest
     * @name V1PracticeTestSelectPracticeTestDetailList
     * @summary Lấy danh sách bài tập thực hành
     * @request GET:/api/v1/PracticeTest/SelectPracticeTestDetail
     * @secure
     */
    v1PracticeTestSelectPracticeTestDetailList: (
      query: {
        /** @format uuid */
        ProblemId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestSelectResponse, any>({
        path: `/api/v1/PracticeTest/SelectPracticeTestDetail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Lấy 3 bài tập thực hành ngẫu nhiên có đủ 3 level: Dễ (Easy), Trung bình (Medium), Khó (Hard). Cần cấp quyền cho API
     *
     * @tags PracticeTest
     * @name V1PracticeTestSelectPracticeTestsList
     * @summary Lấy 3 bài tập thực hành ngẫu nhiên
     * @request GET:/api/v1/PracticeTest/SelectPracticeTests
     * @secure
     */
    v1PracticeTestSelectPracticeTestsList: (params: RequestParams = {}) =>
      this.request<PracticeTestSelectsResponse, any>({
        path: `/api/v1/PracticeTest/SelectPracticeTests`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description API này trả về hàm mẫu dành cho người dùng, dựa trên bài tập (problem) và ngôn ngữ lập trình được chọn. Người dùng có thể sử dụng mã nguồn này để code phần bài tập thực hành của mình.
     *
     * @tags PracticeTest
     * @name V1PracticeTestSelectUserTemplateCodeList
     * @summary Lấy source code mẫu cho user tương ứng với problem và ngôn ngữ lập trình tương ứng
     * @request GET:/api/v1/PracticeTest/SelectUserTemplateCode
     * @secure
     */
    v1PracticeTestSelectUserTemplateCodeList: (
      query: {
        /** @format uuid */
        ProblemId: string;
        /** @format int32 */
        LanguageId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestUserTemplateCodeSelectResponse, any>({
        path: `/api/v1/PracticeTest/SelectUserTemplateCode`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags Quiz
     * @name V1QuizSelectQuizzesList
     * @summary Lấy danh sách quiz của một bài kiểm tra
     * @request GET:/api/v1/Quiz/SelectQuizzes
     * @secure
     */
    v1QuizSelectQuizzesList: (params: RequestParams = {}) =>
      this.request<QuizSelectsResponse, any>({
        path: `/api/v1/Quiz/SelectQuizzes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags StudentSurvey
     * @name V1StudentSurveySelectStudentSurveyList
     * @summary Hiển câu trả lời phần khảo sát của học sinh
     * @request GET:/api/v1/StudentSurvey/SelectStudentSurvey
     * @secure
     */
    v1StudentSurveySelectStudentSurveyList: (
      query?: {
        request?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentSurveySelectResponse, any>({
        path: `/api/v1/StudentSurvey/SelectStudentSurvey`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags StudentSurvey
     * @name V1StudentSurveySelectStudentSurveyDetailList
     * @summary Lấy chi tiết câu trả lời của học sinh trong bài khảo sát
     * @request GET:/api/v1/StudentSurvey/SelectStudentSurveyDetail
     * @secure
     */
    v1StudentSurveySelectStudentSurveyDetailList: (
      query?: {
        /** @format uuid */
        studentSurveyId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentSurveySelectDetailResponse, any>({
        path: `/api/v1/StudentSurvey/SelectStudentSurveyDetail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student cho API
     *
     * @tags StudentTest
     * @name V1StudentTestSelectStudentTestList
     * @summary Lấy câu trả lời của học sinh trong bài test
     * @request GET:/api/v1/StudentTest/SelectStudentTest
     * @secure
     */
    v1StudentTestSelectStudentTestList: (
      query?: {
        /** @format uuid */
        studentTestId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentTestSelectResponse, any>({
        path: `/api/v1/StudentTest/SelectStudentTest`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Lấy danh sách các khảo sát
     *
     * @tags Survey
     * @name V1SurveyList
     * @summary Lấy danh sách các khảo sát
     * @request GET:/api/v1/Survey
     * @secure
     */
    v1SurveyList: (params: RequestParams = {}) =>
      this.request<SurveySelectsResponse, any>({
        path: `/api/v1/Survey`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Lấy chi tiết khảo sát với phân trang
     *
     * @tags Survey
     * @name V1SurveyDetailList
     * @summary Lấy danh sách các khảo sát
     * @request GET:/api/v1/Survey/Detail
     * @secure
     */
    v1SurveyDetailList: (
      query: {
        /** @format uuid */
        SurveyId: string;
        /** @format int32 */
        SemesterNumber?: number;
        /** @format int32 */
        PageIndex?: number;
        /** @format int32 */
        PageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SurveyDetailSelectResponse, any>({
        path: `/api/v1/Survey/Detail`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền cho API
     *
     * @tags Test
     * @name V1TestSelectTestList
     * @summary Lấy bài kiểm tra gồm các quiz mà student chọn
     * @request GET:/api/v1/Test/SelectTest
     * @secure
     */
    v1TestSelectTestList: (
      query?: {
        QuizId?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<TestSelectResponse, any>({
        path: `/api/v1/Test/SelectTest`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cập nhật thông tin bài kiểm tra thực hành bao gồm: tiêu đề, mô tả, độ khó, test cases, templates và examples. Chỉ cập nhật/xóa items có ID trong request. Items không có trong request sẽ bị xoá. Phải giữ ít nhất 1 test case và 1 example. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminUpdatePracticeTestUpdate
     * @summary Cập nhật bài kiểm tra thực hành
     * @request PUT:/api/v1/Admin/UpdatePracticeTest
     * @secure
     */
    v1AdminUpdatePracticeTestUpdate: (
      body: PracticeTestAdminUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestAdminUpdateResponse, any>({
        path: `/api/v1/Admin/UpdatePracticeTest`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Teacher cho API. Chỉ cập nhật thông tin quiz settings và câu hỏi/câu trả lời hiện có
     *
     * @tags CourseQuiz
     * @name V1CourseQuizUpdateQuizCourseUpdate
     * @summary Cập nhật bài kiểm tra cho khoá học
     * @request PUT:/api/v1/CourseQuiz/UpdateQuizCourse
     * @secure
     */
    v1CourseQuizUpdateQuizCourseUpdate: (
      body: QuizCourseUpdateCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuizCourseUpdateResponse, any>({
        path: `/api/v1/CourseQuiz/UpdateQuizCourse`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Xóa bài tập thực hành. Cần cấp quyền Admin cho API
     *
     * @tags Admin
     * @name V1AdminDeletePracticeTestDelete
     * @summary Xóa bài tập thực hành
     * @request DELETE:/api/v1/Admin/DeletePracticeTest
     * @secure
     */
    v1AdminDeletePracticeTestDelete: (
      body: PracticeTestAdminDeleteRequest,
      params: RequestParams = {},
    ) =>
      this.request<PracticeTestAdminDeleteResponse, any>({
        path: `/api/v1/Admin/DeletePracticeTest`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Teacher cho API. Xóa mềm (soft delete) - set IsActive = false
     *
     * @tags CourseQuiz
     * @name V1CourseQuizDeleteQuestionsFromQuizCourseDelete
     * @summary Xóa câu hỏi khỏi bài kiểm tra
     * @request DELETE:/api/v1/CourseQuiz/DeleteQuestionsFromQuizCourse
     * @secure
     */
    v1CourseQuizDeleteQuestionsFromQuizCourseDelete: (
      body: QuizCourseDeleteQuestionsCommand,
      params: RequestParams = {},
    ) =>
      this.request<QuizCourseDeleteQuestionsResponse, any>({
        path: `/api/v1/CourseQuiz/DeleteQuestionsFromQuizCourse`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
