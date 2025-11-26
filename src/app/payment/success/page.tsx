"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Result, Typography, Space, Divider, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { usePaymentStore } from "EduSmart/stores/payment/paymentStore";
import { useCartStore } from "EduSmart/stores/cart/cartStore";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import { PaymentClient } from "EduSmart/hooks/apiClient";

const { Title, Text } = Typography;

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  const code = searchParams?.get("code");
  const id = searchParams?.get("id");
  const status = searchParams?.get("status");
  const orderCode = searchParams?.get("orderCode");

  const { currentOrder, fetchOrderDetails } = usePaymentStore();
  const { fetchCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        if (orderId) {
          // Call PaymentCallback API to notify backend of success
          if (code || id || status) {
            await PaymentClient.api.v1PaymentPaymentCallbackCreate({
              orderId,
              code: code || "",
              id: id || "",
              cancel: false,
              status: status || "SUCCESS",
              orderCode: orderCode ? parseInt(orderCode) : 0,
            });
          }

          await fetchOrderDetails(orderId);
          await fetchCart(); // Refresh cart to remove purchased items
        }
      } catch (err) {
        console.error("Error processing payment success callback:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, code, id, status, orderCode, fetchOrderDetails, fetchCart]);

  const formatPrice = (price?: number) => {
    if (!price) return "0₫";
    return `${price.toLocaleString("vi-VN")}₫`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <BaseScreenWhiteNav>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spin size="large" />
        </div>
      </BaseScreenWhiteNav>
    );
  }

  return (
    <BaseScreenWhiteNav>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <Result
            icon={
              <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
            }
            title={
              <Title level={2} className="!mb-2">
                Thanh toán thành công!
              </Title>
            }
            subTitle="Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ."
          />

          {currentOrder && (
            <div className="mt-6 text-left max-w-md mx-auto">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <Space direction="vertical" className="w-full" size="small">
                  <div className="flex justify-between">
                    <Text type="secondary">Mã đơn hàng:</Text>
                    <Text strong className="font-mono">
                      #{currentOrder.orderId?.slice(0, 8).toUpperCase()}
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text type="secondary">Ngày thanh toán:</Text>
                    <Text>{formatDate(currentOrder.paidAt)}</Text>
                  </div>

                  <div className="flex justify-between">
                    <Text type="secondary">Số khóa học:</Text>
                    <Text>{currentOrder.orderItems?.length || 0}</Text>
                  </div>

                  <Divider className="!my-3" />

                  <div className="flex justify-between items-center">
                    <Text strong>Tổng tiền:</Text>
                    <Text strong className="text-xl text-green-600">
                      {formatPrice(currentOrder.finalAmount)}
                    </Text>
                  </div>
                </Space>
              </Card>

              {currentOrder.orderItems &&
                currentOrder.orderItems.length > 0 && (
                  <div className="mt-4">
                    <Text type="secondary" className="block mb-2">
                      Khóa học đã mua:
                    </Text>
                    <div className="space-y-2">
                      {currentOrder.orderItems.map((item, index) => (
                        <div
                          key={item.orderItemId || index}
                          className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <Text className="block text-sm">
                            • Khóa học #{index + 1}
                          </Text>
                          <Text strong className="text-green-600">
                            {formatPrice(item.finalPrice)}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          <Space className="mt-8" size="middle">
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/dashboard/my-courses")}
            >
              Vào học ngay
            </Button>

            <Button
              size="large"
              onClick={() => router.push(`/dashboard/orders/${orderId}`)}
            >
              Xem đơn hàng
            </Button>

            <Button size="large" onClick={() => router.push("/course")}>
              Khám phá thêm
            </Button>
          </Space>
        </Card>
      </div>
    </BaseScreenWhiteNav>
  );
}

export default function PaymentSuccessPage() {
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
      <PaymentSuccessContent />
    </Suspense>
  );
}
