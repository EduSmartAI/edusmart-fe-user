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
export enum QuizScope {
  Value1 = 1,
  Value2 = 2,
}

export interface AIChatBotRequest {
  request?: ChatRequestDto;
}

export interface AIChatBotResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: ChatResponseDto;
}

export interface AiEvaluateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: EvaluateResult;
  /** @format uuid */
  learningPathId?: string;
}

export interface AiEvaluateTempRequest {
  careerGoal?: string;
  knownFrameworks?: string[];
  knownLanguages?: string[];
  externalLimitTime?: string;
  /** @format int32 */
  kRetrieval?: number;
  /** @format int32 */
  scoreThreshold?: number;
  identityEntity?: IdentityEntity;
  /** @format uuid */
  learningPathId?: string;
  /** @format uuid */
  semesterId?: string;
  /** @format int32 */
  studentLevel?: number;
}

export interface AiEvaluationDto {
  /** @format int32 */
  score100?: number;
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

export interface AiExternalCourseRequest {
  goal_major?: string;
  learningPathId?: string;
  currentUserEmail?: string;
  majorCode?: string;
  reason?: string;
}

export interface AiExternalCourseResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AskResponse;
}

export interface AiSearchRequest {
  topic?: string;
}

export interface AiSearchResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface AnswerResult {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
  isCorrectAnswer?: boolean;
  selectedByStudent?: boolean;
}

export interface AskResponse {
  answer?: string;
  roadmap?: RoadmapPayload;
}

export interface ChatHistoryItem {
  role?: string;
  content?: string;
}

export interface ChatRequestDto {
  message?: string;
  /** @format uuid */
  lessionId?: string;
  history?: ChatHistoryItem[];
}

export interface ChatResponseDto {
  reply?: string;
  rawFinishReason?: string;
}

export interface CreateTranscriptCommand {
  createTranscriptionReq?: CreateTranscriptionReq;
}

export interface CreateTranscriptResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: TranscriptResult;
}

export interface CreateTranscriptionReq {
  lessonId?: string;
  videoUrl?: string;
  language?: string;
  /** @format double */
  durationSec?: number;
}

export interface DetailError {
  field?: string;
  messageId?: string;
  errorMessage?: string;
}

export interface EvaluateResult {
  inputs?: any;
  evaluations?: MajorEvaluation[];
  matched?: MajorEvaluation[];
  externalSuggestions?: ExternalSuggestion[];
}

export interface ExternalSuggestion {
  major_code?: string;
  major_name?: string;
  description?: string;
  why_for_you?: string;
}

export interface IdentityEntity {
  /** @format uuid */
  userId?: string;
  email?: string;
  fullName?: string;
  roleName?: string;
}

export interface MajorEvaluation {
  major_code?: string;
  major_name?: string;
  supports?: boolean;
  /** @format int32 */
  support_score?: number;
  reasons?: string;
}

export interface QuestionResult {
  /** @format uuid */
  questionId?: string;
  questionText?: string;
  /** @format int32 */
  questionType?: number;
  explanation?: string;
  answers?: AnswerResult[];
}

export interface QuizEvaluableCreatedEvent {
  /** @format uuid */
  eventId?: string;
  /** @format uuid */
  attemptId?: string;
  /** @format uuid */
  quizId?: string;
  scope?: QuizScope;
  /** @format uuid */
  scopeId?: string;
  /** @format uuid */
  courseId?: string;
  /** @format uuid */
  userId?: string;
  /** @format int32 */
  totalQuestions?: number;
  /** @format int32 */
  totalCorrectAnswers?: number;
  /** @format int32 */
  score100Raw?: number;
  questions?: QuestionResult[];
  /** @format date-time */
  occurredAtUtc?: string;
}

export interface QuizEvaluateResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: AiEvaluationDto;
}

export interface RecommendedAction {
  title?: string;
  kind?: string;
  targetUrl?: string;
}

export interface RoadmapPayload {
  roadmap_title?: string;
  steps?: RoadmapStepPayload[];
}

export interface RoadmapStepPayload {
  title?: string;
  /** @format int32 */
  duration_weeks?: number;
  objectives?: string[];
  suggested_courses?: SuggestedCoursePayload[];
}

export interface Segment {
  /** @format double */
  start?: number;
  /** @format double */
  end?: number;
  text?: string;
}

export interface SkillGap {
  skillTag?: string;
  /** @format int32 */
  level?: number;
  evidence?: string;
}

export interface SuggestedCoursePayload {
  title?: string;
  link?: string;
  provider?: string;
  reason?: string;
  level?: string;
  rating?: string;
  /** @format int32 */
  est_duration_weeks?: number;
}

export interface TranscriptResult {
  lessonId?: string;
  status?: string;
  language?: string;
  text?: string;
  segments?: Segment[];
  words?: Word[];
  error?: string;
  vttUrl?: string;
  vttPublicId?: string;
}

export interface Word {
  /** @format double */
  start?: number;
  /** @format double */
  end?: number;
  text?: string;
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
  public baseUrl: string = "/ai";
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
 * @title AI Service Swagger
 * @version v1
 * @baseUrl /ai
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags AIChatBots
     * @name AiChatBotsCreate
     * @request POST:/api/AIChatBots
     * @secure
     */
    aiChatBotsCreate: (body: AIChatBotRequest, params: RequestParams = {}) =>
      this.request<AIChatBotResponse, any>({
        path: `/api/AIChatBots`,
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
     * @name AiQuizEvaluateEvaluateCreate
     * @request POST:/api/AiQuizEvaluate/evaluate
     * @secure
     */
    aiQuizEvaluateEvaluateCreate: (
      body: QuizEvaluableCreatedEvent,
      params: RequestParams = {},
    ) =>
      this.request<QuizEvaluateResponse, any>({
        path: `/api/AiQuizEvaluate/evaluate`,
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
     * @tags AiRecommend
     * @name V1AiRecommendCreate
     * @request POST:/api/v1/AiRecommend
     * @secure
     */
    v1AiRecommendCreate: (
      body: AiEvaluateTempRequest,
      params: RequestParams = {},
    ) =>
      this.request<AiEvaluateResponse, any>({
        path: `/api/v1/AiRecommend`,
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
     * @tags AiRecommend
     * @name V1AiRecommendExternalCoursesCreate
     * @request POST:/api/v1/AiRecommend/external-courses
     * @secure
     */
    v1AiRecommendExternalCoursesCreate: (
      body: AiExternalCourseRequest,
      params: RequestParams = {},
    ) =>
      this.request<AiExternalCourseResponse, any>({
        path: `/api/v1/AiRecommend/external-courses`,
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
     * @tags AiRecommend
     * @name V1AiRecommendImprovementSearchAiCreate
     * @request POST:/api/v1/AiRecommend/improvement-search-ai
     * @secure
     */
    v1AiRecommendImprovementSearchAiCreate: (
      body: AiSearchRequest,
      params: RequestParams = {},
    ) =>
      this.request<AiSearchResponse, any>({
        path: `/api/v1/AiRecommend/improvement-search-ai`,
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
     * @tags AiTranscript
     * @name AiTranscriptCreate
     * @request POST:/api/AiTranscript
     * @secure
     */
    aiTranscriptCreate: (
      body: CreateTranscriptCommand,
      params: RequestParams = {},
    ) =>
      this.request<CreateTranscriptResponse, any>({
        path: `/api/AiTranscript`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
