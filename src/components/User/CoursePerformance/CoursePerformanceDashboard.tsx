"use client";

import React, { useState } from "react";
import { Layout, Tabs, Card } from "antd";
import { FiLayers, FiPlay, FiTrendingUp } from "react-icons/fi";
import CourseOverview from "./CourseOverview";
import ModulePerformance from "./ModulePerformance";
import VideoPerformance from "./VideoPerformance";

const { Content } = Layout;

interface CoursePerformanceDashboardProps {
  courseId: string;
}

const CoursePerformanceDashboard: React.FC<CoursePerformanceDashboardProps> = ({
  courseId,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center space-x-2">
          <FiTrendingUp className="w-4 h-4" />
          <span>Tổng quan</span>
        </span>
      ),
      children: <CourseOverview courseId={courseId} />,
    },
    {
      key: "modules",
      label: (
        <span className="flex items-center space-x-2">
          <FiLayers className="w-4 h-4" />
          <span>Hiệu suất Module</span>
        </span>
      ),
      children: <ModulePerformance courseId={courseId} />,
    },
    {
      key: "videos",
      label: (
        <span className="flex items-center space-x-2">
          <FiPlay className="w-4 h-4" />
          <span>Hiệu suất Video</span>
        </span>
      ),
      children: <VideoPerformance />,
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                  Hiệu suất học tập
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Phân tích chi tiết hiệu suất học tập được hỗ trợ bởi AI
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              className="performance-tabs"
              items={tabItems}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default CoursePerformanceDashboard;
