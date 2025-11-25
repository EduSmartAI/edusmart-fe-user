"use server"
import { AddToCartResponse, CheckCourseInCartResponse, GetMyCartResponse } from "EduSmart/api/api-payment-service";
import apiServer from "EduSmart/lib/apiServer";

export async function v1CartItemsCreate(
  courseId: string
): Promise<AddToCartResponse | null> {
  try {
    const resp = await apiServer.payment.api.v1CartItemsCreate({
      courseId: courseId,
    });
    console.log("resp create", resp.data.response);
    return resp.data as AddToCartResponse;
  } catch (error) {
    console.error("create error:", error);
    return null;
  }
}

export async function v1CartList(): Promise<GetMyCartResponse | null> {
  try {
    const resp = await apiServer.payment.api.v1CartList();
    console.log("resp list cart", resp.data.response);
    return resp.data as GetMyCartResponse;
  } catch (error) {
    console.error("get error:", error);
    return null;
  }
}

export async function v1CartItemsCheckList(
  courseId: string
): Promise<CheckCourseInCartResponse | null> {
  try {
    const resp = await apiServer.payment.api.v1CartItemsCheckList({
      courseId: courseId,
    });
    console.log("resp check cart", resp.data.response);
    return resp.data as CheckCourseInCartResponse;
  } catch (error) {
    console.error("check error:", error);
    return null;
  }
}

