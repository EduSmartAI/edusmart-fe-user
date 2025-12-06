"use client";

import React, { useState, useTransition } from "react";
import { Input, Empty, Spin, Select, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { InProgressCourseDto } from "EduSmart/api/api-course-service";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { fetchMyCoursesAction } from "./actions";

// Sort options
const SORT_OPTIONS = [
  { value: "startedAt", label: "Bắt đầu gần nhất" },
  { value: "title", label: "Tên khóa học (A-Z)" },
  { value: "duration", label: "Thời lượng" },
];

interface MyCoursesClientProps {
  initialData: InProgressCourseDto[];
  initialError?: string;
}

export default function MyCoursesClient({
  initialData,
  initialError,
}: MyCoursesClientProps) {
  const [courses, setCourses] = useState(initialData);
  const [error, setError] = useState<string | null>(initialError || null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("startedAt");

  const [isPending, startTransition] = useTransition();

  // Fetch courses
  const handleRefresh = () => {
    startTransition(async () => {
      const result = await fetchMyCoursesAction();
      if (result.success) {
        setCourses(result.data);
        setError(null);
      } else {
        setError(result.error || "Không thể tải danh sách khóa học.");
      }
    });
  };

  // Filter and sort
  const getFilteredCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(search) ||
          c.shortDescription?.toLowerCase().includes(search),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "duration":
          return (b.durationHours || 0) - (a.durationHours || 0);
        default: // startedAt
          return (
            new Date(b.startedAt || 0).getTime() -
            new Date(a.startedAt || 0).getTime()
          );
      }
    });

    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  // Empty state
  if (!isPending && courses.length === 0 && !error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bạn chưa bắt đầu học khóa học nào
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Hãy khám phá các khóa học và bắt đầu hành trình học tập!
              </p>
            </div>
          }
        />
        <Button type="primary" size="large" href="/courses" className="mt-6">
          Khám phá khóa học
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main */}
      <div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 my-6">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm khóa học..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Sắp xếp:
            </span>
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              className="min-w-[180px]"
              size="large"
            />
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isPending}
            size="large"
          >
            Làm mới
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-red-500">{error}</span>}
            />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className="mt-4"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Loading */}
        {isPending && (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" tip="Đang tải khóa học...">
              <div className="p-12" />
            </Spin>
          </div>
        )}

        {/* Course List */}
        {!isPending && !error && filteredCourses.length > 0 && (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.courseId}
                className="flex flex-row justify-between items-center gap-3"
              >
                {/* Course Card */}
                <div className="flex-1 min-w-0">
                  <CourseCard
                    id={course.courseId}
                    imageUrl={
                      course.courseImageUrl || "/placeholder-course.png"
                    }
                    title={course.title || "Khóa học"}
                    descriptionLines={
                      course.shortDescription ? [course.shortDescription] : []
                    }
                    instructor="EduSmart"
                    isEnrolled={true}
                    routerPush={`/course/${course.courseId}`}
                    isHorizontal={true}
                  />
                </div>

                {/* Performance Button - Aligned with card */}
                <div className="flex items-center justify-center lg:flex-col lg:justify-center h-12">
                  <a
                    href={`/dashboard/my-courses/${course.courseId}/performance`}
                    className="flex items-center justify-center gap-2 px-5 py-3 lg:py-0 lg:h-full lg:min-w-[180px] bg-[#49BBBD] hover:bg-[#3da8aa] text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <span>Xem hiệu suất</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!isPending &&
          !error &&
          filteredCourses.length === 0 &&
          courses.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không tìm thấy khóa học nào phù hợp"
              />
            </div>
          )}
      </div>
    </div>
  );
}
