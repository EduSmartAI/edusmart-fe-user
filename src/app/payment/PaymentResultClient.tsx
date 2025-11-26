'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Result, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import type { PaymentCallbackDto } from "EduSmart/api/api-payment-service";
import { usePaymentStore } from "EduSmart/stores/payment/paymentStore";

const { Paragraph, Text } = Typography;

type PaymentResultClientProps = {
  orderId: string;
  cancel: boolean;
  orderCode: number;
  originalStatus: string;
  callbackSuccess: boolean;
  callbackMessage: string | null;
  callbackPayload: PaymentCallbackDto | null;
};

const PaymentResultClient = ({
  orderId,
  cancel,
  orderCode,
  originalStatus,
  callbackSuccess,
  callbackMessage,
  callbackPayload,
}: PaymentResultClientProps) => {
  const router = useRouter();
  const retryPayment = usePaymentStore((state) => state.retryPayment);
  const isProcessing = usePaymentStore((state) => state.isProcessing);

  const [repaymentUrl, setRepaymentUrl] = useState<string | null>(null);
  const [repaymentMessage, setRepaymentMessage] = useState<string | null>(null);
  const [retryFailed, setRetryFailed] = useState(false);
  const retryTriggeredRef = useRef(false);

  const normalizedStatus = useMemo(
    () => originalStatus?.toUpperCase() ?? "",
    [originalStatus],
  );
  const isPaid = useMemo(
    () => callbackSuccess && normalizedStatus === "PAID",
    [callbackSuccess, normalizedStatus],
  );
  const isAwaitingGatewayConfirmation = useMemo(
    () => normalizedStatus === "PAID" && !callbackSuccess,
    [normalizedStatus, callbackSuccess],
  );
  const shouldRetry = useMemo(
    () => cancel && !isPaid,
    [cancel, isPaid],
  );

  useEffect(() => {
    if (!shouldRetry || !orderId || retryTriggeredRef.current) {
      return;
    }

    retryTriggeredRef.current = true;
    let ignore = false;

    const attemptRetry = async () => {
      try {
        const response = await retryPayment(orderId);
        if (ignore) {
          return;
        }

        if (response?.success && response.response?.paymentUrl) {
          setRepaymentUrl(response.response.paymentUrl);
          setRepaymentMessage(
            "Đã lấy lại link thanh toán. Bạn có thể tiếp tục giao dịch.",
          );
        } else {
          setRetryFailed(true);
          setRepaymentMessage(
            response?.message || "Không thể lấy lại link thanh toán. Vui lòng thử lại.",
          );
        }
      } catch (err) {
        console.error("retryPayment failed:", err);
        if (!ignore) {
          setRetryFailed(true);
          setRepaymentMessage("Có lỗi xảy ra khi thử lại thanh toán.");
        }
      }
    };

    attemptRetry();

    return () => {
      ignore = true;
    };
  }, [orderId, retryPayment, shouldRetry]);

  useEffect(() => {
    if (!isAwaitingGatewayConfirmation) {
      return;
    }

    const intervalId = setInterval(() => {
      router.refresh();
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAwaitingGatewayConfirmation, router]);

  const handleContinuePayment = () => {
    if (repaymentUrl) {
      window.location.href = repaymentUrl;
    }
  };

  const resultStatus: "success" | "info" | "error" = isPaid
    ? "success"
    : isAwaitingGatewayConfirmation
    ? "info"
    : shouldRetry
    ? "info"
    : "error";

  const title = isPaid
    ? "Thanh toán thành công"
    : isAwaitingGatewayConfirmation
    ? "Đang xác nhận kết quả thanh toán"
    : shouldRetry
    ? "Đang xác nhận lại thanh toán"
    : "Không thể xác nhận thanh toán";

  const subTitle = isAwaitingGatewayConfirmation
    ? "Thanh toán đã được ghi nhận tại PayOS. Chúng tôi đang đồng bộ kết quả với hệ thống, vui lòng chờ trong giây lát."
    : callbackMessage ??
      (isPaid
        ? "Chúng tôi đã xác nhận thanh toán của bạn."
        : shouldRetry
        ? "Chúng tôi đang cố gắng lấy lại link thanh toán để bạn tiếp tục giao dịch."
        : "Vui lòng thử thanh toán lại hoặc liên hệ bộ phận hỗ trợ.");

  const metadata = [
    { label: "Mã đơn hàng", value: orderId },
    { label: "Mã giao dịch", value: callbackPayload?.orderId ?? "Đang cập nhật" },
    { label: "Mã đơn PayOS", value: orderCode },
    {
      label: "Trạng thái PayOS",
      value: originalStatus || "Không xác định",
    },
    {
      label: "Trạng thái hệ thống",
      value: callbackPayload?.orderStatus || "Đang cập nhật",
    },
  ].filter((item) => item.value !== null && item.value !== undefined);

  const extraButtons = [
    shouldRetry ? (
      <Button
        type="primary"
        key="retry"
        onClick={handleContinuePayment}
        disabled={!repaymentUrl}
      >
        {repaymentUrl ? "Tiếp tục thanh toán" : "Đang lấy lại link..."}
      </Button>
    ) : null,
    <Button key="courses" onClick={() => router.push("/dashboard/orders")}>
      Khóa học của tôi
    </Button>,
    <Button key="home" type="link" onClick={() => router.push("/")}>
      Trang chủ
    </Button>,
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <Result status={resultStatus} title={title} subTitle={subTitle} extra={extraButtons} />

      {isAwaitingGatewayConfirmation && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-blue-900">
            <Spin size="large" />
            <span>Đang đồng bộ kết quả từ PayOS...</span>
          </div>
          <Paragraph className="!mb-0 text-blue-900">
            Trang sẽ tự động cập nhật khi hệ thống xác nhận xong. Bạn không cần thao tác thêm.
          </Paragraph>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Chi tiết giao dịch</h2>
        {metadata.map((item) => (
          <div
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <Text type="secondary">{item.label}</Text>
            <Paragraph className="!mb-0 font-medium">{item.value}</Paragraph>
          </div>
        ))}
        {callbackPayload?.message && (
          <div className="pt-3 border-t border-dashed border-slate-200">
            <Text type="secondary">Ghi chú</Text>
            <Paragraph className="!mb-0">{callbackPayload.message}</Paragraph>
          </div>
        )}
      </div>

      {shouldRetry && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 space-y-3">
          <h3 className="text-base font-semibold text-blue-900">
            Đang cố gắng khôi phục phiên thanh toán
          </h3>
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-700">
              <Spin size="small" />
              <span>Đang lấy lại link thanh toán...</span>
            </div>
          )}
          {repaymentMessage && (
            <Paragraph
              className={`!mb-0 ${retryFailed ? "text-red-600" : "text-blue-900"}`}
            >
              {repaymentMessage}
            </Paragraph>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentResultClient;

