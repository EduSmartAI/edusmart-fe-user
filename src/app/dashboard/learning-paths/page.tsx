"use client";

import React, { useState, useEffect } from "react";
import { Button, Spin, Empty, Pagination, Input, Select, message, Tag } from "antd";
import { useRouter } from "next/navigation";
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiPause,
  FiX,
  FiArrowRight,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { getAllLearningPathsAction } from "EduSmart/app/(learning-path)/learningPathAction";

interface LearningPath {
  pathId: string;
  pathName: string;
  createdAt: string;
  status: number;
}

const statusConfig = {
  0: {
    label: "Đang xử lý",
    color: "processing",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: <FiLoader className="w-5 h-5 animate-spin" />,
    description: "AI đang tạo lộ trình học tập cho bạn",
  },
  1: {
    label: "Chờ xác nhận",
    color: "warning",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: <FiAlertCircle className="w-5 h-5" />,
    description: "Vui lòng xác nhận lộ trình học tập",
  },
  2: {
    label: "Đang học tập",
    color: "success",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    textColor: "text-teal-700 dark:text-teal-300",
    icon: <FiCheckCircle className="w-5 h-5" />,
    description: "Bạn đang theo dõi lộ trình này",
  },
  3: {
    label: "Đã hoàn thành",
    color: "success",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    icon: <FiCheckCircle className="w-5 h-5" />,
    description: "Bạn đã hoàn thành lộ trình này",
  },
  4: {
    label: "Đã đóng",
    color: "error",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    icon: <FiX className="w-5 h-5" />,
    description: "Lộ trình này đã bị đóng",
  },
  5: {
    label: "Tạm dừng",
    color: "default",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    icon: <FiPause className="w-5 h-5" />,
    description: "Lộ trình này đang tạm dừng",
  },
};

export default function LearningPathHistoryPage() {
  const router = useRouter();
  const [allPaths, setAllPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedStatus]);

  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true);
      // Fetch ALL data once (pageIndex: 0, pageSize: 1000)
      const result = await getAllLearningPathsAction(0, 1000);

      if (result.ok) {
        // Sort by createdAt - newest first
        const sortedPaths = (result.data.data || []).sort((a: LearningPath, b: LearningPath) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        setAllPaths(sortedPaths);
      } else {
        message.error(result.error || "Không thể tải danh sách lộ trình");
      }
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách lộ trình");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter paths
  const filteredPaths = allPaths.filter((path) => {
    const matchesSearch = path.pathName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === null || path.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Paginate filtered paths
  const totalCount = filteredPaths.length;
  const paginatedPaths = filteredPaths.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePathClick = (pathId: string, status: number) => {
    router.push(`/dashboard/learning-paths/${pathId}`);
  };

  const statusOptions = [
    { label: "Tất cả trạng thái", value: null },
    { label: "Đang xử lý", value: 0 },
    { label: "Chờ xác nhận", value: 1 },
    { label: "Đang học tập", value: 2 },
    { label: "Đã hoàn thành", value: 3 },
    { label: "Đã đóng", value: 4 },
    { label: "Tạm dừng", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black mb-3 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] via-cyan-500 to-[#4acfd1]">
                  Tất cả lộ trình học tập
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Quản lý và theo dõi tất cả lộ trình học tập của bạn
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-[#49BBBD] dark:text-cyan-400">
                {totalCount}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">lộ trình</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Tìm kiếm lộ trình..."
              prefix={<FiSearch className="w-4 h-4" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 !h-11 !rounded-lg"
              allowClear
            />
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              className="w-full sm:w-48 !h-11"
              optionLabelProp="label"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Đang tải lộ trình học tập...
              </p>
            </div>
          </div>
        ) : filteredPaths.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Empty
              description="Không tìm thấy lộ trình nào"
              style={{
                color: "rgb(107, 114, 128)",
              }}
            />
          </div>
        ) : (
          <>
            {/* Paths Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPaths.map((path) => {
                const config = statusConfig[path.status as keyof typeof statusConfig] || statusConfig[0];

                return (
                  <div
                    key={path.pathId}
                    onClick={() => handlePathClick(path.pathId, path.status)}
                    className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 hover:shadow-xl hover:-translate-y-2 ${
                      config.bgColor
                    } ${config.borderColor}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#49BBBD] transition-colors">
                          {path.pathName}
                        </h3>
                      </div>
                      <div className={`flex-shrink-0 ml-3 ${config.textColor}`}>
                        {config.icon}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <Tag
                        color={config.color}
                        className="!text-xs !font-semibold !px-3 !py-1 !rounded-full"
                      >
                        {config.label}
                      </Tag>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {config.description}
                    </p>

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <FiClock className="w-4 h-4 mr-2" />
                      {formatDate(path.createdAt)}
                    </div>

                    {/* Action Button */}
                    <Button
                      type="primary"
                      block
                      className="!bg-gradient-to-r from-[#49BBBD] to-cyan-600 hover:from-[#3da8aa] hover:to-cyan-700 !border-0 !rounded-lg !font-semibold group-hover:shadow-lg transition-all"
                      icon={<FiArrowRight className="w-4 h-4" />}
                      iconPosition="end"
                    >
                      {path.status === 0 && "Xem chi tiết"}
                      {path.status === 1 && "Xác nhận lộ trình"}
                      {path.status === 2 && "Tiếp tục học"}
                      {path.status === 3 && "Xem kết quả"}
                      {path.status === 4 && "Xem chi tiết"}
                      {path.status === 5 && "Tiếp tục"}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={(page) => setCurrentPage(page)}
                  onShowSizeChange={(current, size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  showSizeChanger
                  // showTotal={(total) => `Tổng cộng ${total} lộ trình`}
                  pageSizeOptions={[12, 24, 36, 48]}
                  className="dark:text-gray-300"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}