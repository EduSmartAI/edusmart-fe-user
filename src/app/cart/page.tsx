"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Image,
  Spin,
  Typography,
  Space,
  Divider,
  message,
  Badge,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useCartStore } from "EduSmart/stores/cart/cartStore";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";

const { Title, Text } = Typography;

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    fetchCart,
    removeFromCart,
    selectedItemIds,
    setSelectedItemIds,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Computed: Check if all items are selected
  const isAllSelected =
    cart?.items && cart.items.length > 0
      ? selectedItemIds.size === cart.items.length
      : false;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items
      const ids = new Set(
        cart?.items
          ?.map((item) => item.cartItemId)
          .filter((id): id is string => !!id) || [],
      );
      setSelectedItemIds(ids);
    } else {
      // Deselect all items
      setSelectedItemIds(new Set());
    }
  };

  const handleSelectItem = (cartItemId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedItemIds);
    if (checked) {
      newSelectedIds.add(cartItemId);
    } else {
      newSelectedIds.delete(cartItemId);
    }
    setSelectedItemIds(newSelectedIds);
  };

  const handleRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
  };

  const handleCheckout = () => {
    if (selectedItemIds.size === 0) {
      message.warning("Vui lòng chọn ít nhất một khóa học");
      return;
    }
    router.push("/checkout");
  };

  const formatPrice = (price?: number) => {
    if (!price) return "0₫";
    return `${price.toLocaleString("vi-VN")}₫`;
  };

  const items = cart?.items || [];
  const selectedCount = selectedItemIds.size;
  const totalPrice = getTotalPrice();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCartOutlined className="text-3xl text-[#49BBBD]" />
            <Title level={2} className="!mb-0">
              Giỏ hàng của bạn
            </Title>
          </div>
          <Text type="secondary" className="text-base">
            {items.length > 0
              ? `Bạn có ${items.length} khóa học trong giỏ hàng`
              : "Quản lý các khóa học bạn muốn mua"}
          </Text>
        </div>

        {items.length === 0 ? (
          <Card
            className="text-center py-20 border-0 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(73, 187, 189, 0.05) 0%, rgba(73, 187, 189, 0.02) 100%)",
            }}
          >
            <Empty
              image={
                <ShoppingOutlined
                  style={{ fontSize: 80, color: "#49BBBD", opacity: 0.3 }}
                />
              }
              description={
                <Space direction="vertical" size="large" className="mt-6">
                  <div>
                    <Text
                      type="secondary"
                      className="text-lg font-medium block mb-2"
                    >
                      Giỏ hàng của bạn đang trống
                    </Text>
                    <Text type="secondary" className="text-sm">
                      Hãy khám phá các khóa học tuyệt vời và thêm vào giỏ hàng
                      nhé!
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => router.push("/course")}
                    className="!h-11 !px-8"
                  >
                    Khám phá khóa học
                  </Button>
                </Space>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-8">
              <Card
                className="shadow-md border-0 h-full"
                bodyStyle={{ padding: "24px" }}
              >
                {/* Select All Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="!text-base"
                  >
                    <Text strong className="text-base">
                      Chọn tất cả ({items.length})
                    </Text>
                  </Checkbox>
                  {selectedCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Text type="secondary" className="text-sm">
                        Đã chọn
                      </Text>
                      <Badge
                        count={selectedCount}
                        showZero
                        style={{
                          backgroundColor: "#49BBBD",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const isSelected = selectedItemIds.has(
                      item.cartItemId || "",
                    );
                    return (
                      <div
                        key={item.cartItemId}
                        onClick={() => {
                          handleSelectItem(
                            item.cartItemId || "",
                            !isSelected,
                          );
                        }}
                        className={`group flex gap-4 p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "border-[#49BBBD] bg-[#49BBBD]/5 dark:bg-[#49BBBD]/10 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-[#49BBBD]/50 hover:shadow-md bg-white dark:bg-gray-800"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectItem(
                              item.cartItemId || "",
                              e.target.checked,
                            )
                          }
                          className="mt-2 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="relative flex-shrink-0 self-start">
                          <Image
                            src={item.courseImageUrl || "/placeholder.jpg"}
                            alt={item.courseTitle || "Course"}
                            width={160}
                            height={110}
                            className="rounded-lg object-cover shadow-sm"
                            preview={false}
                          />
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-[#49BBBD] rounded-full p-1 shadow-lg z-10">
                              <CheckCircleOutlined className="text-white text-sm" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <Title
                            level={5}
                            className="!mb-4 !mt-0 line-clamp-2 group-hover:text-[#49BBBD] transition-colors"
                          >
                            {item.courseTitle}
                          </Title>

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
                                    className="text-xl text-[#ff4d4f] font-bold"
                                  >
                                    {formatPrice(item.dealPrice)}
                                  </Text>
                                </div>
                              </div>
                            ) : (
                              <Text strong className="text-xl text-gray-900 dark:text-white font-semibold">
                                {formatPrice(item.price)}
                              </Text>
                            )}
                          </div>
                        </div>

                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.cartItemId || "");
                          }}
                          className="self-start flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:!bg-red-50 dark:hover:!bg-red-900/20"
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-4">
              <Card
                className="sticky top-6 shadow-lg border-0"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <Title level={4} className="!mb-0">
                    Tóm tắt đơn hàng
                  </Title>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <Text type="secondary" className="text-base">
                      Tổng số khóa học:
                    </Text>
                    <Text strong className="text-base">
                      {items.length} khóa học
                    </Text>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary" className="text-base">
                      Đã chọn:
                    </Text>
                    <Text strong className="text-base text-[#49BBBD]">
                      {selectedCount} khóa học
                    </Text>
                  </div>

                  <Divider className="!my-4" />

                  <div className="flex justify-between items-center py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4">
                    <Text strong className="text-lg">
                      Tổng tiền:
                    </Text>
                    <Text strong className="text-2xl text-[#ff4d4f] font-bold">
                      {formatPrice(totalPrice)}
                    </Text>
                  </div>
                </div>

                <Space direction="vertical" className="w-full" size="middle">
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleCheckout}
                    disabled={selectedCount === 0}
                    className="!h-12 !text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    style={{
                      backgroundColor: selectedCount === 0 ? undefined : "#49BBBD",
                    }}
                  >
                    {selectedCount > 0
                      ? `Thanh toán (${selectedCount})`
                      : "Chọn khóa học để thanh toán"}
                  </Button>

                  <Button
                    size="large"
                    block
                    onClick={() => router.push("/course")}
                    className="!h-11 !text-base border-gray-300 dark:border-gray-600 hover:border-[#49BBBD] hover:text-[#49BBBD] transition-all"
                  >
                    Tiếp tục mua sắm
                  </Button>
                </Space>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Text type="secondary" className="text-xs block text-center leading-relaxed">
                    <CheckCircleOutlined className="mr-1 text-green-500" />
                    Bảo mật thanh toán 100%
                    <br />
                    Hỗ trợ hoàn tiền trong 7 ngày
                  </Text>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </BaseScreenWhiteNav>
  );
}
