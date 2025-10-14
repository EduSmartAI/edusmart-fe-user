"use client";

import React, { useState } from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { Button, Tag, Card, Badge } from "antd";
import {
  FiTarget,
  FiTrendingUp,
  FiGlobe,
  FiStar,
  FiBookOpen,
  FiCheck,
  FiExternalLink,
  FiClock,
  FiUsers,
  FiAward,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiPlus,
  FiMinus,
  FiMove,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

// Mock data based on the API response structure
const mockLearningPathData = {
  basicLearningPath: {
    subjectName: "Lộ trình string",
    semester: null,
    courses: [
        {
            courseId: "ccda6079-9887-4f9f-9b32-28ec25d613ba",
            semesterPosition: 2,
            subjectCode: "PRO192",
            title: "Object-Oriented Programming",
            shortDescription:
              "OOP sạch và kiểm thử: refactor, DBC, TDD JUnit, property-based.",
            description:
              "Refactoring, design-by-contract, TDD with JUnit, property-based tests.",
            slug: "pro192-clean-oop-testing",
            courseImageUrl:
              "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
            learnerCount: 3,
            durationMinutes: 780,
            durationHours: 13,
            level: 2,
            price: 59.99,
            dealPrice: 49.99,
          },
          {
            courseId: "ccda6079-9887-4f9f-9b32-28ec25d613bb",
            semesterPosition: 2,
            subjectCode: "PRO192",
            title: "Object-Oriented Programming",
            shortDescription:
              "OOP sạch và kiểm thử: refactor, DBC, TDD JUnit, property-based.",
            description:
              "Refactoring, design-by-contract, TDD with JUnit, property-based tests.",
            slug: "pro192-clean-oop-testing",
            courseImageUrl:
              "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
            learnerCount: 3,
            durationMinutes: 780,
            durationHours: 13,
            level: 2,
            price: 59.99,
            dealPrice: 49.99,
          },
      {
        courseId: "ccda6079-9887-4f9f-9b32-28ec25d613bf",
        semesterPosition: 2,
        subjectCode: "PRO192",
        title: "Object-Oriented Programming",
        shortDescription:
          "OOP sạch và kiểm thử: refactor, DBC, TDD JUnit, property-based.",
        description:
          "Refactoring, design-by-contract, TDD with JUnit, property-based tests.",
        slug: "pro192-clean-oop-testing",
        courseImageUrl:
          "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        learnerCount: 3,
        durationMinutes: 780,
        durationHours: 13,
        level: 2,
        price: 59.99,
        dealPrice: 49.99,
      },
      {
        courseId: "7f3d6b0f-5809-487d-bc4c-d2ff174a3052",
        semesterPosition: 2,
        subjectCode: "PRO192",
        title: "Object-Oriented Programming",
        shortDescription:
          "Mẫu thiết kế Java: GoF, composition>inheritance, anti-patterns.",
        description:
          "GoF patterns, composition vs inheritance, anti-patterns, refactoring.",
        slug: "pro192-design-patterns-intermediate",
        courseImageUrl:
          "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        learnerCount: 1,
        durationMinutes: 720,
        durationHours: 12,
        level: 1,
        price: 57.99,
        dealPrice: 45.99,
      },
      {
        courseId: "d30347e9-9542-435f-a75f-2fe4b2002de4",
        semesterPosition: 2,
        subjectCode: "PRO192",
        title: "Object-Oriented Programming",
        shortDescription:
          "OOP căn bản đến trung cấp: SOLID, exception, collections, unit test.",
        description:
          "OOP pillars, SOLID, exceptions, collections, unit testing in Java.",
        slug: "pro192-oop-java-b2i",
        courseImageUrl:
          "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        learnerCount: 1,
        durationMinutes: 720,
        durationHours: 12,
        level: 1,
        price: 49.99,
        dealPrice: 29.99,
      },
      {
        courseId: "c4a22bff-1b94-4096-bf00-f280fd68bb62",
        semesterPosition: 3,
        subjectCode: "DBI202",
        title: "Database Systems",
        shortDescription:
          "Đồ án thiết kế CSDL: từ yêu cầu đến ERD, chuẩn hóa, indexing.",
        description:
          "Case-study: requirements → ERD, normalization, indexing strategy.",
        slug: "dbi202-design-capstone",
        courseImageUrl:
          "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        learnerCount: 0,
        durationMinutes: 780,
        durationHours: 13,
        level: 2,
        price: 64.99,
        dealPrice: 49.99,
      },
    ],
  },
  internalLearningPath: [
     {
      majorId: "51efa57d-e0eb-4edd-bc93-e47b44e175da",
      majorCode: "Java React Developer",
      reason: "Phát triển ứng dụng web hiện đại với React ecosystem",
      positionIndex: null,
      majorCourse: [
        {
          courseId: "d31e57c2-5f31-4352-91af-00ed1c71e131",
          semesterPosition: 7,
          subjectCode: "PRN222",
          title: "Advanced Cross-Platform Application Programming With .NET",
          shortDescription:
            "Nâng cao .NET đa nền tảng: MVVM, DI, storage, API, deploy.",
          description: "MVVM, DI, local storage, API integration, deployment.",
          slug: "prn222-dotnet-advanced",
          courseImageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
          learnerCount: 1,
          durationMinutes: 780,
          durationHours: 13,
          level: 2,
          price: 69.99,
          dealPrice: 54.99,
        },
        {
          courseId: "f6868ece-af64-4c58-a272-5e59e5c85ab5",
          semesterPosition: 7,
          subjectCode: "SWD392",
          title: "Software Architecture and Design",
          shortDescription:
            "Clean Architecture thực chiến: BCs, aggregate, domain events, ACL.",
          description:
            "Bounded contexts, aggregates, domain events, anti-corruption layers.",
          slug: "swd392-clean-architecture-pro",
          courseImageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
          learnerCount: 0,
          durationMinutes: 840,
          durationHours: 14,
          level: 3,
          price: 89.99,
          dealPrice: 69.99,
        },
        {
          courseId: "00e5d16d-b780-4834-932c-3bdc21821aef",
          semesterPosition: 8,
          subjectCode: "PRN232",
          title: "Building Cross-Platform Back-End Application With .NET",
          shortDescription:
            "API an toàn: JWT/OIDC, validation, audit log, rate limit, health.",
          description:
            "JWT/OIDC, validation, audit logging, rate limiting, health checks.",
          slug: "prn232-secure-apis-advanced",
          courseImageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
          learnerCount: 0,
          durationMinutes: 720,
          durationHours: 12,
          level: 2,
          price: 74.99,
          dealPrice: 59.99,
        },
      ],
    },
    {
      majorId: "51efa57d-e0eb-4edd-bc93-e47b44e175d5",
      majorCode: "Full-stack React Developer",
      reason: "Phát triển ứng dụng web hiện đại với React ecosystem",
      positionIndex: null,
      majorCourse: [
        {
          courseId: "d31e57c2-5f31-4352-91af-00ed1c71e131",
          semesterPosition: 7,
          subjectCode: "PRN222",
          title: "Advanced Cross-Platform Application Programming With .NET",
          shortDescription:
            "Nâng cao .NET đa nền tảng: MVVM, DI, storage, API, deploy.",
          description: "MVVM, DI, local storage, API integration, deployment.",
          slug: "prn222-dotnet-advanced",
          courseImageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
          learnerCount: 1,
          durationMinutes: 780,
          durationHours: 13,
          level: 2,
          price: 69.99,
          dealPrice: 54.99,
        },
        {
          courseId: "f6868ece-af64-4c58-a272-5e59e5c85ab5",
          semesterPosition: 7,
          subjectCode: "SWD392",
          title: "Software Architecture and Design",
          shortDescription:
            "Clean Architecture thực chiến: BCs, aggregate, domain events, ACL.",
          description:
            "Bounded contexts, aggregates, domain events, anti-corruption layers.",
          slug: "swd392-clean-architecture-pro",
          courseImageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
          learnerCount: 0,
          durationMinutes: 840,
          durationHours: 14,
          level: 3,
          price: 89.99,
          dealPrice: 69.99,
        },
        {
          courseId: "00e5d16d-b780-4834-932c-3bdc21821aef",
          semesterPosition: 8,
          subjectCode: "PRN232",
          title: "Building Cross-Platform Back-End Application With .NET",
          shortDescription:
            "API an toàn: JWT/OIDC, validation, audit log, rate limit, health.",
          description:
            "JWT/OIDC, validation, audit logging, rate limiting, health checks.",
          slug: "prn232-secure-apis-advanced",
          courseImageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
          learnerCount: 0,
          durationMinutes: 720,
          durationHours: 12,
          level: 2,
          price: 74.99,
          dealPrice: 59.99,
        },
      ],
    },
    {
      majorId: "f2726920-0acb-4627-af5f-613118318d2d",
      majorCode: ".NET",
      reason: "Xây dựng ứng dụng enterprise với .NET ecosystem",
      positionIndex: null,
      majorCourse: [
        {
          courseId: "d31e57c2-5f31-4352-91af-00ed1c71e131",
          semesterPosition: 7,
          subjectCode: "PRN222",
          title: "Advanced Cross-Platform Application Programming With .NET",
          shortDescription:
            "Nâng cao .NET đa nền tảng: MVVM, DI, storage, API, deploy.",
          description: "MVVM, DI, local storage, API integration, deployment.",
          slug: "prn222-dotnet-advanced",
          courseImageUrl: "https://cdn.example.com/images/prn222.jpg",
          learnerCount: 1,
          durationMinutes: 780,
          durationHours: 13,
          level: 2,
          price: 69.99,
          dealPrice: 54.99,
        },
        {
          courseId: "f6868ece-af64-4c58-a272-5e59e5c85ab5",
          semesterPosition: 7,
          subjectCode: "SWD392",
          title: "Software Architecture and Design",
          shortDescription:
            "Clean Architecture thực chiến: BCs, aggregate, domain events, ACL.",
          description:
            "Bounded contexts, aggregates, domain events, anti-corruption layers.",
          slug: "swd392-clean-architecture-pro",
          courseImageUrl: "https://cdn.example.com/images/swd392-pro.jpg",
          learnerCount: 0,
          durationMinutes: 840,
          durationHours: 14,
          level: 3,
          price: 89.99,
          dealPrice: 69.99,
        },
        {
          courseId: "00e5d16d-b780-4834-932c-3bdc21821aef",
          semesterPosition: 8,
          subjectCode: "PRN232",
          title: "Building Cross-Platform Back-End Application With .NET",
          shortDescription:
            "API an toàn: JWT/OIDC, validation, audit log, rate limit, health.",
          description:
            "JWT/OIDC, validation, audit logging, rate limiting, health checks.",
          slug: "prn232-secure-apis-advanced",
          courseImageUrl: "https://cdn.example.com/images/prn232-secure.jpg",
          learnerCount: 0,
          durationMinutes: 720,
          durationHours: 12,
          level: 2,
          price: 74.99,
          dealPrice: 59.99,
        },
      ],
    },
  ],
  externalLearningPath: [
    {
      majorId: "205152ce-5b01-4c9f-9b00-eff4173a189e",
      majorCode: "TF_NODEJS",
      reason:
        "Track này giúp tôi áp dụng TensorFlow trong Node.js, bổ sung cho kiến thức AI đã có và mở rộng khả năng phát triển ứng dụng học máy.",
      steps: [
        {
          title: "Khóa học phát triển ứng dụng Backend với Node.js và MongoDB",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title:
                "Khóa học phát triển ứng dụng Backend với Node.js và MongoDB",
              link: "https://www.coursera.org/learn/intermediate-back-end-development-with-node-js-mongodb",
              provider: "IBM",
              reason:
                "Khóa học hỗ trợ giới thiệu về Node.js và phát triển API với MongoDB, phù hợp với mục tiêu học về phát triển ứng dụng backend.",
              level: "Intermediate level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
        {
          title: "Khóa học chuyên sâu về JavaScript và Node.js",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Khóa học chuyên sâu về JavaScript và Node.js",
              link: "https://www.coursera.org/specializations/javascript-programming-with-react-node-mongodb",
              provider: "IBM",
              reason:
                "Khóa chuyên sâu này giúp học viên tiếp cận công nghệ JavaScript với Node.js và MongoDB, đáp ứng mục tiêu phát triển kỹ năng lập trình web.",
              level: "Beginner level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
      ],
    },
    {
      majorId: "4ceb662e-9af4-4c87-82c5-882b11182937",
      majorCode: "JAVA_ML",
      reason:
        "Track này bổ sung kiến thức về học máy trong Java, giúp tôi mở rộng khả năng lập trình và ứng dụng AI trong các dự án sử dụng Java.",
      steps: [
        {
          title: "Nâng cao kỹ năng Java",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Nâng cao kỹ năng Java",
              link: "https://www.coursera.org/learn/parallel-programming-in-java",
              provider: "Rice University",
              reason:
                "Khóa học này giúp nắm vững các khái niệm lập trình song song trong Java, hỗ trợ việc viết ứng dụng hiệu quả.",
              level: "Intermediate level",
              rating: null,
              est_Duration_Weeks: null,
            },
            {
              title: "Nâng cao kỹ năng Java",
              link: "https://www.coursera.org/learn/advanced-java",
              provider: "LearnQuest",
              reason:
                "Khóa học này hỗ trợ CORE_TERMS 'Java' và giúp phát triển kỹ năng lập trình Java nâng cao.",
              level: "Advanced level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
        {
          title: "Quản lý Machine Learning với MLOps",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Quản lý Machine Learning với MLOps",
              link: "https://www.coursera.org/learn/mlops-fundamentals",
              provider: "Google Cloud",
              reason:
                "Khóa học này hỗ trợ CORE_TERMS 'MLOps' và giúp hiểu về cách triển khai và vận hành hệ thống ML trong thực tế.",
              level: "Intermediate level",
              rating: null,
              est_Duration_Weeks: null,
            },
            {
              title: "Quản lý Machine Learning với MLOps",
              link: "https://www.coursera.org/learn/mlops-mlflow-huggingface-duke",
              provider: "Duke University",
              reason:
                "Khóa học này hỗ trợ CORE_TERMS 'MLOps' và cung cấp kiến thức về quản lý mô hình ML.",
              level: "Advanced level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
      ],
    },
    {
      majorId: "500bda7a-2b9e-4561-a762-528d29a1e394",
      majorCode: "STRING_MANIP",
      reason:
        "Track này giúp tôi củng cố kỹ năng xử lý chuỗi trong Python, hỗ trợ cho việc phát triển các ứng dụng AI và phân tích dữ liệu.",
      steps: [
        {
          title: "Xử lý và Manipulation Dữ Liệu với Python",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Xử lý và Manipulation Dữ Liệu với Python",
              link: "https://www.coursera.org/learn/data-processing-and-manipulation",
              provider: "University of Colorado Boulder",
              reason:
                "Khóa này tạo điều kiện cho việc hiểu biết về các khái niệm và công cụ xử lý và manipulation dữ liệu.",
              level: "Intermediate level",
              rating: null,
              est_Duration_Weeks: null,
            },
            {
              title: "Xử lý và Manipulation Dữ Liệu với Python",
              link: "https://www.coursera.org/learn/data-manipulation-in-rpa",
              provider: "UiPath",
              reason:
                "Khóa này hỗ trợ các kỹ năng xử lý dữ liệu và làm quen với các biến và đối số trong lập trình tự động hóa.",
              level: "Beginner level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
        {
          title: "Xử lý Chuỗi và Thuật Toán",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Xử lý Chuỗi và Thuật Toán",
              link: "https://www.coursera.org/learn/algorithms-on-strings",
              provider: "University of California San Diego",
              reason:
                "Khóa học này cung cấp kiến thức sâu sắc về các thuật toán xử lý chuỗi, rất phù hợp với mục tiêu của step.",
              level: "Intermediate level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
      ],
    },
  ],
};

export default function LearningPathRecommendation() {
  const router = useRouter();
  const [selectedInternalPath, setSelectedInternalPath] = useState(0);
  const [selectedExternalPath, setSelectedExternalPath] = useState(0);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [majorOrder, setMajorOrder] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [viewingMajorId, setViewingMajorId] = useState<string | null>(null);

  const handleConfirmPath = () => {
    // TODO: Call API to confirm the learning path
    router.push("/learning-path-results");
  };

  const handleGoBack = () => {
    router.push('/');
  };

  // Handle major selection
  const handleMajorToggle = (majorId: string) => {
    if (selectedMajors.includes(majorId)) {
      // Remove from selection
      setSelectedMajors((prev) => prev.filter((id) => id !== majorId));
      setMajorOrder((prev) => prev.filter((id) => id !== majorId));
    } else {
      // Add to selection
      setSelectedMajors((prev) => [...prev, majorId]);
      setMajorOrder((prev) => [...prev, majorId]);
    }
  };

  // Move major up in order
  const moveMajorUp = (majorId: string) => {
    const currentIndex = majorOrder.indexOf(majorId);
    if (currentIndex > 0) {
      const newOrder = [...majorOrder];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [
        newOrder[currentIndex],
        newOrder[currentIndex - 1],
      ];
      setMajorOrder(newOrder);
    }
  };

  // Move major down in order
  const moveMajorDown = (majorId: string) => {
    const currentIndex = majorOrder.indexOf(majorId);
    if (currentIndex < majorOrder.length - 1) {
      const newOrder = [...majorOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      setMajorOrder(newOrder);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, majorId: string) => {
    setDraggedItem(majorId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", majorId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetMajorId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetMajorId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = majorOrder.indexOf(draggedItem);
    const targetIndex = majorOrder.indexOf(targetMajorId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newOrder = [...majorOrder];
    // Remove dragged item
    newOrder.splice(draggedIndex, 1);
    // Insert at target position
    newOrder.splice(targetIndex, 0, draggedItem);

    setMajorOrder(newOrder);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Helper function to convert course data to CourseCard format
  const convertToCourseCard = (course: any) => ({
    imageUrl: course.courseImageUrl,
    title: course.title,
    descriptionLines: [course.shortDescription],
    instructor: `${course.subjectCode} - Kỳ ${course.semesterPosition}`,
    price: course.dealPrice ? `$${course.dealPrice}` : `$${course.price}`,
    routerPush: `/course/${course.slug}`,
    level: course.level,
    duration: `${course.durationHours}h`,
    learnerCount: course.learnerCount,
  });

  // Group basic courses by semester
  const groupedBasicCourses =
    mockLearningPathData.basicLearningPath.courses.reduce(
      (acc: any, course) => {
        const semester = course.semesterPosition;
        if (!acc[semester]) {
          acc[semester] = [];
        }
        acc[semester].push(course);
        return acc;
      },
      {},
    );

  const SemesterSection = ({
    semester,
    courses,
    title,
  }: {
    semester: number;
    courses: any[];
    title: string;
  }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3 shadow-md">
          {semester}
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h4>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mt-1"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-13">
        {courses.map((course, index) => (
          <div
            key={index}
            className="transform hover:scale-105 transition-transform duration-300"
          >
            <CourseCard {...convertToCourseCard(course)} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <BaseScreenAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <FiTarget className="w-8 h-8 text-white" />
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Lộ trình học tập{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                được đề xuất
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Dựa trên kết quả khảo sát và đánh giá năng lực của bạn, AI đã tạo
              ra lộ trình học tập tối ưu để giúp bạn đạt được mục tiêu nghề
              nghiệp.
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium">
              <FiClock className="w-4 h-4 mr-2" />
              Đang chờ xác nhận
            </div>
          </div>

          {/* Section 1: Basic Learning Path */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-25 to-transparent dark:from-blue-900/10 dark:via-blue-800/5 dark:to-transparent rounded-3xl -m-4"></div>

            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  {/* <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div> */}
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-blue-700 dark:text-blue-400 mb-2 drop-shadow-lg">
                        Lộ trình khởi đầu
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Các môn học nền tảng được đề xuất dựa trên năng lực hiện
                      tại của bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-blue-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
                  {Object.entries(groupedBasicCourses).map(
                    ([semester, courses]: [string, any]) => (
                      <SemesterSection
                        key={semester}
                        semester={parseInt(semester)}
                        courses={courses}
                        title={`Kỳ ${semester}`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Internal Learning Path */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-25 to-transparent dark:from-green-900/10 dark:via-emerald-800/5 dark:to-transparent rounded-3xl -m-4"></div>

            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  {/* <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div> */}
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
                        Chuyên ngành hẹp phù hợp
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      AI đề xuất các chuyên ngành hẹp phù hợp với năng lực và sở
                      thích của bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-green-200 dark:border-green-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-50 dark:bg-emerald-900/10 rounded-full transform -translate-x-14 translate-y-14"></div>
                <div className="relative z-10">
                  {/* Specialization Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {mockLearningPathData.internalLearningPath.map((path, pathIndex) => (
                      <div
                        key={pathIndex}
                        onClick={() => setViewingMajorId(viewingMajorId === path.majorId ? null : path.majorId)}
                        className={`relative cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
                          viewingMajorId === path.majorId
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 shadow-lg'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <h3 className={`font-bold text-base leading-tight ${
                                viewingMajorId === path.majorId 
                                  ? 'text-white' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {path.majorCode}
                              </h3>
                            </div>
                          </div>
                          
                          {/* Status Indicators */}
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              viewingMajorId === path.majorId 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {path.majorCourse.length} khóa học
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className={`text-sm mb-3 line-clamp-2 ${
                          viewingMajorId === path.majorId 
                            ? 'text-white/90' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {path.reason || `${path.majorCourse.length} khóa học chuyên sâu`}
                        </p>
                        
                        {/* Action Row */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMajorToggle(path.majorId);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedMajors.includes(path.majorId)
                                ? viewingMajorId === path.majorId
                                  ? 'bg-white text-black hover:bg-gray-50 shadow-sm'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-100'
                                : viewingMajorId === path.majorId
                                  ? 'bg-white/20 text-white hover:bg-white/30 border border-white/40'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                            }`}
                          >
                            {selectedMajors.includes(path.majorId) ? (
                              <span className="flex items-center space-x-1 text-black">
                                <FiCheck className="w-4 h-4" />
                                <span>Đã chọn</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1">
                                <FiPlus className="w-4 h-4" />
                                <span>Chọn combo</span>
                              </span>
                            )}
                          </button>
                          
                          <div className={`text-xs ${
                            viewingMajorId === path.majorId 
                              ? 'text-white/70' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {viewingMajorId === path.majorId ? 'Đang xem' : 'Nhấn để xem'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Specialization Courses */}
                  {viewingMajorId && (
                    <div>
                      {(() => {
                        const selectedPath = mockLearningPathData.internalLearningPath.find(
                          (p) => p.majorId === viewingMajorId
                        );
                        return selectedPath ? (
                          <>
                            <div className="mb-6 border-gray-200 dark:border-gray-700">
                              <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
                                Lộ trình {selectedPath.majorCode}
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {selectedPath.majorCourse.map((course, index) => (
                                <div
                                  key={index}
                                  className="transform hover:scale-105 transition-transform duration-300"
                                >
                                  <CourseCard {...convertToCourseCard(course)} />
                                </div>
                              ))}
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Selected Order Management */}
                  {selectedMajors.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                          {/* <FiTarget className="w-6 h-6 mr-3 text-green-600" /> */}
                          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
                            Thứ tự học đã chọn
                          </h3>
                          <h3 className="ml-3 text-base font-medium text-gray-500 dark:text-gray-400">
                            ({selectedMajors.length} combo)
                          </h3>
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {majorOrder.map((majorId, index) => {
                          const path = mockLearningPathData.internalLearningPath.find(
                            (p) => p.majorId === majorId,
                          );
                          if (!path) return null;

                          const isDragging = draggedItem === majorId;

                          return (
                            <div
                              key={majorId}
                              draggable
                              onDragStart={(e) => handleDragStart(e, majorId)}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragEnter}
                              onDrop={(e) => handleDrop(e, majorId)}
                              onDragEnd={handleDragEnd}
                              className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-move ${
                                isDragging
                                  ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 opacity-50 scale-105 shadow-lg'
                                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:shadow-md hover:bg-green-100 dark:hover:bg-green-900/30'
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing">
                                  <FiMove className="w-5 h-5" />
                                </div>
                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900 dark:text-white">
                                    {path.majorCode}
                                  </h5>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {path.majorCourse.length} khóa học
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => moveMajorUp(majorId)}
                                  disabled={index === 0}
                                  className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Di chuyển lên"
                                >
                                  <FiChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </button>
                                <button
                                  onClick={() => moveMajorDown(majorId)}
                                  disabled={index === majorOrder.length - 1}
                                  className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  title="Di chuyển xuống"
                                >
                                  <FiChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </button>
                                <button
                                  onClick={() => handleMajorToggle(majorId)}
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 text-red-500 transition-colors"
                                  title="Xóa khỏi danh sách"
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: External Learning Path */}
          <div className="mb-16 relative">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-violet-25 to-transparent dark:from-purple-900/10 dark:via-violet-800/5 dark:to-transparent rounded-3xl -m-4"></div> */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-violet-25 to-transparent dark:from-purple-900/10 dark:via-violet-800/5 dark:to-transparent rounded-3xl -m-4"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  {/* <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full"></div> */}
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-purple-700 dark:text-purple-400 mb-2 drop-shadow-lg">
                        Đề xuất các khóa học bên ngoài
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Các khóa học từ các nền tảng uy tín để nâng cao kỹ năng
                      chuyên môn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-100 dark:bg-purple-900/20 rounded-full transform translate-x-18 -translate-y-18"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/10 rounded-full transform -translate-x-16 translate-y-16"></div>
                <div className="relative z-10">
                  {/* Track Selection Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {mockLearningPathData.externalLearningPath.map((path, pathIndex) => (
                      <div
                        key={pathIndex}
                        onClick={() => setSelectedExternalPath(pathIndex)}
                        className={`relative cursor-pointer rounded-lg p-5 transition-all duration-300 border ${
                          selectedExternalPath === pathIndex
                            ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white border-purple-500 shadow-lg'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                        }`}
                      >
                        {/* Selection Indicator */}
                        {selectedExternalPath === pathIndex && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                          </div>
                        )}
                        
                        {/* Icon */}
                        {/* <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                          selectedExternalPath === pathIndex 
                            ? 'bg-white/20' 
                            : 'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          <FiGlobe className={`w-5 h-5 ${
                            selectedExternalPath === pathIndex 
                              ? 'text-white' 
                              : 'text-purple-600 dark:text-purple-400'
                          }`} />
                        </div> */}
                        
                        {/* Content */}
                        <div>
                          <h3 className={`font-bold text-base mb-2 ${
                            selectedExternalPath === pathIndex 
                              ? 'text-white' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {path.majorCode}
                          </h3>
                          <p className={`text-sm mb-3 line-clamp-2 ${
                            selectedExternalPath === pathIndex 
                              ? 'text-white/90' 
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {path.reason}
                          </p>
                          <div className={`flex items-center justify-between text-xs ${
                            selectedExternalPath === pathIndex 
                              ? 'text-white/80' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <span>{path.steps.reduce((sum, step) => sum + step.suggested_Courses.length, 0)} khóa học</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Track Content */}
                  {mockLearningPathData.externalLearningPath[selectedExternalPath] && (
                    <div>
                      {/* Track Header */}
                      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-3">
                          {/* <FiGlobe className="w-6 h-6 mr-3 text-purple-600" /> */}
                          <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                            {mockLearningPathData.externalLearningPath[selectedExternalPath].majorCode}
                          </span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm ">
                          {mockLearningPathData.externalLearningPath[selectedExternalPath].reason}
                        </p>
                      </div>

                      {/* Learning Steps */}
                      <div className="space-y-6">
                        {mockLearningPathData.externalLearningPath[selectedExternalPath].steps.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                          >
                            {/* Step Header */}
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                    {stepIndex + 1}
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {step.title}
                                  </h4>
                                </div>
                                <Tag color="purple">
                                  {step.suggested_Courses.length} khóa học
                                </Tag>
                              </div>
                            </div>

                            {/* Courses Grid */}
                            <div className="p-5 bg-white dark:bg-gray-800">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {step.suggested_Courses.map((course, courseIndex) => (
                                  <div
                                    key={courseIndex}
                                    className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                                  >
                                    {/* Course Header */}
                                    <div className="flex items-start justify-between mb-3">
                                      <h5 className="font-semibold text-gray-900 dark:text-white text-base flex-1 pr-2 leading-tight">
                                        {course.title}
                                      </h5>
                                      <FiExternalLink className="w-4 h-4 text-purple-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                    </div>
                                    
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      <Tag color="blue" className="text-xs">
                                        <FiStar className="w-3 h-3 inline mr-1" />
                                        {course.provider}
                                      </Tag>
                                      {course.level && (
                                        <Tag color="green" className="text-xs">
                                          {course.level}
                                        </Tag>
                                      )}
                                    </div>
                                    
                                    {/* Reason */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                      {course.reason}
                                    </p>
                                    
                                    {/* Action Button */}
                                    <Button
                                        type="link"
                                        icon={<FiExternalLink />}
                                        href={course.link}
                                        target="_blank"
                                        className="p-0 h-auto text-purple-600 hover:text-purple-800"
                                      >
                                        Xem khóa học
                                      </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Xác nhận lộ trình học tập
              </h3>
              <p className="text-blue-100 mb-4">
                Bạn có đồng ý với lộ trình học tập được đề xuất? Sau khi xác
                nhận, lộ trình này sẽ trở thành lộ trình chính thức của bạn.
              </p>

              {/* Selected Majors Summary */}
              {selectedMajors.length > 0 && (
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-3">
                    Chuyên ngành hẹp đã chọn:
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {majorOrder.map((majorId, index) => {
                      const path =
                        mockLearningPathData.internalLearningPath.find(
                          (p) => p.majorId === majorId,
                        );
                      if (!path) return null;

                      return (
                        <div
                          key={majorId}
                          className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span>{path.majorCode}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="large"
                  onClick={handleGoBack}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-8 py-3 h-auto font-semibold rounded-xl"
                >
                  Quay về trang chủ
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={handleConfirmPath}
                  disabled={selectedMajors.length === 0}
                  className="bg-white text-blue-600 border-none hover:bg-gray-100 px-8 py-3 h-auto font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  icon={<FiCheck className="w-5 h-5" />}
                >
                  Xác nhận lộ trình ({selectedMajors.length} chuyên ngành)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseScreenAdmin>
  );
}
