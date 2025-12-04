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
export enum UserBehaviourTargetType {
  Value1 = 1,
  Value2 = 2,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value99 = 99,
}

/** @format int32 */
export enum UserBehaviourActionType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value10 = 10,
  Value11 = 11,
  Value12 = 12,
  Value13 = 13,
  Value14 = 14,
  Value15 = 15,
  Value16 = 16,
  Value20 = 20,
  Value21 = 21,
  Value22 = 22,
  Value23 = 23,
  Value24 = 24,
  Value30 = 30,
  Value31 = 31,
  Value32 = 32,
  Value33 = 33,
  Value40 = 40,
  Value41 = 41,
  Value42 = 42,
  Value50 = 50,
  Value51 = 51,
  Value52 = 52,
  Value60 = 60,
  Value61 = 61,
  Value62 = 62,
  Value63 = 63,
  Value64 = 64,
  Value65 = 65,
  Value70 = 70,
  Value71 = 71,
  Value72 = 72,
}

/** @format int32 */
export enum TechnologyType {
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum QuizScope {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

/** @format int32 */
export enum ModuleProgressStatus {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum LessonStatus {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
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

export interface AcceptCourseSuggestionCommand {
  /** @format uuid */
  courseSuggestionId?: string;
}

export interface AcceptCourseSuggestionResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface AdminLearningGoalItem {
  /** @format uuid */
  goalId?: string;
  goalName?: string;
  description?: string;
  /** @format int32 */
  learningGoalType?: number;
  /** @format date-time */
  createdAt?: string;
}

export interface AdminLearningGoalItemPagedResult {
  items?: AdminLearningGoalItem[];
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

export interface AdminLearningGoalsSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminLearningGoalItemPagedResult;
}

export interface AdminTechnologiesSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AdminTechnologyItemPagedResult;
}

export interface AdminTechnologyItem {
  /** @format uuid */
  technologyId?: string;
  technologyName?: string;
  description?: string;
  /** @format int32 */
  technologyType?: number;
  technologyTypeName?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface AdminTechnologyItemPagedResult {
  items?: AdminTechnologyItem[];
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

export interface AiEvaluationUpsertEvent {
  /** @format uuid */
  attemptId?: string;
  /** @format uuid */
  userId?: string;
  /** @format uuid */
  courseId?: string;
  scope?: QuizScope;
  /** @format uuid */
  scopeId?: string;
  /** @format uuid */
  quizId?: string;
  /** @format int32 */
  score100?: number;
  /** @format int32 */
  score100Raw?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  actions?: RecommendedAction[];
  skillGaps?: SkillGap[];
  /** @format double */
  confidence?: number;
  model?: string;
  rubricVersion?: string;
  /** @format date-time */
  createdAtUtc?: string;
}

export interface AiImprovementDto {
  /** @format uuid */
  improvementId?: string;
  /** @format int32 */
  positionIndex?: number;
  improvementText?: string;
  contentMarkdown?: string;
  slug?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface BasicLearningPathDto {
  courseGroups?: CourseGroupDto[];
}

export interface CourseGroupDto {
  subjectCode?: string;
  /** @format int32 */
  status?: number;
  analysisMarkdown?: string;
  courses?: CourseItemDto[];
}

export interface CourseItemDto {
  courseId?: string;
  /** @format int32 */
  semesterPosition?: number;
  subjectCode?: string;
  /** @format int32 */
  status?: number;
  title?: string;
  shortDescription?: string;
  description?: string;
  slug?: string;
  courseImageUrl?: string;
  /** @format int32 */
  learnerCount?: number;
  /** @format int32 */
  durationMinutes?: number;
  /** @format int32 */
  durationHours?: number;
  /** @format int32 */
  level?: number;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number;
  isEnrolled?: boolean;
  isWishList?: boolean;
  /** @format uuid */
  teacherId?: string;
  teacherName?: string;
  tagNames?: string[];
}

export interface CreateAiQuizEvaluateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface DetailError {
  field?: string;
  messageId?: string;
  errorMessage?: string;
}

export interface ExternalLearningPathDto {
  majorId?: string;
  majorCode?: string;
  reason?: string;
  steps?: ExternalStepDto[];
}

export interface ExternalStepDto {
  title?: string;
  /** @format int32 */
  duration_Weeks?: number;
  suggested_Courses?: SuggestedCourseDto[];
}

export interface GetLatestLessonAiEvaluationsPayload {
  lessons?: LessonAiEvaluationDto[];
}

export interface GetLatestLessonAiEvaluationsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: GetLatestLessonAiEvaluationsPayload;
}

export interface GetLatestModuleAiEvaluationsPayload {
  modules?: ModuleAiEvaluationDto[];
}

export interface GetLatestModuleAiEvaluationsResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: GetLatestModuleAiEvaluationsPayload;
}

export interface GetLessonDashboardEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: LessonDashboardContract;
}

export interface GetModuleDashboardEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: ModuleDashboardContract;
}

export interface GetOverviewCourseDashboardResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: OverviewCourseContract;
}

export interface InternalLearningPathDto {
  majorId?: string;
  majorCode?: string;
  reason?: string;
  /** @format int32 */
  positionIndex?: number;
  majorCourseGroups?: CourseGroupDto[];
}

export interface LearningBehaviorSection {
  /** @format date-time */
  lastAccessed?: string;
  /** @format int32 */
  mostActiveSlot?: number;
  /** @format int64 */
  totalPauseCount?: number;
  /** @format int64 */
  scrollVideoCount?: number;
  /** @format int32 */
  rewindTimes?: number;
  /** @format double */
  averageRewatchPerLesson?: number;
  /** @format double */
  averagePausePerLesson?: number;
  streaks?: LearningStreakItem[];
}

export interface LearningGoalDeleteResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface LearningGoalInsertCommand {
  goalName?: string;
  description?: string;
  learningGoalType?: LearningGoalType;
}

export interface LearningGoalInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface LearningGoalUpdateCommand {
  /** @format uuid */
  goalId: string;
  /** @minLength 1 */
  goalName: string;
  description?: string;
  learningGoalType: LearningGoalType;
}

export interface LearningGoalUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface LearningPathCourseUpdateCommand {
  /** @format uuid */
  pathId: string;
  /** @minItems 1 */
  selectedCourseIds: string[];
}

export interface LearningPathCourseUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface LearningPathRenameCommand {
  /** @format uuid */
  learningPathId: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  pathName: string;
  /** @format uuid */
  studentId?: string;
  studentEmail?: string;
}

export interface LearningPathRenameResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface LearningPathSelectAllDto {
  /** @format uuid */
  pathId?: string;
  pathName?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  status?: number;
}

export interface LearningPathSelectAllDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
  /** @format int64 */
  totalCount?: number;
  data?: LearningPathSelectAllDto[];
  /** @format int32 */
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface LearningPathSelectDto {
  /** @format int32 */
  status?: number;
  pathName?: string;
  /** @format double */
  completionPercent?: number;
  summaryFeedback?: string;
  habitAndInterestAnalysis?: string;
  personality?: string;
  learningAbility?: string;
  basicLearningPath?: BasicLearningPathDto;
  internalLearningPath?: InternalLearningPathDto[];
  externalLearningPath?: ExternalLearningPathDto[];
}

export interface LearningPathSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: LearningPathSelectDto;
}

export interface LearningPathSelectsQuery {
  /** @format uuid */
  learningPathId?: string;
}

export interface LearningStreakItem {
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format int32 */
  days?: number;
}

export interface LessonAiEvaluationDto {
  /** @format uuid */
  lessonId?: string;
  /** @format uuid */
  quizId?: string;
  /** @format int32 */
  score100Raw?: number;
  /** @format int32 */
  score100?: number;
  summary?: string;
  strengths?: string[];
  improvementResources?: AiImprovementDto[];
  /** @format date-time */
  createdAt?: string;
}

export interface LessonDashboardContract {
  /** @format uuid */
  studentId?: string;
  /** @format uuid */
  courseId?: string;
  modules?: LessonDashboardModuleGroup[];
  totals?: LessonDashboardTotals;
}

export interface LessonDashboardItem {
  /** @format uuid */
  lessonId?: string;
  title?: string;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  videoUrl?: string;
  status?: LessonStatus;
  /** @format int32 */
  currentSecond?: number;
  /** @format int32 */
  videoDurationSeconds?: number;
  /** @format int32 */
  actualStudyMinutes?: number;
  /** @format double */
  percentWatched?: number;
  /** @format int32 */
  lessonQuizCount?: number;
  /** @format double */
  averageQuizScore?: number;
  /** @format int32 */
  aiScore?: number;
  /** @format int32 */
  aiScoreRaw?: number;
  aiFeedbackSummary?: string;
  aiStrengths?: string[];
  aiImprovementResources?: AiImprovementDto[];
  /** @format date-time */
  startedAtUtc?: string;
  /** @format date-time */
  completedAtUtc?: string;
  /** @format date-time */
  updatedAtUtc?: string;
  /** @format date-time */
  aiEvaluatedAtUtc?: string;
}

export interface LessonDashboardModuleGroup {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string;
  /** @format int32 */
  positionIndex?: number;
  lessons?: LessonDashboardItem[];
}

export interface LessonDashboardTotals {
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
  /** @format int32 */
  totalVideoDurationMinutes?: number;
  /** @format int32 */
  totalActualStudyMinutes?: number;
  /** @format int32 */
  totalLessonQuizCount?: number;
  /** @format double */
  averageQuizScore?: number;
  /** @format int32 */
  averageAiScore?: number;
}

export interface MajorItem {
  /** @format uuid */
  majorId?: string;
  majorName?: string;
}

export interface ModuleAiEvaluationDto {
  /** @format uuid */
  moduleId?: string;
  /** @format uuid */
  quizId?: string;
  /** @format int32 */
  score100Raw?: number;
  /** @format int32 */
  score100?: number;
  summary?: string;
  strengths?: string[];
  improvementResources?: AiImprovementDto[];
  /** @format date-time */
  createdAt?: string;
}

export interface ModuleDashboardContract {
  /** @format uuid */
  studentId?: string;
  /** @format uuid */
  courseId?: string;
  modules?: ModuleDashboardItemContract[];
  totals?: ModuleDashboardTotalsContract;
}

export interface ModuleDashboardItemContract {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string;
  /** @format int32 */
  positionIndex?: number;
  /** @format int32 */
  level?: number;
  isCore?: boolean;
  description?: string;
  status?: ModuleProgressStatus;
  /** @format int32 */
  lessonsVideoTotal?: number;
  /** @format int32 */
  lessonsCompleted?: number;
  /** @format double */
  percentCompleted?: number;
  /** @format int32 */
  lessonsInProgress?: number;
  /** @format int32 */
  moduleDurationMinutes?: number;
  /** @format int32 */
  actualStudyMinutes?: number;
  /** @format int32 */
  moduleQuizCount?: number;
  /** @format int32 */
  lessonQuizCount?: number;
  /** @format int32 */
  totalQuizCount?: number;
  /** @format double */
  averageQuizScore?: number;
  /** @format int32 */
  aiScore?: number;
  aiFeedbackSummary?: string;
  aiStrengths?: string[];
  improvementResources?: AiImprovementDto[];
  /** @format date-time */
  startedAtUtc?: string;
  /** @format date-time */
  completedAtUtc?: string;
  /** @format date-time */
  updatedAtUtc?: string;
}

export interface ModuleDashboardTotalsContract {
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsTotal?: number;
  /** @format int32 */
  lessonsCompleted?: number;
  /** @format double */
  percentCompleted?: number;
  /** @format int32 */
  totalModuleDurationMinutes?: number;
  /** @format int32 */
  totalActualStudyMinutes?: number;
  /** @format int32 */
  totalModuleQuizCount?: number;
  /** @format int32 */
  totalLessonQuizCount?: number;
  /** @format int32 */
  totalQuizCount?: number;
  /** @format double */
  averageQuizScore?: number;
  /** @format int32 */
  averageAiScore?: number;
}

export interface OverviewCourseContract {
  courseName?: string;
  instructorName?: string;
  username?: string;
  durationText?: string;
  /** @format int32 */
  totalVideos?: number;
  /** @format int32 */
  totalQuizzes?: number;
  /** @format date-time */
  startDate?: string;
  /** @format int32 */
  level?: number;
  progress?: ProgressSection;
  aiEvaluationMarkdown?: string;
  performance?: PerformanceSection;
  learningBehavior?: LearningBehaviorSection;
}

export interface PerformanceSection {
  /** @format double */
  avgMinutesPerLesson?: number;
  /** @format int32 */
  rank?: number;
  /** @format int32 */
  fasterCount?: number;
  /** @format int32 */
  slowerCount?: number;
  analysis?: string;
}

export interface ProgressSection {
  /** @format double */
  completedPercent?: number;
  /** @format int32 */
  lessonsCompleted?: number;
  /** @format int32 */
  lessonsTotal?: number;
  /** @format int32 */
  quizTotal?: number;
  /** @format double */
  averageScore?: number;
  /** @format double */
  averageAiScore?: number;
  /** @format date-span */
  totalLearningTime?: string;
}

export interface RecommendedAction {
  title?: string;
  kind?: string;
  targetUrl?: string;
}

export interface SearchAiRecommendResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface SelectAllLearningPathResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: LearningPathSelectAllDtoPaginatedResult;
}

export interface SelectAllUserBehaviourResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: UserBehaviourDto[];
}

export interface SemesterItem {
  /** @format uuid */
  semesterId?: string;
  semesterName?: string;
}

export interface SkillGap {
  skillTag?: string;
  /** @format int32 */
  level?: number;
  evidence?: string;
}

export interface StudentLearningGoalItem {
  /** @format uuid */
  goalId?: string;
  goalName?: string;
  /** @format int32 */
  learningGoalType?: number;
  learningGoalTypeName?: string;
}

export interface StudentProfileSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentProfileSelectResponseEntity;
}

export interface StudentProfileSelectResponseEntity {
  /** @format uuid */
  studentId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  /** @format date */
  dateOfBirth?: string;
  phoneNumber?: string;
  /** @format int32 */
  gender?: number;
  avatarUrl?: string;
  address?: string;
  bio?: string;
  /** @format uuid */
  majorId?: string;
  majorName?: string;
  /** @format uuid */
  semesterId?: string;
  semesterName?: string;
  technologies?: StudentTechnologyItem[];
  learningGoals?: StudentLearningGoalItem[];
}

export interface StudentProfileUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface StudentTechnologyGoalSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentTechnologyGoalSelectResponseEntity;
}

export interface StudentTechnologyGoalSelectResponseEntity {
  semester?: SemesterItem;
  major?: MajorItem;
  technologies?: StudentTechnologyItem[];
  learningGoals?: StudentLearningGoalItem[];
}

export interface StudentTechnologyItem {
  /** @format uuid */
  technologyId?: string;
  technologyName?: string;
  /** @format int32 */
  technologyType?: number;
  technologyTypeName?: string;
}

export interface StudentTranscriptInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface StudentTranscriptSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: StudentTranscriptSelectResponseEntity[];
}

export interface StudentTranscriptSelectResponseEntity {
  /** @format uuid */
  studentTranscriptId?: string;
  semester?: string;
  /** @format int32 */
  semesterNumber?: number;
  subjectCode?: string;
  prerequisite?: string;
  subjectName?: string;
  /** @format int32 */
  credit?: number;
  /** @format double */
  grade?: number;
  status?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface SuggestedCourseDto {
  title?: string;
  link?: string;
  provider?: string;
  reason?: string;
  level?: string;
  rating?: string;
  /** @format int32 */
  est_Duration_Weeks?: number;
}

export interface TechnologyDeleteResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface TechnologyInsertCommand {
  technologyName?: string;
  description?: string;
  technologyType?: TechnologyType;
}

export interface TechnologyInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface TechnologyUpdateCommand {
  /** @format uuid */
  technologyId: string;
  /** @minLength 1 */
  technologyName: string;
  description?: string;
  technologyType: TechnologyType;
}

export interface TechnologyUpdateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface UpdateCourseStatusToSkippedCommand {
  /** @format uuid */
  courseId: string;
}

export interface UpdateCourseStatusToSkippedResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface UpdateLearningPathCourseStatusCommand {
  /** @format uuid */
  userId?: string;
  /** @format uuid */
  courseId?: string;
  /** @format int32 */
  status?: number;
}

export interface UpdateLearningPathCourseStatusResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface UpdateLearningPathStatusCommand {
  /** @format uuid */
  learningPathId?: string;
  /** @format int32 */
  status?: number;
}

export interface UpdateLearningPathStatusResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: boolean;
}

export interface UpdateReadModelLearningPathCommand {
  /** @format uuid */
  learningPathId?: string;
}

export interface UpdateReadModelLearningPathResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface UpdateStatusLearningPathCommand {
  /** @format uuid */
  learningPathId?: string;
  internalMajorIds?: string[];
}

export interface UpdateStatusLearningPathResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface UserBehaviourDto {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  studentId?: string;
  actionType?: string;
  /** @format uuid */
  targetId?: string;
  targetType?: string;
  metadata?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface UserBehaviourInsertCommand {
  actionType: UserBehaviourActionType;
  /** @format uuid */
  targetId?: string;
  targetType?: UserBehaviourTargetType;
  /** @format uuid */
  parentTargetId?: string;
  metadata?: string;
}

export interface UserBehaviourInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
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
  public baseUrl: string = "/student";
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
 * @title Student Service Swagger
 * @version v1
 * @baseUrl /student
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags AiQuizEvaluate
     * @name AiQuizEvaluateCreate
     * @request POST:/api/AiQuizEvaluate
     * @secure
     */
    aiQuizEvaluateCreate: (
      body: AiEvaluationUpsertEvent,
      params: RequestParams = {},
    ) =>
      this.request<CreateAiQuizEvaluateResponse, any>({
        path: `/api/AiQuizEvaluate`,
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
     * @tags AiQuizEvaluate
     * @name AiQuizEvaluateList
     * @request GET:/api/AiQuizEvaluate
     * @secure
     */
    aiQuizEvaluateList: (
      query?: {
        /** @format uuid */
        StudentId?: string;
        /** @format uuid */
        CourseId?: string;
        ModuleIds?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLatestModuleAiEvaluationsResponse, any>({
        path: `/api/AiQuizEvaluate`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Sử dụng SSE để lấy Learning PathById (POST body).
     *
     * @tags LearningPaths
     * @name LearningPathsStreamByIdCreate
     * @summary Streaming Learning Path theo Id
     * @request POST:/api/LearningPaths/stream-by-id
     * @secure
     */
    learningPathsStreamByIdCreate: (
      body: LearningPathSelectsQuery,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/LearningPaths/stream-by-id`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Dùng để đồng bộ dữ liệu từ write-model khi chỉnh data, chỉ dùng cho Backend
     *
     * @tags LearningPaths
     * @name LearningPathsSyncDataReadmodelCreate
     * @summary Đồng bộ dữ liệu từ write-model sang read-model (BACKEND)
     * @request POST:/api/LearningPaths/Sync-data-readmodel
     * @secure
     */
    learningPathsSyncDataReadmodelCreate: (
      body: UpdateReadModelLearningPathCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateReadModelLearningPathResponse, any>({
        path: `/api/LearningPaths/Sync-data-readmodel`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Internal debug endpoint - userId lấy từ body, không dùng token
     *
     * @tags LearningPaths
     * @name LearningPathsUpdateCourseStatusCreate
     * @summary Update course status in all learning paths for a user
     * @request POST:/api/LearningPaths/update-course-status
     * @secure
     */
    learningPathsUpdateCourseStatusCreate: (
      body: UpdateLearningPathCourseStatusCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateLearningPathCourseStatusResponse, any>({
        path: `/api/LearningPaths/update-course-status`,
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
     * @tags LearningPaths
     * @name LearningPathsUpdateLearningPathStatusCreate
     * @request POST:/api/LearningPaths/UpdateLearningPathStatus
     * @secure
     */
    learningPathsUpdateLearningPathStatusCreate: (
      body: UpdateLearningPathStatusCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateLearningPathStatusResponse, any>({
        path: `/api/LearningPaths/UpdateLearningPathStatus`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Trả về tài liệu dạng markdown. Cần xác thực Bearer.
     *
     * @tags StudentDashboards
     * @name StudentDashboardsGenAndInsertImprovementByAiCreate
     * @summary Tìm tài liệu improvement
     * @request POST:/api/StudentDashboards/GenAndInsertImprovementByAI
     * @secure
     */
    studentDashboardsGenAndInsertImprovementByAiCreate: (
      query?: {
        /** @format uuid */
        ImprovementId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SearchAiRecommendResponse, any>({
        path: `/api/StudentDashboards/GenAndInsertImprovementByAI`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Admin
     * @name V1AdminInsertLearningGoalCreate
     * @summary Tạo mục tiêu học tập mới
     * @request POST:/api/v1/Admin/InsertLearningGoal
     * @secure
     */
    v1AdminInsertLearningGoalCreate: (
      body: LearningGoalInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<LearningGoalInsertResponse, any>({
        path: `/api/v1/Admin/InsertLearningGoal`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Admin
     * @name V1AdminInsertTechnologyCreate
     * @summary Thêm ngôn ngữ/ framework mới
     * @request POST:/api/v1/Admin/InsertTechnology
     * @secure
     */
    v1AdminInsertTechnologyCreate: (
      body: TechnologyInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<TechnologyInsertResponse, any>({
        path: `/api/v1/Admin/InsertTechnology`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student
     *
     * @tags Student
     * @name V1StudentInsertStudentTranscriptCreate
     * @summary Import bảng điểm từ FAP cho sinh viên
     * @request POST:/api/v1/Student/InsertStudentTranscript
     * @secure
     */
    v1StudentInsertStudentTranscriptCreate: (
      data: {
        /** @format binary */
        TranscriptFile?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentTranscriptInsertResponse, any>({
        path: `/api/v1/Student/InsertStudentTranscript`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền
     *
     * @tags UserBehaviour
     * @name V1UserBehaviourInsertUserBehaviourCreate
     * @summary Dùng cho việc lưu hành vi của người dùng để theo dõi đưa ra lộ trình cá nhân hoá phù hợp
     * @request POST:/api/v1/UserBehaviour/InsertUserBehaviour
     * @secure
     */
    v1UserBehaviourInsertUserBehaviourCreate: (
      body: UserBehaviourInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<UserBehaviourInsertResponse, any>({
        path: `/api/v1/UserBehaviour/InsertUserBehaviour`,
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
     * @tags AiQuizEvaluate
     * @name AiQuizEvaluateGetLatestLessonAiEvaluationsList
     * @request GET:/api/AiQuizEvaluate/GetLatestLessonAiEvaluations
     * @secure
     */
    aiQuizEvaluateGetLatestLessonAiEvaluationsList: (
      query?: {
        /** @format uuid */
        StudentId?: string;
        /** @format uuid */
        CourseId?: string;
        LessonIds?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLatestLessonAiEvaluationsResponse, any>({
        path: `/api/AiQuizEvaluate/GetLatestLessonAiEvaluations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Nếu client gửi Accept: text/event-stream thì server trả SSE realtime, ngược lại trả JSON thông thường.
     *
     * @tags LearningPaths
     * @name LearningPathsList
     * @summary Lấy Learning Path (hỗ trợ SSE)
     * @request GET:/api/LearningPaths
     * @secure
     */
    learningPathsList: (
      query?: {
        /** @format uuid */
        LearningPathId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LearningPathSelectResponse, any>({
        path: `/api/LearningPaths`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Trả về Learning Path đang có. Cần xác thực Bearer.
     *
     * @tags LearningPaths
     * @name LearningPathsGetAllList
     * @summary Lấy tất cả Learning Path
     * @request GET:/api/LearningPaths/get-all
     * @secure
     */
    learningPathsGetAllList: (
      query?: {
        /** @format int32 */
        "Pagination.PageIndex"?: number;
        /** @format int32 */
        "Pagination.PageSize"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SelectAllLearningPathResponse, any>({
        path: `/api/LearningPaths/get-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Trả về Lesson Dashboard theo tham số query. Cần xác thực Bearer.
     *
     * @tags StudentDashboards
     * @name StudentDashboardsGetLessonDashboardProcessList
     * @summary Lấy Lesson Dashboard
     * @request GET:/api/StudentDashboards/GetLessonDashboardProcess
     * @secure
     */
    studentDashboardsGetLessonDashboardProcessList: (
      query?: {
        /** @format uuid */
        CourseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLessonDashboardEventResponse, any>({
        path: `/api/StudentDashboards/GetLessonDashboardProcess`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Trả về Module Dashboard theo tham số query. Cần xác thực Bearer.
     *
     * @tags StudentDashboards
     * @name StudentDashboardsGetModuleDashboardProcessList
     * @summary Lấy Module Dashboard
     * @request GET:/api/StudentDashboards/GetModuleDashboardProcess
     * @secure
     */
    studentDashboardsGetModuleDashboardProcessList: (
      query?: {
        /** @format uuid */
        CourseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetModuleDashboardEventResponse, any>({
        path: `/api/StudentDashboards/GetModuleDashboardProcess`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Trả về Overview Dashboard theo tham số query. Cần xác thực Bearer.
     *
     * @tags StudentDashboards
     * @name StudentDashboardsGetOverviewCourseDashboardProcessList
     * @summary Lấy Overview Dashboard
     * @request GET:/api/StudentDashboards/GetOverviewCourseDashboardProcess
     * @secure
     */
    studentDashboardsGetOverviewCourseDashboardProcessList: (
      query?: {
        /** @format uuid */
        CourseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetOverviewCourseDashboardResponse, any>({
        path: `/api/StudentDashboards/GetOverviewCourseDashboardProcess`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Admin
     * @name V1AdminSelectLearningGoalsList
     * @summary Lấy danh sách mục tiêu học tập (phân trang, tìm kiếm, lọc)
     * @request GET:/api/v1/Admin/SelectLearningGoals
     * @secure
     */
    v1AdminSelectLearningGoalsList: (
      query?: {
        /** @format int32 */
        PageNumber?: number;
        /** @format int32 */
        PageSize?: number;
        SearchTerm?: string;
        /** @format int32 */
        LearningGoalType?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminLearningGoalsSelectResponse, any>({
        path: `/api/v1/Admin/SelectLearningGoals`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Admin
     * @name V1AdminSelectTechnologiesList
     * @summary Lấy danh sách công nghệ (phân trang, tìm kiếm, lọc)
     * @request GET:/api/v1/Admin/SelectTechnologies
     * @secure
     */
    v1AdminSelectTechnologiesList: (
      query?: {
        /** @format int32 */
        PageNumber?: number;
        /** @format int32 */
        PageSize?: number;
        SearchTerm?: string;
        /** @format int32 */
        TechnologyType?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminTechnologiesSelectResponse, any>({
        path: `/api/v1/Admin/SelectTechnologies`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student
     *
     * @tags Student
     * @name V1StudentSelectStudentProfileList
     * @summary Hiển thị profile học sinh
     * @request GET:/api/v1/Student/SelectStudentProfile
     * @secure
     */
    v1StudentSelectStudentProfileList: (params: RequestParams = {}) =>
      this.request<StudentProfileSelectResponse, any>({
        path: `/api/v1/Student/SelectStudentProfile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student
     *
     * @tags Student
     * @name V1StudentSelectStudentTechnologyGoalList
     * @summary Hiển thị công nghệ và mục tiêu học tập của sinh viên
     * @request GET:/api/v1/Student/SelectStudentTechnologyGoal
     * @secure
     */
    v1StudentSelectStudentTechnologyGoalList: (params: RequestParams = {}) =>
      this.request<StudentTechnologyGoalSelectResponse, any>({
        path: `/api/v1/Student/SelectStudentTechnologyGoal`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student
     *
     * @tags Student
     * @name V1StudentSelectStudentTranscriptList
     * @summary Hiển thị bảng điểm được import từ FAP của sinh viên
     * @request GET:/api/v1/Student/SelectStudentTranscript
     * @secure
     */
    v1StudentSelectStudentTranscriptList: (params: RequestParams = {}) =>
      this.request<StudentTranscriptSelectResponse, any>({
        path: `/api/v1/Student/SelectStudentTranscript`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description API hỗ trợ phân trang và lọc theo ActionType, TargetType. Cần cấp quyền.
     *
     * @tags UserBehaviour
     * @name V1UserBehaviourSelectUserBehavioursList
     * @summary Lấy danh sách toàn bộ hành vi của người dùng hiện tại
     * @request GET:/api/v1/UserBehaviour/SelectUserBehaviours
     * @secure
     */
    v1UserBehaviourSelectUserBehavioursList: (params: RequestParams = {}) =>
      this.request<SelectAllUserBehaviourResponse, any>({
        path: `/api/v1/UserBehaviour/SelectUserBehaviours`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags LearningPaths
     * @name LearningPathsChooseMajorUpdate
     * @summary Pick lộ trình chuyên ngành phù hợp
     * @request PUT:/api/LearningPaths/choose-major
     * @secure
     */
    learningPathsChooseMajorUpdate: (
      body: UpdateStatusLearningPathCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateStatusLearningPathResponse, any>({
        path: `/api/LearningPaths/choose-major`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Chỉ cập nhật PathName của lộ trình.
     *
     * @tags LearningPaths
     * @name LearningPathsRenameUpdate
     * @summary Đổi tên Learning Path
     * @request PUT:/api/LearningPaths/rename
     * @secure
     */
    learningPathsRenameUpdate: (
      body: LearningPathRenameCommand,
      params: RequestParams = {},
    ) =>
      this.request<LearningPathRenameResponse, any>({
        path: `/api/LearningPaths/rename`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description API cho phép sinh viên chấp nhận học vượt/bỏ qua khóa học trong lộ trình học tập
     *
     * @tags LearningPaths
     * @name LearningPathsUpdateCourseStatusToSkippedUpdate
     * @summary Cập nhật trạng thái khóa học sang Skipped
     * @request PUT:/api/LearningPaths/UpdateCourseStatusToSkipped
     * @secure
     */
    learningPathsUpdateCourseStatusToSkippedUpdate: (
      body: UpdateCourseStatusToSkippedCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCourseStatusToSkippedResponse, any>({
        path: `/api/LearningPaths/UpdateCourseStatusToSkipped`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description API này cho phép sinh viên chọn các khóa học mong muốn.
     *
     * @tags LearningPaths
     * @name LearningPathsUpdateLearningPathCoursesUpdate
     * @summary Cập nhật các khóa học được chọn trong lộ trình học tập
     * @request PUT:/api/LearningPaths/UpdateLearningPathCourses
     * @secure
     */
    learningPathsUpdateLearningPathCoursesUpdate: (
      body: LearningPathCourseUpdateCommand,
      params: RequestParams = {},
    ) =>
      this.request<LearningPathCourseUpdateResponse, any>({
        path: `/api/LearningPaths/UpdateLearningPathCourses`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Admin
     * @name V1AdminUpdateLearningGoalUpdate
     * @summary Cập nhật mục tiêu học tập
     * @request PUT:/api/v1/Admin/UpdateLearningGoal
     * @secure
     */
    v1AdminUpdateLearningGoalUpdate: (
      body: LearningGoalUpdateCommand,
      params: RequestParams = {},
    ) =>
      this.request<LearningGoalUpdateResponse, any>({
        path: `/api/v1/Admin/UpdateLearningGoal`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Admin
     * @name V1AdminUpdateTechnologyUpdate
     * @summary Cập nhật ngôn ngữ/ framework
     * @request PUT:/api/v1/Admin/UpdateTechnology
     * @secure
     */
    v1AdminUpdateTechnologyUpdate: (
      body: TechnologyUpdateCommand,
      params: RequestParams = {},
    ) =>
      this.request<TechnologyUpdateResponse, any>({
        path: `/api/v1/Admin/UpdateTechnology`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description API cho phép sinh viên chấp nhận đề xuất khóa học từ hệ thống. Sau khi chấp nhận, IsAccepted sẽ được đặt thành true.
     *
     * @tags CourseSuggestions
     * @name V1CourseSuggestionsUpdateAcceptCourseSuggestionStatusUpdate
     * @summary Chấp nhận đề xuất khóa học
     * @request PUT:/api/v1/CourseSuggestions/UpdateAcceptCourseSuggestionStatus
     * @secure
     */
    v1CourseSuggestionsUpdateAcceptCourseSuggestionStatusUpdate: (
      body: AcceptCourseSuggestionCommand,
      params: RequestParams = {},
    ) =>
      this.request<AcceptCourseSuggestionResponse, any>({
        path: `/api/v1/CourseSuggestions/UpdateAcceptCourseSuggestionStatus`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Student
     *
     * @tags Student
     * @name V1StudentUpdateStudentProfileUpdate
     * @summary Cập nhật thông tin học sinh
     * @request PUT:/api/v1/Student/UpdateStudentProfile
     * @secure
     */
    v1StudentUpdateStudentProfileUpdate: (
      data: {
        /**
         * @minLength 0
         * @maxLength 50
         */
        FirstName?: string;
        /**
         * @minLength 0
         * @maxLength 50
         */
        LastName?: string;
        /** @format date */
        DateOfBirth?: string;
        /**
         * @minLength 0
         * @maxLength 15
         */
        PhoneNumber?: string;
        /**
         * @format int32
         * @min 1
         * @max 3
         */
        Gender?: number;
        /** @format binary */
        Avatar?: File;
        /**
         * @minLength 0
         * @maxLength 200
         */
        Address?: string;
        /**
         * @minLength 0
         * @maxLength 500
         */
        Bio?: string;
        /** @format uuid */
        MajorId?: string;
        /** @format uuid */
        SemesterId?: string;
        /** @minItems 1 */
        Technologies?: string[];
        /** @minItems 1 */
        LearningGoals?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentProfileUpdateResponse, any>({
        path: `/api/v1/Student/UpdateStudentProfile`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin - Xóa logic
     *
     * @tags Admin
     * @name V1AdminDeleteLearningGoalDelete
     * @summary Xóa mục tiêu học tập
     * @request DELETE:/api/v1/Admin/DeleteLearningGoal
     * @secure
     */
    v1AdminDeleteLearningGoalDelete: (
      query: {
        /** @format uuid */
        GoalId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LearningGoalDeleteResponse, any>({
        path: `/api/v1/Admin/DeleteLearningGoal`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin - Xóa logic
     *
     * @tags Admin
     * @name V1AdminDeleteTechnologyDelete
     * @summary Xóa ngôn ngữ/ framework
     * @request DELETE:/api/v1/Admin/DeleteTechnology
     * @secure
     */
    v1AdminDeleteTechnologyDelete: (
      query?: {
        /** @format uuid */
        technologyId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TechnologyDeleteResponse, any>({
        path: `/api/v1/Admin/DeleteTechnology`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
