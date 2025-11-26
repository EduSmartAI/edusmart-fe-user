"use server"
import { AddToWishlistResponse, GetMyWishlistResponse, RemoveFromWishlistResponse } from "EduSmart/api/api-course-service";
import { courseService } from "EduSmart/lib/apiServer";

export async function courseWishlistCreate(
  courseId: string
): Promise<AddToWishlistResponse | null> {
  try {
    const resp = await courseService.api.courseWishlistCreate({
      courseId: courseId,
    });
    console.log("resp", resp.data.response);
    return resp.data as AddToWishlistResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}

export async function courseWishlistDelete(
  courseId: string
): Promise<RemoveFromWishlistResponse | null> {
  try {
    const resp = await courseService.api.courseWishlistDelete({
      courseId: courseId,
    });
    console.log("resp delete", resp.data.response);
    return resp.data as RemoveFromWishlistResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}


export async function courseWishlistList(
  search: string,
  page: number,
  size: number,
): Promise<GetMyWishlistResponse | null> {
  try {
    const resp = await courseService.api.courseWishlistList({
      Page: page,
      Size: size,
      Search: search
    });
    console.log("resp delete", resp.data.response);
    return resp.data as GetMyWishlistResponse;
  } catch (error) {
    console.error("selectCodeLangues error:", error);
    return null;
  }
}