import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import { v1PaymentPaymentCallbackCreate } from "EduSmart/app/apiServer/payment/paymentAction";
import PaymentResultClient from "./PaymentResultClient";
import type {
  PaymentCallbackDto,
  PaymentCallbackResponse,
} from "EduSmart/api/api-payment-service";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

type PaymentPageProps = {
  searchParams?: Promise<SearchParams>;
};

type ParsedParams =
  | {
      orderId: string;
      code: string;
      id: string;
      status: string;
      cancel: boolean;
      orderCode: number;
    }
  | null;

const toStringParam = (value?: string | string[]): string | null => {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? value[0] ?? null : value;
};

const parseBooleanParam = (value?: string | string[]): boolean => {
  const stringValue = toStringParam(value);
  if (!stringValue) {
    return false;
  }
  return stringValue.toLowerCase() === "true";
};

const parseNumberParam = (value?: string | string[]): number | null => {
  const stringValue = toStringParam(value);
  if (!stringValue) {
    return null;
  }
  const parsed = Number(stringValue);
  return Number.isFinite(parsed) ? parsed : null;
};

const extractParams = (searchParams: SearchParams): ParsedParams => {
  const orderId = toStringParam(searchParams.orderId);
  const code = toStringParam(searchParams.code);
  const id = toStringParam(searchParams.id);
  const status = toStringParam(searchParams.status);
  const orderCode = parseNumberParam(searchParams.orderCode);

  if (!orderId || !code || !id || !status || orderCode == null) {
    return null;
  }

  const cancel = parseBooleanParam(searchParams.cancel);

  return {
    orderId,
    code,
    id,
    status,
    cancel,
    orderCode,
  };
};

const MissingParams = ({ missing }: { missing: string[] }) => {
  return (
    <BaseScreenWhiteNav>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <h1 className="text-2xl font-semibold mb-2">Thiếu tham số</h1>
          <p className="mb-4">
            Thiếu thông tin bắt buộc để xử lý kết quả thanh toán. Vui lòng kiểm tra lại
            đường dẫn thanh toán và thử lại.
          </p>
          <p className="text-sm text-red-600">
            Thiếu: {missing.join(", ")}
          </p>
        </div>
      </div>
    </BaseScreenWhiteNav>
  );
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const resolvedSearchParams: SearchParams = searchParams ? await searchParams : {};
  const params = extractParams(resolvedSearchParams);

  if (!params) {
    const requiredKeys = ["orderId", "code", "id", "status", "orderCode"];
    const missingKeys = requiredKeys.filter(
      (key) => !toStringParam(resolvedSearchParams[key]),
    );

    const hasOrderCodeValue = Boolean(toStringParam(resolvedSearchParams.orderCode));
    const invalidOrderCode =
      hasOrderCodeValue && parseNumberParam(resolvedSearchParams.orderCode) == null
        ? ["orderCode (không hợp lệ)"]
        : [];

    const issues = [...missingKeys, ...invalidOrderCode];

    return <MissingParams missing={issues.length ? issues : ["tham số không hợp lệ"]} />;
  }

  let callbackResponse: PaymentCallbackResponse | null = null;
  let combinedMessage: string | null = null;

  try {
    callbackResponse = await v1PaymentPaymentCallbackCreate(
      params.orderId,
      params.code,
      params.id,
      params.cancel,
      params.status,
      params.orderCode,
    );

    if (!callbackResponse) {
      combinedMessage = "Không nhận được phản hồi từ hệ thống thanh toán.";
    } else if (!callbackResponse.success) {
      combinedMessage =
        callbackResponse.message ||
        callbackResponse.detailErrors?.[0]?.errorMessage ||
        "Thanh toán chưa được xác nhận. Vui lòng thử lại.";
    } else if (callbackResponse.message) {
      combinedMessage = callbackResponse.message;
    }
  } catch (error) {
    console.error("Failed to handle payment callback:", error);
    combinedMessage = "Không thể xử lý yêu cầu thanh toán. Vui lòng thử lại sau.";
  }

  const callbackPayload: PaymentCallbackDto | null =
    callbackResponse?.response ?? null;

  return (
    <BaseScreenWhiteNav>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <PaymentResultClient
          orderId={params.orderId}
          cancel={params.cancel}
          orderCode={params.orderCode}
          originalStatus={params.status}
          callbackSuccess={callbackResponse?.success ?? false}
          callbackMessage={combinedMessage}
          callbackPayload={callbackPayload}
        />
      </div>
    </BaseScreenWhiteNav>
  );
}

