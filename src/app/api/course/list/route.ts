import { NextRequest, NextResponse } from "next/server";
import { fetchCourseByQuery } from "EduSmart/app/apiServer/courseAction";
import { CourseSortBy } from "EduSmart/enum/enum";

const VALID_SORTS = new Set<CourseSortBy>([
  CourseSortBy.Latest,
  CourseSortBy.Popular,
  CourseSortBy.TitleAsc,
  CourseSortBy.TitleDesc,
]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
    const size = Math.max(Number(searchParams.get("size") ?? "9"), 1);
    const rawSort = Number(searchParams.get("sortBy"));
    const sortBy =
      Number.isInteger(rawSort) && VALID_SORTS.has(rawSort as CourseSortBy)
        ? (rawSort as CourseSortBy)
        : CourseSortBy.Latest;

    const result = await fetchCourseByQuery(search, page, size, sortBy);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Course list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

