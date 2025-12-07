import { fetchMyCourses } from "EduSmart/app/apiServer/courseAction";
import MyCoursesClient from "EduSmart/app/dashboard/my-courses/MyCoursesClient";

export default async function MyCoursesPage() {
  const result = await fetchMyCourses();

  return (
    <MyCoursesClient
      initialData={result.data}
      initialError={result.success ? undefined : result.error}
    />
  );
}
