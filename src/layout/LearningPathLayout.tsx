"use client";

import React, { ReactNode } from "react";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface LearningPathLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  subtitle?: string;
}

const LearningPathLayout: React.FC<LearningPathLayoutProps> = ({
  children,
  showBackButton = false,
  backUrl = "/",
  title,
  subtitle,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(backUrl);
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Simplified Header */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Back Button */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md"
              >
                <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Quay lại</span>
              </button>
            )}
            
            {/* Center - Title */}
            {title && (
              <div className="text-center flex-1 mx-8">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Right Side - Home Button */}
            <button
              onClick={handleHome}
              className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md"
            >
              <FiHome className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium hidden sm:block">Trang chủ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-0">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                EduSmart
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} EduSmart Learning Platform. Được phát triển bởi SOLTECH
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearningPathLayout;
