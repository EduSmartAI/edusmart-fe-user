import { create } from "zustand";
import { message } from "antd";
import {
  PaymentGateway,
  InsertOrderCommand,
  InsertOrderResponse,
  SelectOrderResponseEntity,
  RePaymentResponse,
} from "EduSmart/api/api-payment-service";
import { PaymentClient } from "EduSmart/hooks/apiClient";

interface PaymentState {
  // State
  currentOrder: SelectOrderResponseEntity | null;
  paymentMethod: PaymentGateway;
  isProcessing: boolean;
  error: string | null;

  // Actions
  createOrder: (
    cartItemIds: string[],
    paymentMethod: PaymentGateway,
  ) => Promise<InsertOrderResponse | null>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  retryPayment: (orderId: string) => Promise<RePaymentResponse | null>;
  setPaymentMethod: (method: PaymentGateway) => void;
  clearOrder: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  currentOrder: null,
  paymentMethod: PaymentGateway.Value2, // Default: PayOS
  isProcessing: false,
  error: null,

  createOrder: async (cartItemIds: string[], paymentMethod: PaymentGateway) => {
    set({ isProcessing: true, error: null });
    try {
      const body: InsertOrderCommand = {
        cartItemIds,
        paymentMethod,
      };

      console.log("Creating order with payload:", body);
      const res = await PaymentClient.api.v1OrderInsertOrderCreate(body);
      console.log("Order created response:", res.data);

      if (res.data?.success) {
        set({ isProcessing: false });
        return res.data;
      }

      throw new Error(res.data?.message || "Failed to create order");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Failed to create order:", error);
      console.error("Backend error response:", err?.response?.data);
      const errorMsg = err?.response?.data?.message || "Không thể tạo đơn hàng";
      set({ error: errorMsg, isProcessing: false });
      message.error(errorMsg);
      return null;
    }
  },

  fetchOrderDetails: async (orderId: string) => {
    try {
      const res = await PaymentClient.api.v1OrderSelectOrderList({
        pageIndex: 0,
        pageSize: 1,
      });

      if (res.data?.success) {
        const order = res.data.response?.find((o) => o.orderId === orderId);
        if (order) {
          set({ currentOrder: order });
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Failed to fetch order details:", error);
      const errorMsg =
        err?.response?.data?.message || "Không thể tải chi tiết đơn hàng";
      set({ error: errorMsg });
      message.error(errorMsg);
    }
  },

  retryPayment: async (orderId: string) => {
    set({ isProcessing: true, error: null });
    try {
      // Re-process payment for the order
      const res = await PaymentClient.api.v1PaymentRePaymentList({
        orderId,
      });

      if (res.data?.success) {
        set({ isProcessing: false });
        return res.data;
      }

      throw new Error(res.data?.message || "Failed to retry payment");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Failed to retry payment:", error);
      const errorMsg =
        err?.response?.data?.message || "Không thể thử lại thanh toán";
      set({ error: errorMsg, isProcessing: false });
      message.error(errorMsg);
      return null;
    }
  },

  setPaymentMethod: (method: PaymentGateway) => {
    set({ paymentMethod: method });
  },

  clearOrder: () => {
    set({ currentOrder: null, error: null });
  },
}));
