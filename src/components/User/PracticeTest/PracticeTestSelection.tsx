"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, Empty, message, Select } from "antd";
import {
  FiCode,
  FiArrowRight,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";
import { usePracticeTestStore } from "EduSmart/stores/PracticeTest/PracticeTestStore";
import {
  selectCodeLangues,
  selectPracticeTestsList,
} from "EduSmart/app/(codeQuiz)/action";

interface PracticeTestSelectionProps {
  onStartPracticeTest: () => void;
}

const difficultyColor = (difficulty: string): string => {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "green";
  if (d === "medium") return "gold";
  if (d === "hard") return "red";
  return "default";
};

const PracticeTestSelection: React.FC<PracticeTestSelectionProps> = ({
  onStartPracticeTest,
}) => {
  const {
    problems,
    languages,
    selectedLanguageId,
    setLanguages,
    setProblems,
    setSelectedLanguageId,
    setLoadingLanguages,
    setLoadingProblems,
    isLoadingLanguages,
    isLoadingProblems,
  } = usePracticeTestStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingLanguages(true);
        setLoadingProblems(true);

        const [langRes, testsRes] = await Promise.all([
          selectCodeLangues(),
          selectPracticeTestsList(),
        ]);

        if (langRes?.response) {
          console.log("📚 Loaded languages:", langRes.response);
          setLanguages(langRes.response);
        } else {
          message.error("Không thể tải danh sách ngôn ngữ lập trình");
        }

        if (testsRes?.response?.items) {
          setProblems(testsRes.response.items);
        } else {
          message.error("Không thể tải danh sách bài tập thực hành");
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading practice test data:", error);
        message.error("Có lỗi khi tải dữ liệu bài tập thực hành");
      } finally {
        setLoadingLanguages(false);
        setLoadingProblems(false);
      }
    };

    if (!isInitialized) {
      loadData();
    }
  }, [
    isInitialized,
    setLanguages,
    setProblems,
    setLoadingLanguages,
    setLoadingProblems,
  ]);

  const isLoading = isLoadingLanguages || isLoadingProblems;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải bài tập thực hành...
          </div>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Empty
          description="Không có bài tập thực hành nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const handleLanguageChange = (languageId: number) => {
    setSelectedLanguageId(languageId);
  };

  const handleStart = () => {
    if (!selectedLanguageId) {
      message.warning("Vui lòng chọn ngôn ngữ lập trình trước khi bắt đầu");
      return;
    }
    onStartPracticeTest();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
          <FiCode className="text-3xl text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Bài Tập Thực Hành Lập Trình
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Hoàn thành{" "}
          <span className="font-semibold text-violet-600 dark:text-violet-400">
            {problems.length} bài tập
          </span>{" "}
          để đánh giá kỹ năng lập trình của bạn
        </p>
      </div>

      {/* Language Selection Card */}
      <Card className="mb-8 border-l-4 border-l-violet-500 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <FiSettings className="text-violet-600 dark:text-violet-400 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Chọn ngôn ngữ lập trình
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Chọn ngôn ngữ lập trình bạn muốn sử dụng cho tất cả các bài tập
            </p>
            <Select
              size="large"
              placeholder="Chọn ngôn ngữ lập trình"
              value={selectedLanguageId}
              onChange={handleLanguageChange}
              className="w-full max-w-md"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={languages.map((lang) => ({
                value: lang.languageId,
                label: lang.name,
              }))}
            />
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="mb-8 border-l-4 border-l-blue-500">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FiCheckCircle className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Hướng dẫn làm bài
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  Bạn sẽ làm <strong>{problems.length} bài tập</strong> với độ
                  khó khác nhau (Easy, Medium, Hard)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Viết code và chạy test để kiểm tra kết quả</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  Bạn có thể đánh dấu hoàn thành từng bài khi code xong
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Hoàn thành tất cả bài tập để nộp bài và tiếp tục</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Problems List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {problems.map((problem, index) => (
          <Card
            key={problem.problemId}
            className="hover:shadow-lg transition-shadow duration-200"
            hoverable
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-sm font-semibold text-violet-600 dark:text-violet-400">
                  {index + 1}
                </div>
                <Tag color={difficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Tag>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {problem.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {problem.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          type="primary"
          size="large"
          icon={<FiArrowRight />}
          onClick={handleStart}
          disabled={!selectedLanguageId}
          className="px-8 h-12 text-base font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-none"
        >
          Bắt đầu làm bài
        </Button>
      </div>
    </div>
  );
};

export default PracticeTestSelection;
