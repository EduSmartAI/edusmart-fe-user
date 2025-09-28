"use client";

import React from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import { Button } from "antd";
import { FiHome, FiBookOpen } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function LearningPathResults() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <BaseScreenAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-100 dark:border-gray-700">
            
            {/* Placeholder Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                🎯 Lộ trình học tập cá nhân hóa
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Màn hình này sẽ hiển thị lộ trình học tập được AI đề xuất dựa trên kết quả khảo sát và đánh giá năng lực của bạn.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  🚧 UI cho màn hình này đang được phát triển
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                  Sẽ hiển thị: khóa học được đề xuất, lộ trình học tập chi tiết, thời gian ước tính, và các tài nguyên học tập.
                </p>
              </div>
            </div>

            {/* Temporary Navigation */}
            <Button
              type="primary"
              size="large"
              onClick={handleGoHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 px-8 py-3 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              icon={<FiHome className="w-5 h-5" />}
              iconPosition="end"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </BaseScreenAdmin>
  );
}
