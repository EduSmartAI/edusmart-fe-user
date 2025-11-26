'use server';
import { PaymentCallbackResponse } from "EduSmart/api/api-payment-service";
import apiServer from "EduSmart/lib/apiServer";

export async function v1PaymentPaymentCallbackCreate(
    orderId: string,
    code: string,
    id: string,
    cancel: boolean,
    status: string,
    orderCode: number,
  ): Promise<PaymentCallbackResponse | null> {
    try {
      const resp = await apiServer.payment.api.v1PaymentPaymentCallbackCreate({
        orderId: orderId,
        code: code,
        id: id,
        cancel: cancel,
        status: status,
        orderCode: orderCode,
      });
      console.log("resp v1PaymentPaymentCallbackCreate", resp.data.response);
      return resp.data as PaymentCallbackResponse;
    } catch (error) {
      console.error("v1PaymentPaymentCallbackCreate error:", error);
      return null;
    }
  }