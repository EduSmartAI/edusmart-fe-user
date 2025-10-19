"use client";
import React, { Component, ReactNode } from "react";
import { Button } from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import LearningPathProgress from "EduSmart/components/LearningPath/LearningPathProgress";
import { isHttpError } from "EduSmart/types/errors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showProgress?: boolean; // Hiển thị Progress header
  currentStep?: number; // Optional: Current step for Progress header
  completedSteps?: number[]; // Optional: Completed steps
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Learning Path Error Boundary
 *
 * Bắt tất cả lỗi JavaScript runtime và hiển thị UI thân thiện với người dùng
 *
 * Features:
 * - ✅ Support HttpError với status code
 * - ✅ Auto-map status code → Vietnamese title
 * - ✅ Backward compatible với string errors
 * - ✅ Optional Progress header
 *
 * @example
 * <LearningPathErrorBoundary showProgress>{children}</LearningPathErrorBoundary>
 */
class LearningPathErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Extract HTTP status code từ error message
   * Format: "403: Forbidden" hoặc "403 Forbidden" hoặc "HTTP 403"
   */
  private extractStatusCode(errorMessage: string): string | null {
    const patterns = [
      /^(\d{3}):/, // "403: Message"
      /HTTP\s+(\d{3})/i, // "HTTP 403"
      /Status\s+(\d{3})/i, // "Status 403"
      /^(\d{3})\s+\w+/, // "403 Forbidden"
    ];

    for (const pattern of patterns) {
      const match = errorMessage.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get auto-mapped title based on HTTP status code
   */
  private getStatusTitle(statusCode: string | null): string | null {
    if (!statusCode) return null;

    const statusMappings: Record<string, string> = {
      "400": "Yêu cầu không hợp lệ",
      "401": "Phiên đăng nhập hết hạn",
      "403": "Không có quyền truy cập",
      "404": "Không tìm thấy dữ liệu",
      "409": "Xung đột dữ liệu",
      "422": "Dữ liệu không hợp lệ",
      "429": "Quá nhiều yêu cầu",
      "500": "Lỗi hệ thống",
      "502": "Lỗi kết nối",
      "503": "Dịch vụ tạm thời không khả dụng",
    };

    return statusMappings[statusCode] || null;
  }

  /**
   * Chuyển đổi error message thành thông báo thân thiện cho user
   */
  private getUserFriendlyMessage(error: Error): {
    statusCode: string | null;
    title: string;
    message: string;
  } {
    // ✅ NEW: Check if error is HttpError (preferred method)
    if (isHttpError(error)) {
      const status = error.statusCode?.toString() || null;
      const title = this.getStatusTitle(status);

      return {
        statusCode: status,
        title: title || "Đã xảy ra lỗi",
        message: error.message,
      };
    }

    // ❌ FALLBACK: Parse string error message (legacy support)
    const errorMessage = error.message.toLowerCase();
    const originalMessage = error.message;
    const statusCode = this.extractStatusCode(originalMessage);

    // HTTP Status Code mapping
    if (errorMessage.includes("403") || errorMessage.includes("forbidden")) {
      return {
        statusCode: statusCode || "403",
        title: "Không có quyền truy cập",
        message:
          "Bạn chưa được cấp quyền để truy cập nội dung này. Vui lòng liên hệ quản trị viên hoặc đăng nhập lại.",
      };
    }

    if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      return {
        statusCode: statusCode || "401",
        title: "Phiên đăng nhập hết hạn",
        message: "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
      };
    }

    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      return {
        statusCode: statusCode || "404",
        title: "Không tìm thấy dữ liệu",
        message: "Nội dung bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
      };
    }

    if (
      errorMessage.includes("500") ||
      errorMessage.includes("internal server")
    ) {
      return {
        statusCode: statusCode || "500",
        title: "Lỗi hệ thống",
        message: "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.",
      };
    }

    if (
      errorMessage.includes("503") ||
      errorMessage.includes("service unavailable")
    ) {
      return {
        statusCode: statusCode || "503",
        title: "Dịch vụ tạm ngưng",
        message: "Hệ thống đang bảo trì. Vui lòng quay lại sau.",
      };
    }

    if (
      errorMessage.includes("network") ||
      errorMessage.includes("fetch failed")
    ) {
      return {
        statusCode: null,
        title: "Lỗi kết nối",
        message:
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.",
      };
    }

    if (errorMessage.includes("timeout")) {
      return {
        statusCode: null,
        title: "Hết thời gian chờ",
        message: "Yêu cầu của bạn mất quá nhiều thời gian. Vui lòng thử lại.",
      };
    }

    // Custom error messages từ API
    let customMessage = originalMessage;
    if (statusCode) {
      customMessage = originalMessage.replace(/^\d{3}:\s*/, "");
    }

    if (
      customMessage &&
      customMessage.length > 0 &&
      customMessage.length < 200
    ) {
      return {
        statusCode,
        title: "Đã xảy ra lỗi",
        message: customMessage,
      };
    }

    // Default fallback
    return {
      statusCode,
      title: "Đã xảy ra lỗi",
      message:
        "Ứng dụng gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.group("🚨 Learning Path Error Boundary Caught Error");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo.componentStack);
    console.groupEnd();

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    // Reset error state và reload component
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    // Reload toàn bộ page
    window.location.reload();
  };

  handleGoHome = () => {
    // Navigate về trang chủ
    window.location.href = "/learning-path/overview";
  };

  /**
   * Detect current step from URL path
   */
  private detectStepFromUrl(): {
    currentStep: number;
    completedSteps: number[];
  } {
    if (typeof window === "undefined") {
      return { currentStep: 0, completedSteps: [] };
    }

    const path = window.location.pathname;

    // Map URL paths to steps
    if (path.includes("/learning-path/overview")) {
      return { currentStep: 0, completedSteps: [] };
    }
    if (path.includes("/learning-path/assessment/survey")) {
      return { currentStep: 1, completedSteps: [0] };
    }
    if (path.includes("/learning-path/assessment/quiz")) {
      return { currentStep: 2, completedSteps: [0, 1] };
    }
    if (path.includes("/learning-path/assessment/processing")) {
      return { currentStep: 3, completedSteps: [0, 1, 2] };
    }
    if (path.includes("/dashboard/learning-paths")) {
      return { currentStep: 4, completedSteps: [0, 1, 2, 3] };
    }

    // Default
    return { currentStep: 0, completedSteps: [] };
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback nếu được provide
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Error UI with HttpError support
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Progress Header - Optional */}
          {this.props.showProgress &&
            (() => {
              // Use props if provided, otherwise detect from URL
              const { currentStep, completedSteps } =
                this.props.currentStep !== undefined
                  ? {
                      currentStep: this.props.currentStep,
                      completedSteps: this.props.completedSteps || [],
                    }
                  : this.detectStepFromUrl();

              return (
                <div className="sticky top-0 z-10">
                  <LearningPathProgress
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    minimal={true}
                    showTimeRemaining={false}
                  />
                </div>
              );
            })()}

          {/* Error Content - Simple & Centered */}
          <div
            className={`flex items-center justify-center px-6 ${this.props.showProgress ? "min-h-[calc(100vh-80px)]" : "min-h-screen"}`}
          >
            <div className="max-w-md w-full text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                {/* Error Icon Circle */}
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiRefreshCcw className="w-10 h-10 text-red-500 dark:text-red-400" />
                </div>

                {/* Dynamic Title & Message */}
                {(() => {
                  const { statusCode, title, message } = this.state.error
                    ? this.getUserFriendlyMessage(this.state.error)
                    : {
                        statusCode: null,
                        title: "Đã xảy ra lỗi",
                        message: "Vui lòng thử lại.",
                      };

                  return (
                    <>
                      {/* HTTP Status Code Badge */}
                      {statusCode && (
                        <div className="mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                            HTTP {statusCode}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {title}
                      </h3>

                      {/* User-Friendly Error Message */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {message}
                      </p>
                    </>
                  );
                })()}

                {/* Retry Button - Primary Action */}
                <Button
                  type="primary"
                  size="large"
                  onClick={this.handleReset}
                  className="!bg-gradient-to-r !from-[#49BBBD] !to-cyan-500 hover:!from-[#3da8aa] hover:!to-cyan-600 dark:!from-[#5fd4d6] dark:!to-cyan-400 dark:hover:!from-[#49BBBD] dark:hover:!to-cyan-500 !border-none h-11 px-8 font-medium rounded-lg !shadow-md hover:!shadow-lg transition-all duration-200"
                  icon={<FiRefreshCcw className="w-4 h-4" />}
                >
                  Thử lại
                </Button>

                {/* Development Details - Collapsible */}
                {process.env.NODE_ENV === "development" &&
                  this.state.error?.stack && (
                    <details className="mt-6 text-left">
                      <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-[#49BBBD] dark:hover:text-[#5fd4d6]">
                        Chi tiết lỗi (Dev mode)
                      </summary>
                      <code className="text-xs text-gray-600 dark:text-gray-400 font-mono block mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {this.state.error.stack}
                      </code>
                    </details>
                  )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LearningPathErrorBoundary;
