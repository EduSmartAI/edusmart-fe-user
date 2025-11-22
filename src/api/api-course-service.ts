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
export enum CourseSortBy {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** @format int32 */
export enum CourseProgressStatus {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

export interface AddToWishlistResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface Answers {
  text?: string | null;
  isCorrect?: boolean;
}

export interface CheckEnrollmentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface CourseAudienceDto {
  /** @format uuid */
  audienceId?: string;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CourseCommentDetailsDto {
  /** @format uuid */
  commentId?: string;
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  userId?: string;
  userDisplayName?: string | null;
  content?: string | null;
  /** @format uuid */
  parentCommentId?: string | null;
  isActive?: boolean;
  /** @format int32 */
  replyCount?: number;
  /** @format date-time */
  createdAt?: string;
}

export interface CourseCommentDetailsDtoPagedResult {
  items?: CourseCommentDetailsDto[] | null;
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

export interface CourseCommentDto {
  /** @format uuid */
  commentId?: string;
  /** @format uuid */
  userId?: string;
  content?: string | null;
  /** @format uuid */
  parentCommentId?: string | null;
  /** @format date-time */
  createdAt?: string;
  isActive?: boolean;
}

export interface CourseDetailForGuestDto {
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  teacherId?: string;
  /** @format uuid */
  subjectId?: string;
  subjectCode?: string | null;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  slug?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  learnerCount?: number;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number | null;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  objectives?: CourseObjectiveDto[] | null;
  requirements?: CourseRequirementDto[] | null;
  modules?: GuestLessonDetailDtoModuleDetailDto[] | null;
  comments?: CourseCommentDto[] | null;
  tags?: CourseTagDto[] | null;
  ratings?: CourseRatingDto[] | null;
  /** @format int32 */
  ratingsCount?: number;
  /** @format double */
  ratingsAverage?: number;
  isWishlist?: boolean;
  isEnrolled?: boolean;
}

export interface CourseDetailForLectureDto {
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  teacherId?: string;
  /** @format uuid */
  subjectId?: string;
  subjectCode?: string | null;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  slug?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  learnerCount?: number;
  courseIntroVideoUrl?: string | null;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number | null;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  objectives?: CourseObjectiveDto[] | null;
  requirements?: CourseRequirementDto[] | null;
  audiences?: CourseAudienceDto[] | null;
  tags?: CourseTagDto[] | null;
  modules?: ModuleDetailForLectureDto[] | null;
  comments?: CourseCommentDto[] | null;
  ratings?: CourseRatingDto[] | null;
  /** @format int32 */
  ratingsCount?: number;
  /** @format double */
  ratingsAverage?: number;
}

export interface CourseDetailForStudentDto {
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  subjectId?: string;
  subjectCode?: string | null;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  slug?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  learnerCount?: number;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  objectives?: CourseObjectiveDto[] | null;
  requirements?: CourseRequirementDto[] | null;
  modules?: ModuleDetailForStudentDto[] | null;
  comments?: CourseCommentDto[] | null;
  tags?: CourseTagDto[] | null;
  ratings?: CourseRatingDto[] | null;
  /** @format int32 */
  ratingsCount?: number;
  /** @format double */
  ratingsAverage?: number;
  progress?: CourseProgressDto;
}

export interface CourseDto {
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  teacherId?: string;
  /** @format uuid */
  subjectId?: string;
  subjectCode?: string | null;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  slug?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  learnerCount?: number;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number | null;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  tags?: CourseTagDto[] | null;
  isWishlist?: boolean;
  isEnrolled?: boolean;
}

export interface CourseDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number | null;
  /** @format int32 */
  pageSize?: number | null;
  /** @format int64 */
  totalCount?: number;
  data?: CourseDto[] | null;
  /** @format int32 */
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface CourseLessonDashboardContract {
  /** @format uuid */
  studentId?: string;
  /** @format uuid */
  courseId?: string;
  modules?: CourseLessonModuleGroup[] | null;
  totals?: CourseLessonTotals;
}

export interface CourseLessonItem {
  /** @format uuid */
  lessonId?: string;
  title?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  videoUrl?: string | null;
  status?: LessonStatus;
  /** @format int32 */
  currentSecond?: number | null;
  /** @format int32 */
  videoDurationSeconds?: number;
  /** @format int32 */
  actualStudyMinutes?: number;
  /** @format double */
  percentWatched?: number;
  /** @format int32 */
  lessonQuizCount?: number;
  /** @format double */
  averageQuizScore?: number | null;
  /** @format date-time */
  startedAtUtc?: string | null;
  /** @format date-time */
  completedAtUtc?: string | null;
  /** @format date-time */
  updatedAtUtc?: string | null;
}

export interface CourseLessonModuleGroup {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string | null;
  /** @format int32 */
  positionIndex?: number;
  lessons?: CourseLessonItem[] | null;
}

export interface CourseLessonTotals {
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
  averageQuizScore?: number | null;
}

export interface CourseModuleDashboardContract {
  /** @format uuid */
  studentId?: string;
  /** @format uuid */
  courseId?: string;
  modules?: CourseModuleDashboardItem[] | null;
  totals?: CourseModuleDashboardTotals;
}

export interface CourseModuleDashboardItem {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string | null;
  /** @format int32 */
  positionIndex?: number;
  /** @format int32 */
  level?: number | null;
  isCore?: boolean;
  description?: string | null;
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
  averageQuizScore?: number | null;
  /** @format date-time */
  startedAtUtc?: string | null;
  /** @format date-time */
  completedAtUtc?: string | null;
  /** @format date-time */
  updatedAtUtc?: string;
}

export interface CourseModuleDashboardTotals {
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
}

export interface CourseObjectiveDto {
  /** @format uuid */
  objectiveId?: string;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CourseProgressDto {
  /** @format int32 */
  lessonsTotal?: number;
  /** @format int32 */
  lessonsCompleted?: number;
  /** @format double */
  percentCompleted?: number;
  /** @format int32 */
  status?: number;
  /** @format date-time */
  startedAt?: string | null;
  /** @format date-time */
  completedAt?: string | null;
}

export interface CourseRatingDto {
  /** @format uuid */
  ratingId?: string;
  /** @format uuid */
  userId?: string;
  /** @format int32 */
  rating?: number;
  /** @format date-time */
  createdAt?: string;
}

export interface CourseRequirementDto {
  /** @format uuid */
  requirementId?: string;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CourseTagDetailsDto {
  /** @format int64 */
  courseTagId?: number;
  tagName?: string | null;
}

export interface CourseTagDto {
  /** @format int64 */
  tagId?: number;
  tagName?: string | null;
}

export interface CreateCommentBody {
  content?: string | null;
}

export interface CreateCommentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseCommentDetailsDto;
}

export interface CreateCourseAudienceDto {
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CreateCourseCommand {
  payload?: CreateCourseDto;
}

export interface CreateCourseDto {
  /** @format uuid */
  subjectId?: string;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  slug?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format int32 */
  level?: number | null;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number | null;
  courseIntroVideoUrl?: string | null;
  isActive?: boolean;
  objectives?: CreateCourseObjectiveDto[] | null;
  requirements?: CreateCourseRequirementDto[] | null;
  courseTags?: CreateCourseTagDto[] | null;
  audiences?: CreateCourseAudienceDto[] | null;
  modules?: CreateModuleDto[] | null;
}

export interface CreateCourseObjectiveDto {
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CreateCourseRequirementDto {
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CreateCourseResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface CreateCourseTagDto {
  /** @format int64 */
  tagId?: number;
}

export interface CreateLessonDto {
  title?: string | null;
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  lessonQuiz?: CreateQuizDto;
}

export interface CreateLessonTranscriptCommand {
  /** @format uuid */
  lessonId?: string;
  language?: string | null;
  /** @format int32 */
  status?: number;
  textFull?: string | null;
  vttUrl?: string | null;
  vttPublicId?: string | null;
  error?: string | null;
}

export interface CreateLessonTranscriptResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface CreateMajorCommand {
  createMajorDto?: CreateMajorDto;
}

export interface CreateMajorDto {
  majorCode?: string | null;
  majorName?: string | null;
  description?: string | null;
}

export interface CreateMajorResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface CreateMajorCommand {
  createMajorDto?: CreateMajorDto;
}

export interface CreateMajorDto {
  majorCode?: string | null;
  majorName?: string | null;
  description?: string | null;
}

export interface CreateMajorResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface CreateModuleDiscussionDto {
  title?: string | null;
  description?: string | null;
  discussionQuestion?: string | null;
  isActive?: boolean;
}

export interface CreateModuleDto {
  moduleName?: string | null;
  description?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCore?: boolean;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format int32 */
  level?: number | null;
  objectives?: CreateModuleObjectiveDto[] | null;
  lessons?: CreateLessonDto[] | null;
  discussions?: CreateModuleDiscussionDto[] | null;
  materials?: CreateModuleMaterialDto[] | null;
  moduleQuiz?: CreateQuizDto;
}

export interface CreateModuleMaterialDto {
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  isActive?: boolean;
}

export interface CreateModuleObjectiveDto {
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface CreateNoteDto {
  /** @format int32 */
  timeSeconds?: number;
  content?: string | null;
}

export interface CreateNoteResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface CreateQuizDto {
  quizSettings?: CreateQuizSettingsDto;
  questions?: Questions[] | null;
}

export interface CreateQuizSettingsDto {
  /** @format int32 */
  durationMinutes?: number;
  /** @format int32 */
  passingScorePercentage?: number;
  shuffleQuestions?: boolean;
  showResultsImmediately?: boolean;
  allowRetake?: boolean;
}

export interface CreateSubjectCommand {
  createSubjectDto?: CreateSubjectDto;
}

export interface CreateSubjectDto {
  subjectCode?: string | null;
  subjectName?: string | null;
}

export interface CreateSubjectResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface CreateSubjectCommand {
  createSubjectDto?: CreateSubjectDto;
}

export interface CreateSubjectDto {
  subjectCode?: string | null;
  subjectName?: string | null;
}

export interface CreateSubjectResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface DeleteCourseResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface DeleteNoteResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface DetailError {
  field?: string | null;
  messageId?: string | null;
  errorMessage?: string | null;
}

export interface DiscussionCommentDto {
  /** @format uuid */
  commentId?: string;
  /** @format uuid */
  parentCommentId?: string | null;
  /** @format uuid */
  discussionId?: string;
  /** @format uuid */
  userId?: string;
  userDisplayName?: string | null;
  content?: string | null;
  /** @format date-time */
  createdAt?: string;
  replies?: DiscussionCommentDto[] | null;
}

export interface DiscussionCommentDtoPagedResult {
  items?: DiscussionCommentDto[] | null;
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

export interface EnrollInCourseResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface GetCourseByIdForGuestResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDetailForGuestDto;
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
}

export interface GetCourseByIdForLectureResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDetailForLectureDto;
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
}

export interface GetCourseBySlugForGuestResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDetailForGuestDto;
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
}

export interface GetCourseBySlugForLectureResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDetailForLectureDto;
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
}

export interface GetCourseCommentsResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseCommentDetailsDtoPagedResult;
}

export interface GetCourseLessonDashboardEventResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseLessonDashboardContract;
}

export interface GetCourseModuleDashboardEventResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseModuleDashboardContract;
}

export interface GetCourseTagsResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseTagDetailsDto[] | null;
}

export interface GetCoursesByTeacherIdResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDtoPaginatedResult;
}

export interface GetCoursesResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDtoPaginatedResult;
}

export interface GetDetailsProgressByCourseIdForStudentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDetailForStudentDto;
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
}

export interface GetDetailsProgressByCourseSlugForStudentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDetailForStudentDto;
  /** @format int32 */
  modulesCount?: number;
  /** @format int32 */
  lessonsCount?: number;
}

export interface GetDiscussionThreadResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: DiscussionCommentDtoPagedResult;
}

export interface GetInProgressCourseByStudentIdResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: InProgressCourseDto[] | null;
}

export interface GetLessonNotesResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: LessonNoteDtoPagedResult;
}

export interface GetMyLearningCoursesResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: MyLearningCourseItemDtoPaginatedResult;
}

export interface GetMyWishlistResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: WishlistItemDtoPagedResult;
}

export interface GuestLessonDetailDto {
  /** @format uuid */
  lessonId?: string;
  title?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface GuestLessonDetailDtoModuleDetailDto {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string | null;
  description?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCore?: boolean;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  objectives?: ModuleObjectiveDto[] | null;
  lessons?: GuestLessonDetailDto[] | null;
}

export interface InProgressCourseDto {
  /** @format uuid */
  courseId?: string;
  title?: string | null;
  shortDescription?: string | null;
  courseImageUrl?: string | null;
  /** @format double */
  durationHours?: number | null;
  /** @format date-time */
  startedAt?: string;
}

export interface InProgressCourseDto {
  /** @format uuid */
  courseId?: string;
  title?: string | null;
  shortDescription?: string | null;
  courseImageUrl?: string | null;
  /** @format double */
  durationHours?: number | null;
  /** @format date-time */
  startedAt?: string;
}

export interface LectureLessonDetailDto {
  /** @format uuid */
  lessonId?: string;
  title?: string | null;
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  lessonQuiz?: QuizOutDto;
}

export interface LessonNoteDto {
  /** @format uuid */
  noteId?: string;
  /** @format uuid */
  lessonId?: string;
  /** @format int32 */
  timeSeconds?: number;
  content?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updateddAt?: string;
}

export interface LessonNoteDtoPagedResult {
  items?: LessonNoteDto[] | null;
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

export interface ModuleDetailForLectureDto {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string | null;
  description?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCore?: boolean;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  objectives?: ModuleObjectiveDto[] | null;
  moduleDiscussionDetails?: ModuleDiscussionDetailDto[] | null;
  moduleMaterialDetails?: ModuleMaterialDetailDto[] | null;
  lessons?: LectureLessonDetailDto[] | null;
  moduleQuiz?: QuizOutDto;
}

export interface ModuleDetailForStudentDto {
  /** @format uuid */
  moduleId?: string;
  moduleName?: string | null;
  description?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCore?: boolean;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format double */
  durationHours?: number | null;
  /** @format int32 */
  level?: number | null;
  objectives?: ModuleObjectiveDto[] | null;
  moduleDiscussionDetails?: ModuleDiscussionDetailDto[] | null;
  moduleMaterialDetails?: ModuleMaterialDetailDto[] | null;
  lessons?: StudentLessonDetailDto[] | null;
  moduleQuiz?: QuizOutDto;
  canAttempt?: boolean;
  /** @format uuid */
  studentQuizResultId?: string | null;
  progress?: ModuleProgressDto;
}

export interface ModuleDiscussionDetailDto {
  /** @format uuid */
  discussionId?: string;
  title?: string | null;
  description?: string | null;
  discussionQuestion?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string | null;
}

export interface ModuleMaterialDetailDto {
  /** @format uuid */
  materialId?: string;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface ModuleObjectiveDto {
  /** @format uuid */
  objectiveId?: string;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface ModuleProgressDto {
  /** @format int32 */
  lessonsTotal?: number;
  /** @format int32 */
  lessonsCompleted?: number;
  /** @format double */
  percentCompleted?: number;
  /** @format int32 */
  status?: number;
  /** @format date-time */
  startedAt?: string | null;
  /** @format date-time */
  completedAt?: string | null;
}

export interface MyLearningCourseItemDto {
  /** @format uuid */
  courseId?: string;
  title?: string | null;
  slug?: string | null;
  imageUrl?: string | null;
  /** @format double */
  percentCompleted?: number;
  /** @format int32 */
  lessonsTotal?: number;
  /** @format int32 */
  lessonsCompleted?: number;
  /** @format date-time */
  startedAt?: string | null;
  /** @format date-time */
  completedAt?: string | null;
  /** @format date-time */
  lastUpdatedAt?: string;
  status?: CourseProgressStatus;
}

export interface MyLearningCourseItemDtoPaginatedResult {
  /** @format int32 */
  pageIndex?: number | null;
  /** @format int32 */
  pageSize?: number | null;
  /** @format int64 */
  totalCount?: number;
  data?: MyLearningCourseItemDto[] | null;
  /** @format int32 */
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface PostCommentRequest {
  content?: string | null;
}

export interface PostDiscussionCommentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface Questions {
  /** @format int32 */
  questionType?: number;
  questionText?: string | null;
  options?: Answers[] | null;
  explanation?: string | null;
}

export interface QuizAnswerOutDto {
  /** @format uuid */
  answerId?: string;
  answerText?: string | null;
  isCorrect?: boolean | null;
}

export interface QuizOutDto {
  /** @format uuid */
  quizId?: string;
  quizSettings?: QuizSettingsOutDto;
  questions?: QuizQuestionOutDto[] | null;
}

export interface QuizQuestionOutDto {
  /** @format uuid */
  questionId?: string;
  questionText?: string | null;
  explanation?: string | null;
  /** @format int32 */
  questionType?: number;
  answers?: QuizAnswerOutDto[] | null;
}

export interface QuizSettingsOutDto {
  /** @format int32 */
  durationMinutes?: number;
  /** @format int32 */
  passingScorePercentage?: number;
  shuffleQuestions?: boolean;
  showResultsImmediately?: boolean;
  allowRetake?: boolean;
}

export interface RemoveFromWishlistResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface ReplyCommentRequest {
  content?: string | null;
}

export interface ReplyDiscussionCommentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface ReplyToCommentResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseCommentDetailsDto;
}

export interface StudentLessonDetailDto {
  /** @format uuid */
  lessonId?: string;
  title?: string | null;
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  /** @format int32 */
  lastSeenPositionSec?: number;
  canAttempt?: boolean;
  /** @format uuid */
  studentQuizResultId?: string | null;
  lessonQuiz?: QuizOutDto;
}

export interface UpdateCourseAudienceDto {
  /** @format uuid */
  audienceId?: string | null;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateCourseCommand {
  /** @format uuid */
  courseId?: string;
  payload?: UpdateCourseDto;
}

export interface UpdateCourseDto {
  /** @format uuid */
  teacherId?: string;
  /** @format uuid */
  subjectId?: string;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  slug?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format int32 */
  level?: number | null;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number | null;
  isActive?: boolean;
  objectives?: UpdateCourseObjectiveDto[] | null;
  requirements?: UpdateCourseRequirementDto[] | null;
  audiences?: UpdateCourseAudienceDto[] | null;
  courseTags?: UpdateCourseTagDto[] | null;
}

export interface UpdateCourseLessonDto {
  /** @format uuid */
  lessonId?: string | null;
  title?: string | null;
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateCourseModuleDto {
  /** @format uuid */
  moduleId?: string | null;
  moduleName?: string | null;
  description?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCore?: boolean;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format int32 */
  level?: number | null;
  objectives?: UpdateCourseModuleObjectiveDto[] | null;
  lessons?: UpdateCourseLessonDto[] | null;
  discussions?: UpdateModuleDiscussionDto[] | null;
  materials?: UpdateModuleMaterialDto[] | null;
}

export interface UpdateCourseModuleObjectiveDto {
  /** @format uuid */
  objectiveId?: string | null;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateCourseModulesCommand {
  /** @format uuid */
  courseId?: string;
  updateCourseModules?: UpdateCourseModulesDto;
}

export interface UpdateCourseModulesDto {
  modules?: UpdateCourseModuleDto[] | null;
}

export interface UpdateCourseModulesResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface UpdateCourseObjectiveDto {
  /** @format uuid */
  objectiveId?: string | null;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateCourseRequirementDto {
  /** @format uuid */
  requirementId?: string | null;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateCourseResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface UpdateCourseTagDto {
  /** @format int64 */
  tagId?: number;
}

export interface UpdateLessonDto {
  /** @format uuid */
  lessonId?: string | null;
  title?: string | null;
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateModuleCommand {
  /** @format uuid */
  moduleId?: string;
  updateModuleDto?: UpdateModuleDto;
}

export interface UpdateModuleDiscussionDto {
  /** @format uuid */
  discussionId?: string | null;
  title?: string | null;
  description?: string | null;
  discussionQuestion?: string | null;
  isActive?: boolean;
}

export interface UpdateModuleDto {
  /** @format uuid */
  moduleId?: string | null;
  moduleName?: string | null;
  description?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
  isCore?: boolean;
  /** @format int32 */
  durationMinutes?: number | null;
  /** @format int32 */
  level?: number | null;
  objectives?: UpdateModuleObjectiveDto[] | null;
  lessons?: UpdateLessonDto[] | null;
  discussions?: UpdateModuleDiscussionDto[] | null;
  materials?: UpdateModuleMaterialDto[] | null;
}

export interface UpdateModuleMaterialDto {
  /** @format uuid */
  materialId?: string | null;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  isActive?: boolean;
}

export interface UpdateModuleObjectiveDto {
  /** @format uuid */
  objectiveId?: string | null;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface UpdateModuleResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: string | null;
}

export interface UpdateNoteDto {
  content?: string | null;
}

export interface UpdateNoteResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: boolean;
}

export interface UpsertUserLessonProgressCommand {
  /** @format uuid */
  lessonId?: string;
  userLessonProgress?: UpsertUserLessonProgressDto;
}

export interface UpsertUserLessonProgressDto {
  /** @format int32 */
  lastSeenPositionSec?: number | null;
  /** @format int32 */
  watchedDeltaSec?: number | null;
}

export interface UpsertUserLessonProgressResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: UserLessonProgressEntity;
}

export interface UserLessonProgressEntity {
  /** @format uuid */
  lessonId?: string;
  /** @format int32 */
  status?: number;
  /** @format int32 */
  lastPositionSec?: number;
  /** @format int32 */
  durationWatchedSec?: number;
  /** @format date-time */
  completedAt?: string | null;
}

export interface WishlistItemDto {
  /** @format uuid */
  wishlistId?: string;
  /** @format uuid */
  courseId?: string;
  courseTitle?: string | null;
  courseDescription?: string | null;
  courseShortDescription?: string | null;
  courseImageUrl?: string | null;
  /** @format int32 */
  courseLevel?: number | null;
  /** @format double */
  coursePrice?: number;
  /** @format double */
  courseDealPrice?: number | null;
  courseSlug?: string | null;
  isActive?: boolean;
  /** @format date-time */
  createdAt?: string;
}

export interface WishlistItemDtoPagedResult {
  items?: WishlistItemDto[] | null;
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
  public baseUrl: string = "/course";
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
 * @title Course Service Swagger
 * @version v1
 * @baseUrl /course
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags CourseComments
     * @name CourseCommentsCreate
     * @summary Create a comment (root)
     * @request POST:/api/CourseComments
     * @secure
     */
    courseCommentsCreate: (
      data: CreateCommentBody,
      query?: {
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CreateCommentResponse, any>({
        path: `/api/CourseComments`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseComments
     * @name CourseCommentsList
     * @summary List comments
     * @request GET:/api/CourseComments
     * @secure
     */
    courseCommentsList: (
      query?: {
        /** @format uuid */
        courseId?: string;
        /** @format int32 */
        page?: number;
        /** @format int32 */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseCommentsResponse, any>({
        path: `/api/CourseComments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseComments
     * @name CourseCommentsRepliesCreate
     * @summary Reply to a comment
     * @request POST:/api/CourseComments/{parentCommentId}/replies
     * @secure
     */
    courseCommentsRepliesCreate: (
      parentCommentId: string,
      data: CreateCommentBody,
      query?: {
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReplyToCommentResponse, any>({
        path: `/api/CourseComments/${parentCommentId}/replies`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseWishlist
     * @name CourseWishlistCreate
     * @summary Add course to my wishlist
     * @request POST:/api/CourseWishlist
     * @secure
     */
    courseWishlistCreate: (
      query?: {
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AddToWishlistResponse, any>({
        path: `/api/CourseWishlist`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseWishlist
     * @name CourseWishlistList
     * @summary Get my wishlist
     * @request GET:/api/CourseWishlist
     * @secure
     */
    courseWishlistList: (
      query?: {
        /**
         * @format int32
         * @default 1
         */
        Page?: number;
        /**
         * @format int32
         * @default 10
         */
        Size?: number;
        Search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetMyWishlistResponse, any>({
        path: `/api/CourseWishlist`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CourseWishlist
     * @name CourseWishlistDelete
     * @summary Remove course from my wishlist
     * @request DELETE:/api/CourseWishlist
     * @secure
     */
    courseWishlistDelete: (
      query?: {
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RemoveFromWishlistResponse, any>({
        path: `/api/CourseWishlist`,
        method: "DELETE",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lesson
     * @name LessonCreate
     * @request POST:/api/Lesson
     * @secure
     */
    lessonCreate: (
      data: CreateLessonTranscriptCommand,
      params: RequestParams = {},
    ) =>
      this.request<CreateLessonTranscriptResponse, any>({
        path: `/api/Lesson`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a lesson note at a specific time in the lesson
     *
     * @tags LessonNotes
     * @name LessonNotesCreate
     * @summary Create a lesson note
     * @request POST:/api/LessonNotes
     * @secure
     */
    lessonNotesCreate: (
      data: CreateNoteDto,
      query?: {
        /** @format uuid */
        lessonId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CreateNoteResponse, any>({
        path: `/api/LessonNotes`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get lesson notes by lesson id with pagination
     *
     * @tags LessonNotes
     * @name LessonNotesList
     * @summary Get lesson notes by lesson id - Not implemented yet
     * @request GET:/api/LessonNotes
     * @secure
     */
    lessonNotesList: (
      query?: {
        /** @format uuid */
        lessonId?: string;
        /** @format int32 */
        page?: number;
        /** @format int32 */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLessonNotesResponse, any>({
        path: `/api/LessonNotes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ModuleDiscussionComments
     * @name ModuleDiscussionCommentsCreate
     * @request POST:/api/ModuleDiscussionComments/{moduleId}
     * @secure
     */
    moduleDiscussionCommentsCreate: (
      moduleId: string,
      data: PostCommentRequest,
      params: RequestParams = {},
    ) =>
      this.request<PostDiscussionCommentResponse, any>({
        path: `/api/ModuleDiscussionComments/${moduleId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ModuleDiscussionComments
     * @name ModuleDiscussionCommentsReplyCreate
     * @request POST:/api/ModuleDiscussionComments/{moduleId}/{parentId}/reply
     * @secure
     */
    moduleDiscussionCommentsReplyCreate: (
      moduleId: string,
      parentId: string,
      data: ReplyCommentRequest,
      params: RequestParams = {},
    ) =>
      this.request<ReplyDiscussionCommentResponse, any>({
        path: `/api/ModuleDiscussionComments/${moduleId}/${parentId}/reply`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Enroll the authenticated user in the specified course
     *
     * @tags StudentLessonProgress
     * @name StudentLessonProgressEnrollmentCreate
     * @summary Enroll the current user in a course
     * @request POST:/api/StudentLessonProgress/{courseId}/enrollment
     * @secure
     */
    studentLessonProgressEnrollmentCreate: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<EnrollInCourseResponse, any>({
        path: `/api/StudentLessonProgress/${courseId}/enrollment`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Check if the authenticated user is enrolled in the specified course
     *
     * @tags StudentLessonProgress
     * @name StudentLessonProgressEnrollmentList
     * @summary Check if current user is enrolled in a course
     * @request GET:/api/StudentLessonProgress/{courseId}/enrollment
     * @secure
     */
    studentLessonProgressEnrollmentList: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<CheckEnrollmentResponse, any>({
        path: `/api/StudentLessonProgress/${courseId}/enrollment`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Tạo mới chuyên ngành. Cần xác thực Bearer.
     *
     * @tags Syllabus
     * @name SyllabusCreateMajorProcessCreate
     * @summary Tạo mới chuyên ngành
     * @request POST:/api/Syllabus/CreateMajorProcess
     * @secure
     */
    syllabusCreateMajorProcessCreate: (
      data: CreateMajorCommand,
      params: RequestParams = {},
    ) =>
      this.request<CreateMajorResponse, any>({
        path: `/api/Syllabus/CreateMajorProcess`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Tạo mới môn học. Cần xác thực Bearer.
     *
     * @tags Syllabus
     * @name SyllabusCreateSubjectProcessCreate
     * @summary Tạo mới môn học
     * @request POST:/api/Syllabus/CreateSubjectProcess
     * @secure
     */
    syllabusCreateSubjectProcessCreate: (
      data: CreateSubjectCommand,
      params: RequestParams = {},
    ) =>
      this.request<CreateSubjectResponse, any>({
        path: `/api/Syllabus/CreateSubjectProcess`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new course with its modules, lessons, and tags. Course tags are optional and can be used to categorize courses.
     *
     * @tags Courses
     * @name V1CoursesCreate
     * @summary Create a new course
     * @request POST:/api/v1/Courses
     * @secure
     */
    v1CoursesCreate: (data: CreateCourseCommand, params: RequestParams = {}) =>
      this.request<CreateCourseResponse, any>({
        path: `/api/v1/Courses`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a paginated list of courses with optional filtering by title, category, or instructor.
     *
     * @tags Courses
     * @name V1CoursesList
     * @summary Get list of courses with pagination and optional filtering
     * @request GET:/api/v1/Courses
     * @secure
     */
    v1CoursesList: (
      query?: {
        /** @format int32 */
        "Pagination.PageIndex"?: number;
        /** @format int32 */
        "Pagination.PageSize"?: number;
        "Filter.Search"?: string;
        "Filter.SubjectCode"?: string;
        "Filter.IsActive"?: boolean;
        /** @format uuid */
        "Filter.LectureId"?: string;
        "Filter.SortBy"?: CourseSortBy;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCoursesResponse, any>({
        path: `/api/v1/Courses`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ModuleDiscussionComments
     * @name ModulesDiscussionThreadList
     * @summary Not implemented yet
     * @request GET:/api/modules/{moduleId}/discussion/thread
     * @secure
     */
    modulesDiscussionThreadList: (
      moduleId: string,
      query?: {
        /** @format int32 */
        page?: number;
        /** @format int32 */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetDiscussionThreadResponse, any>({
        path: `/api/modules/${moduleId}/discussion/thread`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific course by its ID, including modules and lessons, accessible to students.
     *
     * @tags StudentLessonProgress
     * @name StudentLessonProgressDetail
     * @summary Get course progress details by ID for students
     * @request GET:/api/StudentLessonProgress/{courseId}
     * @secure
     */
    studentLessonProgressDetail: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<GetDetailsProgressByCourseIdForStudentResponse, any>({
        path: `/api/StudentLessonProgress/${courseId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific course by its slug, including modules and lessons, accessible to students.
     *
     * @tags StudentLessonProgress
     * @name StudentLessonProgressDetail2
     * @summary Get course progress details by slug for students
     * @request GET:/api/StudentLessonProgress/{courseSlug}
     * @originalName studentLessonProgressDetail
     * @duplicate
     * @secure
     */
    studentLessonProgressDetail2: (
      courseSlug: string,
      params: RequestParams = {},
    ) =>
      this.request<GetDetailsProgressByCourseSlugForStudentResponse, any>({
        path: `/api/StudentLessonProgress/${courseSlug}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a list of courses that the authenticated student is currently learning.
     *
     * @tags StudentLessonProgress
     * @name StudentLessonProgressInProgressCoursesList
     * @summary Get my learning courses
     * @request GET:/api/StudentLessonProgress/in-progress-courses
     * @secure
     */
    studentLessonProgressInProgressCoursesList: (
      query?: {
        /**
         * @format int32
         * @default 1
         */
        Page?: number;
        /**
         * @format int32
         * @default 10
         */
        Size?: number;
        Search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetMyLearningCoursesResponse, any>({
        path: `/api/StudentLessonProgress/in-progress-courses`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the module dashboard information for a specific student and course
     *
     * @tags Tests
     * @name TestsList
     * @summary Get course module dashboard for a student
     * @request GET:/api/Tests
     * @secure
     */
    testsList: (
      query?: {
        /** @format uuid */
        studentId?: string;
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseModuleDashboardEventResponse, any>({
        path: `/api/Tests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tests
     * @name TestsProcessGetCourseLessonDashboardList
     * @request GET:/api/Tests/ProcessGetCourseLessonDashboard
     * @secure
     */
    testsProcessGetCourseLessonDashboardList: (
      query?: {
        /** @format uuid */
        studentId?: string;
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCourseLessonDashboardEventResponse, any>({
        path: `/api/Tests/ProcessGetCourseLessonDashboard`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific course by its ID, including modules and lessons, accessible to guest users.
     *
     * @tags Courses
     * @name V1CoursesDetail
     * @summary Get course details by ID for guest users
     * @request GET:/api/v1/Courses/{id}
     * @secure
     */
    v1CoursesDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetCourseByIdForGuestResponse, any>({
        path: `/api/v1/Courses/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing course (only course details, not modules or lessons)
     *
     * @tags Courses
     * @name V1CoursesUpdate
     * @summary Update an existing course
     * @request PUT:/api/v1/Courses/{id}
     * @secure
     */
    v1CoursesUpdate: (
      id: string,
      data: UpdateCourseCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCourseResponse, any>({
        path: `/api/v1/Courses/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific course by its ID, including modules and lessons, accessible to lectures.
     *
     * @tags Courses
     * @name V1CoursesAuthDetail
     * @summary Get course details by ID for lectures
     * @request GET:/api/v1/Courses/auth/{id}
     * @secure
     */
    v1CoursesAuthDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetCourseByIdForLectureResponse, any>({
        path: `/api/v1/Courses/auth/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific course by its slug, including modules and lessons, accessible to lectures.
     *
     * @tags Courses
     * @name V1CoursesAuthSlugDetail
     * @summary Get course details by slug for lectures
     * @request GET:/api/v1/Courses/auth/slug/{slug}
     * @secure
     */
    v1CoursesAuthSlugDetail: (slug: string, params: RequestParams = {}) =>
      this.request<GetCourseBySlugForLectureResponse, any>({
        path: `/api/v1/Courses/auth/slug/${slug}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a list of courses that are currently in progress for a specific student.
     *
     * @tags Courses
     * @name V1CoursesGetInProgressCourseByStudentIdList
     * @summary Get in-progress courses by student ID
     * @request GET:/api/v1/Courses/GetInProgressCourseByStudentId
     * @secure
     */
    v1CoursesGetInProgressCourseByStudentIdList: (params: RequestParams = {}) =>
      this.request<GetInProgressCourseByStudentIdResponse, any>({
        path: `/api/v1/Courses/GetInProgressCourseByStudentId`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a paginated list of courses created by a specific teacher with optional filtering.
     *
     * @tags Courses
     * @name V1CoursesLectureList
     * @summary Get list of courses for lecture
     * @request GET:/api/v1/Courses/lecture
     * @secure
     */
    v1CoursesLectureList: (
      query?: {
        /** @format int32 */
        "Pagination.PageIndex"?: number;
        /** @format int32 */
        "Pagination.PageSize"?: number;
        "Filter.Search"?: string;
        "Filter.SubjectCode"?: string;
        "Filter.IsActive"?: boolean;
        /** @format uuid */
        "Filter.LectureId"?: string;
        "Filter.SortBy"?: CourseSortBy;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetCoursesByTeacherIdResponse, any>({
        path: `/api/v1/Courses/lecture`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific course by its slug, including modules and lessons, accessible to guest users.
     *
     * @tags Courses
     * @name V1CoursesSlugDetail
     * @summary Get course details by slug for guest users
     * @request GET:/api/v1/Courses/slug/{slug}
     * @secure
     */
    v1CoursesSlugDetail: (slug: string, params: RequestParams = {}) =>
      this.request<GetCourseBySlugForGuestResponse, any>({
        path: `/api/v1/Courses/slug/${slug}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve all available course tags
     *
     * @tags Courses
     * @name V1CoursesTagsList
     * @summary Get all course tags
     * @request GET:/api/v1/Courses/tags
     * @secure
     */
    v1CoursesTagsList: (params: RequestParams = {}) =>
      this.request<GetCourseTagsResponse, any>({
        path: `/api/v1/Courses/tags`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the content of a lesson note
     *
     * @tags LessonNotes
     * @name LessonNotesUpdate
     * @summary Update a lesson note
     * @request PUT:/api/LessonNotes/{noteId}
     * @secure
     */
    lessonNotesUpdate: (
      noteId: string,
      data: UpdateNoteDto,
      query?: {
        /** @format uuid */
        lessonId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UpdateNoteResponse, any>({
        path: `/api/LessonNotes/${noteId}`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a lesson note by its id
     *
     * @tags LessonNotes
     * @name LessonNotesDelete
     * @summary Delete a lesson note
     * @request DELETE:/api/LessonNotes/{noteId}
     * @secure
     */
    lessonNotesDelete: (
      noteId: string,
      query?: {
        /** @format uuid */
        lessonId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DeleteNoteResponse, any>({
        path: `/api/LessonNotes/${noteId}`,
        method: "DELETE",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a module within a course, including its objectives and lessons
     *
     * @tags Modules
     * @name ModulesUpdate
     * @summary Update a module within a course
     * @request PUT:/api/Modules/{id}
     * @secure
     */
    modulesUpdate: (
      id: string,
      data: UpdateModuleCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateModuleResponse, any>({
        path: `/api/Modules/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create or update the progress of a user in a specific lesson
     *
     * @tags StudentLessonProgress
     * @name StudentLessonProgressUpdate
     * @summary Upsert user lesson progress
     * @request PUT:/api/StudentLessonProgress
     * @secure
     */
    studentLessonProgressUpdate: (
      data: UpsertUserLessonProgressCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpsertUserLessonProgressResponse, any>({
        path: `/api/StudentLessonProgress`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update multiple modules in a course with its Objectives and Lessons
     *
     * @tags Courses
     * @name V1CoursesModulesUpdate
     * @summary Update multiple modules in a course
     * @request PUT:/api/v1/Courses/{courseId}/modules
     * @secure
     */
    v1CoursesModulesUpdate: (
      courseId: string,
      data: UpdateCourseModulesCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateCourseModulesResponse, any>({
        path: `/api/v1/Courses/${courseId}/modules`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a specific course by its ID. Only the lecturer who created the course can delete it.
     *
     * @tags Courses
     * @name V1CoursesDelete
     * @summary Delete a course by ID
     * @request DELETE:/api/v1/Courses/{courseId}
     * @secure
     */
    v1CoursesDelete: (courseId: string, params: RequestParams = {}) =>
      this.request<DeleteCourseResponse, any>({
        path: `/api/v1/Courses/${courseId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
