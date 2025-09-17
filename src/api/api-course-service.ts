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
export enum CourseSortBy {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
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
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number;
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
  modules?: LectureLessonDetailDtoModuleDetailDto[] | null;
  comments?: CourseCommentDto[] | null;
  tags?: CourseTagDto[] | null;
  ratings?: CourseRatingDto[] | null;
  /** @format int32 */
  ratingsCount?: number;
  /** @format double */
  ratingsAverage?: number;
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

export interface CourseObjectiveDto {
  /** @format uuid */
  objectiveId?: string;
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
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

export interface CourseTagDto {
  /** @format int64 */
  tagId?: number;
  tagName?: string | null;
}

export interface CreateCourseCommand {
  payload?: CreateCourseDto;
}

export interface CreateCourseDto {
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
  objectives?: CreateCourseObjectiveDto[] | null;
  requirements?: CreateCourseRequirementDto[] | null;
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

export interface CreateLessonDto {
  title?: string | null;
  videoUrl?: string | null;
  /** @format int32 */
  videoDurationSec?: number | null;
  /** @format int32 */
  positionIndex?: number;
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
}

export interface CreateModuleObjectiveDto {
  content?: string | null;
  /** @format int32 */
  positionIndex?: number;
  isActive?: boolean;
}

export interface DetailError {
  field?: string | null;
  messageId?: string | null;
  errorMessage?: string | null;
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

export interface GetCoursesResponse {
  success?: boolean;
  messageId?: string | null;
  message?: string | null;
  detailErrors?: DetailError[] | null;
  response?: CourseDtoPaginatedResult;
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
}

export interface LectureLessonDetailDtoModuleDetailDto {
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
  lessons?: LectureLessonDetailDto[] | null;
}

export interface ModuleObjectiveDto {
  /** @format uuid */
  objectiveId?: string;
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
     * @description Create a new course with its modules and lessons
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
     * @description Update a module within a course, including its objectives and lessons
     *
     * @tags Courses
     * @name V1CoursesModuleUpdate
     * @summary Update a module within a course
     * @request PUT:/api/v1/Courses/Module/{id}
     * @secure
     */
    v1CoursesModuleUpdate: (
      id: string,
      data: UpdateModuleCommand,
      params: RequestParams = {},
    ) =>
      this.request<UpdateModuleResponse, any>({
        path: `/api/v1/Courses/Module/${id}`,
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
  };
}
