"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Radio,
  Typography,
  Space,
  Divider,
  Image,
  Spin,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCartStore } from "EduSmart/stores/cart/cartStore";
import { usePaymentStore } from "EduSmart/stores/payment/paymentStore";
import { PaymentGateway } from "EduSmart/api/api-payment-service";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const router = useRouter();
  const { getSelectedItems, getTotalPrice, fetchCart } = useCartStore();
  const { paymentMethod, setPaymentMethod, createOrder, isProcessing } =
    usePaymentStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setIsLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  const selectedItems = getSelectedItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (!isLoading && selectedItems.length === 0) {
      message.warning("Vui lòng chọn khóa học để thanh toán");
      router.push("/cart");
    }
  }, [isLoading, selectedItems, router]);

  const handlePayment = async () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn khóa học để thanh toán");
      return;
    }

    const cartIds = selectedItems
      .map((item) => item.cartItemId)
      .filter((id): id is string => !!id);

    if (cartIds.length === 0) {
      message.error("Không thể xác định khóa học");
      return;
    }

    const result = await createOrder(cartIds, paymentMethod);

    if (result?.success && result.response?.checkoutUrl) {
      // Redirect to payment gateway
      window.location.href = result.response.checkoutUrl;
    } else if (result?.orderId) {
      // If no checkout URL, redirect to success page
      router.push(`/payment/success?orderId=${result.orderId}`);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "0₫";
    return `${price.toLocaleString("vi-VN")}₫`;
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/cart")}
          className="!mb-6"
        >
          Quay lại giỏ hàng
        </Button>

        <Title level={2} className="!mb-6">
          Thanh toán
        </Title>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Thông tin đơn hàng">
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <Image
                      src={item.courseImageUrl || "/placeholder.jpg"}
                      alt={item.courseTitle || "Course"}
                      width={100}
                      height={67}
                      className="rounded-lg object-cover"
                      preview={false}
                    />

                    <div className="flex-1 min-w-0">
                      <Text strong className="block mb-2 line-clamp-2">
                        {item.courseTitle}
                      </Text>

                      <div className="flex items-center gap-2">
                        {item.dealPrice &&
                        item.dealPrice < (item.price || 0) ? (
                          <>
                            <Text delete type="secondary" className="text-sm">
                              {formatPrice(item.price)}
                            </Text>
                            <Text strong className="text-red-600">
                              {formatPrice(item.dealPrice)}
                            </Text>
                          </>
                        ) : (
                          <Text strong>{formatPrice(item.price)}</Text>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Phương thức thanh toán">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full" size="middle">
                  <Radio value={PaymentGateway.Value2} className="w-full">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Text strong className="block">
                          PayOS
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Thanh toán qua QR Code hoặc Internet Banking
                        </Text>
                      </div>
                    </div>
                  </Radio>

                  {/* <Radio value={PaymentGateway.Value1} className="w-full">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Text strong className="block">
                          Momo
                        </Text>
                        <Text type="secondary" className="text-sm">
                          Thanh toán qua ví điện tử Momo
                        </Text>
                      </div>
                    </div>
                  </Radio> */}
                </Space>
              </Radio.Group>
            </Card>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-0">
              <Title level={4} className="!mb-4">
                Tổng cộng
              </Title>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <Text type="secondary">Số khóa học:</Text>
                  <Text>{selectedItems.length}</Text>
                </div>

                <div className="flex justify-between">
                  <Text type="secondary">Tạm tính:</Text>
                  <Text>{formatPrice(totalPrice)}</Text>
                </div>

                <Divider className="!my-3" />

                <div className="flex justify-between items-center">
                  <Text strong className="text-base">
                    Thành tiền:
                  </Text>
                  <Text strong className="text-2xl text-red-600">
                    {formatPrice(totalPrice)}
                  </Text>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handlePayment}
                loading={isProcessing}
                className="!h-12"
              >
                Xác nhận thanh toán
              </Button>

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text type="secondary" className="text-xs block text-center">
                  Bằng việc thanh toán, bạn đồng ý với{" "}
                  <a href="/terms" className="text-blue-600">
                    Điều khoản sử dụng
                  </a>
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </BaseScreenWhiteNav>
  );
}
