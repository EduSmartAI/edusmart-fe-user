"use client";

import { useEffect, useState } from "react";
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
} from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
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
    getSelectedItems,
    getTotalPrice,
    getSelectedCount,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <Title level={2} className="!mb-8">
          Giỏ hàng của bạn
        </Title>

        {items.length === 0 ? (
          <Card className="text-center py-16">
            <Empty
              image={<ShoppingOutlined style={{ fontSize: 64 }} />}
              description={
                <Space direction="vertical" size="middle">
                  <Text type="secondary" className="text-base">
                    Giỏ hàng của bạn đang trống
                  </Text>
                  <Button type="primary" onClick={() => router.push("/course")}>
                    Khám phá khóa học
                  </Button>
                </Space>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <Card className="!p-5">
                <div className="flex items-center justify-between mb-4">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    <Text strong className="text-base">
                      Chọn tất cả ({items.length})
                    </Text>
                  </Checkbox>
                </div>

                <Divider className="!my-4" />

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      onClick={() => {
                        const isCurrentlySelected = selectedItemIds.has(
                          item.cartItemId || "",
                        );
                        handleSelectItem(
                          item.cartItemId || "",
                          !isCurrentlySelected,
                        );
                      }}
                      className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedItemIds.has(item.cartItemId || "")}
                        onChange={(e) =>
                          handleSelectItem(
                            item.cartItemId || "",
                            e.target.checked,
                          )
                        }
                        className="mt-1 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      />

                      <Image
                        src={item.courseImageUrl || "/placeholder.jpg"}
                        alt={item.courseTitle || "Course"}
                        width={140}
                        height={90}
                        className="rounded-lg object-cover flex-shrink-0"
                        preview={false}
                      />

                      <div className="flex-1 min-w-0">
                        <Title level={5} className="!mb-2 !mt-0 line-clamp-2">
                          {item.courseTitle}
                        </Title>

                        <div className="flex items-center gap-3 mt-3">
                          {item.dealPrice &&
                          item.dealPrice < (item.price || 0) ? (
                            <>
                              <Text delete type="secondary" className="text-sm">
                                {formatPrice(item.price)}
                              </Text>
                              <Text strong className="text-lg text-red-600">
                                {formatPrice(item.dealPrice)}
                              </Text>
                            </>
                          ) : (
                            <Text strong className="text-lg">
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
                        className="self-start flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-4">
              <Card className="sticky top-0 shadow-sm">
                <Title level={4} className="!mb-5">
                  Thông tin đơn hàng
                </Title>

                <div className="space-y-4 mb-5">
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Số khóa học:</Text>
                    <Text strong>{items.length}</Text>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Đã chọn:</Text>
                    <Text strong className="text-blue-600">
                      {selectedCount} khóa học
                    </Text>
                  </div>

                  <Divider className="!my-4" />

                  <div className="flex justify-between items-center">
                    <Text strong className="text-base">
                      Tổng tiền:
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
                  onClick={handleCheckout}
                  disabled={selectedCount === 0}
                  className="!h-12 !mb-3"
                >
                  Thanh toán ({selectedCount})
                </Button>

                <Button
                  size="large"
                  block
                  onClick={() => router.push("/course")}
                  className="!h-12"
                >
                  Tiếp tục mua sắm
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </BaseScreenWhiteNav>
  );
}
