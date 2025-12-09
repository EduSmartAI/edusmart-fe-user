"use client";
import React from "react";
import { Button } from "antd";
import { FiArrowRight, FiX, FiCheckCircle } from "react-icons/fi";

interface ActionButtonsProps {
  selectedCount: number;
  onSkip: () => void;
  onStart: () => void;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedCount,
  onSkip,
  onStart,
  disabled = false,
}) => {
  return (
    <div className="sticky bottom-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-6 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Selection Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <FiCheckCircle
                className={`w-5 h-5 ${selectedCount > 0 ? "text-green-500" : "text-gray-400"}`}
              />
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Đã chọn{" "}
                <span
                  className={`font-bold ${selectedCount > 0 ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}
                >
                  {selectedCount}
                </span>{" "}
                bài quiz
              </span>
            </div>
            {selectedCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sẵn sàng bắt đầu đánh giá năng lực
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center space-x-2">
            <div>
              <Button
                onClick={onSkip}
                size="large"
                className="px-6 py-3 h-auto font-semibold rounded-xl border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                icon={<FiX className="w-5 h-5" />}
              >
                Thoát
              </Button>
            </div>

            <div>
              <Button
                type="primary"
                size="large"
                onClick={onStart}
                disabled={disabled || selectedCount === 0}
                className={`px-8 py-3 h-auto font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                  disabled || selectedCount === 0
                    ? "bg-gray-300 dark:bg-gray-600 border-none cursor-not-allowed"
                    : "!bg-gradient-to-r from-[#49BBBD] to-cyan-600 border-none hover:from-[#3da8aa] hover:to-cyan-700 hover:shadow-xl hover:scale-105"
                }`}
                icon={<FiArrowRight className="w-5 h-5" />}
                iconPosition="end"
              >
                {selectedCount > 0
                  ? `Bắt đầu làm bài (${selectedCount})`
                  : "Chọn ít nhất 1 quiz"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
