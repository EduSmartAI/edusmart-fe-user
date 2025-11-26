"use client";

import { Badge } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useCartStore } from "EduSmart/stores/cart/cartStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartIcon() {
  const router = useRouter();
  const { getItemsCount, fetchCart } = useCartStore();
  const itemsCount = getItemsCount();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleClick = () => {
    router.push("/cart");
  };

  return (
    <Badge count={itemsCount} showZero={false} offset={[-2, 2]}>
      <button
        onClick={handleClick}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Giỏ hàng"
      >
        <ShoppingOutlined className="text-xl text-gray-700 dark:text-gray-300" />
      </button>
    </Badge>
  );
}
