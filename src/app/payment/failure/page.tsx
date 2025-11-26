"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Result, Typography, Space, Spin } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { usePaymentStore } from "EduSmart/stores/payment/paymentStore";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";

const { Title, Text } = Typography;

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");

  const { retryPayment, isProcessing } = usePaymentStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = async () => {
    if (!orderId) return;

    setIsLoading(true);
    const result = await retryPayment(orderId);

    if (result?.success && result.response?.paymentUrl) {
      window.location.href = result.response.paymentUrl;
    }
    setIsLoading(false);
  };

  return (
    <BaseScreenWhiteNav>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <Result
            icon={
              <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
            }
            title={
              <Title level={2} className="!mb-2">
                Thanh toán thất bại
              </Title>
            }
            subTitle="Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."
          />

          {orderId && (
            <div className="mt-6 max-w-md mx-auto">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <Space direction="vertical" className="w-full" size="small">
                  <div className="flex justify-between">
                    <Text type="secondary">Mã đơn hàng:</Text>
                    <Text strong className="font-mono">
                      #{orderId.slice(0, 8).toUpperCase()}
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text type="secondary">Trạng thái:</Text>
                    <Text type="danger">Thất bại</Text>
                  </div>
                </Space>
              </Card>
            </div>
          )}

          <Space className="mt-8" size="middle" direction="vertical">
            <Text type="secondary" className="block">
              Một số nguyên nhân có thể:
            </Text>
            <ul className="text-left text-gray-600 dark:text-gray-400 text-sm space-y-1">
              <li>• Giao dịch bị hủy bởi người dùng</li>
              <li>• Thông tin thanh toán không hợp lệ</li>
              <li>• Tài khoản không đủ số dư</li>
              <li>• Lỗi kết nối mạng</li>
            </ul>
          </Space>

          <Space className="mt-8" size="middle">
            {orderId && (
              <Button
                type="primary"
                size="large"
                onClick={handleRetry}
                loading={isLoading || isProcessing}
              >
                Thử lại thanh toán
              </Button>
            )}

            <Button size="large" onClick={() => router.push("/cart")}>
              Quay lại giỏ hàng
            </Button>

            <Button size="large" onClick={() => router.push("/course")}>
              Tiếp tục mua sắm
            </Button>
          </Space>
        </Card>
      </div>
    </BaseScreenWhiteNav>
  );
}

export default function PaymentFailurePage() {
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
      <PaymentFailureContent />
    </Suspense>
  );
}
