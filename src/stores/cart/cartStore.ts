import { create } from "zustand";
import { persist } from "zustand/middleware";
import { message } from "antd";
import {
  CartDto,
  CartItemDto,
  AddToCartRequest,
  GetMyCartResponse,
  AddToCartResponse,
  RemoveCartItemResponse,
} from "EduSmart/api/api-payment-service";
import { PaymentClient } from "EduSmart/hooks/apiClient";

interface CartState {
  // State
  cart: CartDto | null;
  isLoading: boolean;
  error: string | null;
  selectedItemIds: Set<string>;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  setSelectedItemIds: (ids: Set<string>) => void;
  clearCart: () => void;
  checkCourseInCart: (courseId: string) => Promise<boolean>;

  // Computed
  getSelectedItems: () => CartItemDto[];
  getTotalPrice: () => number;
  getItemsCount: () => number;
  getSelectedCount: () => number;

  // Deprecated (kept for compatibility)
  updateItemSelection: (cartItemId: string, isSelected: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      selectedItemIds: new Set<string>(),

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await PaymentClient.api.v1CartList();
          if (res.data?.success && res.data.response) {
            const cart = res.data.response;
            const currentSelectedIds = get().selectedItemIds;

            // Only auto-select all items if no items are currently selected
            let selectedIds = currentSelectedIds;
            if (currentSelectedIds.size === 0) {
              selectedIds = new Set(
                cart.items
                  ?.map((item) => item.cartItemId)
                  .filter((id): id is string => !!id) || [],
              );
            }

            set({ cart, selectedItemIds: selectedIds, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          set({ error: "Không thể tải giỏ hàng", isLoading: false });
        }
      },

      addToCart: async (courseId: string) => {
        set({ isLoading: true, error: null });
        try {
          const body: AddToCartRequest = { courseId };
          const res = await PaymentClient.api.v1CartItemsCreate(body);

          if (res.data?.success) {
            await get().fetchCart();
            message.success("Đã thêm vào giỏ hàng");
          } else {
            throw new Error(res.data?.message || "Failed to add to cart");
          }
        } catch (error: any) {
          console.error("Failed to add to cart:", error);
          const errorMsg =
            error?.response?.data?.message || "Không thể thêm vào giỏ hàng";
          set({ error: errorMsg, isLoading: false });
          message.error(errorMsg);
        }
      },

      removeFromCart: async (cartItemId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await PaymentClient.api.v1CartItemsDelete(cartItemId);

          if (res.data?.success) {
            // Remove from selectedItemIds
            const selectedIds = get().selectedItemIds;
            selectedIds.delete(cartItemId);
            set({ selectedItemIds: new Set(selectedIds) });

            await get().fetchCart();
            message.success("Đã xóa khỏi giỏ hàng");
          } else {
            throw new Error(res.data?.message || "Failed to remove from cart");
          }
        } catch (error: any) {
          console.error("Failed to remove from cart:", error);
          const errorMsg =
            error?.response?.data?.message || "Không thể xóa khỏi giỏ hàng";
          set({ error: errorMsg, isLoading: false });
          message.error(errorMsg);
        }
      },

      setSelectedItemIds: (ids: Set<string>) => {
        set({ selectedItemIds: new Set(ids) });
      },

      updateItemSelection: (cartItemId: string, isSelected: boolean) => {
        // Deprecated - use setSelectedItemIds instead
        const selectedIds = get().selectedItemIds;
        if (isSelected) {
          selectedIds.add(cartItemId);
        } else {
          selectedIds.delete(cartItemId);
        }
        set({ selectedItemIds: new Set(selectedIds) });
      },

      clearCart: () => {
        set({ cart: null, error: null });
      },

      checkCourseInCart: async (courseId: string) => {
        try {
          const res = await PaymentClient.api.v1CartItemsCheckList({
            courseId,
          });
          return res.data?.response?.isInCart ?? false;
        } catch (error) {
          console.error("Failed to check course in cart:", error);
          return false;
        }
      },

      getSelectedItems: () => {
        const cart = get().cart;
        const selectedIds = get().selectedItemIds;
        return (
          cart?.items?.filter((item) =>
            selectedIds.has(item.cartItemId || ""),
          ) ?? []
        );
      },

      getTotalPrice: () => {
        const selectedItems = get().getSelectedItems();
        return selectedItems.reduce((total, item) => {
          const price = item.dealPrice ?? item.price ?? 0;
          return total + price;
        }, 0);
      },

      getItemsCount: () => {
        const cart = get().cart;
        return cart?.items?.length ?? 0;
      },

      getSelectedCount: () => {
        return get().selectedItemIds.size;
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        selectedItemIds: Array.from(state.selectedItemIds), // Only persist selection, not cart data
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        selectedItemIds: new Set(persistedState?.selectedItemIds || []), // Restore selection from storage
      }),
    },
  ),
);
