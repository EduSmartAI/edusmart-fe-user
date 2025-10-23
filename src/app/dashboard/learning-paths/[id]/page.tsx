"use client";

import React, { useState, useEffect, useMemo } from "react";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { Button, Spin, message } from "antd";
import {
  FiStar,
  FiCheck,
  FiExternalLink,
  FiClock,
  FiChevronUp,
  FiChevronDown,
  FiPlus,
  FiMinus,
  FiMove,
  FiChevronRight,
  FiArrowDown,
} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import {
  getLearningPathAction,
  confirmLearningPathAction,
  type LearningPathData,
} from "EduSmart/app/(learning-path)/learningPathAction";

export default function LearningPathRecommendation() {
  const router = useRouter();
  const params = useParams();
  const learningPathId = params.id as string;

  // State management
  const [learningPathData, setLearningPathData] =
    useState<LearningPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedExternalPath, setSelectedExternalPath] = useState(0);
  const [selectedExternalStep, setSelectedExternalStep] = useState(0);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [majorOrder, setMajorOrder] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [viewingMajorId, setViewingMajorId] = useState<string | null>(null);
  const [expandedMajorId, setExpandedMajorId] = useState<string | null>(null);

  // Fetch learning path data on mount
  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setIsLoading(true);
        const result = await getLearningPathAction(learningPathId);

        if (!result.ok) {
          message.error(result.error || "Không thể tải lộ trình học tập");
          console.log("result.error", result);
          return;
        }

        setLearningPathData(result.data);
      } catch (error) {
        console.error("Error fetching learning path:", error);
        message.error("Đã xảy ra lỗi khi tải lộ trình học tập");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (learningPathId) {
      fetchLearningPath();
    }
  }, [learningPathId, router]);

  // Sort internal learning path by positionIndex when status = 2 (confirmed)
  const sortedInternalPath = useMemo(() => {
    if (!learningPathData) return [];

    if (learningPathData.status === 2) {
      // Status = 2: Đã xác nhận, sort by positionIndex
      return [...learningPathData.internalLearningPath].sort(
        (a, b) => (a.positionIndex || 0) - (b.positionIndex || 0),
      );
    }
    // Status = 1: Chưa xác nhận, giữ nguyên order
    return learningPathData.internalLearningPath;
  }, [learningPathData]);

  // Auto expand first combo when status = 2
  useEffect(() => {
    if (learningPathData?.status === 2 && sortedInternalPath.length > 0) {
      setExpandedMajorId(sortedInternalPath[0].majorId);
    }
  }, [learningPathData?.status, sortedInternalPath]);

  const handleConfirmPath = async () => {
    // Validate status = 1 (ready for confirmation)
    if (learningPathData?.status !== 1) {
      message.warning("Lộ trình học tập không ở trạng thái sẵn sàng xác nhận");
      return;
    }

    if (selectedMajors.length === 0) {
      message.warning("Vui lòng chọn ít nhất một chuyên ngành hẹp");
      return;
    }

    try {
      setIsConfirming(true);
      const result = await confirmLearningPathAction(
        learningPathId,
        majorOrder,
      );

      if (result.ok) {
        console.log("✅ Confirmation successful!");
        console.log("📊 New Status:", result.status);

        // Update local state with new data
        setLearningPathData(result.data);

        message.success({
          content: `Xác nhận lộ trình học tập thành công! ${result.status === 2 ? "Đang học tập" : "Đã cập nhật"}`,
          duration: 2,
        });

        // Reload page to reflect new status
        window.location.reload();
      } else {
        message.error(result.error || "Không thể xác nhận lộ trình học tập");
      }
    } catch (error) {
      console.error("Error confirming learning path:", error);
      message.error("Đã xảy ra lỗi khi xác nhận lộ trình học tập");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  // Handle major selection
  const handleMajorToggle = (majorId: string) => {
    if (selectedMajors.includes(majorId)) {
      // Remove from selection
      setSelectedMajors((prev) => prev.filter((id) => id !== majorId));
      setMajorOrder((prev) => prev.filter((id) => id !== majorId));
    } else {
      // Add to selection
      setSelectedMajors((prev) => [...prev, majorId]);
      setMajorOrder((prev) => [...prev, majorId]);
    }
  };

  // Move major up in order
  const moveMajorUp = (majorId: string) => {
    const currentIndex = majorOrder.indexOf(majorId);
    if (currentIndex > 0) {
      const newOrder = [...majorOrder];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [
        newOrder[currentIndex],
        newOrder[currentIndex - 1],
      ];
      setMajorOrder(newOrder);
    }
  };

  // Move major down in order
  const moveMajorDown = (majorId: string) => {
    const currentIndex = majorOrder.indexOf(majorId);
    if (currentIndex < majorOrder.length - 1) {
      const newOrder = [...majorOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      setMajorOrder(newOrder);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, majorId: string) => {
    setDraggedItem(majorId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", majorId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetMajorId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetMajorId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = majorOrder.indexOf(draggedItem);
    const targetIndex = majorOrder.indexOf(targetMajorId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newOrder = [...majorOrder];
    // Remove dragged item
    newOrder.splice(draggedIndex, 1);
    // Insert at target position
    newOrder.splice(targetIndex, 0, draggedItem);

    setMajorOrder(newOrder);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Đang tải lộ trình học tập...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!learningPathData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Không tìm thấy lộ trình học tập
          </p>
          <Button
            type="primary"
            onClick={() => router.replace("/")}
            className="mt-4"
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Use real data instead of mock data
  const displayData = learningPathData;

  // Helper function to convert course data to CourseCard format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToCourseCard = (course: any) => ({
    imageUrl: course.courseImageUrl,
    title: course.title,
    descriptionLines: [course.shortDescription],
    instructor: `${course.subjectCode} - Kỳ ${course.semesterPosition}`,
    price: course.dealPrice ? `$${course.dealPrice}` : `$${course.price}`,
    routerPush: `/course/${course.slug}`,
    level: course.level,
    duration: `${course.durationHours}h`,
    learnerCount: course.learnerCount,
  });

  // Group basic courses by semester
  const groupedBasicCourses = displayData.basicLearningPath.courses.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, course) => {
      const semester = course.semesterPosition;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push(course);
      return acc;
    },
    {},
  );

  const SemesterSection = ({
    semester,
    courses,
    title,
    isLast,
  }: {
    semester: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    courses: any[];
    title: string;
    isLast?: boolean;
  }) => (
    <div className="mb-10">
      {/* Semester Header */}
      <div className="flex items-center mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
          {semester}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h4>
          <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <CourseCard {...convertToCourseCard(course)} />
            </div>
          ))}
        </div>
      </div>

      {/* Separator - not for last semester */}
      {!isLast && (
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-orange-700"></div>
          <div className="text-orange-500 dark:text-orange-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-orange-700"></div>
        </div>
        // <div className="mt-16 flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-800"></div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] via-cyan-500 to-[#4acfd1]">
              {learningPathData.basicLearningPath.subjectName}
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Dựa trên kết quả khảo sát và đánh giá năng lực của bạn, AI đã tạo ra
            lộ trình học tập tối ưu để giúp bạn đạt được mục tiêu nghề nghiệp.
          </p>

          {/* Status Badge */}
          {learningPathData && (
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                learningPathData.status === 0
                  ? "bg-oảnge-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300"
                  : learningPathData.status === 1
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                    : learningPathData.status === 2
                      ? "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300"
                      : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
              }`}
            >
              <FiClock className="w-4 h-4 mr-2" />
              {learningPathData.status === 0
                ? "AI đang tạo lộ trình"
                : learningPathData.status === 1
                  ? "Đang chờ xác nhận"
                  : learningPathData.status === 2
                    ? "Đang học tập"
                    : `Trạng thái: ${learningPathData.status}`}
            </div>
          )}
        </div>

        {/* Section 1: Basic Learning Path */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/60 via-amber-25 to-transparent dark:from-orange-900/10 dark:via-amber-800/5 dark:to-transparent rounded-3xl -m-4"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="relative">
                <div className="pl-6">
                  <div className="inline-block">
                    <h2 className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-2 drop-shadow-lg">
                      Lộ trình khởi đầu
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Các môn học nền tảng được đề xuất dựa trên năng lực hiện tại
                    của bạn
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border-1 border-orange-200 dark:border-orange-400/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-full transform -translate-x-12 translate-y-12"></div>
              <div className="relative z-10">
                {Object.entries(groupedBasicCourses).map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ([semester, courses]: [string, any], index, array) => (
                    <SemesterSection
                      key={semester}
                      semester={parseInt(semester)}
                      courses={courses}
                      title={`Kỳ ${semester}`}
                      isLast={index === array.length - 1}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Internal Learning Path */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/60 via-cyan-25 to-transparent dark:from-teal-900/10 dark:via-cyan-800/5 dark:to-transparent rounded-3xl -m-4"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="relative">
                <div className="pl-6">
                  <div className="inline-block">
                    <h2 className="text-3xl font-black text-[#49BBBD] dark:text-cyan-400 mb-2 drop-shadow-lg">
                      {learningPathData?.status === 2
                        ? "Chuyên ngành hẹp"
                        : "Chuyên ngành hẹp phù hợp"}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {learningPathData?.status === 2
                      ? `Bạn đã chọn ${sortedInternalPath.length} chuyên ngành hẹp. Hãy học theo thứ tự đã sắp xếp để đạt hiệu quả tốt nhất.`
                      : "AI đề xuất các chuyên ngành hẹp phù hợp với năng lực và sở thích của bạn"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-teal-200 dark:border-cyan-800 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-cyan-50 dark:bg-cyan-900/10 rounded-full transform -translate-x-14 translate-y-14"></div>

              <div className="relative z-10">
                {/* TIMELINE VIEW - Status = 2 (Confirmed) */}
                {learningPathData?.status === 2 && (
                  <>
                    {/* Timeline Vertical Layout */}
                    <div className="space-y-6">
                      {sortedInternalPath.map((path, index) => {
                        const isExpanded = expandedMajorId === path.majorId;
                        const isFirst = index === 0;

                        return (
                          <React.Fragment key={path.majorId}>
                            {/* Timeline Item */}
                            <div className="relative">
                              {/* Combo Card */}
                              <div
                                onClick={() =>
                                  setExpandedMajorId(
                                    isExpanded ? null : path.majorId,
                                  )
                                }
                                className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
                                  isExpanded
                                    ? "border border-[#49BBBD] bg-teal-50/50 dark:bg-teal-900/20 shadow-lg"
                                    : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-teal-200 dark:hover:border-cyan-600 hover:shadow-sm"
                                }`}
                              >
                                {/* Card Header */}
                                <div className="flex items-start gap-4 mb-5">
                                  {/* Large Number Badge */}
                                  <div
                                    className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black shadow-md ${
                                      index === 0
                                        ? "bg-gradient-to-br from-[#49BBBD] to-cyan-600 text-white"
                                        : index === 1
                                          ? "bg-gradient-to-br from-teal-400 to-cyan-500 text-white"
                                          : index === 2
                                            ? "bg-gradient-to-br from-cyan-400 to-teal-500 text-white"
                                            : "bg-gradient-to-br from-[#49BBBD] to-cyan-600 text-white"
                                    }`}
                                  >
                                    {index + 1}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                        {path.majorCode}
                                      </h3>
                                      {/* {isFirst && (
                                        <span className="flex-shrink-0 text-xs px-2.5 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded font-semibold">
                                          Đang học
                                        </span>
                                      )} */}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                      {path.majorCourse.length} khóa học
                                    </span>
                                  </div>
                                </div>

                                {/* Reason */}
                                <p
                                  className={`text-sm leading-relaxed transition-all duration-300 ${
                                    isExpanded
                                      ? "text-gray-700 dark:text-gray-300 mb-5"
                                      : "text-gray-600 dark:text-gray-400 line-clamp-2 mb-1"
                                  }`}
                                >
                                  {path.reason}
                                </p>

                                {/* Collapsed State - CTA */}
                                {!isExpanded && (
                                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-[#49BBBD] dark:text-cyan-400 text-sm font-semibold">
                                      Xem chi tiết các khóa học
                                    </span>
                                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}

                                {/* Expanded State - Courses Grid */}
                                {isExpanded && (
                                  <div className="mt-6 pt-6 border-t-1 border-teal-200 dark:border-cyan-800">
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                      <span>Danh sách khóa học</span>
                                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                        ({path.majorCourse.length})
                                      </span>
                                    </h4>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                      {path.majorCourse.map(
                                        (course, courseIndex) => (
                                          <div
                                            key={courseIndex}
                                            className="transform hover:scale-[1.02] transition-all duration-300"
                                          >
                                            <CourseCard
                                              {...convertToCourseCard(course)}
                                            />
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* GRID VIEW - Status = 1 (Pending Confirmation) */}
                {learningPathData?.status === 1 && (
                  <>
                    {/* Specialization Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {displayData.internalLearningPath.map(
                        (path, pathIndex) => (
                          <div
                            key={pathIndex}
                            onClick={() =>
                              setViewingMajorId(
                                viewingMajorId === path.majorId
                                  ? null
                                  : path.majorId,
                              )
                            }
                            className={`relative cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
                              viewingMajorId === path.majorId
                                ? "bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white border-[#49BBBD] shadow-lg"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-cyan-600 hover:shadow-md"
                            }`}
                          >
                            {/* Header Row */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <h3
                                    className={`font-bold text-base leading-tight ${
                                      viewingMajorId === path.majorId
                                        ? "text-white"
                                        : "text-gray-900 dark:text-white"
                                    }`}
                                  >
                                    {path.majorCode}
                                  </h3>
                                </div>
                              </div>

                              {/* Status Indicators */}
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    viewingMajorId === path.majorId
                                      ? "bg-white/20 text-white"
                                      : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  {path.majorCourse.length} khóa học
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p
                              className={`text-sm mb-3 line-clamp-2 ${
                                viewingMajorId === path.majorId
                                  ? "text-white/90"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {path.reason ||
                                `${path.majorCourse.length} khóa học chuyên sâu`}
                            </p>

                            {/* Action Row */}
                            {learningPathData?.status === 1 && (
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMajorToggle(path.majorId);
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedMajors.includes(path.majorId)
                                      ? viewingMajorId === path.majorId
                                        ? "bg-white text-black hover:bg-gray-50 shadow-sm"
                                        : "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-800 dark:text-teal-100"
                                      : viewingMajorId === path.majorId
                                        ? "bg-white/20 text-white hover:bg-white/30 border border-white/40"
                                        : "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400"
                                  }`}
                                >
                                  {selectedMajors.includes(path.majorId) ? (
                                    <span className="flex items-center space-x-1 text-black">
                                      <FiCheck className="w-4 h-4" />
                                      <span>Đã chọn</span>
                                    </span>
                                  ) : (
                                    <span className="flex items-center space-x-1">
                                      <FiPlus className="w-4 h-4" />
                                      <span>Chọn combo</span>
                                    </span>
                                  )}
                                </button>

                                <div
                                  className={`text-xs ${
                                    viewingMajorId === path.majorId
                                      ? "text-white/70"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {viewingMajorId === path.majorId
                                    ? "Đang xem"
                                    : "Nhấn để xem"}
                                </div>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>

                    {/* Selected Specialization Courses */}
                    {viewingMajorId && (
                      <div>
                        {(() => {
                          const selectedPath =
                            displayData.internalLearningPath.find(
                              (p) => p.majorId === viewingMajorId,
                            );
                          return selectedPath ? (
                            <>
                              <div className="mb-6 border-gray-200 dark:border-gray-700">
                                <h3 className="text-2xl font-black text-[#49BBBD] dark:text-cyan-400 mb-2 drop-shadow-lg">
                                  Lộ trình {selectedPath.majorCode}
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedPath.majorCourse.map(
                                  (course, index) => (
                                    <div
                                      key={index}
                                      className="transform hover:scale-105 transition-transform duration-300"
                                    >
                                      <CourseCard
                                        {...convertToCourseCard(course)}
                                      />
                                    </div>
                                  ),
                                )}
                              </div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* Selected Order Management */}
                    {selectedMajors.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="mb-6">
                          <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <h3 className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 mb-2 drop-shadow-lg">
                              Thứ tự học đã chọn
                            </h3>
                            <h3 className="ml-3 text-base font-medium text-gray-500 dark:text-gray-400">
                              ({selectedMajors.length} combo)
                            </h3>
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {majorOrder.map((majorId, index) => {
                            const path = displayData.internalLearningPath.find(
                              (p) => p.majorId === majorId,
                            );
                            if (!path) return null;

                            const isDragging = draggedItem === majorId;

                            return (
                              <div
                                key={majorId}
                                draggable
                                onDragStart={(e) => handleDragStart(e, majorId)}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDrop={(e) => handleDrop(e, majorId)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-move ${
                                  isDragging
                                    ? "bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-cyan-600 opacity-50 scale-105 shadow-lg"
                                    : "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-cyan-700 hover:shadow-md hover:bg-teal-100 dark:hover:bg-teal-900/30"
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing">
                                    <FiMove className="w-5 h-5" />
                                  </div>
                                  <div className="w-8 h-8 bg-[#49BBBD] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900 dark:text-white">
                                      {path.majorCode}
                                    </h5>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      {path.majorCourse.length} khóa học
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => moveMajorUp(majorId)}
                                    disabled={index === 0}
                                    className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Di chuyển lên"
                                  >
                                    <FiChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                  </button>
                                  <button
                                    onClick={() => moveMajorDown(majorId)}
                                    disabled={index === majorOrder.length - 1}
                                    className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Di chuyển xuống"
                                  >
                                    <FiChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                  </button>
                                  <button
                                    onClick={() => handleMajorToggle(majorId)}
                                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition-colors"
                                    title="Xóa khỏi danh sách"
                                  >
                                    <FiMinus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: External Learning Path */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-sky-25 to-transparent dark:from-blue-900/10 dark:via-sky-800/5 dark:to-transparent rounded-3xl -m-4"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <div className="relative">
                <div className="pl-6">
                  <div className="inline-block">
                    <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-2 drop-shadow-lg">
                      Đề xuất các khóa học bên ngoài
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Các khóa học từ các nền tảng uy tín để nâng cao kỹ năng
                    chuyên môn
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-blue-200 dark:border-blue-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100 dark:bg-blue-900/20 rounded-full transform translate-x-18 -translate-y-18"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-50 dark:bg-sky-900/10 rounded-full transform -translate-x-16 translate-y-16"></div>
              <div className="relative z-10">
                {/* Compact Track Selector Pills */}
                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-blue-200 dark:border-blue-700">
                  {displayData.externalLearningPath.map((path, pathIndex) => (
                    <button
                      key={pathIndex}
                      onClick={() => {
                        setSelectedExternalPath(pathIndex);
                        setSelectedExternalStep(0);
                      }}
                      className={`px-7 py-3 rounded-full text-sm font-semibold transition-colors duration-200 ${
                        selectedExternalPath === pathIndex
                          ? "bg-gradient-to-r from-blue-500 to-sky-600 !text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {path.majorCode}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Track Content */}
                {displayData.externalLearningPath[selectedExternalPath] && (
                  <div>
                    {/* Track Description Banner */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-sky-100/50 dark:from-blue-900/20 dark:to-sky-900/10 rounded-xl border border-blue-200 dark:border-blue-700">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {
                          displayData.externalLearningPath[selectedExternalPath]
                            .majorCode
                        }
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {
                          displayData.externalLearningPath[selectedExternalPath]
                            .reason
                        }
                      </p>
                    </div>

                    {/* Horizontal Step Timeline */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 !mb-4">
                        Các bước học tập
                      </h4>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700">
                        {displayData.externalLearningPath[
                          selectedExternalPath
                        ].steps.map((step, stepIndex) => (
                          <React.Fragment key={stepIndex}>
                            <button
                              onClick={() => setSelectedExternalStep(stepIndex)}
                              className={`flex-shrink-0 px-5 py-4 rounded-xl border-1 transition-all duration-300 ${
                                selectedExternalStep === stepIndex
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-sm"
                                  : "bg-gradient-to-br from-white via-blue-50/20 to-sky-50/10 dark:from-gray-700 dark:via-blue-900/10 dark:to-sky-900/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm hover:from-blue-50/40 hover:via-sky-50/30 hover:to-blue-50/20"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                                    selectedExternalStep === stepIndex
                                      ? "bg-white/25 text-white"
                                      : "bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/30 text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {stepIndex + 1}
                                </div>
                                <div className="text-left">
                                  <div
                                    className={`text-sm font-semibold line-clamp-1 ${
                                      selectedExternalStep === stepIndex
                                        ? "text-white"
                                        : "text-gray-800 dark:text-gray-200"
                                    }`}
                                  >
                                    {step.title}
                                  </div>
                                  <div
                                    className={`text-xs font-medium ${
                                      selectedExternalStep === stepIndex
                                        ? "text-white/80"
                                        : "text-blue-600/70 dark:text-blue-400/70"
                                    }`}
                                  >
                                    {step.suggested_Courses.length} khóa học
                                  </div>
                                </div>
                              </div>
                            </button>
                            {stepIndex <
                              displayData.externalLearningPath[
                                selectedExternalPath
                              ].steps.length -
                                1 && (
                              <FiChevronRight className="w-5 h-5 text-blue-400 dark:text-blue-600 flex-shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Course List Header */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Danh sách khóa học đề xuất
                      </h4>
                    </div>

                    {/* Compact Course Cards - Single Column */}
                    <div className="space-y-3">
                      {displayData.externalLearningPath[
                        selectedExternalPath
                      ].steps[selectedExternalStep].suggested_Courses.map(
                        (course, courseIndex) => (
                          <div
                            key={courseIndex}
                            className="group border border-blue-100 dark:border-blue-800/50 rounded-xl p-5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 bg-gradient-to-br from-white via-blue-50/30 to-sky-50/20 dark:from-gray-800 dark:via-blue-900/10 dark:to-sky-900/5 hover:from-blue-50/50 hover:via-sky-50/40 hover:to-blue-50/30"
                          >
                            {/* Course Header Row */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                {/* Provider and Level Tags */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    <FiStar className="w-3.5 h-3.5 mr-1.5" />
                                    {course.provider}
                                  </span>
                                  {course.level && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                      {course.level}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/10 text-blue-600 dark:text-blue-400  hover:text-white dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-sm"
                              >
                                <FiExternalLink className="w-4 h-4" />
                              </a>
                            </div>

                            {/* Reason Text */}
                            <p className="text-blue-700/80 dark:text-blue-300/80 text-sm leading-relaxed line-clamp-2 mb-3 font-normal">
                              {course.reason}
                            </p>

                            {/* Action Link */}
                            <a
                              href={course.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:gap-3 transition-all duration-200"
                            >
                              Xem chi tiết khóa học
                              <FiArrowDown className="w-4 h-4 rotate-[-90deg]" />
                            </a>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show when status = 1 (waiting for confirmation) */}
        {learningPathData?.status === 1 && (
          <div className="text-center">
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-slate-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl p-10 border-1 border-gray-200/50 dark:border-gray-700 shadow-2xl overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-[#49BBBD]/5 to-blue-500/5 pointer-events-none"></div>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/30 to-sky-100/20 dark:from-blue-900/20 dark:to-sky-900/10 rounded-full transform translate-x-24 -translate-y-24 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-100/30 to-amber-100/20 dark:from-orange-900/20 dark:to-amber-900/10 rounded-full transform -translate-x-28 translate-y-28 blur-2xl"></div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-orange-600 via-[#49BBBD] to-blue-600 bg-clip-text text-transparent">
                  Xác nhận lộ trình học tập
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-base max-w-2xl mx-auto leading-relaxed">
                  Bạn có đồng ý với lộ trình học tập được đề xuất? Sau khi xác
                  nhận, lộ trình này sẽ trở thành lộ trình chính thức của bạn.
                </p>

                {/* Selected Majors Summary */}
                {/* {selectedMajors.length > 0 && (
                  <div className="bg-gradient-to-r from-teal-50/80 via-cyan-50/60 to-blue-50/80 dark:from-teal-900/20 dark:via-cyan-900/15 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-teal-200/50 dark:border-cyan-800/30 shadow-sm">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center justify-center gap-2">
                      <FiAward className="w-5 h-5 text-[#49BBBD]" />
                      Chuyên ngành hẹp đã chọn
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      {majorOrder.map((majorId, index) => {
                        const path = displayData.internalLearningPath.find(
                          (p) => p.majorId === majorId,
                        );
                        if (!path) return null;

                        return (
                          <div
                            key={majorId}
                            className="bg-white dark:bg-gray-700 border-2 border-teal-200 dark:border-cyan-700 px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2.5 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                          >
                            <span className="w-6 h-6 bg-gradient-to-br from-orange-500 via-[#49BBBD] to-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                              {index + 1}
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 font-semibold">
                              {path.majorCode}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )} */}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
                  <Button
                    size="large"
                    onClick={handleGoBack}
                    className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-8 py-3 h-auto font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Quay về trang chủ
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    onClick={handleConfirmPath}
                    disabled={selectedMajors.length === 0 || isConfirming}
                    loading={isConfirming}
                    className="bg-gradient-to-r from-orange-500 via-[#49BBBD] to-blue-500 hover:from-orange-600 hover:via-[#3aa9ab] hover:to-blue-600 text-white border-0 px-10 py-3 h-auto font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:!bg-gradient-to-r disabled:!from-gray-400 disabled:!via-gray-500 disabled:!to-gray-400"
                    icon={!isConfirming && <FiCheck className="w-5 h-5" />}
                  >
                    {isConfirming
                      ? "Đang xác nhận..."
                      : `Xác nhận lộ trình (${selectedMajors.length} chuyên ngành)`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
