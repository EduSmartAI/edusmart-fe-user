"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, Empty, message, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
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
  if (d === "easy" || d === "dễ") return "green";
  if (d === "medium" || d === "trung bình") return "gold";
  if (d === "hard" || d === "khó") return "red";
  return "default";
};

const translateDifficulty = (difficulty: string): string => {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "Dễ";
  if (d === "medium") return "Trung bình";
  if (d === "hard") return "Khó";
  return difficulty;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: "#49BBBD" }}
                  spin
                />
              }
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Đang tải bài tập thực hành
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
    <div className="w-full flex-1 flex flex-col bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Bài Tập{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BBBD] to-cyan-600">
                Thực Hành
              </span>{" "}
              Lập Trình
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hoàn thành{" "}
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                {problems.length} bài tập
              </span>{" "}
              để đánh giá kỹ năng lập trình của bạn
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Language Selection Card */}
            <Card className="mb-6 sm:mb-8 shadow-sm transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Chọn ngôn ngữ lập trình
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chọn ngôn ngữ lập trình bạn muốn sử dụng cho tất cả các bài
                    tập
                  </p>
                </div>
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
            </Card>

            {/* Info Card */}
            <Card className="mb-6 sm:mb-8 shadow-sm transition-shadow bg-gray-50 dark:bg-gray-800/50">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hướng dẫn làm bài
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1 font-bold">
                      •
                    </span>
                    <span>
                      Bạn sẽ làm <strong>{problems.length} bài tập</strong> với
                      độ khó khác nhau (Dễ, Trung Bình, Khó)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1 font-bold">
                      •
                    </span>
                    <span>
                      Bạn có thể đánh dấu hoàn thành từng bài khi code xong
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1 font-bold">
                      •
                    </span>
                    <span>
                      Hoàn thành tất cả bài tập để nộp bài và tiếp tục
                    </span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Problems List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {problems.map((problem, index) => (
                <Card
                  key={problem.problemId}
                  className="hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
                  hoverable
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-sm font-semibold text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                        {index + 1}
                      </div>
                      <Tag color={difficultyColor(problem.difficulty)}>
                        {translateDifficulty(problem.difficulty)}
                      </Tag>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {problem.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {problem.description}
                  </p>
                </Card>
              ))}
            </div>

            {/* Spacer for fixed button */}
            {/* <div className="h-20 sm:h-24" /> */}
          </div>
        </div>
      </div>

      {/* Fixed Start Button */}
      <div className="flex-shrink-0 sticky bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedLanguageId ? (
                <span>
                  Ngôn ngữ đã chọn:{" "}
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    {
                      languages.find((l) => l.languageId === selectedLanguageId)
                        ?.name
                    }
                  </span>
                </span>
              ) : (
                <span>Vui lòng chọn ngôn ngữ lập trình</span>
              )}
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleStart}
              disabled={!selectedLanguageId}
              className="w-full sm:w-auto px-8 h-12 text-base font-medium"
            >
              Bắt đầu làm bài
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestSelection;
