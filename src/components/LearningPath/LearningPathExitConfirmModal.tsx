"use client";

import React from "react";
import { Modal, Button } from "antd";
import { FiAlertTriangle, FiAlertCircle, FiInfo } from "react-icons/fi";

interface LearningPathExitConfirmModalProps {
  /**
   * Whether the modal is visible
   */
  open: boolean;

  /**
   * Title of the modal
   * @default "Xác nhận thoát"
   */
  title?: string;

  /**
   * Main content/message to display
   * @default "Bạn có chắc chắn muốn thoát? Tất cả dữ liệu hiện tại sẽ bị mất."
   */
  content?: string;

  /**
   * Additional warning message (optional)
   */
  warningMessage?: string;

  /**
   * Text for the confirm button
   * @default "Thoát"
   */
  confirmText?: string;

  /**
   * Text for the cancel button
   * @default "Hủy"
   */
  cancelText?: string;

  /**
   * Callback when user confirms exit
   */
  onConfirm: () => void;

  /**
   * Callback when user cancels
   */
  onCancel: () => void;

  /**
   * Whether to show loading state on confirm button
   * @default false
   */
  confirmLoading?: boolean;

  /**
   * Type of confirmation (affects styling)
   * @default "warning"
   */
  type?: "warning" | "danger" | "info";
}

/**
 * Reusable confirmation modal for Learning Path flow
 * Use this when user wants to exit from survey, quiz, or any form
 *
 * @example
 * ```tsx
 * const [showExitModal, setShowExitModal] = useState(false);
 *
 * <LearningPathExitConfirmModal
 *   open={showExitModal}
 *   onConfirm={() => {
 *     // Clear data and exit
 *     clearAllData();
 *     router.push('/learning-path');
 *   }}
 *   onCancel={() => setShowExitModal(false)}
 * />
 * ```
 */
const LearningPathExitConfirmModal: React.FC<
  LearningPathExitConfirmModalProps
> = ({
  open,
  title = "Xác nhận thoát",
  content = "",
  warningMessage,
  confirmText = "Thoát",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  confirmLoading = false,
  type = "warning",
}) => {
  // Get icon and styles based on type
  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FiAlertCircle className="w-10 h-10" />,
          iconBg:
            "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          warningBg: "bg-red-50 dark:bg-red-900/20",
          warningBorder: "border-red-100 dark:border-red-800",
          warningText: "text-red-800 dark:text-red-200",
          warningIcon: "text-red-600 dark:text-red-400",
          buttonBg: "!bg-red-600 hover:!bg-red-700",
        };
      case "info":
        return {
          icon: <FiInfo className="w-12 h-12" />,
          iconBg:
            "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          warningBg: "bg-blue-50 dark:bg-blue-900/20",
          warningBorder: "border-blue-200 dark:border-blue-800",
          warningText: "text-blue-800 dark:text-blue-200",
          warningIcon: "text-blue-600 dark:text-blue-400",
          buttonBg: "!bg-blue-600 hover:!bg-blue-700",
        };
      case "warning":
      default:
        return {
          icon: <FiAlertTriangle className="w-12 h-12" />,
          iconBg:
            "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
          iconColor: "text-orange-600 dark:text-orange-400",
          warningBg: "bg-orange-50 dark:bg-orange-900/20",
          warningBorder: "border-orange-200 dark:border-orange-800",
          warningText: "text-orange-800 dark:text-orange-200",
          warningIcon: "text-orange-600 dark:text-orange-400",
          buttonBg: "!bg-orange-600 hover:!bg-orange-700",
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={520}
      className="learning-path-exit-modal"
      closeIcon={
        <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          ✕
        </span>
      }
    >
      <div className="py-6 px-2">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${typeConfig.iconBg} shadow-md`}
          >
            <span className={typeConfig.iconColor}>{typeConfig.icon}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center mb-5 text-gray-800 dark:text-gray-100">
          {title}
        </h3>

        {/* Optional warning message */}
        {warningMessage && (
          <div
            className={`my-6 p-4 ${typeConfig.warningBg} border ${typeConfig.warningBorder} rounded-xl`}
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle
                className={`${typeConfig.warningIcon} text-lg mt-0.5 flex-shrink-0`}
              />
              <p
                className={`text-sm ${typeConfig.warningText} font-medium leading-relaxed`}
              >
                {warningMessage}
              </p>
            </div>
          </div>
        )}

        {/* Info note */}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 mt-6">
          <Button
            onClick={onCancel}
            size="large"
            className="flex-1 !h-12 !font-medium !rounded-xl !border-1 !border-gray-300 dark:!border-gray-600 hover:!border-[#49BBBD] dark:hover:!border-[#49BBBD] hover:!text-[#49BBBD] dark:hover:!text-[#49BBBD] transition-all duration-300"
          >
            {cancelText}
          </Button>
          <Button
            type="primary"
            onClick={onConfirm}
            loading={confirmLoading}
            size="large"
            className={`flex-1 !h-12 !font-semibold !rounded-xl ${typeConfig.buttonBg} !border-none !shadow-sm hover:!shadow-lg transition-all duration-300`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LearningPathExitConfirmModal;
