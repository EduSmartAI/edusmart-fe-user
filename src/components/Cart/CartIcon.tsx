"use client";

import { Badge, Popover, Empty, Image, Typography, Divider } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useCartStore } from "EduSmart/stores/cart/cartStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const { Text } = Typography;

export default function CartIcon() {
  const router = useRouter();
  const { getItemsCount, fetchCart, cart } = useCartStore();
  const itemsCount = getItemsCount();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleClick = () => {
    router.push("/cart");
  };

  const cartItems = cart?.items ?? [];
  const hasItems = cartItems.length > 0;

  const cartContent = (
    <div className="w-80 max-h-96 overflow-y-auto">
      {hasItems ? (
        <>
          <div className="space-y-2">
            {cartItems.slice(0, 5).map((item) => (
              <Link
                key={item.cartItemId}
                href={`/course/${item.courseId}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.courseImageUrl || "/placeholder-course.jpg"}
                      alt={item.courseTitle || "Course"}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                      preview={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text
                      className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2"
                      ellipsis
                    >
                      {item.courseTitle || "Khóa học"}
                    </Text>
                    <div className="mt-1">
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {item.dealPrice
                          ? `${item.dealPrice.toLocaleString("vi-VN")}₫`
                          : item.price
                          ? `${item.price.toLocaleString("vi-VN")}₫`
                          : "Miễn phí"}
                      </Text>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {cartItems.length > 5 && (
            <>
              <Divider className="my-2" />
              <div className="text-center">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Và {cartItems.length - 5} khóa học khác
                </Text>
              </div>
            </>
          )}
          <Divider className="my-2" />
          <div className="flex justify-between items-center">
            <Text className="text-sm font-medium">
              Tổng: {cartItems.length} khóa học
            </Text>
            <button
              onClick={handleClick}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Xem giỏ hàng
            </button>
          </div>
        </>
      ) : (
        <Empty
          description="Giỏ hàng trống"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-4"
        />
      )}
    </div>
  );

  return (
    <Popover
      content={cartContent}
      title="Giỏ hàng"
      trigger="hover"
      placement="bottomRight"
      overlayClassName="cart-popover"
    >
      <Badge count={itemsCount} showZero={false} offset={[-2, 2]}>
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Giỏ hàng"
        >
          <ShoppingOutlined className="text-xl text-gray-700 dark:text-gray-300" />
        </button>
      </Badge>
    </Popover>
  );
}
