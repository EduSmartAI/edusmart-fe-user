"use client";

import React, { useState, useEffect } from "react";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { Button, Tag, Spin, message } from "antd";
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
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [majorOrder, setMajorOrder] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [viewingMajorId, setViewingMajorId] = useState<string | null>(null);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
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
  }: {
    semester: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    courses: any[];
    title: string;
  }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3 shadow-md">
          {semester}
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h4>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mt-1"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-13">
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
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {learningPathData.basicLearningPath.subjectName}
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Dựa trên kết quả khảo sát và đánh giá năng lực của bạn, AI đã tạo
              ra lộ trình học tập tối ưu để giúp bạn đạt được mục tiêu nghề
              nghiệp.
            </p>

            {/* Status Badge */}
            {learningPathData && (
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  learningPathData.status === 0
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                    : learningPathData.status === 1
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                      : learningPathData.status === 2
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-25 to-transparent dark:from-blue-900/10 dark:via-blue-800/5 dark:to-transparent rounded-3xl -m-4"></div>

            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-blue-700 dark:text-blue-400 mb-2 drop-shadow-lg">
                        Lộ trình khởi đầu
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Các môn học nền tảng được đề xuất dựa trên năng lực hiện
                      tại của bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-blue-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
                  {Object.entries(groupedBasicCourses).map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ([semester, courses]: [string, any]) => (
                      <SemesterSection
                        key={semester}
                        semester={parseInt(semester)}
                        courses={courses}
                        title={`Kỳ ${semester}`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Internal Learning Path */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-25 to-transparent dark:from-green-900/10 dark:via-emerald-800/5 dark:to-transparent rounded-3xl -m-4"></div>

            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
                        Chuyên ngành hẹp phù hợp
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      AI đề xuất các chuyên ngành hẹp phù hợp với năng lực và sở
                      thích của bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-green-200 dark:border-green-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-50 dark:bg-emerald-900/10 rounded-full transform -translate-x-14 translate-y-14"></div>
                <div className="relative z-10">
                  {/* Specialization Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {displayData.internalLearningPath.map((path, pathIndex) => (
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
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 shadow-lg"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md"
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
                                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
                                  : viewingMajorId === path.majorId
                                    ? "bg-white/20 text-white hover:bg-white/30 border border-white/40"
                                    : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
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
                    ))}
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
                              <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
                                Lộ trình {selectedPath.majorCode}
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {selectedPath.majorCourse.map((course, index) => (
                                <div
                                  key={index}
                                  className="transform hover:scale-105 transition-transform duration-300"
                                >
                                  <CourseCard
                                    {...convertToCourseCard(course)}
                                  />
                                </div>
                              ))}
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
                          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
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
                                  ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 opacity-50 scale-105 shadow-lg"
                                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:shadow-md hover:bg-green-100 dark:hover:bg-green-900/30"
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing">
                                  <FiMove className="w-5 h-5" />
                                </div>
                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                                  className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Di chuyển lên"
                                >
                                  <FiChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </button>
                                <button
                                  onClick={() => moveMajorDown(majorId)}
                                  disabled={index === majorOrder.length - 1}
                                  className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: External Learning Path */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-violet-25 to-transparent dark:from-purple-900/10 dark:via-violet-800/5 dark:to-transparent rounded-3xl -m-4"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-purple-700 dark:text-purple-400 mb-2 drop-shadow-lg">
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

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-100 dark:bg-purple-900/20 rounded-full transform translate-x-18 -translate-y-18"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/10 rounded-full transform -translate-x-16 translate-y-16"></div>
                <div className="relative z-10">
                  {/* Track Selection Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {displayData.externalLearningPath.map((path, pathIndex) => (
                      <div
                        key={pathIndex}
                        onClick={() => setSelectedExternalPath(pathIndex)}
                        className={`relative cursor-pointer rounded-lg p-5 transition-all duration-300 border ${
                          selectedExternalPath === pathIndex
                            ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white border-purple-500 shadow-lg"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md"
                        }`}
                      >
                        {/* Selection Indicator */}
                        {selectedExternalPath === pathIndex && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                          </div>
                        )}

                        {/* Content */}
                        <div>
                          <h3
                            className={`font-bold text-base mb-2 ${
                              selectedExternalPath === pathIndex
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {path.majorCode}
                          </h3>
                          <p
                            className={`text-sm mb-3 line-clamp-2 ${
                              selectedExternalPath === pathIndex
                                ? "text-white/90"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {path.reason}
                          </p>
                          <div
                            className={`flex items-center justify-between text-xs ${
                              selectedExternalPath === pathIndex
                                ? "text-white/80"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <span>
                              {path.steps.reduce(
                                (sum, step) =>
                                  sum + step.suggested_Courses.length,
                                0,
                              )}{" "}
                              khóa học
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Track Content */}
                  {displayData.externalLearningPath[selectedExternalPath] && (
                    <div>
                      {/* Track Header */}
                      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-3">
                          <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                            {
                              displayData.externalLearningPath[
                                selectedExternalPath
                              ].majorCode
                            }
                          </span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm ">
                          {
                            displayData.externalLearningPath[
                              selectedExternalPath
                            ].reason
                          }
                        </p>
                      </div>

                      {/* Learning Steps */}
                      <div className="space-y-6">
                        {displayData.externalLearningPath[
                          selectedExternalPath
                        ].steps.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                          >
                            {/* Step Header */}
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                    {stepIndex + 1}
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {step.title}
                                  </h4>
                                </div>
                                <Tag color="purple">
                                  {step.suggested_Courses.length} khóa học
                                </Tag>
                              </div>
                            </div>

                            {/* Courses Grid */}
                            <div className="p-5 bg-white dark:bg-gray-800">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {step.suggested_Courses.map(
                                  (course, courseIndex) => (
                                    <div
                                      key={courseIndex}
                                      className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                                    >
                                      {/* Course Header */}
                                      <div className="flex items-start justify-between mb-3">
                                        <h5 className="font-semibold text-gray-900 dark:text-white text-base flex-1 pr-2 leading-tight">
                                          {course.title}
                                        </h5>
                                        <FiExternalLink className="w-4 h-4 text-purple-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                      </div>

                                      {/* Tags */}
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        <Tag color="blue" className="text-xs">
                                          <FiStar className="w-3 h-3 inline mr-1" />
                                          {course.provider}
                                        </Tag>
                                        {course.level && (
                                          <Tag
                                            color="green"
                                            className="text-xs"
                                          >
                                            {course.level}
                                          </Tag>
                                        )}
                                      </div>

                                      {/* Reason */}
                                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                        {course.reason}
                                      </p>

                                      {/* Action Button */}
                                      <Button
                                        type="link"
                                        icon={<FiExternalLink />}
                                        href={course.link}
                                        target="_blank"
                                        className="p-0 h-auto text-purple-600 hover:text-purple-800"
                                      >
                                        Xem khóa học
                                      </Button>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Xác nhận lộ trình học tập
                </h3>
                <p className="text-blue-100 mb-4">
                  Bạn có đồng ý với lộ trình học tập được đề xuất? Sau khi xác
                  nhận, lộ trình này sẽ trở thành lộ trình chính thức của bạn.
                </p>

                {/* Selected Majors Summary */}
                {selectedMajors.length > 0 && (
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">
                      Chuyên ngành hẹp đã chọn:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {majorOrder.map((majorId, index) => {
                        const path = displayData.internalLearningPath.find(
                          (p) => p.majorId === majorId,
                        );
                        if (!path) return null;

                        return (
                          <div
                            key={majorId}
                            className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                          >
                            <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>{path.majorCode}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="large"
                    onClick={handleGoBack}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-8 py-3 h-auto font-semibold rounded-xl"
                  >
                    Quay về trang chủ
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    onClick={handleConfirmPath}
                    disabled={selectedMajors.length === 0 || isConfirming}
                    loading={isConfirming}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-1 hover:from-blue-700 hover:to-emerald-700 px-8 py-3 h-auto font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all disabled:!bg-gray-400 disabled:!text-white"
                    icon={!isConfirming && <FiCheck className="w-5 h-5" />}
                  >
                    {isConfirming
                      ? "Đang xác nhận..."
                      : `Xác nhận lộ trình (${selectedMajors.length} chuyên ngành)`}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
