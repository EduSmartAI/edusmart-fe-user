'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Spin, Typography, Card, Divider, Tag } from "antd";
import { useRouter } from "next/navigation";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import type { PaymentCallbackDto } from "EduSmart/api/api-payment-service";
import { usePaymentStore } from "EduSmart/stores/payment/paymentStore";
import { useSpring, animated } from "@react-spring/web";

const { Paragraph, Text, Title } = Typography;

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

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 200, friction: 20 },
  });

  const getStatusConfig = () => {
    if (isPaid) {
      return {
        icon: <CheckCircleOutlined className="text-5xl" />,
        iconColor: "text-emerald-500 dark:text-emerald-400",
        borderColor: "border-emerald-500 dark:border-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
        titleColor: "text-emerald-700 dark:text-emerald-300",
        tagColor: "success",
        tagText: "Thành công",
      };
    }
    if (isAwaitingGatewayConfirmation) {
      return {
        icon: <LoadingOutlined className="text-5xl animate-spin" />,
        iconColor: "text-blue-500 dark:text-blue-400",
        borderColor: "border-blue-500 dark:border-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        titleColor: "text-blue-700 dark:text-blue-300",
        tagColor: "processing",
        tagText: "Đang xử lý",
      };
    }
    if (shouldRetry) {
      return {
        icon: <InfoCircleOutlined className="text-5xl" />,
        iconColor: "text-amber-500 dark:text-amber-400",
        borderColor: "border-amber-500 dark:border-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
        titleColor: "text-amber-700 dark:text-amber-300",
        tagColor: "warning",
        tagText: "Cần xác nhận",
      };
    }
    return {
      icon: <CloseCircleOutlined className="text-5xl" />,
      iconColor: "text-red-500 dark:text-red-400",
      borderColor: "border-red-500 dark:border-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      titleColor: "text-red-700 dark:text-red-300",
      tagColor: "error",
      tagText: "Thất bại",
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <animated.div style={fadeIn} className="space-y-4">
      {/* Main Status Card */}
      <Card
        className={`border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} shadow-xl relative overflow-hidden`}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 opacity-10 ${
          isPaid
            ? "bg-gradient-to-br from-emerald-400 to-teal-500"
            : isAwaitingGatewayConfirmation
            ? "bg-gradient-to-br from-blue-400 to-cyan-500"
            : shouldRetry
            ? "bg-gradient-to-br from-amber-400 to-orange-500"
            : "bg-gradient-to-br from-red-400 to-pink-500"
        }`} />
        <div className="text-center py-5 relative z-10">
          <div className={`mb-4 flex justify-center ${statusConfig.iconColor}`}>
            <div className={`p-4 rounded-full ${
              isPaid
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : isAwaitingGatewayConfirmation
                ? "bg-blue-100 dark:bg-blue-900/30"
                : shouldRetry
                ? "bg-amber-100 dark:bg-amber-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            }`}>
              {statusConfig.icon}
            </div>
          </div>
          <div className="mb-3">
            <Tag color={statusConfig.tagColor} className="text-sm px-3 py-0.5 font-semibold">
              {statusConfig.tagText}
            </Tag>
          </div>
          <Title
            level={2}
            className={`!mb-2 !text-2xl font-bold ${statusConfig.titleColor}`}
          >
            {title}
          </Title>
          <Paragraph className="text-sm text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            {subTitle}
          </Paragraph>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {shouldRetry && (
              <Button
                type="primary"
                size="middle"
                onClick={handleContinuePayment}
                disabled={!repaymentUrl || isProcessing}
                loading={isProcessing}
                className="h-10 px-6 font-semibold shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0 transition-all duration-300 ease-out relative overflow-hidden group"
                style={{
                  background: repaymentUrl
                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    : undefined,
                  border: "none",
                }}
              >
                <span className="relative z-10">
                  {repaymentUrl ? "Tiếp tục thanh toán" : "Đang lấy lại link..."}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            )}
            {isPaid && (
              <Button
                type="primary"
                size="middle"
                onClick={() => router.push("/dashboard/my-courses")}
                className="h-10 px-6 font-semibold shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0 transition-all duration-300 ease-out relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                }}
              >
                <span className="relative z-10">Vào học ngay</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            )}
            <Button
              size="middle"
              onClick={() => router.push("/dashboard/my-courses")}
              className="h-10 px-6 font-semibold border-2 border-teal-400 dark:border-teal-500 text-teal-600 dark:text-teal-400 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-700 dark:hover:text-teal-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0 transition-all duration-300 ease-out shadow-sm hover:shadow-lg hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30 relative overflow-hidden group"
            >
              <span className="relative z-10">Khóa học của tôi</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
            </Button>
            <Button
              type="text"
              size="middle"
              onClick={() => router.push("/dashboard/orders")}
              className="h-10 px-6 font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 active:translate-y-0 transition-all duration-300 ease-out rounded-md relative overflow-hidden group"
            >
              <span className="relative z-10">Đơn hàng của tôi</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Awaiting Confirmation Alert */}
      {isAwaitingGatewayConfirmation && (
        <Card className="border-2 border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10" />
          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 mt-0.5">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Spin size="default" className="text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <Text strong className="text-sm text-blue-900 dark:text-blue-100 block mb-1">
                Đang đồng bộ kết quả từ PayOS...
              </Text>
              <Paragraph className="!mb-0 text-sm text-blue-800 dark:text-blue-200">
                Thanh toán đã được ghi nhận tại PayOS. Chúng tôi đang đồng bộ kết quả với hệ thống, vui lòng chờ trong giây lát.
              </Paragraph>
            </div>
          </div>
        </Card>
      )}

      {/* Transaction Details Card */}
      <Card
        className={`border-2 shadow-lg bg-white dark:bg-slate-900 relative overflow-hidden ${
          isPaid
            ? "border-emerald-200 dark:border-emerald-800"
            : isAwaitingGatewayConfirmation
            ? "border-blue-200 dark:border-blue-800"
            : shouldRetry
            ? "border-amber-200 dark:border-amber-800"
            : "border-red-200 dark:border-red-800"
        }`}
        title={
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full shadow-sm ${
                isPaid
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : isAwaitingGatewayConfirmation
                  ? "bg-blue-500 dark:bg-blue-400"
                  : shouldRetry
                  ? "bg-amber-500 dark:bg-amber-400"
                  : "bg-red-500 dark:bg-red-400"
              }`}
            />
            <Title level={5} className={`!mb-0 ${
              isPaid
                ? "text-emerald-700 dark:text-emerald-300"
                : isAwaitingGatewayConfirmation
                ? "text-blue-700 dark:text-blue-300"
                : shouldRetry
                ? "text-amber-700 dark:text-amber-300"
                : "text-red-700 dark:text-red-300"
            }`}>
              Chi tiết giao dịch
            </Title>
          </div>
        }
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isPaid
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : isAwaitingGatewayConfirmation
            ? "bg-gradient-to-r from-blue-400 to-cyan-500"
            : shouldRetry
            ? "bg-gradient-to-r from-amber-400 to-orange-500"
            : "bg-gradient-to-r from-red-400 to-pink-500"
        }`} />
        <div className="space-y-2 mt-2">
          {metadata.map((item, index) => (
            <div key={item.label}>
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 px-3 rounded-md transition-all ${
                isPaid
                  ? "hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  : isAwaitingGatewayConfirmation
                  ? "hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  : shouldRetry
                  ? "hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  : "hover:bg-red-50 dark:hover:bg-red-950/20"
              }`}>
                <Text className={`text-xs font-medium min-w-[120px] ${
                  isPaid
                    ? "text-emerald-700 dark:text-emerald-300"
                    : isAwaitingGatewayConfirmation
                    ? "text-blue-700 dark:text-blue-300"
                    : shouldRetry
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-red-700 dark:text-red-300"
                }`}>
                  {item.label}
                </Text>
                <Text strong className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm break-all text-right sm:text-left">
                  {item.value}
                </Text>
              </div>
              {index < metadata.length - 1 && (
                <Divider className="!my-0" />
              )}
            </div>
          ))}
          {callbackPayload?.message && (
            <>
              <Divider className="!my-2" />
              <div>
                <Text className={`text-xs font-semibold block mb-2 uppercase ${
                  isPaid
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isAwaitingGatewayConfirmation
                    ? "text-blue-600 dark:text-blue-400"
                    : shouldRetry
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  Ghi chú
                </Text>
                <div className={`rounded-md p-3 border-l-4 ${
                  isPaid
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-600"
                    : isAwaitingGatewayConfirmation
                    ? "bg-blue-50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600"
                    : shouldRetry
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600"
                    : "bg-red-50 dark:bg-red-950/20 border-red-400 dark:border-red-600"
                }`}>
                  <Paragraph className="!mb-0 text-slate-700 dark:text-slate-300 text-xs">
                    {callbackPayload.message}
                  </Paragraph>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Retry Payment Card */}
      {shouldRetry && (
        <Card className="border-2 border-amber-400 dark:border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <InfoCircleOutlined className="text-lg text-amber-600 dark:text-amber-400 flex-shrink-0" />
              </div>
              <Title level={5} className="!mb-0 text-amber-900 dark:text-amber-100">
                Đang cố gắng khôi phục phiên thanh toán
              </Title>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 rounded-md p-2 border border-amber-200 dark:border-amber-800">
                <Spin size="small" className="text-amber-600 dark:text-amber-400" />
                <Text className="text-sm font-medium">Đang lấy lại link thanh toán...</Text>
              </div>
            )}
            {repaymentMessage && (
              <div
                className={`p-3 rounded-md border-2 shadow-sm ${
                  retryFailed
                    ? "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/20 border-red-300 dark:border-red-700"
                    : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border-emerald-300 dark:border-emerald-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {retryFailed ? (
                    <div className="p-1 rounded-full bg-red-100 dark:bg-red-900/30">
                      <CloseCircleOutlined className="text-red-500 dark:text-red-400 flex-shrink-0 text-sm" />
                    </div>
                  ) : (
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <CheckCircleOutlined className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 text-sm" />
                    </div>
                  )}
                  <Paragraph
                    className={`!mb-0 text-xs font-medium ${
                      retryFailed
                        ? "text-red-800 dark:text-red-200"
                        : "text-emerald-800 dark:text-emerald-200"
                    }`}
                  >
                    {repaymentMessage}
                  </Paragraph>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </animated.div>
  );
};

export default PaymentResultClient;

