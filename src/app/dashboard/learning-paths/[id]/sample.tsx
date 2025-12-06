"use client";

import React, { useState } from "react";
import {
  Card,
  Tabs,
  Badge,
  Progress,
  Button,
  Tag,
} from "antd";
import {
  FiBook,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { MarkdownBlock } from "EduSmart/components/MarkDown/MarkdownBlock";

// Sample data từ response
const sampleData = {
  status: 1,
  pathName: "Lộ trình Lập trình viên FullStack",
  completionPercent: 0,
  summaryFeedback:
    "## Tóm tắt kết quả học tập\nSinh viên đã đạt điểm trung bình 8.49...",
  habitAndInterestAnalysis:
    "## Phân tích thói quen và sở thích học tập\nSinh viên dành 3-4 giờ học mỗi ngày...",
  personality: "## Tính cách học tập\nSinh viên có tính cách sáng tạo...",
  learningAbility:
    "## Đánh giá năng lực học tập\nVới điểm trung bình các môn chuyên ngành là 8.49...",
};

export default function LearningPathSample() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {sampleData.pathName}
              </h1>
              <div className="flex items-center gap-3">
                <Badge status="processing" text="Đang chọn chuyên ngành" />
                <Tag color="blue">Kỳ 4</Tag>
                <Tag color="green">Điểm TB: 8.49</Tag>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Tiến độ hoàn thành
              </div>
              <Progress
                type="circle"
                percent={sampleData.completionPercent}
                width={80}
                strokeColor={{
                  "0%": "#49BBBD",
                  "100%": "#2DD4BF",
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: AI Analysis Cards */}
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-4 sticky top-6">
              <Card
                className="border-l-4 border-l-blue-500"
                title={
                  <div className="flex items-center gap-2">
                    <FiTarget className="text-blue-500" />
                    <span>Phân tích AI</span>
                  </div>
                }
              >
                <Tabs
                  defaultActiveKey="personality"
                  items={[
                    {
                      key: "personality",
                      label: "Tính cách",
                      children: (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <MarkdownBlock markdown={sampleData.personality} />
                        </div>
                      ),
                    },
                    {
                      key: "habit",
                      label: "Thói quen",
                      children: (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <MarkdownBlock
                            markdown={sampleData.habitAndInterestAnalysis}
                          />
                        </div>
                      ),
                    },
                    {
                      key: "ability",
                      label: "Năng lực",
                      children: (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <MarkdownBlock
                            markdown={sampleData.learningAbility}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>

              <Card
                className="border-l-4 border-l-green-500"
                title={
                  <div className="flex items-center gap-2">
                    <FiAward className="text-green-500" />
                    <span>Tóm tắt</span>
                  </div>
                }
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownBlock markdown={sampleData.summaryFeedback} />
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Learning Path Content */}
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  {
                    key: "overview",
                    label: (
                      <span className="flex items-center gap-2">
                        <FiBook />
                        Tổng quan
                      </span>
                    ),
                    children: <OverviewTab />,
                  },
                  {
                    key: "basic",
                    label: (
                      <span className="flex items-center gap-2">
                        <FiTrendingUp />
                        Nền tảng
                      </span>
                    ),
                    children: <BasicPathTab />,
                  },
                  {
                    key: "majors",
                    label: (
                      <span className="flex items-center gap-2">
                        <FiTarget />
                        Chuyên ngành
                      </span>
                    ),
                    children: <MajorsTab />,
                  },
                  {
                    key: "external",
                    label: (
                      <span className="flex items-center gap-2">
                        <FiAward />
                        Khóa ngoài
                      </span>
                    ),
                    children: <ExternalTab />,
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <FiBook className="text-4xl text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">11</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Môn nền tảng
          </div>
        </Card>
        <Card className="text-center">
          <FiTarget className="text-4xl text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Chuyên ngành
          </div>
        </Card>
        <Card className="text-center">
          <FiAward className="text-4xl text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Track ngoài
          </div>
        </Card>
      </div>

      <Card title="Lộ trình học tập" className="border-l-4 border-l-blue-500">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold">
                Bước 1: Hoàn thành các môn nền tảng
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Tập trung vào PRO192 (OOP) và các môn cơ bản khác
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiClock className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold">
                Bước 2: Chọn chuyên ngành phù hợp
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                .NET, JAVA, hoặc REACT - tùy theo sở thích
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiTrendingUp className="text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold">
                Bước 3: Nâng cao với khóa ngoài
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Coursera, Udemy để mở rộng kiến thức
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Basic Path Tab
function BasicPathTab() {
  const basicCourses = [
    {
      semester: 1,
      subjects: [
        {
          code: "MAE101",
          name: "Mathematics for Engineering",
          score: 8.9,
          status: "completed",
        },
        {
          code: "CEA201",
          name: "Computer Organization",
          score: 9.2,
          status: "completed",
        },
        {
          code: "CSI104",
          name: "Introduction to Computing",
          score: 8.5,
          status: "completed",
        },
      ],
    },
    {
      semester: 2,
      subjects: [
        {
          code: "PRO192",
          name: "Object-Oriented Programming",
          score: 5.5,
          status: "warning",
        },
        {
          code: "MAD101",
          name: "Discrete Mathematics",
          score: null,
          status: "pending",
        },
      ],
    },
    {
      semester: 3,
      subjects: [
        {
          code: "DBI202",
          name: "Database Systems",
          score: 8.8,
          status: "completed",
        },
        {
          code: "CSD201",
          name: "Data Structures & Algorithms",
          score: 8.3,
          status: "completed",
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {basicCourses.map((sem) => (
        <Card
          key={sem.semester}
          title={
            <div className="flex items-center justify-between">
              <span className="font-bold">Kỳ {sem.semester}</span>
              <Tag color="blue">{sem.subjects.length} môn</Tag>
            </div>
          }
          className="border-l-4 border-l-orange-500"
        >
          <div className="space-y-3">
            {sem.subjects.map((subject) => (
              <div
                key={subject.code}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {subject.status === "completed" && (
                    <FiCheckCircle className="text-green-500 text-xl" />
                  )}
                  {subject.status === "warning" && (
                    <FiAlertCircle className="text-orange-500 text-xl" />
                  )}
                  {subject.status === "pending" && (
                    <FiClock className="text-slate-400 text-xl" />
                  )}
                  <div>
                    <div className="font-semibold">{subject.code}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {subject.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {subject.score ? (
                    <>
                      <div className="text-2xl font-bold">{subject.score}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        /10
                      </div>
                    </>
                  ) : (
                    <Tag>Chưa học</Tag>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// Majors Tab
function MajorsTab() {
  const majors = [
    {
      code: ".NET",
      name: "Lập trình .NET",
      reason: "Phù hợp với FullStack, C#/Unity",
    },
    {
      code: "JAVA",
      name: "Lập trình Java",
      reason: "Backend mạnh, Spring Boot",
    },
    {
      code: "REACT",
      name: "Lập trình React",
      reason: "Frontend hiện đại, Full-stack",
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-blue-500 text-xl mt-1" />
          <div>
            <div className="font-semibold mb-2">Chọn chuyên ngành phù hợp</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Bạn có thể chọn và sắp xếp thứ tự ưu tiên các chuyên ngành dưới
              đây
            </div>
          </div>
        </div>
      </Card>

      {majors.map((major, index) => (
        <Card
          key={major.code}
          className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center font-bold text-cyan-600 dark:text-cyan-400">
                {index + 1}
              </div>
              <div>
                <div className="font-bold text-lg">{major.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {major.reason}
                </div>
              </div>
            </div>
            <Button type="primary">Xem chi tiết</Button>
          </div>
        </Card>
      ))}

      <Button type="primary" size="large" block className="mt-4">
        Xác nhận lựa chọn
      </Button>
    </div>
  );
}

// External Tab
function ExternalTab() {
  const tracks = [
    {
      code: "FULLSTACK_DEV",
      name: "Full Stack Development",
      provider: "Coursera",
      courses: 3,
    },
    {
      code: "REACT_ADV",
      name: "Advanced React",
      provider: "Meta",
      courses: 3,
    },
    {
      code: "PYTHON_WEB",
      name: "Python Web Development",
      provider: "University of Michigan",
      courses: 2,
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <FiAward className="text-purple-500 text-xl mt-1" />
          <div>
            <div className="font-semibold mb-2">Khóa học ngoài bổ sung</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Các khóa học từ Coursera, Udemy giúp bổ sung kiến thức
            </div>
          </div>
        </div>
      </Card>

      {tracks.map((track) => (
        <Card
          key={track.code}
          className="border-l-4 border-l-lime-500 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">{track.name}</div>
              <div className="flex items-center gap-3 mt-2">
                <Tag color="purple">{track.provider}</Tag>
                <Tag>{track.courses} khóa học</Tag>
              </div>
            </div>
            <Button type="link">Xem khóa học →</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
