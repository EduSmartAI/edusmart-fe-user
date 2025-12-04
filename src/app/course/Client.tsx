"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Layout,
  Row,
  Select,
  Spin,
  Tag,
} from "antd";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { FiFilter } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterContent, {
  FilterGroup,
} from "EduSmart/components/Common/Filter/FilterContent";
import Title from "antd/es/typography/Title";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import CourseSearchSection from "EduSmart/components/Course/HeroBannerCourse";
import { ZoomIn } from "EduSmart/components/Animation/ZoomIn";
import BaseScreenWhiteNav from "EduSmart/layout/BaseScreenWhiteNav";
import { Course } from "../apiServer/courseAction";
import { useLoadingStore } from "EduSmart/stores/Loading/LoadingStore";
import { CourseLevel, CourseSortBy } from "EduSmart/enum/enum";

type FilterState = Record<string, string[]>;

interface CourseListPageProps {
  courses: Course[];
  totalCount?: number;
  page?: number;
  size?: number;
  searchCoursedata?: Course[];
  sortBy?: CourseSortBy;
}

export default function CourseListPage({
  courses = [],
  totalCount,
  page = 1,
  size = 10,
  searchCoursedata = [],
  sortBy = CourseSortBy.Latest,
}: CourseListPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState(false);
  const [visibleCourses, setVisibleCourses] = useState<Course[]>(courses);
  const [currentPage, setCurrentPage] = useState(page);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const totalAvailable = totalCount ?? 0;
  const pageSize = size ?? 10;
  const [hasMore, setHasMore] = useState(page * pageSize < totalAvailable);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentSearch = searchParams.get("search") ?? "";

  const levelOptions = useMemo(
    () => [
      { label: "Người mới bắt đầu", value: String(CourseLevel.Beginner) },
      { label: "Trung cấp", value: String(CourseLevel.Intermidiate) },
      { label: "Nâng cao", value: String(CourseLevel.Advanced) },
    ],
    [],
  );

  const tagOptions = useMemo(() => {
    const tagSet = new Set<string>();
    [...courses, ...(searchCoursedata ?? [])].forEach((course) => {
      (course.tagNames ?? []).forEach((tag) => {
        if (tag.trim()) tagSet.add(tag);
      });
    });
    return Array.from(tagSet)
      .sort((a, b) => a.localeCompare(b))
      .map((tag) => ({ label: tag, value: tag }));
  }, [courses, searchCoursedata]);

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        param: "level",
        title: "Cấp độ",
        type: "multi",
        options: levelOptions,
      },
      ...(tagOptions.length
        ? [
            {
              param: "tag",
              title: "Chủ đề (tags)",
              type: "multi" as const,
              options: tagOptions,
            },
          ]
        : []),
    ],
    [levelOptions, tagOptions],
  );

  const levelFilters = useMemo(
    () => searchParams.getAll("level"),
    [searchParams],
  );
  const tagFilters = useMemo(() => searchParams.getAll("tag"), [searchParams]);
  const sortValue = searchParams.get("sortBy") ?? String(sortBy);
  const sortOptions = useMemo(
    () => [
      { value: String(CourseSortBy.Latest), label: "Mới nhất" },
      { value: String(CourseSortBy.Popular), label: "Phổ biến" },
      { value: String(CourseSortBy.TitleAsc), label: "Tên (A-Z)" },
      { value: String(CourseSortBy.TitleDesc), label: "Tên (Z-A)" },
    ],
    [],
  );

  const optionLabelLookup = useMemo(() => {
    const lookup: Record<string, Record<string, string>> = {};
    filterGroups.forEach((group) => {
      lookup[group.param] = {};
      group.options.forEach((opt) => {
        lookup[group.param][opt.value] = opt.label;
      });
    });
    return lookup;
  }, [filterGroups]);

  const readParamValues = useCallback(
    (sp: URLSearchParams, key: string) => {
      const multi = sp.getAll(key);
      if (multi.length) return multi;
      const single = sp.get(key);
      return single ? single.split(",").filter(Boolean) : [];
    },
    [],
  );

  const initialFilterValues = useMemo<FilterState>(() => {
    const state: FilterState = {};
    filterGroups.forEach((group) => {
      state[group.param] = readParamValues(searchParams, group.param);
    });
    return state;
  }, [filterGroups, readParamValues, searchParams]);

  const emptyFilterState = useMemo<FilterState>(() => {
    const state: FilterState = {};
    filterGroups.forEach((group) => {
      state[group.param] = [];
    });
    return state;
  }, [filterGroups]);

  const [draftFilters, setDraftFilters] =
    useState<FilterState>(initialFilterValues);

  useEffect(() => {
    setDraftFilters(initialFilterValues);
  }, [initialFilterValues]);

  const showLoading = useLoadingStore((s) => s.showLoading);
  const hideLoading = useLoadingStore((s) => s.hideLoading);

  const replaceWithLoading = useCallback(
    (url: string) => {
      showLoading();
      router.replace(url, { scroll: false });
    },
    [router, showLoading],
  );

  const setQueryParams = (updater: (sp: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams.toString());
    updater(next);
    replaceWithLoading(`${pathname}?${next.toString()}`);
  };

  const setSort = (val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sortBy", val);
    next.set("page", "1");
    replaceWithLoading(`${pathname}?${next.toString()}`);
  };

  const removeParamValue = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    const current = readParamValues(next, key).filter((v) => v !== val);
    next.delete(key);
    current.forEach((v) => next.append(key, v));
    const qs = next.toString();
    replaceWithLoading(qs ? `${pathname}?${qs}` : pathname);
  };

  const buildChipList = useCallback(
    (state: FilterState) =>
      Object.entries(state).flatMap(([param, values]) =>
        values.map((value) => ({
          param,
          value,
          label: optionLabelLookup[param]?.[value] ?? value,
        })),
      ),
    [optionLabelLookup],
  );

  const getChipClass = useCallback(
    (param: string, value: string, variant: "pending" | "applied") => {
      if (param === "level") {
        const lv = Number(value);
        switch (lv) {
          case CourseLevel.Beginner:
            return variant === "pending"
              ? "rounded-full border border-emerald-100 bg-gradient-to-r from-emerald-50 via-lime-50 to-white text-emerald-700 px-2.5 py-1 text-xs font-medium shadow-sm"
              : "rounded-full border border-emerald-100 bg-gradient-to-r from-emerald-100 via-lime-100 to-white text-emerald-800 px-3 py-1 text-xs font-semibold shadow";
          case CourseLevel.Intermidiate:
            return variant === "pending"
              ? "rounded-full border border-sky-100 bg-gradient-to-r from-sky-50 via-blue-50 to-white text-sky-700 px-2.5 py-1 text-xs font-medium shadow-sm"
              : "rounded-full border border-sky-200 bg-gradient-to-r from-sky-100 via-blue-100 to-white text-sky-800 px-3 py-1 text-xs font-semibold shadow";
          case CourseLevel.Advanced:
            return variant === "pending"
              ? "rounded-full border border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50 to-white text-purple-700 px-2.5 py-1 text-xs font-medium shadow-sm"
              : "rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 via-pink-100 to-white text-purple-800 px-3 py-1 text-xs font-semibold shadow";
          default:
            break;
        }
      }
      return variant === "pending"
        ? "rounded-full border border-transparent bg-gradient-to-r from-slate-50 via-zinc-50 to-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm"
        : "rounded-full border border-transparent bg-gradient-to-r from-zinc-50 via-stone-50 to-white px-3 py-1 text-xs font-semibold text-slate-800 shadow";
    },
    [],
  );

  const appliedChips = useMemo(
    () => buildChipList(initialFilterValues),
    [buildChipList, initialFilterValues],
  );

  const pendingChips = useMemo(
    () => buildChipList(draftFilters),
    [buildChipList, draftFilters],
  );

  const handleFilterChange = useCallback(
    (param: string, values: string[]) => {
      setDraftFilters((prev) => ({
        ...prev,
        [param]: values,
      }));
    },
    [],
  );

  const handleRemoveDraftValue = (param: string, value: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      [param]: prev[param]?.filter((v) => v !== value) ?? [],
    }));
  };

  const cloneFilterState = useCallback(
    (state: FilterState): FilterState =>
      Object.fromEntries(
        Object.entries(state).map(([k, vals]) => [k, [...vals]]),
      ) as FilterState,
    [],
  );

  const handleClearDraftFilters = () => {
    setDraftFilters(cloneFilterState(emptyFilterState));
  };

  const handleClearAllAndApply = () => {
    const cleared = cloneFilterState(emptyFilterState);
    setDraftFilters(cleared);
    applyFilters(cleared);
  };

  useEffect(() => {
    hideLoading();
    setIsApplyingFilters(false);
  }, [courses, hideLoading]);

  const matchesFilter = useCallback(
    (course: Course) => {
      const levelPass =
        levelFilters.length === 0 ||
        (course.level !== null &&
          course.level !== undefined &&
          levelFilters.includes(String(course.level)));
      const tagPass =
        tagFilters.length === 0 ||
        (course.tagNames ?? []).some((tag) => tagFilters.includes(tag));
      return levelPass && tagPass;
    },
    [levelFilters, tagFilters],
  );

  const handleSearch = (value: string) => {
    setQueryParams((next) => {
      if (value) next.set("search", value);
      else next.delete("search");
      next.set("page", "1");
    });
  };

  const applyFilters = useCallback(
    (filtersArg?: FilterState) => {
      const filtersToApply = filtersArg ?? draftFilters;
      setIsApplyingFilters(true);
      const next = new URLSearchParams(searchParams.toString());
      filterGroups.forEach((group) => next.delete(group.param));
      Object.entries(filtersToApply).forEach(([param, values]) => {
        values
          .filter((value) => value && value.length > 0)
          .forEach((value) => next.append(param, value));
      });
      const qs = next.toString();
      replaceWithLoading(qs ? `${pathname}?${qs}` : pathname);
    },
    [draftFilters, filterGroups, pathname, replaceWithLoading, searchParams],
  );

  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    setLoadMoreError(null);
    const nextPage = currentPage + 1;
    try {
      const params = new URLSearchParams({
        search: currentSearch,
        page: String(nextPage),
        size: String(pageSize),
        sortBy: sortValue,
      });
      const res = await fetch(`/api/course/list?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load more");
      const json: {
        data: Course[];
        totalCount: number;
      } = await res.json();
      const filteredChunk = (json.data ?? []).filter(matchesFilter);
      setVisibleCourses((prev) => [...prev, ...filteredChunk]);
      const nextTotal = json.totalCount ?? totalAvailable;
      setHasMore(nextPage * pageSize < nextTotal);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("loadMore error:", error);
      setLoadMoreError("Không thể tải thêm khóa học");
    } finally {
      setIsFetchingMore(false);
    }
  }, [
    currentPage,
    currentSearch,
    hasMore,
    isFetchingMore,
    matchesFilter,
    pageSize,
    sortValue,
    totalAvailable,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    const target = loadMoreRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [loadMore]);

  useEffect(() => {
    setVisibleCourses(courses.filter(matchesFilter));
    setCurrentPage(page);
    setHasMore(page * pageSize < (totalCount ?? 0));
    setLoadMoreError(null);
  }, [courses, page, totalCount, matchesFilter, pageSize]);

  return (
    <BaseScreenWhiteNav>
      <ZoomIn>
        <CourseSearchSection
          onSearch={handleSearch}
          searchCoursedata={searchCoursedata}
        />
        {/* Khung ngoài, canh giữa theo max width */}
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
          <Layout hasSider className="!bg-transparent gap-4 lg:gap-10">
            {/* SIDEBAR (LG+) */}
            <Sider
              width={288}
              breakpoint="xxl"
              collapsedWidth={0}
              className="hidden lg:block !bg-transparent !px-0 !transition-all !will-change-[width]"
              style={{ position: "sticky", top: 96, alignSelf: "flex-start" }}
            >
              <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] p-5 h-screen">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Lọc khóa học
                    </span>
                  </div>
                  {pendingChips.length > 0 && (
                    <button
                      className="text-xs font-medium text-blue-600 hover:underline"
                      onClick={handleClearAllAndApply}
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {/* Chips đã chọn */}
                {pendingChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pendingChips.map((chip) => (
                      <Tag
                        key={`${chip.param}:${chip.value}`}
                        closable
                        className={getChipClass(
                          chip.param,
                          chip.value,
                          "pending",
                        )}
                        onClose={(e) => {
                          e.preventDefault();
                          handleRemoveDraftValue(chip.param, chip.value);
                        }}
                      >
                        {chip.label}
                      </Tag>
                    ))}
                  </div>
                )}

                <Divider className="my-2" />

                {/* Groups */}
                <div className="divide-y divide-gray-100 [&>section]:py-3">
                  <FilterContent
                    groups={filterGroups}
                    values={draftFilters}
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t border-gray-100 sticky bottom-0 bg-white dark:bg-[#0b1220]">
                  <div className="flex gap-2">
                    <Button
                      block
                      size="small"
                      onClick={handleClearDraftFilters}
                    >
                      Xóa
                    </Button>
                    <Button
                      type="primary"
                      block
                      size="small"
                      loading={isApplyingFilters}
                      onClick={() => applyFilters()}
                    >
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </div>
            </Sider>

            {/* CONTENT */}
            <Content className="!bg-transparent min-w-0">
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Title
                      level={2}
                      className="!mb-0 text-xl sm:text-2xl font-bold"
                    >
                      Kết quả cho
                    </Title>
                    {isApplyingFilters && <Spin size="small" />}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* nút lọc chỉ hiện mobile */}
                    <Button
                      icon={<FiFilter />}
                      onClick={() => setOpenFilter(true)}
                      className="lg:!hidden"
                    >
                      Lọc
                    </Button>

                    {/* Select full width trên mobile */}
                    <Select
                      value={sortValue}
                      onChange={setSort}
                      className="w-full sm:w-[200px]"
                      options={sortOptions}
                    />
                  </div>
                </div>

                {appliedChips.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
                    {appliedChips.map((chip) => (
                      <Tag
                        key={`applied-${chip.param}:${chip.value}`}
                        color="blue"
                        closable
                        className="rounded-full border border-transparent bg-gradient-to-r from-blue-50 via-indigo-50 to-white px-3 py-1 text-xs font-semibold text-blue-800 shadow"
                        onClose={(e) => {
                          e.preventDefault();
                          removeParamValue(chip.param, chip.value);
                        }}
                      >
                        {chip.label}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid cards */}
              <div className="lg:mx-0">
                <Row
                  gutter={[
                    { xs: 20, sm: 16, md: 24, lg: 0, xl: 0 }, // ngang
                    { xs: 20, sm: 24, md: 32, lg: 24, xl: 24 }, // dọc
                  ]}
                >
                  {visibleCourses.map((c, idx) => (
                    <Col key={idx} xs={24} sm={12} xl={8}>
                      <div className="h-full xs:ml-4">
                        <CourseCard
                          {...c}
                          isEnrolled={c.isEnroll ?? false}
                          isWishList={c.isWishList ?? false}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
              <div ref={loadMoreRef} className="mt-10 flex justify-center">
                {isFetchingMore ? (
                  <Spin tip="Đang tải thêm khóa học..." />
                ) : loadMoreError ? (
                  <Button onClick={loadMore}>{loadMoreError} · Thử lại</Button>
                ) : hasMore ? (
                  <span className="text-sm text-gray-500">
                    Cuộn xuống để tải thêm...
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">
                    Bạn đã xem hết khóa học hiện có.
                  </span>
                )}
              </div>
            </Content>
          </Layout>
        </div>

        {/* Drawer mobile */}
        <Drawer
          placement="left"
          width={320}
          title="Lọc khóa học"
          open={openFilter}
          onClose={() => setOpenFilter(false)}
          maskClosable
          rootClassName="xl:hidden"
        >
          <FilterContent
            groups={filterGroups}
            values={draftFilters}
            onChange={handleFilterChange}
          />
          <div className="sticky bottom-0 left-0 right-0 bg-white pt-3">
            <div className="flex gap-2">
              <Button block onClick={handleClearDraftFilters}>
                Xóa
              </Button>
              <Button
                type="primary"
                block
                loading={isApplyingFilters}
                onClick={() => {
                  applyFilters();
                  setOpenFilter(false);
                }}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </Drawer>
      </ZoomIn>
    </BaseScreenWhiteNav>
  );
}
