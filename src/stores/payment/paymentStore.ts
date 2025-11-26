import { create } from "zustand";
import { message } from "antd";
import {
  PaymentGateway,
  InsertOrderCommand,
  InsertOrderResponse,
  ProcessPaymentCommand,
  ProcessPaymentResponse,
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
  processPayment: (orderId: string) => Promise<ProcessPaymentResponse | null>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  retryPayment: (orderId: string) => Promise<RePaymentResponse | null>;
  setPaymentMethod: (method: PaymentGateway) => void;
  clearOrder: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
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

      const res = await PaymentClient.api.v1OrderInsertOrderCreate(body);

      if (res.data?.success) {
        set({ isProcessing: false });
        return res.data;
      }

      throw new Error(res.data?.message || "Failed to create order");
    } catch (error: any) {
      console.error("Failed to create order:", error);
      const errorMsg =
        error?.response?.data?.message || "Không thể tạo đơn hàng";
      set({ error: errorMsg, isProcessing: false });
      message.error(errorMsg);
      return null;
    }
  },

  processPayment: async (orderId: string) => {
    set({ isProcessing: true, error: null });
    try {
      const body: ProcessPaymentCommand = { orderId };
      const res = await PaymentClient.api.v1PaymentInsertPaymentCreate(body);

      if (res.data?.success) {
        set({ isProcessing: false });
        return res.data;
      }

      throw new Error(res.data?.message || "Failed to process payment");
    } catch (error: any) {
      console.error("Failed to process payment:", error);
      const errorMsg =
        error?.response?.data?.message || "Không thể xử lý thanh toán";
      set({ error: errorMsg, isProcessing: false });
      message.error(errorMsg);
      return null;
    }
  },

  fetchOrderDetails: async (orderId: string) => {
    set({ isProcessing: true, error: null });
    try {
      const res = await PaymentClient.api.v1OrderSelectOrderList({ orderId });

      if (
        res.data?.success &&
        res.data.response &&
        res.data.response.length > 0
      ) {
        set({ currentOrder: res.data.response[0], isProcessing: false });
      } else {
        set({ isProcessing: false });
      }
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      const errorMsg =
        error?.response?.data?.message || "Không thể tải thông tin đơn hàng";
      set({ error: errorMsg, isProcessing: false });
    }
  },

  retryPayment: async (orderId: string) => {
    set({ isProcessing: true, error: null });
    try {
      const res = await PaymentClient.api.v1PaymentRePaymentList({ orderId });

      if (res.data?.success) {
        set({ isProcessing: false });
        return res.data;
      }

      throw new Error(res.data?.message || "Failed to retry payment");
    } catch (error: any) {
      console.error("Failed to retry payment:", error);
      const errorMsg =
        error?.response?.data?.message || "Không thể thử lại thanh toán";
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
