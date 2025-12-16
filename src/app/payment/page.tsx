import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import PaymentResultClient from "./PaymentResultClient";

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

  return (
    <BaseScreenWhiteNav>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <PaymentResultClient
          orderId={params.orderId}
          code={params.code}
          id={params.id}
          cancel={params.cancel}
          status={params.status}
          orderCode={params.orderCode}
        />
      </div>
    </BaseScreenWhiteNav>
  );
}

