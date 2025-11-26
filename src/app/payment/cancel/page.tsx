"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Result, Typography, Space, Spin, message } from "antd";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import { PaymentClient } from "EduSmart/hooks/apiClient";

const { Title, Text } = Typography;

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callbackProcessed, setCallbackProcessed] = useState(false);

  // Extract query parameters from PayOS callback
  const orderId = searchParams?.get("orderId");
  const code = searchParams?.get("code");
  const id = searchParams?.get("id");
  const cancel = searchParams?.get("cancel") === "true";
  const status = searchParams?.get("status");
  const orderCode = searchParams?.get("orderCode");

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        if (!orderId) {
          setError("Không tìm thấy thông tin đơn hàng");
          setIsLoading(false);
          return;
        }

        // Call PaymentCallback API to notify backend
        const response = await PaymentClient.api.v1PaymentPaymentCallbackCreate(
          {
            orderId,
            code: code || "",
            id: id || "",
            cancel,
            status: status || "",
            orderCode: orderCode ? parseInt(orderCode) : 0,
          },
        );

        if (response.data?.success) {
          setCallbackProcessed(true);
          console.log("Payment callback processed successfully");
        } else {
          setError(response.data?.message || "Không thể xử lý hủy đơn hàng");
        }
      } catch (err: any) {
        console.error("Payment callback error:", err);
        setError(err?.response?.data?.message || "Lỗi khi xử lý hủy đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentCallback();
  }, [orderId, code, id, cancel, status, orderCode]);

  if (isLoading) {
    return (
      <BaseScreenWhiteNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spin size="large" tip="Đang xử lý..." />
        </div>
      </BaseScreenWhiteNav>
    );
  }

  return (
    <BaseScreenWhiteNav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Result
          status="error"
          title="Thanh toán bị hủy"
          subTitle={
            error ||
            "Đơn hàng của bạn đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ."
          }
          extra={
            <Space>
              <Button type="primary" onClick={() => router.push("/cart")}>
                Quay lại giỏ hàng
              </Button>
              <Button onClick={() => router.push("/course")}>
                Tiếp tục mua sắm
              </Button>
            </Space>
          }
        />

        <Card className="mt-8">
          <Title level={4} className="!mb-4">
            Thông tin đơn hàng
          </Title>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text type="secondary">Mã đơn hàng:</Text>
              <Text>{orderId || "—"}</Text>
            </div>
            <div className="flex justify-between">
              <Text type="secondary">Trạng thái:</Text>
              <Text type="danger">Đã hủy</Text>
            </div>
            <div className="flex justify-between">
              <Text type="secondary">Mã giao dịch:</Text>
              <Text>{orderCode || "—"}</Text>
            </div>
          </div>
        </Card>
      </div>
    </BaseScreenWhiteNav>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <BaseScreenWhiteNav>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Spin size="large" />
          </div>
        </BaseScreenWhiteNav>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
