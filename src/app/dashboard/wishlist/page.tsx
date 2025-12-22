"use client";

import React, { useState, useEffect } from "react";
import { Input, Empty, Spin, Select, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { CourseClient } from "EduSmart/hooks/apiClient";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";

const { Search } = Input;

// Sort options
const SORT_OPTIONS = [
  { value: "createdAt", label: "Thêm gần nhất" },
  { value: "title", label: "Tên khóa học (A-Z)" },
  { value: "price", label: "Giá (Thấp đến cao)" },
];

interface WishlistItem {
  wishlistId?: string;
  courseId?: string;
  teacherName?: string | null;
  courseTitle?: string | null;
  courseDescription?: string | null;
  courseShortDescription?: string | null;
  courseImageUrl?: string | null;
  courseLevel?: number | null;
  coursePrice?: number | null;
  courseDealPrice?: number | null;
  courseSlug?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100); // Load all items
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalCount, setTotalCount] = useState(0);

  // Fetch wishlist
  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CourseClient.api.courseWishlistList({
        Page: currentPage,
        Size: pageSize,
        Search: searchText.trim() || undefined,
      });

      if (response.data.success && response.data.response) {
        const data = response.data.response;
        setWishlist(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
      } else {
        setError(response.data.message ?? "Không thể tải danh sách yêu thích.");
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Đã xảy ra lỗi khi tải danh sách yêu thích.");
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setSearchText("");
    fetchWishlist();
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchWishlist();
  };

  // Filter and sort
  const getFilteredWishlist = () => {
    let filtered = [...wishlist];

    // Search filter (already handled by API, but keep for client-side filtering)
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.courseTitle?.toLowerCase().includes(search) ||
          item.courseShortDescription?.toLowerCase().includes(search) ||
          item.teacherName?.toLowerCase().includes(search),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.courseTitle || "").localeCompare(b.courseTitle || "");
        case "price":
          const priceA = a.courseDealPrice ?? a.coursePrice ?? 0;
          const priceB = b.courseDealPrice ?? b.coursePrice ?? 0;
          return priceA - priceB;
        default: // createdAt
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return filtered;
  };

  const filteredWishlist = getFilteredWishlist();

  // Empty state
  if (!loading && wishlist.length === 0 && !error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh sách yêu thích của bạn đang trống
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Hãy thêm các khóa học yêu thích để học sau!
              </p>
            </div>
          }
        />
        <Button type="primary" size="large" href="/course" className="mt-6">
          Khám phá khóa học
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Search
            placeholder="Tìm kiếm khóa học..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            allowClear
            size="large"
            className="max-w-md"
            enterButton
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
          loading={loading}
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
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Spin size="large" tip="Đang tải danh sách yêu thích...">
            <div className="p-12" />
          </Spin>
        </div>
      )}

      {/* Wishlist */}
      {!loading && !error && filteredWishlist.length > 0 && (
        <div className=" flex flex-row flex-wrap gap-5">
          {filteredWishlist.map((item) => (
            <div key={item.wishlistId}>
              <CourseCard
                id={item.courseId}
                imageUrl={item.courseImageUrl || "/placeholder-course.png"}
                title={item.courseTitle || "Khóa học"}
                descriptionLines={
                  item.courseShortDescription
                    ? [item.courseShortDescription]
                    : []
                }
                instructor={item.teacherName || "EduSmart"}
                level={item.courseLevel}
                price={item.coursePrice ?? undefined}
                dealPrice={item.courseDealPrice}
                isWishList={true}
                routerPush={`/course/${item.courseId}`}
                isHorizontal={false}
                onToggleWishList={async () => {
                  // Refresh list after successful removal
                  await fetchWishlist();
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading &&
        !error &&
        filteredWishlist.length === 0 &&
        wishlist.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không tìm thấy khóa học nào phù hợp"
            />
          </div>
        )}
    </div>
  );
}
