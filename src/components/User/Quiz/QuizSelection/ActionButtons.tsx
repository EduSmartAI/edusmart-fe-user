"use client";
import React from "react";
import { Button, Space, Typography } from "antd";
import { PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
    <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 mt-8 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Selection Info */}
          <div className="text-center sm:text-left">
            <Text className="text-sm text-gray-600 dark:text-gray-300">
              Đã chọn{" "}
              <span className="font-semibold text-primary">
                {selectedCount}
              </span>{" "}
              bài quiz
            </Text>
          </div>

          {/* Action Buttons */}
          <Space size="middle">
            <Button
              icon={<CloseOutlined />}
              onClick={onSkip}
              size="large"
              className="min-w-[120px]"
            >
              Bỏ qua
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={onStart}
              disabled={disabled || selectedCount === 0}
              className="min-w-[160px]"
            >
              Bắt đầu làm bài ({selectedCount})
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
