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
  Badge,
  Steps,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  LockOutlined,
} from "@ant-design/icons";
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/cart")}
          className="!mb-6 hover:!bg-gray-100 dark:hover:!bg-gray-800 !px-4 !h-10"
        >
          <Text className="text-base">Quay lại giỏ hàng</Text>
        </Button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CreditCardOutlined className="text-3xl text-[#49BBBD]" />
            <Title level={2} className="!mb-0">
              Thanh toán
            </Title>
          </div>
          <Text type="secondary" className="text-base">
            Hoàn tất đơn hàng của bạn một cách an toàn và nhanh chóng
          </Text>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <Steps
            current={1}
            items={[
              {
                title: "Giỏ hàng",
                icon: <ShoppingCartOutlined />,
              },
              {
                title: "Thanh toán",
                icon: <CreditCardOutlined />,
              },
              {
                title: "Hoàn tất",
                icon: <CheckCircleOutlined />,
              },
            ]}
            className="hidden md:block"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Order Items & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ShoppingCartOutlined className="text-[#49BBBD]" />
                  <Text strong className="text-lg">
                    Thông tin đơn hàng
                  </Text>
                </div>
              }
              className="shadow-md border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="space-y-4">
                {selectedItems.map((item, index) => (
                  <div
                    key={item.cartItemId}
                    className={`flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#49BBBD]/50 hover:shadow-md transition-all ${
                      index !== selectedItems.length - 1
                        ? "mb-4 pb-4 border-b-2"
                        : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0 self-start">
                      <Image
                        src={item.courseImageUrl || "/placeholder.jpg"}
                        alt={item.courseTitle || "Course"}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover shadow-sm"
                        preview={false}
                      />
                      <Badge
                        count={index + 1}
                        style={{
                          backgroundColor: "#49BBBD",
                        }}
                        className="absolute -top-1 -right-1 z-10"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <Text
                        strong
                        className="block mb-4 line-clamp-2 text-base"
                      >
                        {item.courseTitle}
                      </Text>

                      <div className="flex items-baseline gap-3 mt-auto">
                        {item.dealPrice &&
                        item.dealPrice < (item.price || 0) ? (
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <Text
                              delete
                              type="secondary"
                              className="text-sm font-medium"
                            >
                              {formatPrice(item.price)}
                            </Text>
                            <div className="flex items-baseline gap-2">
                              <Tag
                                color="#ff4d4f"
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 8px",
                                  margin: 0,
                                  lineHeight: "1.5",
                                  verticalAlign: "baseline",
                                }}
                              >
                                Giảm giá
                              </Tag>
                              <Text
                                strong
                                className="text-lg text-[#ff4d4f] font-bold"
                              >
                                {formatPrice(item.dealPrice)}
                              </Text>
                            </div>
                          </div>
                        ) : (
                          <Text strong className="text-lg text-gray-900 dark:text-white font-semibold">
                            {formatPrice(item.price)}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method Card */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <LockOutlined className="text-[#49BBBD]" />
                  <Text strong className="text-lg">
                    Phương thức thanh toán
                  </Text>
                </div>
              }
              className="shadow-md border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full" size="middle">
                  <Radio
                    value={PaymentGateway.Value2}
                    className="w-full !py-3 !px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#49BBBD] transition-all"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Text strong className="text-base block">
                            PayOS
                          </Text>
                          <Badge
                            status="processing"
                            text="Được đề xuất"
                            className="ml-2"
                          />
                        </div>
                        <Text type="secondary" className="text-sm block">
                          Thanh toán an toàn qua QR Code hoặc Internet Banking
                        </Text>
                      </div>
                      <SafetyOutlined className="text-2xl text-[#49BBBD]" />
                    </div>
                  </Radio>

                  {/* <Radio value={PaymentGateway.Value1} className="w-full !py-3 !px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#49BBBD] transition-all">
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-1">
                        <Text strong className="text-base block">
                          Momo
                        </Text>
                        <Text type="secondary" className="text-sm block">
                          Thanh toán qua ví điện tử Momo
                        </Text>
                      </div>
                    </div>
                  </Radio> */}
                </Space>
              </Radio.Group>
            </Card>

            {/* Security Notice */}
            <Card
              className="border-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(73, 187, 189, 0.1) 0%, rgba(73, 187, 189, 0.05) 100%)",
              }}
              bodyStyle={{ padding: "16px 24px" }}
            >
              <div className="flex items-start gap-3">
                <SafetyOutlined className="text-xl text-[#49BBBD] mt-1" />
                <div>
                  <Text strong className="block mb-1">
                    Thanh toán an toàn
                  </Text>
                  <Text type="secondary" className="text-sm">
                    Thông tin thanh toán của bạn được mã hóa và bảo mật. Chúng
                    tôi không lưu trữ thông tin thẻ của bạn.
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <Card
              className="sticky top-6 shadow-lg border-0"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Title level={4} className="!mb-0">
                  Tổng cộng
                </Title>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <Text type="secondary" className="text-base">
                    Số khóa học:
                  </Text>
                  <Text strong className="text-base">
                    {selectedItems.length} khóa học
                  </Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text type="secondary" className="text-base">
                    Tạm tính:
                  </Text>
                  <Text className="text-base font-medium">
                    {formatPrice(totalPrice)}
                  </Text>
                </div>

                <Divider className="!my-4" />

                <div className="flex justify-between items-center py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4">
                  <Text strong className="text-lg">
                    Thành tiền:
                  </Text>
                  <Text strong className="text-2xl text-[#ff4d4f] font-bold">
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
                icon={<LockOutlined />}
                className="!h-12 !text-base font-semibold shadow-md hover:shadow-lg transition-all mb-4"
                style={{
                  backgroundColor: "#49BBBD",
                }}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </Button>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <Text type="secondary" className="text-xs block text-center leading-relaxed">
                  <SafetyOutlined className="mr-1 text-[#49BBBD]" />
                  Bằng việc thanh toán, bạn đồng ý với{" "}
                  <a
                    href="/terms"
                    className="text-[#49BBBD] hover:underline font-medium"
                  >
                    Điều khoản sử dụng
                  </a>{" "}
                  của chúng tôi
                </Text>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-green-500 mt-1" />
                  <div>
                    <Text strong className="text-xs block mb-1">
                      Đảm bảo hoàn tiền
                    </Text>
                    <Text type="secondary" className="text-xs">
                      Hoàn tiền 100% trong vòng 7 ngày nếu không hài lòng
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </BaseScreenWhiteNav>
  );
}
