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

export interface AnswerDetailResponse {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
}

export interface AnswerSurveySelects {
  /** @format uuid */
  answerId?: string;
  answerText?: string;
  isCorrect?: boolean;
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

export interface InsertAnswers {
  answerText?: string;
  isCorrect?: boolean;
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
  /** @format uuid */
  parentMajorId?: string;
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

export interface StudentInformation {
  /** @format uuid */
  majorId: string;
  /** @format uuid */
  semesterId: string;
  technologyIds: string[];
  learningGoalIds: string[];
}

export interface StudentQuizAnswerInsertRequest {
  /** @format uuid */
  questionId: string;
  /** @format uuid */
  answerId?: string;
  answerText?: string;
}

export interface StudentSurveyInsertCommand {
  studentInformation: StudentInformation;
  studentSurveys?: StudentSurveyInsertRequest[];
}

export interface StudentSurveyInsertRequest {
  /** @format uuid */
  surveyId: string;
  answers: StudentQuizAnswerInsertRequest[];
}

export interface StudentSurveyInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface StudentSurveySelectAnswerResponseEntity {
  /** @format uuid */
  answerId?: string;
  isCorrect?: boolean;
  answerText?: string;
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
  answers: StudentAnswerRequest[];
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

export interface SurveyAnswerRequest {
  /** @minLength 1 */
  answerText: string;
  isCorrect?: boolean;
}

export interface SurveyDetailSelectResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: SurveyDetailSelectResponseEntityPagedResult;
}

export interface SurveyDetailSelectResponseEntity {
  /** @format uuid */
  surveyId?: string;
  title?: string;
  description?: string;
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
  questions: SurveyQuestionRequest[];
}

export interface SurveyInsertResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface SurveyQuestionRequest {
  /** @minLength 1 */
  questionText: string;
  /** @format int32 */
  questionType: number;
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
     * @description Cần cấp quyền Student cho API
     *
     * @tags StudentSurvey
     * @name V1StudentSurveyCreate
     * @summary Lưu câu trả lời phần khảo sát của học sinh
     * @request POST:/api/v1/StudentSurvey
     * @secure
     */
    v1StudentSurveyCreate: (
      body: StudentSurveyInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<StudentSurveyInsertResponse, any>({
        path: `/api/v1/StudentSurvey`,
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
     * @tags StudentSurvey
     * @name V1StudentSurveyList
     * @summary Hiển câu trả lời phần khảo sát của học sinh
     * @request GET:/api/v1/StudentSurvey
     * @secure
     */
    v1StudentSurveyList: (
      query?: {
        request?: any;
      },
      params: RequestParams = {},
    ) =>
      this.request<StudentSurveySelectResponse, any>({
        path: `/api/v1/StudentSurvey`,
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
     * @description Tạo khảo sát mới với các câu hỏi và câu trả lời tương ứng
     *
     * @tags Survey
     * @name V1SurveyCreate
     * @summary Tạo khảo sát mới
     * @request POST:/api/v1/Survey
     * @secure
     */
    v1SurveyCreate: (body: SurveyInsertCommand, params: RequestParams = {}) =>
      this.request<SurveyInsertResponse, any>({
        path: `/api/v1/Survey`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
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
     * @description Cần cấp quyền Admin cho API
     *
     * @tags Test
     * @name V1TestInsertTestCreate
     * @summary Tạo bài kiểm tra mới
     * @request POST:/api/v1/Test/InsertTest
     * @secure
     */
    v1TestInsertTestCreate: (
      body: TestInsertCommand,
      params: RequestParams = {},
    ) =>
      this.request<TestInsertResponse, any>({
        path: `/api/v1/Test/InsertTest`,
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
  };
}
