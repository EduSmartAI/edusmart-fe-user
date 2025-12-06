"use client";

import React, { useState } from "react";
import { Card, Tabs, Tag, Button } from "antd";
import { MarkdownBlock } from "EduSmart/components/MarkDown/MarkdownBlock";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";

// Sample data từ response
const sampleData = {
  status: 1,
  pathName: "Lộ trình Lập trình viên FullStack",
  completionPercent: 0,
  summaryFeedback:
    "## Tóm tắt kết quả học tập\nSinh viên đã đạt điểm trung bình 8.49, với nhiều môn học nổi bật như Ethics in IT và Web Design đạt điểm 10. Tuy nhiên, môn Object-Oriented Programming là điểm yếu cần cải thiện. Để tiến gần hơn tới mục tiêu trở thành lập trình viên FullStack, sinh viên cần tập trung vào việc nâng cao kỹ năng lập trình và thực hành nhiều hơn.",
  habitAndInterestAnalysis:
    "## Phân tích thói quen và sở thích học tập\n\nSinh viên dành 3-4 giờ học mỗi ngày, chủ yếu vào buổi sáng, cho thấy sự tập trung cao độ trong thời gian này. Họ cũng thích học nhóm và trao đổi với người khác, điều này có thể giúp cải thiện kỹ năng lập trình và tư duy logic thông qua các dự án nhóm.",
  personality:
    "## Tính cách học tập\n\nSinh viên có tính cách sáng tạo và thích làm việc theo kế hoạch dài hạn. Họ cảm thấy hứng thú với việc giải quyết bài toán logic và phát triển sản phẩm mà người dùng tương tác trực tiếp. Điều này cho thấy họ có khả năng làm việc tốt trong môi trường phát triển phần mềm.",
  learningAbility:
    "## Đánh giá năng lực học tập\n\nVới điểm trung bình các môn chuyên ngành là 8.49, sinh viên đã vượt qua giai đoạn đánh giá cơ bản. Để tiến gần hơn tới mục tiêu nghề nghiệp, họ nên tập trung vào các dự án thực tế, đặc biệt là trong lĩnh vực Object-Oriented Programming và Software Development. Khuyến nghị là tham gia vào ít nhất một dự án nhóm trong 2-4 tuần tới để cải thiện kỹ năng lập trình và làm việc nhóm.",
  // Sample data cho Roadmap Tab
  basicLearningPath: {
    courseGroups: [
      {
        subjectCode: "MAS291",
        status: 0,
        semesterPosition: 4,
        analysisMarkdown:
          "## Statistics & Probability (MAS291)\n### Tình hình\n- Điểm hiện tại: 6.5 – Bạn cần cải thiện để đạt yêu cầu.\n### Kiến thức trọng tâm\n- Khái niệm cơ bản về xác suất: Nắm vững các định nghĩa và công thức.\n- Phân tích dữ liệu: Học cách sử dụng thống kê để phân tích thông tin.\n### Môn nền tảng quan trọng\n- Mathematics for Engineering (MAE101) – Kỳ 1: Chưa có điểm – cần hoàn thành trước khi học sâu môn hiện tại.\n### Cảnh báo\n- Không có.\n### Lộ trình 2–4 tuần\n- 4 buổi: Ôn tập kiến thức từ MAE101 và thực hành bài tập thống kê, hỗ trợ cho mục tiêu trở thành Lập trình viên FullStack.",
        courses: [],
      },
      {
        subjectCode: "PRO192",
        status: 0,
        semesterPosition: 2,
        analysisMarkdown:
          "## Object-Oriented Programming (PRO192)\n### Tình hình\n- Điểm hiện tại là chưa có, môn này phụ thuộc vào PRF192.\n### Kiến thức trọng tâm\n- **PRF192 (Programming Fundamentals) – Kỳ 1**: 7.2 – cần ôn lại để cải thiện điểm.\n### Cảnh báo\n- ⚠️ Object-Oriented Programming là điều kiện đầu vào cho Basic Cross-Platform Application Programming With .NET (kỳ 5).\n- ⚠️ Object-Oriented Programming là điều kiện đầu vào cho Data Structures and Algorithms (kỳ 3).\n### Lộ trình 2–4 tuần\n- **Buổi 1-2**: Ôn lại các khái niệm cơ bản trong PRF192.\n- **Buổi 3-4**: Thực hành lập trình với các bài tập cụ thể.",
        courses: [
          {
            courseId: "39446be2-25b8-491c-aac5-9ed7bc6e9bb3",
            title: "Object-Oriented Programming",
            shortDescription:
              "Khóa học nhập môn OOP cho người mới, giúp hiểu lớp, đối tượng, kế thừa và đa hình.",
            courseImageUrl:
              "https://s3-hfx03.fptcloud.com/codelearnstorage/files/thumbnails/lap-trinh-huong-doi-tuong-trong-java_da49c404556247e898bbc0e435476936.png",
            durationHours: 2,
            level: 1,
            dealPrice: 100000,
            price: 199000,
            teacherName: "An Teacher",
            tagNames: ["Software Engineering", "Java"],
          },
          {
            courseId: "7f3d6b0f-5809-487d-bc4c-d2ff174a3052",
            title: "Design Patterns in Java",
            shortDescription:
              "Mẫu thiết kế Java: GoF, composition>inheritance, anti-patterns.",
            courseImageUrl:
              "https://topdev.vn/blog/wp-content/uploads/2019/05/la%CC%A3%CC%82p-tri%CC%80nh-hu%CC%9Bo%CC%9B%CC%81ng-%C4%91o%CC%82%CC%81i-tu%CC%9Bo%CC%9B%CC%A3ng-la%CC%80-gi%CC%80.png",
            durationHours: 12,
            level: 2,
            dealPrice: 90000,
            price: 100000,
            teacherName: "Gia Khôi",
            tagNames: [],
          },
          {
            courseId: "d30347e9-9542-435f-a75f-2fe4b2002de4",
            title: "OOP Java Intermediate",
            shortDescription:
              "OOP căn bản đến trung cấp: SOLID, exception, collections, unit test.",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            durationHours: 12,
            level: 2,
            dealPrice: 90000,
            price: 100000,
            teacherName: "Admin Admin",
            tagNames: [],
          },
        ],
      },
      {
        subjectCode: "DBI202",
        status: 1,
        semesterPosition: 3,
        analysisMarkdown:
          "## Database Systems (DBI202)\n### Tình hình\n- Điểm hiện tại: 8.8 – Đạt yêu cầu.\n### Kiến thức trọng tâm\n- Hiểu rõ các khái niệm cơ bản về hệ thống cơ sở dữ liệu và SQL.\n### Lộ trình 2–4 tuần\n- Tuần 1: 2 buổi ôn tập lý thuyết về cơ sở dữ liệu.\n- Tuần 2: 2 buổi thực hành viết truy vấn SQL.",
        courses: [
          {
            courseId: "c9099728-edbd-40f9-aa92-eb55a158db26",
            title: "Database Systems",
            shortDescription:
              "Khóa học Database nâng cao dành cho người đã nắm vững SQL cơ bản.",
            courseImageUrl:
              "https://res.cloudinary.com/ddb7mdg1x/image/upload/v1764180851/DBI_v1tkxi.jpg",
            durationHours: 4,
            level: 3,
            dealPrice: 299000,
            price: 499000,
            teacherName: "An Teacher",
            tagNames: ["Software Engineering", "Data Engineering"],
          },
        ],
      },
      {
        subjectCode: "CSD201",
        status: 0,
        semesterPosition: 3,
        analysisMarkdown:
          "## Data Structures and Algorithms (CSD201)\n### Tình hình\n- Điểm: 8.3 – Tình hình tốt, nhưng cần cải thiện.\n### Kiến thức trọng tâm\n- Cần nắm vững các cấu trúc dữ liệu cơ bản như danh sách, cây, đồ thị.\n### Cảnh báo\n- ⚠️ Object-Oriented Programming (PRO192) – Kỳ 2: điểm 5.5/10 đang dưới chuẩn nhưng là tiền đề.",
        courses: [
          {
            courseId: "1a8d54b8-b0bf-4db9-b72a-f98aa4c4bb39",
            title: "Data Structures and Algorithms",
            shortDescription:
              "Khóa học giúp nắm vững cấu trúc dữ liệu, thuật toán và tư duy tối ưu.",
            courseImageUrl:
              "https://res.cloudinary.com/dhvyupck5/image/upload/v1764185499/vlbptqetbhpvonxs47uc.png",
            durationHours: 3,
            level: 3,
            dealPrice: 200000,
            price: 1000000,
            teacherName: "An Teacher",
            tagNames: ["Software Engineering", "Data Engineering"],
          },
          {
            courseId: "c262634a-a3a6-4ef0-ab6a-caef01e22318",
            title: "DSA Mastery Expert",
            shortDescription:
              "DSA chuyên sâu cho thi đấu/phỏng vấn: graph nâng cao, tối ưu DP.",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            durationHours: 18,
            level: 3,
            dealPrice: 90000,
            price: 100000,
            teacherName: "Gia Khôi",
            tagNames: [],
          },
        ],
      },
      {
        subjectCode: "CSI104",
        status: 2,
        semesterPosition: 1,
        analysisMarkdown:
          "## Introduction to computing (CSI104)\n### Tình hình\n- Điểm: 8.5 – Tình hình tốt, bạn đã có kiến thức cơ bản về máy tính.\n### Cảnh báo\n- Không có.",
        courses: [],
      },
      {
        subjectCode: "MAE101",
        status: 2,
        semesterPosition: 1,
        analysisMarkdown:
          "## Mathematics for Engineering (MAE101)\n### Tình hình\n- Điểm hiện tại: 8.9 – Đây là một điểm tốt.\n### Cảnh báo\n- Không có.",
        courses: [],
      },
    ],
  },
  internalLearningPath: [
    {
      majorId: "ce75b6bc-dfd6-43df-9ef9-fcc20cde6386",
      majorCode: ".NET",
      reason:
        "Major .NET có nội dung rõ ràng liên quan đến lập trình viên FullStack, đặc biệt là với công nghệ C#/.NET và có liên quan đến cả frontend lẫn backend. Mặc dù không trực tiếp dạy các môn về lập trình game, nhưng kiến thức về C# và Unity có thể hỗ trợ phát triển game cũng như ứng dụng FullStack.",
      positionIndex: null,
      majorCourseGroups: [
        {
          subjectCode: "SWT301",
          status: 0,
          semesterPosition: 5,
          analysisMarkdown:
            "## Software Testing (SWT301)\n### Tình hình\n- Điểm hiện tại: 7.7 – Bạn cần duy trì hoặc cải thiện điểm số.\n### Kiến thức trọng tâm\n- Kỹ thuật kiểm thử phần mềm: Nắm vững các phương pháp kiểm thử.",
          courses: [],
        },
        {
          subjectCode: "SWD392",
          status: 0,
          semesterPosition: 7,
          analysisMarkdown:
            "## Software Architecture and Design (SWD392)\n### Tình hình\n- Điểm hiện tại: 8.2 – Điểm này cho thấy bạn có kiến thức tốt.",
          courses: [
            {
              courseId: "5c71103f-5000-4404-a277-fc688f6a2ef1",
              title: "Software Architecture and Design",
              shortDescription:
                "Kiến trúc phần mềm: Layered, Clean, Hexagonal, CQRS, microservices.",
              courseImageUrl:
                "https://analyticsstepsfiles.s3.ap-south-1.amazonaws.com/backend/media/thumbnail/7474744/1518749_1635490594_What%20are%20the%20Basics%20of%20Software%20Documentation-Artboard%201.jpg",
              durationHours: 11,
              level: 2,
              price: 100000,
              dealPrice: 90000,
              teacherName: "Admin Admin",
              tagNames: [],
            },
          ],
        },
        {
          subjectCode: "PRN222",
          status: 0,
          semesterPosition: 7,
          analysisMarkdown: null,
          courses: [
            {
              courseId: "d31e57c2-5f31-4352-91af-00ed1c71e131",
              title:
                "Advanced Cross-Platform Application Programming With .NET",
              shortDescription:
                "Nâng cao .NET đa nền tảng: MVVM, DI, storage, API, deploy.",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              durationHours: 13,
              level: 2,
              price: 100000,
              dealPrice: 90000,
              teacherName: "An Teacher",
              tagNames: [],
            },
          ],
        },
        {
          subjectCode: "PRN232",
          status: 0,
          semesterPosition: 8,
          analysisMarkdown: null,
          courses: [
            {
              courseId: "00e5d16d-b780-4834-932c-3bdc21821aef",
              title: "Building Cross-Platform Back-End Application With .NET",
              shortDescription:
                "API an toàn: JWT/OIDC, validation, audit log, rate limit, health.",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              durationHours: 12,
              level: 2,
              price: 100000,
              dealPrice: 90000,
              teacherName: "An Teacher",
              tagNames: [".NET"],
            },
          ],
        },
      ],
    },
    {
      majorId: "cd3a0693-cd0a-41e9-b1e6-531792cb35e8",
      majorCode: "JAVA",
      reason:
        "Major này liên quan đến phát triển ứng dụng doanh nghiệp bằng Java, một ngôn ngữ quan trọng cho lập trình viên FullStack. Mặc dù không trực tiếp liên quan đến frontend, nhưng backend Java với Spring Boot hỗ trợ tốt cho các công việc liên quan đến phát triển đầy đủ ứng dụng.",
      positionIndex: null,
      majorCourseGroups: [
        {
          subjectCode: "SWT301",
          status: 0,
          semesterPosition: 5,
          analysisMarkdown:
            "## Software Testing (SWT301)\n### Tình hình\n- Điểm hiện tại: 7.7",
          courses: [],
        },
        {
          subjectCode: "SWD392",
          status: 0,
          semesterPosition: 7,
          analysisMarkdown:
            "## Software Architecture and Design (SWD392)\n### Tình hình\n- Điểm hiện tại: 8.2",
          courses: [
            {
              courseId: "5c71103f-5000-4404-a277-fc688f6a2ef1",
              title: "Software Architecture and Design",
              shortDescription:
                "Kiến trúc phần mềm: Layered, Clean, Hexagonal, CQRS, microservices.",
              courseImageUrl:
                "https://analyticsstepsfiles.s3.ap-south-1.amazonaws.com/backend/media/thumbnail/7474744/1518749_1635490594_What%20are%20the%20Basics%20of%20Software%20Documentation-Artboard%201.jpg",
              durationHours: 11,
              level: 2,
              price: 100000,
              dealPrice: 90000,
              teacherName: "Admin Admin",
              tagNames: [],
            },
          ],
        },
        {
          subjectCode: "SBA301",
          status: 0,
          semesterPosition: 7,
          analysisMarkdown: null,
          courses: [],
        },
        {
          subjectCode: "MSS301",
          status: 0,
          semesterPosition: 8,
          analysisMarkdown: null,
          courses: [],
        },
      ],
    },
    {
      majorId: "1ff4b395-3213-48f3-b82f-3e86a07fa420",
      majorCode: "REACT",
      reason:
        "Major này liên quan đến lập trình full-stack với React, phù hợp với mục tiêu trở thành lập trình viên FullStack. Mặc dù chính xác không phải là domain chính nhưng vẫn hỗ trợ nhiều kiến thức cần thiết cho phát triển ứng dụng web.",
      positionIndex: null,
      majorCourseGroups: [
        {
          subjectCode: "FER202",
          status: 0,
          semesterPosition: 5,
          analysisMarkdown:
            "## Front-End web development with React (FER202)\n### Tình hình\n- Điểm hiện tại: 7.9 – Bạn cần cải thiện thêm để đạt yêu cầu.",
          courses: [],
        },
        {
          subjectCode: "SDN302",
          status: 0,
          semesterPosition: 7,
          analysisMarkdown:
            "## Server-Side development with NodeJS, Express, and MongoDB (SDN302)\n### Tình hình\n- Điểm hiện tại là 7.7",
          courses: [],
        },
        {
          subjectCode: "SWD392",
          status: 0,
          semesterPosition: 7,
          analysisMarkdown: null,
          courses: [
            {
              courseId: "f6868ece-af64-4c58-a272-5e59e5c85ab5",
              title: "Software Architecture and Design",
              shortDescription:
                "Clean Architecture thực chiến: BCs, aggregate, domain events, ACL.",
              courseImageUrl:
                "https://analyticsstepsfiles.s3.ap-south-1.amazonaws.com/backend/media/thumbnail/7474744/1518749_1635490594_What%20are%20the%20Basics%20of%20Software%20Documentation-Artboard%201.jpg",
              durationHours: 14,
              level: 3,
              price: 100000,
              dealPrice: 90000,
              teacherName: "An Teacher",
              tagNames: [],
            },
          ],
        },
        {
          subjectCode: "WDP301",
          status: 0,
          semesterPosition: 8,
          analysisMarkdown: null,
          courses: [],
        },
      ],
    },
  ],
  externalLearningPath: [
    {
      majorCode: "FULLSTACK_DEV",
      reason:
        "Track này giúp bổ sung kiến thức về Python và JavaScript, những công nghệ quan trọng cho lập trình viên FullStack.",
      steps: [
        {
          title: "Phát triển ứng dụng Full Stack với Node.js và Express",
          suggested_Courses: [
            {
              title: "Developing Backend Apps with Node.js and Express",
              link: "https://www.coursera.org/learn/developing-backend-apps-with-nodejs-and-express",
              provider: "IBM",
              level: "Intermediate level",
            },
          ],
        },
        {
          title: "Khóa học về phát triển Frontend với JavaScript",
          suggested_Courses: [
            {
              title: "Frontend Development for Java Full Stack",
              link: "https://www.coursera.org/learn/frontend-development-for-java-full-stack",
              provider: "Board Infinity",
              level: "Intermediate level",
            },
          ],
        },
      ],
    },
    {
      majorCode: "REACT_ADV",
      reason:
        "Track này giúp củng cố kiến thức về ReactJS, mang lại chiều sâu cho kỹ năng frontend.",
      steps: [
        {
          title: "Chương Trình Nâng Cao React",
          suggested_Courses: [
            {
              title: "Advanced React",
              link: "https://www.coursera.org/learn/advanced-react",
              provider: "Meta",
              level: "Intermediate level",
            },
            {
              title: "Learn Advanced React",
              link: "https://www.coursera.org/learn/learn-advanced-react",
              provider: "Scrimba",
              level: "Advanced level",
            },
          ],
        },
      ],
    },
    {
      majorCode: "PYTHON_WEB",
      reason: "Track này bổ sung kiến thức về phát triển web với Python.",
      steps: [
        {
          title: "Xây Dựng Ứng Dụng Web với Django",
          suggested_Courses: [
            {
              title: "Django Web Framework",
              link: "https://www.coursera.org/learn/django-web-framework",
              provider: "Meta",
              level: "Beginner level",
            },
          ],
        },
      ],
    },
  ],
};

export default function LearningPathSample() {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header Card - Combined */}
        <Card className="mb-6 overflow-hidden border-0 shadow-lg">
          {/* Top Section - Title & Status */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-6 border-b border-orange-100 dark:border-orange-900">
            <div className="flex items-start justify-between gap-4 my-1">
              <div className="flex-1">
                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3">
                  Lộ trình đề xuất
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {sampleData.pathName}
                </h1>
              </div>
              <Tag color="cyan" className="h-fit">
                Đang chọn chuyên ngành
              </Tag>
            </div>
          </div>

          {/* Bottom Section - Summary */}
          <div className="p-6 bg-white dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
              Tóm tắt kết quả học tập
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Sinh viên đã đạt điểm trung bình 8.49, với nhiều môn học nổi bật
                như <code>Ethics in IT</code> và <code>Web Design</code> đạt
                điểm 10. Tuy nhiên, môn <code>Object-Oriented Programming</code>{" "}
                là điểm yếu cần cải thiện. Để tiến gần hơn tới mục tiêu trở
                thành lập trình viên FullStack, sinh viên cần tập trung vào việc
                nâng cao kỹ năng lập trình và thực hành nhiều hơn.
              </p>
            </div>
          </div>
        </Card>

        {/* Main Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: "analysis",
              label: "Phân tích chung",
              children: <AnalysisTab data={sampleData} />,
            },
            {
              key: "roadmap",
              label: "Lộ trình học tập",
              children: <RoadmapTab />,
            },
          ]}
        />
      </div>
    </div>
  );
}

// Tab 1: Analysis Tab - Tính cách và Thói quen
function AnalysisTab({ data }: { data: typeof sampleData }) {
  // Helper function để loại bỏ heading ## từ markdown
  const removeMarkdownHeading = (markdown: string) => {
    return markdown.replace(/^##\s+[^\n]+\n+/, "").trim();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tính cách học tập */}
      <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-3 border-b border-orange-100 dark:border-orange-900/50">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Tính cách
          </span>
        </div>
        <div className="p-5 flex-1">
          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
            <MarkdownBlock markdown={removeMarkdownHeading(data.personality)} />
          </div>
        </div>
      </div>

      {/* Thói quen & sở thích học tập */}
      <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-3 border-b border-orange-100 dark:border-orange-900/50">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Thói quen & Sở thích
          </span>
        </div>
        <div className="p-5 flex-1">
          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400">
            <MarkdownBlock
              markdown={removeMarkdownHeading(data.habitAndInterestAnalysis)}
            />
          </div>
        </div>
      </div>

      {/* Năng lực học tập */}
      <div className="rounded-2xl border border-orange-100 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-5 py-3 border-b border-orange-100 dark:border-orange-900/50">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Năng lực học tập
          </span>
        </div>
        <div className="p-5 flex-1">
          <div className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed prose-strong:text-orange-600 dark:prose-strong:text-orange-400 prose-code:text-orange-700 dark:prose-code:text-orange-300 prose-code:bg-orange-50 dark:prose-code:bg-orange-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-medium">
            <MarkdownBlock
              markdown={removeMarkdownHeading(data.learningAbility)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab 2: Roadmap Tab - Lộ trình học tập
function RoadmapTab() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedMajor, setExpandedMajor] = useState<string | null>(null);

  // State để đóng/mở từng section
  const [sectionsOpen, setSectionsOpen] = useState({
    basic: true,
    internal: true,
    external: true,
  });

  // State cho việc chọn và sắp xếp chuyên ngành (khi status = 1)
  const [selectedMajors, setSelectedMajors] = useState<string[]>(
    sampleData.internalLearningPath.map((m) => m.majorId),
  );
  const [majorOrder, setMajorOrder] = useState<string[]>(
    sampleData.internalLearningPath.map((m) => m.majorId),
  );
  const [draggedMajor, setDraggedMajor] = useState<string | null>(null);

  const toggleSection = (section: "basic" | "internal" | "external") => {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle chọn chuyên ngành
  const toggleMajorSelection = (majorId: string) => {
    setSelectedMajors((prev) =>
      prev.includes(majorId)
        ? prev.filter((id) => id !== majorId)
        : [...prev, majorId],
    );
  };

  // Drag & Drop handlers
  const handleDragStart = (majorId: string) => {
    setDraggedMajor(majorId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetMajorId: string) => {
    if (!draggedMajor || draggedMajor === targetMajorId) return;

    setMajorOrder((prev) => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedMajor);
      const targetIndex = newOrder.indexOf(targetMajorId);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedMajor);

      return newOrder;
    });
    setDraggedMajor(null);
  };

  const handleDragEnd = () => {
    setDraggedMajor(null);
  };

  // Lấy danh sách majors theo thứ tự đã sắp xếp
  const orderedMajors = majorOrder
    .map((id) => sampleData.internalLearningPath.find((m) => m.majorId === id))
    .filter(Boolean);

  // Đếm tổng số khóa học trong một major
  const getTotalCourses = (
    major: (typeof sampleData.internalLearningPath)[0],
  ) => {
    return major.majorCourseGroups.reduce(
      (acc, cg) => acc + cg.courses.length,
      0,
    );
  };

  // Helper: Status label và màu sắc
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: "Chưa học",
          color: "default",
          bgClass: "bg-slate-100 dark:bg-slate-800",
        };
      case 1:
        return {
          label: "Đang học",
          color: "processing",
          bgClass: "bg-blue-50 dark:bg-blue-950/30",
        };
      case 2:
        return {
          label: "Đã hoàn thành",
          color: "success",
          bgClass: "bg-green-50 dark:bg-green-950/30",
        };
      default:
        return {
          label: "Chưa xác định",
          color: "default",
          bgClass: "bg-slate-100 dark:bg-slate-800",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* ========== 1. LỘ TRÌNH KHỞI ĐẦU ========== */}
      <section className="rounded-2xl border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Section Header - Clickable */}
        <div
          className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 px-6 py-5 border-b border-orange-200 dark:border-orange-900/50 cursor-pointer hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-950/50 dark:hover:to-amber-950/50 transition-colors"
          onClick={() => toggleSection("basic")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    Phần 1
                  </span>
                  <Tag color="orange" className="text-xs">
                    {sampleData.basicLearningPath.courseGroups.length} môn học
                  </Tag>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Lộ trình khởi đầu
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Dựa trên năng lực hiện tại, hệ thống chúng tôi đề xuất bạn nên
                  củng cố các môn học nền tảng sau
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-orange-500 text-lg transition-transform duration-200 ${
                  sectionsOpen.basic ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Content - Collapsible */}
        {sectionsOpen.basic && (
          <div className="p-6">
            <div className="space-y-3">
              {sampleData.basicLearningPath.courseGroups.map((group, idx) => {
                const statusInfo = getStatusInfo(group.status);
                const isExpanded = expandedSubject === group.subjectCode;

                return (
                  <div
                    key={group.subjectCode}
                    className={`rounded-xl border overflow-hidden transition-all ${
                      isExpanded
                        ? "border-orange-300 dark:border-orange-700 shadow-sm"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {/* Subject Header - Clickable */}
                    <div
                      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${statusInfo.bgClass}`}
                      onClick={() =>
                        setExpandedSubject(
                          isExpanded ? null : group.subjectCode,
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        {/* Subject Code Badge */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {group.subjectCode}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <Tag color="blue" className="text-xs">
                              Kỳ {group.semesterPosition}
                            </Tag>
                            <Tag
                              color={statusInfo.color as any}
                              className="text-xs"
                            >
                              {statusInfo.label}
                            </Tag>
                          </div>
                          {group.courses.length > 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {group.courses.length} khóa học đề xuất
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Expand indicator */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                          {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                        </span>
                        <span
                          className={`text-orange-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        {/* Analysis Markdown */}
                        {group.analysisMarkdown && (
                          <div className="p-5 bg-orange-50/50 dark:bg-orange-950/10">
                            <div className="prose prose-sm max-w-none dark:prose-invert text-slate-700 dark:text-slate-300 prose-headings:text-orange-700 dark:prose-headings:text-orange-400 prose-strong:text-orange-600 dark:prose-strong:text-orange-400 prose-h2:text-base prose-h3:text-sm prose-h2:mb-3 prose-h3:mb-2 prose-ul:my-2 prose-li:my-0.5">
                              <MarkdownBlock
                                markdown={group.analysisMarkdown}
                              />
                            </div>
                          </div>
                        )}

                        {/* Courses */}
                        {group.courses.length > 0 && (
                          <div className="p-5 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Khóa học đề xuất
                              </span>
                              <span className="text-xs text-slate-500">
                                {group.courses.length} khóa học
                              </span>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                              {group.courses.map((course) => (
                                <CourseCard
                                  key={course.courseId}
                                  id={course.courseId}
                                  imageUrl={course.courseImageUrl}
                                  title={course.title}
                                  descriptionLines={
                                    course.shortDescription
                                      ? [course.shortDescription]
                                      : []
                                  }
                                  instructor={
                                    course.teacherName || "Giảng viên"
                                  }
                                  level={course.level}
                                  price={course.price}
                                  dealPrice={course.dealPrice}
                                  routerPush={`/course/${course.courseId}`}
                                  isHorizontal={true}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ========== 2. CHUYÊN NGÀNH HẸP ========== */}
      <section className="rounded-2xl border border-cyan-200 dark:border-cyan-900/50 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Section Header - Clickable */}
        <div
          className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 px-6 py-5 border-b border-cyan-200 dark:border-cyan-900/50 cursor-pointer hover:from-cyan-100 hover:to-teal-100 dark:hover:from-cyan-950/50 dark:hover:to-teal-950/50 transition-colors"
          onClick={() => toggleSection("internal")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    Phần 2
                  </span>
                  <Tag color="cyan" className="text-xs">
                    {sampleData.internalLearningPath.length} chuyên ngành
                  </Tag>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Chuyên ngành hẹp
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Các chuyên ngành hẹp phù hợp với mục tiêu nghề nghiệp của bạn.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-cyan-500 text-lg transition-transform duration-200 ${
                  sectionsOpen.internal ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Content - Collapsible */}
        {sectionsOpen.internal && (
          <div className="p-6">
            {/* Instruction khi status = 1 */}
            {sampleData.status === 1 && (
              <div className="mb-4 p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
                <p className="text-sm text-cyan-700 dark:text-cyan-300">
                  <span className="font-semibold">Hướng dẫn:</span> Kéo thả để
                  sắp xếp thứ tự ưu tiên học các chuyên ngành. Bỏ chọn các
                  chuyên ngành bạn không muốn theo học.
                </p>
              </div>
            )}

            {/* Major Cards - Draggable */}
            <div className="space-y-4">
              {orderedMajors.map((major, idx) => {
                if (!major) return null;
                const isExpanded = expandedMajor === major.majorId;
                const isSelected = selectedMajors.includes(major.majorId);
                const totalCourses = getTotalCourses(major);
                const isDragging = draggedMajor === major.majorId;

                return (
                  <div
                    key={major.majorId}
                    draggable={sampleData.status === 1}
                    onDragStart={() => handleDragStart(major.majorId)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(major.majorId)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      isDragging
                        ? "opacity-50 border-cyan-400 dark:border-cyan-600"
                        : isSelected
                          ? "border-cyan-300 dark:border-cyan-700 bg-white dark:bg-slate-800"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60"
                    } ${sampleData.status === 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
                  >
                    {/* Major Header */}
                    <div
                      className={`p-5 ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox + Drag Handle (khi status = 1) */}
                        {sampleData.status === 1 && (
                          <div className="flex flex-col items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleMajorSelection(major.majorId)
                              }
                              className="w-5 h-5 rounded border-cyan-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-slate-400 text-xs">⋮⋮</span>
                          </div>
                        )}

                        {/* Position Badge (chỉ hiển thị khi đã chọn) */}
                        {isSelected && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {selectedMajors.indexOf(major.majorId) + 1}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {major.majorCode}
                            </span>
                            <Tag color="cyan" className="text-xs">
                              {major.majorCourseGroups.length} môn học
                            </Tag>
                            {totalCourses > 0 && (
                              <Tag color="green" className="text-xs">
                                {totalCourses} khóa học
                              </Tag>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {major.reason}
                          </p>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() =>
                            setExpandedMajor(isExpanded ? null : major.majorId)
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {isExpanded ? "Thu gọn" : "Chi tiết"}
                          </span>
                          <span
                            className={`text-cyan-500 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        {/* Course Groups */}
                        <div className="p-5">
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                            Danh sách môn học trong chuyên ngành
                          </h4>
                          <div className="space-y-3">
                            {major.majorCourseGroups.map((cg) => (
                              <div
                                key={cg.subjectCode}
                                className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                              >
                                {/* Subject Header */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50">
                                  <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 text-xs font-semibold rounded bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300">
                                      {cg.subjectCode}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      Kỳ {cg.semesterPosition}
                                    </span>
                                  </div>
                                  {cg.courses.length > 0 && (
                                    <Tag color="blue" className="text-xs">
                                      {cg.courses.length} khóa học
                                    </Tag>
                                  )}
                                </div>

                                {/* Courses */}
                                {cg.courses.length > 0 && (
                                  <div className="p-3 bg-white dark:bg-slate-900">
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                      {cg.courses.map((course) => (
                                        <CourseCard
                                          key={course.courseId}
                                          id={course.courseId}
                                          imageUrl={course.courseImageUrl}
                                          title={course.title}
                                          descriptionLines={
                                            course.shortDescription
                                              ? [course.shortDescription]
                                              : []
                                          }
                                          instructor={
                                            course.teacherName || "Giảng viên"
                                          }
                                          level={course.level}
                                          price={course.price}
                                          dealPrice={course.dealPrice}
                                          routerPush={`/course/${course.courseId}`}
                                          isHorizontal={true}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Confirm Button (khi status = 1) */}
            {sampleData.status === 1 && selectedMajors.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Đã chọn{" "}
                      <span className="font-semibold text-cyan-600">
                        {selectedMajors.length}
                      </span>{" "}
                      chuyên ngành
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Thứ tự ưu tiên:{" "}
                      {selectedMajors
                        .map((id, i) => {
                          const m = sampleData.internalLearningPath.find(
                            (x) => x.majorId === id,
                          );
                          return m?.majorCode;
                        })
                        .filter(Boolean)
                        .join(" → ")}
                    </p>
                  </div>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 border-0 h-12 text-base font-semibold"
                >
                  Xác nhận lựa chọn chuyên ngành
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========== 3. KHÓA HỌC BÊN NGOÀI ========== */}
      <section className="rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Section Header - Clickable */}
        <div
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 px-6 py-5 border-b border-purple-200 dark:border-purple-900/50 cursor-pointer hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 transition-colors"
          onClick={() => toggleSection("external")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    Phần 3
                  </span>
                  <Tag color="purple" className="text-xs">
                    {sampleData.externalLearningPath.length} track
                  </Tag>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Đề xuất khóa học bên ngoài
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Các khóa học bổ sung từ nền tảng ngoài để bù lấp lỗ hổng kỹ
                  năng.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-purple-500 text-lg transition-transform duration-200 ${
                  sectionsOpen.external ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Content - Collapsible */}
        {sectionsOpen.external && (
          <div className="p-6">
            <div className="space-y-6">
              {sampleData.externalLearningPath.map((track) => (
                <div
                  key={track.majorCode}
                  className="rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden"
                >
                  {/* Track Header */}
                  <div className="bg-purple-50 dark:bg-purple-950/30 px-5 py-4 border-b border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-purple-700 dark:text-purple-300">
                          {track.majorCode.replace(/_/g, " ")}
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {track.reason}
                        </p>
                      </div>
                      <Tag color="purple">{track.steps.length} bước</Tag>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {track.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="flex gap-4">
                          {/* Step Number */}
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                            {stepIdx + 1}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white mb-3">
                              {step.title}
                            </div>
                            <div className="space-y-2">
                              {step.suggested_Courses.map(
                                (course, courseIdx) => (
                                  <a
                                    key={courseIdx}
                                    href={course.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                        {course.title}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Tag className="text-xs" color="purple">
                                          {course.provider}
                                        </Tag>
                                        <span className="text-xs text-slate-500">
                                          {course.level}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-purple-500 group-hover:text-purple-600 flex-shrink-0 ml-3 text-sm">
                                      Xem →
                                    </span>
                                  </a>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
