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
export enum PaymentGateway {
  Value1 = 1,
  Value2 = 2,
}

export interface AddToCartRequest {
  /** @format uuid */
  courseId?: string;
}

export interface AddToCartResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface CartDto {
  /** @format uuid */
  cartId?: string;
  /** @format uuid */
  userId?: string;
  items?: CartItemDto[];
}

export interface CartItemDto {
  /** @format uuid */
  cartItemId?: string;
  /** @format uuid */
  courseId?: string;
  courseTitle?: string;
  courseImageUrl?: string;
  /** @format double */
  price?: number;
  /** @format double */
  dealPrice?: number;
  isSelected?: boolean;
}

export interface CheckCourseInCartDto {
  isInCart?: boolean;
  /** @format uuid */
  cartId?: string;
  /** @format uuid */
  cartItemId?: string;
}

export interface CheckCourseInCartResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: CheckCourseInCartDto;
}

export interface DetailError {
  field?: string;
  messageId?: string;
  errorMessage?: string;
}

export interface GetMyCartResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: CartDto;
}

export interface InsertOrderCommand {
  cartItemIds: string[];
  paymentMethod: PaymentGateway;
}

export interface InsertOrderResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PaymentResultEntity;
  /** @format uuid */
  orderId?: string;
}

export interface OrderItemEntity {
  /** @format uuid */
  orderItemId?: string;
  /** @format uuid */
  courseId?: string;
  /** @format double */
  price?: number;
  /** @format double */
  discount?: number;
  /** @format double */
  finalPrice?: number;
}

export interface PaymentCallbackCommand {
  /** @format uuid */
  orderId?: string;
  code?: string;
  id?: string;
  cancel?: boolean;
  status?: string;
  /** @format int64 */
  orderCode?: number;
}

export interface PaymentCallbackDto {
  checkoutUrl?: string;
  qrCode?: string;
  /** @format uuid */
  orderId?: string;
  orderStatus?: string;
  message?: string;
}

export interface PaymentCallbackResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: PaymentCallbackDto;
}

export interface PaymentResultEntity {
  transactionId?: string;
  checkoutUrl?: string;
  qrCode?: string;
}

export interface RePaymentResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: RePaymentResponseEntity;
}

export interface RePaymentResponseEntity {
  paymentUrl?: string;
}

export interface RemoveCartItemResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: string;
}

export interface SelectOrderResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  detailErrors?: DetailError[];
  response?: SelectOrderResponseEntity[];
  /** @format int32 */
  totalRecords?: number;
  /** @format int32 */
  pageIndex?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface SelectOrderResponseEntity {
  /** @format uuid */
  orderId?: string;
  /** @format date-time */
  orderDate?: string;
  /** @format int32 */
  status?: number;
  statusName?: string;
  /** @format double */
  subtotal?: number;
  /** @format double */
  discount?: number;
  /** @format double */
  finalAmount?: number;
  currency?: string;
  /** @format date-time */
  paidAt?: string;
  orderItems?: OrderItemEntity[];
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
  public baseUrl: string = "/payment";
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
 * @title Payment Service Swagger
 * @version v1
 * @baseUrl /payment
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Add a course into current user's cart
     *
     * @tags Cart
     * @name V1CartItemsCreate
     * @summary Add course to cart
     * @request POST:/api/v1/Cart/items
     * @secure
     */
    v1CartItemsCreate: (body: AddToCartRequest, params: RequestParams = {}) =>
      this.request<AddToCartResponse, any>({
        path: `/api/v1/Cart/items`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description PaymentMethod: 1. Momo, 2. PayOS
     *
     * @tags Order
     * @name V1OrderInsertOrderCreate
     * @summary Tạo đơn hàng mới và khởi tạo thanh toán qua PayOS.
     * @request POST:/api/v1/Order/InsertOrder
     * @secure
     */
    v1OrderInsertOrderCreate: (
      body: InsertOrderCommand,
      params: RequestParams = {},
    ) =>
      this.request<InsertOrderResponse, any>({
        path: `/api/v1/Order/InsertOrder`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Process payment result from PayOS gateway. Update order and payment transaction status based on payment result.
     *
     * @tags Payment
     * @name V1PaymentPaymentCallbackCreate
     * @summary Handle payment callback from PayOS
     * @request POST:/api/v1/Payment/PaymentCallback
     * @secure
     */
    v1PaymentPaymentCallbackCreate: (
      body: PaymentCallbackCommand,
      params: RequestParams = {},
    ) =>
      this.request<PaymentCallbackResponse, any>({
        path: `/api/v1/Payment/PaymentCallback`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return active cart of the authenticated user
     *
     * @tags Cart
     * @name V1CartList
     * @summary Get current user's cart
     * @request GET:/api/v1/Cart
     * @secure
     */
    v1CartList: (params: RequestParams = {}) =>
      this.request<GetMyCartResponse, any>({
        path: `/api/v1/Cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cart
     * @name V1CartItemsCheckList
     * @request GET:/api/v1/Cart/items/check
     * @secure
     */
    v1CartItemsCheckList: (
      query?: {
        /** @format uuid */
        courseId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CheckCourseInCartResponse, any>({
        path: `/api/v1/Cart/items/check`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get paginated list of user's orders or single order detail by OrderId.
     *
     * @tags Order
     * @name V1OrderSelectOrderList
     * @summary Lấy danh sách đơn hàng hoặc chi tiết một đơn hàng.
     * @request GET:/api/v1/Order/SelectOrder
     * @secure
     */
    v1OrderSelectOrderList: (
      query?: {
        /** @format uuid */
        orderId?: string;
        /**
         * @format int32
         * @default 0
         */
        pageIndex?: number;
        /**
         * @format int32
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SelectOrderResponse, any>({
        path: `/api/v1/Order/SelectOrder`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve existing payment URL and QR code when user closed the payment tab or needs to retry payment.
     *
     * @tags Payment
     * @name V1PaymentRePaymentList
     * @summary Lấy lại link thanh toán khi người dùng đóng tab hoặc cần thanh toán lại.
     * @request GET:/api/v1/Payment/RePayment
     * @secure
     */
    v1PaymentRePaymentList: (
      query?: {
        /** @format uuid */
        orderId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RePaymentResponse, any>({
        path: `/api/v1/Payment/RePayment`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Logical delete a cart item from current user's cart
     *
     * @tags Cart
     * @name V1CartItemsDelete
     * @summary Remove cart item
     * @request DELETE:/api/v1/Cart/items/{cartItemId}
     * @secure
     */
    v1CartItemsDelete: (cartItemId: string, params: RequestParams = {}) =>
      this.request<RemoveCartItemResponse, any>({
        path: `/api/v1/Cart/items/${cartItemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
