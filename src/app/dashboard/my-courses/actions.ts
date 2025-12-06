"use server";

import { fetchMyCourses } from "EduSmart/app/apiServer/courseAction";

export async function fetchMyCoursesAction() {
  return fetchMyCourses();
}
