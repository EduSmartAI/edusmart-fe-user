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
  Value20 = 20,
  Value21 = 21,
  Value22 = 22,
  Value23 = 23,
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
export enum QuizScope {
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum ModuleProgressStatus {
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

export interface BasicLearningPathDto {
  subjectName?: string;
  semester?: string;
  courses?: CourseItemDto[];
}

export interface CourseItemDto {
  courseId?: string;
  /** @format int32 */
  semesterPosition?: number;
  subjectCode?: string;
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

export interface GetModuleDashboardEventResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: ModuleDashboardContract;
}

export interface InternalLearningPathDto {
  majorId?: string;
  majorCode?: string;
  reason?: string;
  /** @format int32 */
  positionIndex?: number;
  majorCourse?: CourseItemDto[];
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
  improvements?: string[];
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
  aiImprovements?: string[];
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

export interface RecommendedAction {
  title?: string;
  kind?: string;
  targetUrl?: string;
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

export interface SkillGap {
  skillTag?: string;
  /** @format int32 */
  level?: number;
  evidence?: string;
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

export interface TechnologyInsertCommand {
  technologyName?: string;
  description?: string;
  /** @format int32 */
  technologyType?: number;
}

export interface TechnologyInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface UpdateCourseStatusToSkippedCommand {
  /** @format uuid */
  learningPathCourseId: string;
}

export interface UpdateCourseStatusToSkippedResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
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
     * @description Cần cấp quyền Admin
     *
     * @tags LearningGoal
     * @name V1LearningGoalCreate
     * @summary Tạo mục tiêu học tập mới
     * @request POST:/api/v1/LearningGoal
     * @secure
     */
    v1LearningGoalCreate: (
      body: LearningGoalInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<LearningGoalInsertResponse, any>({
        path: `/api/v1/LearningGoal`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Trả về Learning Path theo tham số query. Cần xác thực Bearer.
     *
     * @tags LearningPaths
     * @name LearningPathsList
     * @summary Lấy Learning Path
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
     * @description Trả về Module Dashboard theo tham số query. Cần xác thực Bearer.
     *
     * @tags StudentDashboards
     * @name StudentDashboardsGetModuleDashboardResponseList
     * @summary Lấy Module Dashboard
     * @request GET:/api/StudentDashboards/GetModuleDashboardResponse
     * @secure
     */
    studentDashboardsGetModuleDashboardResponseList: (
      query?: {
        /** @format uuid */
        CourseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetModuleDashboardEventResponse, any>({
        path: `/api/StudentDashboards/GetModuleDashboardResponse`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Cần cấp quyền Admin
     *
     * @tags Technology
     * @name V1TechnologyInsertTechnologyCreate
     * @summary Thêm ngôn ngữ/ framework/ tool/ platform mới
     * @request POST:/api/v1/Technology/InsertTechnology
     * @secure
     */
    v1TechnologyInsertTechnologyCreate: (
      body: TechnologyInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<TechnologyInsertResponse, any>({
        path: `/api/v1/Technology/InsertTechnology`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
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
  };
}
