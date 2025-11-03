/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(learning-path)/[id]/page.tsx
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

  const countGroupCourses = (groups?: { courses?: any[] }[]) =>
    (groups ?? []).reduce((sum, g) => sum + (g?.courses?.length ?? 0), 0);

  const groupBySemester = (courses: any[]) =>
    courses.reduce((acc: Record<number, any[]>, c: any) => {
      const sem = c?.semesterPosition ?? 0;
      if (!acc[sem]) acc[sem] = [];
      acc[sem].push(c);
      return acc;
    }, {});

  // Lấy danh sách kỳ từ danh sách môn (groups)
  const getSemestersFromGroups = (groups?: { courses?: any[] }[]) => {
    const set = new Set<number>();
    (groups ?? []).forEach((g) =>
      (g.courses ?? []).forEach((c) => {
        const sem = c?.semesterPosition ?? 0;
        if (sem > 0) set.add(sem);
      }),
    );
    return Array.from(set).sort((a, b) => a - b);
  };

  // Lọc mỗi group theo 1 kỳ cụ thể
  const filterGroupsBySemester = (groups: any[] | undefined, sem: number) =>
    (groups ?? [])
      .map((g) => ({
        ...g,
        courses: (g.courses ?? []).filter(
          (c: any) => (c?.semesterPosition ?? 0) === sem,
        ),
      }))
      .filter((g) => (g.courses?.length ?? 0) > 0);

  // ====== BASIC: Group Kỳ → Môn → Khóa (mỗi kỳ chỉ 1 header) ======
  const allBasicSemesters: number[] = useMemo(() => {
    const groups = learningPathData?.basicLearningPath?.courseGroups ?? [];
    const set = new Set<number>();
    groups.forEach((g) =>
      (g.courses ?? []).forEach((c) => {
        const sem = c?.semesterPosition ?? 0;
        if (sem > 0) set.add(sem);
      }),
    );
    return Array.from(set).sort((a, b) => a - b);
  }, [learningPathData?.basicLearningPath?.courseGroups]);

  const basicGroupsBySemester: Record<number, any[]> = useMemo(() => {
    const groups = learningPathData?.basicLearningPath?.courseGroups ?? [];
    const map: Record<number, any[]> = {};
    allBasicSemesters.forEach((sem) => {
      const filteredGroups = groups
        .map((g) => ({
          ...g,
          courses: (g.courses ?? []).filter(
            (c) => (c?.semesterPosition ?? 0) === sem,
          ),
        }))
        .filter((g) => (g.courses?.length ?? 0) > 0);
      if (filteredGroups.length > 0) map[sem] = filteredGroups;
    });
    return map;
  }, [learningPathData?.basicLearningPath?.courseGroups, allBasicSemesters]);
  // =================================================================

  // Badge trạng thái cho từng subject (CourseGroupDto.status)
  const SubjectStatusBadge = ({ status }: { status?: number }) => {
    const map: Record<number, { label: string; cls: string }> = {
      0: { label: "Chưa bắt đầu", cls: "bg-gray-100 text-gray-700" },
      1: { label: "Đang học", cls: "bg-blue-100 text-blue-700" },
      2: { label: "Hoàn thành", cls: "bg-emerald-100 text-emerald-700" },
      3: { label: "Bỏ qua", cls: "bg-amber-100 text-amber-700" },
    };
    const m = map[status ?? 0] ?? map[0];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.cls}`}>
        {m.label}
      </span>
    );
  };

  /**
   * Hiển thị MỘT MÔN (CourseGroupDto).
   * - showSemesterHeading=false: không render "Kỳ {n}" ở trong (dùng khi bên ngoài đã có header Kỳ).
   * - semesterHeaderStyle="large": header kỳ to (khi cần).
   */
  const SubjectGroupSection = ({
    group,
    showSemesterHeading = true,
    semesterHeaderStyle = "compact",
  }: {
    group: any;
    showSemesterHeading?: boolean;
    semesterHeaderStyle?: "compact" | "large";
  }) => {
    const bySemester = groupBySemester(group?.courses ?? []);
    const hasSemester = Object.keys(bySemester).length > 0;

    return (
      <div className="mb-8">
        {/* Header môn + badge trạng thái */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded-md bg-[#49BBBD] text-white text-xs font-bold">
              {group?.subjectCode ?? "Subject"}
            </div>
            <SubjectStatusBadge status={group?.status} />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {(group?.courses?.length ?? 0)} khóa học
          </span>
        </div>

        {/* Khóa học theo kỳ */}
        {hasSemester ? (
          Object.entries(bySemester).map(([sem, list]: [string, any[]]) => (
            <div key={sem} className="mb-4">
              {showSemesterHeading && (
                semesterHeaderStyle === "large" ? (
                  <div className="flex items-center mb-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl flex items-center justify-center text-sm font-extrabold mr-3 shadow">
                      {sem}
                    </div>
                    <div>
                      <div className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                        Kỳ {sem}
                      </div>
                      <div className="w-12 h-[3px] bg-orange-500 rounded mt-1" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mb-2">
                    <div className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs font-bold mr-2">
                      {sem}
                    </div>
                    <span className="text-sm font-semibold">Kỳ {sem}</span>
                  </div>
                )
              )}

              <div className="flex flex-wrap gap-4">
                {list.map((course, i) => (
                  <div
                    key={`${group?.subjectCode}-${sem}-${i}`}
                    className="transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <CourseCard {...convertToCourseCard(course)} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-wrap gap-4">
            {(group?.courses ?? []).map((course: any, i: number) => (
              <div
                key={`${group?.subjectCode}-flat-${i}`}
                className="transform hover:scale-[1.02] transition-all duration-300"
              >
                <CourseCard {...convertToCourseCard(course)} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
    if (!learningPathData?.internalLearningPath) return [];
    if (learningPathData.status === 2) {
      return [...learningPathData.internalLearningPath].sort(
        (a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0),
      );
    }
    return learningPathData.internalLearningPath;
  }, [learningPathData]);

  // Auto expand first combo when status = 2
  useEffect(() => {
    if (learningPathData?.status === 2 && sortedInternalPath.length > 0) {
      setExpandedMajorId(String(sortedInternalPath[0].majorId ?? ""));
    }
  }, [learningPathData?.status, sortedInternalPath]);

  const handleConfirmPath = async () => {
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
      const result = await confirmLearningPathAction(learningPathId, majorOrder);

      if (result.ok) {
        setLearningPathData(result.data);
        message.success({
          content: `Xác nhận lộ trình học tập thành công! ${
            result.status === 2 ? "Đang học tập" : "Đã cập nhật"
          }`,
          duration: 2,
        });
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
    if (!majorId) return;
    if (selectedMajors.includes(majorId)) {
      setSelectedMajors((prev) => prev.filter((id) => id !== majorId));
      setMajorOrder((prev) => prev.filter((id) => id !== majorId));
    } else {
      setSelectedMajors((prev) => [...prev, majorId]);
      setMajorOrder((prev) => [...prev, majorId]);
    }
  };

  // Move major up/down in order
  const moveMajorUp = (majorId: string) => {
    const i = majorOrder.indexOf(majorId);
    if (i > 0) {
      const arr = [...majorOrder];
      [arr[i - 1], arr[i]] = [arr[i - 1], arr[i]];
      setMajorOrder(arr);
    }
  };
  const moveMajorDown = (majorId: string) => {
    const i = majorOrder.indexOf(majorId);
    if (i !== -1 && i < majorOrder.length - 1) {
      const arr = [...majorOrder];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      setMajorOrder(arr);
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
    const arr = [...majorOrder];
    arr.splice(draggedIndex, 1);
    arr.splice(targetIndex, 0, draggedItem);
    setMajorOrder(arr);
    setDraggedItem(null);
  };
  const handleDragEnd = () => setDraggedItem(null);

  // Show loading
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

  // Show error state
  if (!learningPathData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Không tìm thấy lộ trình học tập
          </p>
        </div>
      </div>
    );
  }

  const displayData = learningPathData;

  // ---- Convert sang props của CourseCard ----
  const convertToCourseCard = (course: any) => ({
    imageUrl: course?.courseImageUrl,
    title: course?.title,
    descriptionLines: [course?.shortDescription],
    instructor: `${course?.subjectCode ?? ""} - Kỳ ${course?.semesterPosition ?? ""}`,
    price: course?.price,
    dealPrice: course?.dealPrice,
    routerPush: `/course/${course.courseId}`,
    level: course?.level,
    duration:
      typeof course?.durationHours === "number"
        ? `${course.durationHours}h`
        : typeof course?.durationMinutes === "number"
          ? `${Math.round(course.durationMinutes / 60)}h`
          : undefined,
    learnerCount: course?.learnerCount,
  });

  // ---- Header Progress (completionPercent) ----
  const completion = Math.max(
    0,
    Math.min(100, Math.round((displayData.completionPercent ?? 0) * 100) / 100),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] via-cyan-500 to-[#4acfd1]">
              {displayData.pathName || "Learning Path"}
            </span>
          </h1>

          {/* Completion percent */}
          <div className="mx-auto max-w-xl mb-6">
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-emerald-500 via-[#49BBBD] to-cyan-500 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Hoàn thành: <span className="font-semibold">{completion}%</span>
            </div>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Dựa trên kết quả khảo sát và đánh giá năng lực của bạn, AI đã tạo ra
            lộ trình học tập tối ưu để giúp bạn đạt được mục tiêu nghề nghiệp.
          </p>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              displayData.status === 0
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                : displayData.status === 1
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                : displayData.status === 2
                ? "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300"
                : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
            }`}
          >
            <FiClock className="w-4 h-4 mr-2" />
            {displayData.status === 0
              ? "AI đang tạo lộ trình"
              : displayData.status === 1
              ? "Đang chờ xác nhận"
              : displayData.status === 2
              ? "Đang học tập"
              : `Trạng thái: ${displayData.status}`}
          </div>
        </div>

        {/* Section 1: Basic Learning Path — Kỳ → Môn → Khoá (mỗi kỳ 1 lần) */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/60 via-amber-25 to-transparent dark:from-orange-900/10 dark:via-amber-800/5 dark:to-transparent rounded-3xl -m-4"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="pl-6">
                <h2 className="text-3xl font-black text-orange-600 dark:text-orange-400 mb-2 drop-shadow-lg">
                  Lộ trình khởi đầu
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Các môn học nền tảng được đề xuất dựa trên năng lực hiện tại
                  của bạn
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-orange-200 dark:border-orange-400/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-full transform -translate-x-12 translate-y-12" />
              <div className="relative z-10">
                {allBasicSemesters.map((sem, idx) => {
                  const groups = basicGroupsBySemester[sem] ?? [];
                  const isLast = idx === allBasicSemesters.length - 1;
                  if (groups.length === 0) return null;

                  return (
                    <div key={sem} className="mb-10">
                      <div className="flex items-center mb-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
                          {sem}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                            Kỳ {sem}
                          </h4>
                          <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                        </div>
                      </div>

                      {/* LIST SUBJECT GROUPS (ẩn header kỳ bên trong) */}
                      <div className="space-y-6">
                        {groups.map((g, gi) => (
                          <SubjectGroupSection
                            key={g?.subjectCode ?? gi}
                            group={g}
                            showSemesterHeading={false}
                          />
                        ))}
                      </div>

                      {!isLast && (
                        <div className="mt-10 flex items-center gap-4">
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
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Internal Learning Path (đã đổi sang Kỳ → Môn → Khoá) */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/60 via-cyan-25 to-transparent dark:from-teal-900/10 dark:via-cyan-800/5 dark:to-transparent rounded-3xl -m-4"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="pl-6">
                <h2 className="text-3xl font-black text-[#49BBBD] dark:text-cyan-400 mb-2 drop-shadow-lg">
                  {displayData.status === 2
                    ? "Chuyên ngành hẹp"
                    : "Chuyên ngành hẹp phù hợp"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {displayData.status === 2
                    ? `Bạn đã chọn ${sortedInternalPath.length} chuyên ngành hẹp. Học theo thứ tự đã sắp xếp để hiệu quả nhất.`
                    : "AI đề xuất các chuyên ngành hẹp phù hợp với năng lực và sở thích của bạn"}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-teal-200 dark:border-cyan-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full transform translate-x-20 -translate-y-20" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-cyan-50 dark:bg-cyan-900/10 rounded-full transform -translate-x-14 translate-y-14" />

              <div className="relative z-10">
                {/* TIMELINE VIEW - Status = 2 */}
                {displayData.status === 2 && (
                  <div className="space-y-6">
                    {sortedInternalPath.map((path, index) => {
                      const id = String(path.majorId ?? "");
                      const isExpanded = expandedMajorId === id;

                      // Tính danh sách kỳ cho combo này
                      const sems = getSemestersFromGroups(
                        path.majorCourseGroups,
                      );

                      return (
                        <div key={id} className="relative">
                          <div
                            onClick={() =>
                              setExpandedMajorId(isExpanded ? null : id)
                            }
                            className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
                              isExpanded
                                ? "border border-[#49BBBD] bg-teal-50/50 dark:bg-teal-900/20 shadow-lg"
                                : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-teal-200 dark:hover:border-cyan-600 hover:shadow-sm"
                            }`}
                          >
                            {/* Header combo */}
                            <div className="flex items-start gap-4 mb-4">
                              <div
                                className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black shadow-md ${
                                  index === 0
                                    ? "bg-gradient-to-br from-[#49BBBD] to-cyan-600 text-white"
                                    : "bg-gradient-to-br from-teal-400 to-cyan-500 text-white"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                    {path.majorCode}
                                  </h3>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                  {countGroupCourses(path.majorCourseGroups)} khóa học
                                </span>
                              </div>
                            </div>

                            {/* Reason */}
                            {path.reason && (
                              <p
                                className={`text-sm leading-relaxed ${
                                  isExpanded
                                    ? "text-gray-700 dark:text-gray-300 mb-4"
                                    : "text-gray-600 dark:text-gray-400 line-clamp-2 mb-1"
                                }`}
                              >
                                {path.reason}
                              </p>
                            )}

                            {/* CTA collapsed */}
                            {!isExpanded && (
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-[#49BBBD] dark:text-cyan-400 text-sm font-semibold">
                                  Xem chi tiết theo kỳ
                                </span>
                                <FiChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            )}

                            {/* Expanded: Kỳ → Môn → Khóa (ẩn heading Kỳ trong môn) */}
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-teal-200 dark:border-cyan-800">
                                {sems.map((sem) => {
                                  const groupsForSem = filterGroupsBySemester(
                                    path.majorCourseGroups,
                                    sem,
                                  );
                                  if (groupsForSem.length === 0) return null;
                                  return (
                                    <div key={`major-${id}-sem-${sem}`} className="mb-10">
                                      <div className="flex items-center mb-5">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
                                          {sem}
                                        </div>
                                        <div>
                                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Kỳ {sem}
                                          </h4>
                                          <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                                        </div>
                                      </div>

                                      <div className="space-y-6">
                                        {groupsForSem.map((g: any, gi: number) => (
                                          <SubjectGroupSection
                                            key={g?.subjectCode ?? gi}
                                            group={g}
                                            showSemesterHeading={false}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* GRID VIEW - Status = 1 (chọn & sắp xếp) */}
                {displayData.status === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {displayData.internalLearningPath?.map((path, idx) => {
                        const id = String(path.majorId ?? "");
                        const total = countGroupCourses(path.majorCourseGroups);
                        return (
                          <div
                            key={id || idx}
                            onClick={() =>
                              setViewingMajorId(viewingMajorId === id ? null : id)
                            }
                            className={`relative cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
                              viewingMajorId === id
                                ? "bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white border-[#49BBBD] shadow-lg"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-cyan-600 hover:shadow-md"
                            }`}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                              <h3
                                className={`font-bold text-base leading-tight ${
                                  viewingMajorId === id
                                    ? "text-white"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {path.majorCode}
                              </h3>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  viewingMajorId === id
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {total} khóa học
                              </div>
                            </div>

                            {/* Reason */}
                            <p
                              className={`text-sm mb-3 line-clamp-2 ${
                                viewingMajorId === id
                                  ? "text-white/90"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {path.reason || `${total} khóa học chuyên sâu`}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMajorToggle(id);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  selectedMajors.includes(id)
                                    ? viewingMajorId === id
                                      ? "bg-white text-black hover:bg-gray-50 shadow-sm"
                                      : "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-800 dark:text-teal-100"
                                    : viewingMajorId === id
                                    ? "bg-white/20 text-white hover:bg-white/30 border border-white/40"
                                    : "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400"
                                }`}
                              >
                                {selectedMajors.includes(id) ? (
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
                                  viewingMajorId === id
                                    ? "text-white/70"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {viewingMajorId === id
                                  ? "Đang xem"
                                  : "Nhấn để xem"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Courses of selected major — Kỳ → Môn → Khoá */}
                    {viewingMajorId && (
                      <div>
                        {(() => {
                          const selectedPath =
                            displayData.internalLearningPath?.find(
                              (p) => String(p.majorId ?? "") === viewingMajorId,
                            );
                          if (!selectedPath) return null;

                          const sems = getSemestersFromGroups(
                            selectedPath.majorCourseGroups,
                          );

                          return (
                            <>
                              <div className="mb-6">
                                <h3 className="text-2xl font-black text-[#49BBBD] dark:text-cyan-400 drop-shadow-lg">
                                  Lộ trình {selectedPath.majorCode}
                                </h3>
                              </div>

                              {sems.map((sem) => {
                                const groupsForSem = filterGroupsBySemester(
                                  selectedPath.majorCourseGroups,
                                  sem,
                                );
                                if (groupsForSem.length === 0) return null;
                                return (
                                  <div key={`view-${viewingMajorId}-sem-${sem}`} className="mb-10">
                                    <div className="flex items-center mb-5">
                                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
                                        {sem}
                                      </div>
                                      <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                          Kỳ {sem}
                                        </h4>
                                        <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                                      </div>
                                    </div>

                                    <div className="space-y-6">
                                      {groupsForSem.map((g: any, gi: number) => (
                                        <SubjectGroupSection
                                          key={g?.subjectCode ?? gi}
                                          group={g}
                                          showSemesterHeading={false}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Selected Order Management */}
                    {selectedMajors.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="mb-6">
                          <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 drop-shadow-lg">
                              Thứ tự học đã chọn
                            </span>
                            <span className="ml-3 text-base font-medium text-gray-500 dark:text-gray-400">
                              ({selectedMajors.length} combo)
                            </span>
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {majorOrder.map((majorId, index) => {
                            const path = displayData.internalLearningPath?.find(
                              (p) => String(p.majorId ?? "") === majorId,
                            );
                            if (!path) return null;

                            const total = countGroupCourses(
                              path.majorCourseGroups,
                            );
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
                                      {total} khóa học
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

        {/* Section 3: External Learning Path (giữ nguyên) */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-white/20 to-transparent dark:from-gray-900/20 dark:via-gray-800/10 dark:to-transparent rounded-3xl -m-4"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <div className="pl-6">
                <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-2">
                  Đề xuất các khóa học bên ngoài
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Các khóa học từ các nền tảng uy tín để nâng cao kỹ năng chuyên
                  môn
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100 dark:bg-gray-700/20 rounded-full transform translate-x-20 -translate-y-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gray-50 dark:bg-gray-800/20 rounded-full transform -translate-x-20 translate-y-20 opacity-50"></div>
              <div className="relative z-10">
                {/* Track Selector */}
                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  {displayData.externalLearningPath?.map((path, pathIndex) => (
                    <button
                      key={pathIndex}
                      onClick={() => {
                        setSelectedExternalPath(pathIndex);
                        setSelectedExternalStep(0);
                      }}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        selectedExternalPath === pathIndex
                          ? "bg-gradient-to-r from-blue-500 to-sky-600 !text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      {path.majorCode}
                    </button>
                  ))}
                </div>

                {/* Selected Track Content */}
                {displayData.externalLearningPath?.[selectedExternalPath] && (
                  <>
                    {(() => {
                      const selectedExternal =
                        displayData.externalLearningPath?.[selectedExternalPath];
                      if (!selectedExternal) return null;

                      return (
                        <div>
                          {/* Track Description */}
                          <div className="mb-6 p-4 bg-blue-100/50 dark:bg-gray-700/30 rounded-lg border border-blue-300/50 dark:border-blue-600">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              {selectedExternal.majorCode}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {selectedExternal.reason}
                            </p>
                          </div>

                          {/* Steps timeline */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              Các bước học tập
                            </h4>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                              {selectedExternal.steps?.map(
                                (step: any, stepIndex: number) => (
                                  <React.Fragment key={stepIndex}>
                                    <button
                                      onClick={() =>
                                        setSelectedExternalStep(stepIndex)
                                      }
                                      className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all duration-200 ${
                                        selectedExternalStep === stepIndex
                                          ? "bg-gradient-to-r from-blue-500 to-sky-600 text-white border-blue-500 shadow-sm"
                                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div
                                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                            selectedExternalStep === stepIndex
                                              ? "bg-white/25 text-white"
                                              : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                                          }`}
                                        >
                                          {stepIndex + 1}
                                        </div>
                                        <div className="text-left hidden sm:block">
                                          <div
                                            className={`text-sm font-semibold line-clamp-1 ${
                                              selectedExternalStep === stepIndex
                                                ? "text-white"
                                                : "text-gray-800 dark:text-gray-200"
                                            }`}
                                          >
                                            {step?.title}
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                    {stepIndex <
                                      (selectedExternal.steps?.length ?? 0) - 1 && (
                                      <FiChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                                    )}
                                  </React.Fragment>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Course List */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Danh sách khóa học đề xuất
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {selectedExternal.steps
                              ? selectedExternal.steps?.[selectedExternalStep]
                                  ?.suggested_Courses?.map(
                                    (course: any, courseIndex: number) => (
                                      <div
                                        key={courseIndex}
                                        className="group border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 bg-white dark:bg-gray-700/50"
                                      >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                <FiStar className="w-3.5 h-3.5 mr-1.5" />
                                                {course?.provider}
                                              </span>
                                              {course?.level && (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                  {course.level}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          {course?.link && (
                                            <a
                                              href={course.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 flex items-center justify-center shadow-sm"
                                            >
                                              <FiExternalLink className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3 font-normal">
                                          {course?.reason}
                                        </p>

                                        {course?.link && (
                                          <a
                                            href={course.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:gap-3 transition-all duration-200"
                                          >
                                            Xem chi tiết khóa học
                                            <FiArrowDown className="w-4 h-4 rotate-[-90deg]" />
                                          </a>
                                        )}
                                      </div>
                                    ),
                                  )
                              : null}
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only when status = 1 */}
        {displayData.status === 1 && (
          <div className="text-center">
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-slate-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl p-10 border border-gray-200/50 dark:border-gray-700 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-[#49BBBD]/5 to-blue-500/5 pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/30 to-sky-100/20 dark:from-blue-900/20 dark:to-sky-900/10 rounded-full transform translate-x-24 -translate-y-24 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-orange-100/30 to-amber-100/20 dark:from-orange-900/20 dark:to-amber-900/10 rounded-full transform -translate-x-28 translate-y-28 blur-2xl" />

              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-orange-600 via-[#49BBBD] to-blue-600 bg-clip-text text-transparent">
                  Xác nhận lộ trình học tập
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-base max-w-2xl mx-auto leading-relaxed">
                  Bạn có đồng ý với lộ trình học tập được đề xuất? Sau khi xác
                  nhận, lộ trình này sẽ trở thành lộ trình chính thức của bạn.
                </p>

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
                    className="bg-gradient-to-r from-orange-500 via-[#49BBBD] to-blue-500 hover:from-orange-600 hover:via-[#3aa9ab] hover:to-blue-600 text-white border-0 px-10 py-3 h-auto font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
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
