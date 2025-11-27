"use client";

import React, { useMemo, useState } from "react";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import {
  FiBook,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";

type CourseStatus = 0 | 1 | 2 | 3;

interface CourseDto {
  courseId: string;
  semesterPosition: number;
  subjectCode: string;
  status: CourseStatus;
  title: string;
  shortDescription?: string | null;
  description?: string | null;
  slug: string;
  courseImageUrl?: string | null;
  learnerCount: number;
  durationMinutes: number;
  durationHours: number;
  level: number;
  price?: number | null;
  dealPrice?: number | null;
  isEnrolled: boolean;
  isWishList: boolean;
}

interface SubjectInsight {
  score: number;
  target: number;
  summary: string;
  reasons: string[];
}

interface CourseGroupDto {
  subjectCode: string;
  status: CourseStatus;
  courses: CourseDto[];
  insight?: SubjectInsight;
}

interface BasicLearningPathDto {
  courseGroups: CourseGroupDto[];
}

interface InternalMajorDto {
  majorId: string;
  majorCode: string;
  reason: string;
  positionIndex: number;
  majorCourseGroups: CourseGroupDto[];
}

interface ExternalCourseSuggestion {
  title: string;
  link: string;
  provider: string;
  reason: string;
  level: string | null;
  rating: number | null;
  est_Duration_Weeks: number | null;
}

interface ExternalStepDto {
  title: string;
  duration_Weeks: number;
  suggested_Courses: ExternalCourseSuggestion[];
}

interface ExternalLearningPathDto {
  majorId: string;
  majorCode: string;
  reason: string;
  steps: ExternalStepDto[];
}

interface SampleLearningPathData {
  basicLearningPath: BasicLearningPathDto;
  internalLearningPath: InternalMajorDto[];
  externalLearningPath: ExternalLearningPathDto[];
}

const AI_PROFILE_CARDS = [
  {
    id: "persona",
    badge: "Tính cách",
    title: "Nhà hoạch định thận trọng",
    summary:
      "AI ghi nhận bạn thiên hướng phân tích, ưu tiên độ chính xác hơn tốc độ. Điều này giúp bạn học sâu nhưng dễ bị chậm tiến độ nếu thiếu lộ trình rõ ràng.",
    bullets: [
      "Luôn lập bảng so sánh, checklist trước khi ra quyết định.",
      "Có xu hướng ghi chép tay/take note kỹ càng sau mỗi buổi học.",
      "Ưa chuộng tài liệu chính thống, ít thích học theo video ngắn ngẫu nhiên.",
    ],
    tags: ["DISC: C/S", "MBTI: INTJ-A", "Mindset: Deep work"],
  },
  {
    id: "habit",
    badge: "Thói quen & sở thích",
    title: "Ưa thực hành nhỏ - lặp lại",
    summary:
      "Bạn học tốt nhất khi được thao tác với project mini, nhiệm vụ kéo dài 25-35 phút rồi nghỉ ngắn. Những nội dung thiên về thị giác (UI/UX) kích thích bạn quay lại học mỗi ngày.",
    bullets: [
      "Thích ghép cặp (pair) code để duy trì động lực.",
      "Ưu tiên tools hiện đại: VS Code + extension AI, Figma để phác thảo UX.",
      "Dễ phân tán nếu bài học chỉ thuần lý thuyết dài hơn 45 phút.",
    ],
    tags: ["Pomodoro x2/ngày", "Love: UI mockup", "Night owl"],
  },
  {
    id: "learning",
    badge: "Năng lực học tập",
    title: "Tư duy logic mạnh · tập trung 35 phút",
    summary:
      "Bài đánh giá cho thấy năng lực phân tích đạt 78/100 trong khi kiến thức nền lập trình mới ở mức 55/100. AI gợi ý kết hợp bài tập phân tích luồng dữ liệu với project nhỏ để cân bằng.",
    bullets: [
      "Tốc độ đọc hiểu tài liệu kỹ thuật: 230 wpm (nhanh hơn 20% trung bình).",
      "Điểm kiên trì hoàn thành bài khó đạt 82/100 → phù hợp môn giải thuật.",
      "Cần bổ sung 15-20 điểm ở kỹ năng trình bày & demo để tự tin bảo vệ dự án.",
    ],
    tags: ["Focus span: 35’", "Logic score: 78/100", "Presentation: 62/100"],
  },
];

const CORE_SKILL_STATUS = [
  {
    key: "dsa",
    label: "Cấu trúc dữ liệu & giải thuật",
    score: 48,
    target: 70,
    status: "Thiếu 22 điểm so với chuẩn tuyển dụng Fresher Backend.",
    summary:
      "Nhanh ở bài toán tuyến tính nhưng mất điểm ở dạng đồ thị & phân tích độ phức tạp. Cần luyện thêm 3-4 tuần với bài tập chuẩn hoá.",
  },
  {
    key: "db",
    label: "Cơ sở dữ liệu",
    score: 62,
    target: 75,
    status: "Hiểu query cơ bản nhưng chưa tối ưu hoá, thiếu trải nghiệm thiết kế chuẩn 3NF.",
    summary:
      "Điểm mạnh là viết được trigger/procedure đơn giản, tuy nhiên phần index & transaction isolation còn yếu.",
  },
  {
    key: "oop",
    label: "Lập trình hướng đối tượng",
    score: 58,
    target: 80,
    status: "Chưa thành thạo SOLID, refactor còn lúng túng khi scale module.",
    summary:
      "Bạn xử lý inheritance tốt nhưng chưa biết đo đạc cohesion/coupling để tái cấu trúc class.",
  },
  {
    key: "htmlcss",
    label: "Lập trình web HTML & CSS cơ bản",
    score: 54,
    target: 75,
    status: "Thiếu cảm giác spacing, layout responsive chưa vững.",
    summary:
      "Nắm được flexbox ở mức cơ bản nhưng grid system và accessibility (semantic tag) dưới mức yêu cầu.",
  },
];

const SAMPLE_LEARNING_PATH: SampleLearningPathData = {
  basicLearningPath: {
    courseGroups: [
      {
        subjectCode: "PRF192",
        status: 0,
        insight: {
          score: 54,
          target: 75,
          summary:
            "Điểm HTML/CSS cơ bản và tư duy thuật toán nhập môn mới đạt 54/100 nên AI khuyến nghị củng cố PRF192 để không hụt hơi ở các kỳ sau.",
          reasons: [
            "Bài test HTML & CSS: 54/100 (chuẩn tối thiểu 75).",
            "Các câu hỏi biểu diễn lưu đồ/giả mã chỉ đúng 60%, dễ sai khi vào cấu trúc điều khiển phức tạp.",
          ],
        },
        courses: [
          {
            courseId: "d95ac9f4-a95f-422d-8270-623db7115e2d",
            semesterPosition: 1,
            subjectCode: "PRF192",
            status: 0,
            title: "Programming Fundamentals",
            shortDescription:
              "Learn C programming from scratch with practical examples and hands-on exercises",
            description:
              "<p>This comprehensive course covers all fundamental concepts of C programming including variables, data types, control structures, functions, arrays, pointers, and memory management. Perfect for beginners with no prior programming experience.</p>",
            slug: "programming-fundamentals-with-c",
            courseImageUrl:
              "https://anhcocvang.com/static/media/PRF192.175d27716986ea8c2f05.png",
            learnerCount: 18,
            durationMinutes: 670,
            durationHours: 12,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: true,
            isWishList: true,
          },
        ],
      },
      {
        subjectCode: "PRO192",
        status: 0,
        insight: {
          score: 58,
          target: 80,
          summary:
            "Bạn hiểu inheritance và interface nhưng điểm SOLID/clean code chỉ 58/100. Học PRO192 giúp nâng logic OOP trước khi bước vào dự án lớn.",
          reasons: [
            "Rubric OOP: 12/20 điểm phần thiết kế class diagram (thiếu cohesion).",
            "Khi refactor code, 3/5 bài vẫn lẫn lộn logic UI & business → cần luyện nguyên tắc SRP.",
          ],
        },
        courses: [
          {
            courseId: "d30347e9-9542-435f-a75f-2fe4b2002de4",
            semesterPosition: 2,
            subjectCode: "PRO192",
            status: 0,
            title: "Object-Oriented Programming",
            shortDescription:
              "OOP căn bản đến trung cấp: SOLID, exception, collections, unit test.",
            description:
              "OOP pillars, SOLID, exceptions, collections, unit testing in Java.",
            slug: "pro192-oop-java-b2i",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            learnerCount: 1,
            durationMinutes: 720,
            durationHours: 12,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: true,
          },
          {
            courseId: "ccda6079-9887-4f9f-9b32-28ec25d613bf",
            semesterPosition: 2,
            subjectCode: "PRO192",
            status: 0,
            title: "Object-Oriented Programming",
            shortDescription:
              "OOP sạch và kiểm thử: refactor, DBC, TDD JUnit, property-based.",
            description:
              "Refactoring, design-by-contract, TDD with JUnit, property-based tests.",
            slug: "pro192-clean-oop-testing",
            courseImageUrl:
              "https://topdev.vn/blog/wp-content/uploads/2019/05/la%CC%A3%CC%82p-tri%CC%80nh-hu%CC%9Bo%CC%9B%CC%81ng-%C4%91o%CC%82%CC%81i-tu%CC%9Bo%CC%9B%CC%A3ng-la%CC%80-gi%CC%80.png",
            learnerCount: 4,
            durationMinutes: 780,
            durationHours: 13,
            level: 2,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: true,
            isWishList: true,
          },
          {
            courseId: "7f3d6b0f-5809-487d-bc4c-d2ff174a3052",
            semesterPosition: 2,
            subjectCode: "PRO192",
            status: 0,
            title: "Object-Oriented Programming",
            shortDescription:
              "Mẫu thiết kế Java: GoF, composition>inheritance, anti-patterns.",
            description:
              "GoF patterns, composition vs inheritance, anti-patterns, refactoring.",
            slug: "pro192-design-patterns-intermediate",
            courseImageUrl:
              "https://topdev.vn/blog/wp-content/uploads/2019/05/la%CC%A3%CC%82p-tri%CC%80nh-hu%CC%9Bo%CC%9B%CC%81ng-%C4%91o%CC%82%CC%83i-tu%CC%9Bo%CC%9B%CC%A3ng-la%CC%80-gi%CC%80.png",
            learnerCount: 2,
            durationMinutes: 720,
            durationHours: 12,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: true,
          },
        ],
      },
      {
        subjectCode: "CSD201",
        status: 3,
        insight: {
          score: 48,
          target: 70,
          summary:
            "Điểm DSA 48/100 cho thấy bạn chỉ vững cấu trúc tuyến tính. Mục tiêu là nâng lên mức 70 để xử lý bài phỏng vấn theo chuẩn FAANG mini.",
          reasons: [
            "Sai 4/5 câu hỏi về graph traversal & phân tích độ phức tạp.",
            "Chưa quen áp dụng DP cải tiến (bottom-up) nên thời gian giải dài gấp đôi trung bình.",
          ],
        },
        courses: [
          {
            courseId: "c262634a-a3a6-4ef0-ab6a-caef01e22318",
            semesterPosition: 3,
            subjectCode: "CSD201",
            status: 3,
            title: "Data Structures and Algorithms",
            shortDescription:
              "DSA chuyên sâu cho thi đấu/phỏng vấn: graph nâng cao, tối ưu DP.",
            description:
              "Advanced graphs, DP optimizations, amortized analysis, contest prep.",
            slug: "csd201-dsa-mastery-expert",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            learnerCount: 2,
            durationMinutes: 1080,
            durationHours: 18,
            level: 3,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: true,
            isWishList: false,
          },
          {
            courseId: "1a8d54b8-b0bf-4db9-b72a-f98aa4c4bb39",
            semesterPosition: 3,
            subjectCode: "CSD201",
            status: 3,
            title: "Data Structures and Algorithms",
            shortDescription:
              "Khóa học giúp nắm vững cấu trúc dữ liệu, thuật toán và tư duy tối ưu để giải quyết bài toán hiệu quả hơn.",
            description:
              "<p>Khóa học <strong>Cấu trúc dữ liệu và Giải thuật</strong> được thiết kế nhằm trang bị cho học viên nền tảng tư duy thuật toán, khả năng phân tích độ phức tạp và xử lý dữ liệu hiệu quả. Khóa học tập trung vào các cấu trúc dữ liệu cốt lõi (Array, Linked List, Stack, Queue, Tree, Graph…) và các giải thuật cơ bản – nâng cao như tìm kiếm, sắp xếp, đệ quy, backtracking, dynamic programming và graph algorithms.</p><p>Thông qua khóa học, học viên sẽ nắm được cách lựa chọn và ứng dụng thuật toán phù hợp vào giải quyết vấn đề, từ đó tối ưu hiệu năng chương trình và nâng cao kỹ năng lập trình.</p>",
            slug: "cu-trc-d-liu-gii-thut-423de7",
            courseImageUrl:
              "https://res.cloudinary.com/dhvyupck5/image/upload/v1764185499/vlbptqetbhpvonxs47uc.png",
            learnerCount: 3,
            durationMinutes: 176,
            durationHours: 3,
            level: 3,
            price: 1000000.0,
            dealPrice: 0,
            isEnrolled: true,
            isWishList: false,
          },
          {
            courseId: "b880f840-8866-4004-b771-c912c0d6bfbe",
            semesterPosition: 3,
            subjectCode: "CSD201",
            status: 3,
            title: "Data Structures and Algorithms",
            shortDescription:
              "Khóa học giúp nắm vững cấu trúc dữ liệu, thuật toán và tư duy tối ưu để giải quyết bài toán hiệu quả hơn.",
            description:
              "<p>Khóa học <strong>Cấu trúc dữ liệu và Giải thuật</strong> được thiết kế nhằm trang bị cho học viên nền tảng tư duy thuật toán, khả năng phân tích độ phức tạp và xử lý dữ liệu hiệu quả. Khóa học tập trung vào các cấu trúc dữ liệu cốt lõi (Array, Linked List, Stack, Queue, Tree, Graph…) và các giải thuật cơ bản – nâng cao như tìm kiếm, sắp xếp, đệ quy, backtracking, dynamic programming và graph algorithms.</p><p>Thông qua khóa học, học viên sẽ nắm được cách lựa chọn và ứng dụng thuật toán phù hợp vào giải quyết vấn đề, từ đó tối ưu hiệu năng chương trình và nâng cao kỹ năng lập trình.</p>",
            slug: "cu-trc-d-liu-gii-thut",
            courseImageUrl:
              "https://res.cloudinary.com/dhvyupck5/image/upload/v1764185499/vlbptqetbhpvonxs47uc.png",
            learnerCount: 1,
            durationMinutes: 176,
            durationHours: 3,
            level: 3,
            price: 1000000.0,
            dealPrice: 0,
            isEnrolled: true,
            isWishList: false,
          },
          {
            courseId: "6c6bc97e-ff26-4c66-80a2-1f9e9827e1c9",
            semesterPosition: 3,
            subjectCode: "CSD201",
            status: 3,
            title: "Data Structures and Algorithms",
            shortDescription:
              "Khóa học giúp nắm vững cấu trúc dữ liệu, thuật toán và tư duy tối ưu để giải quyết bài toán hiệu quả hơn.",
            description:
              "<p>Khóa học <strong>Cấu trúc dữ liệu và Giải thuật</strong> được thiết kế nhằm trang bị cho học viên nền tảng tư duy thuật toán, khả năng phân tích độ phức tạp và xử lý dữ liệu hiệu quả. Khóa học tập trung vào các cấu trúc dữ liệu cốt lõi (Array, Linked List, Stack, Queue, Tree, Graph…) và các giải thuật cơ bản – nâng cao như tìm kiếm, sắp xếp, đệ quy, backtracking, dynamic programming và graph algorithms.</p><p>Thông qua khóa học, học viên sẽ nắm được cách lựa chọn và ứng dụng thuật toán phù hợp vào giải quyết vấn đề, từ đó tối ưu hiệu năng chương trình và nâng cao kỹ năng lập trình.</p>",
            slug: "cu-trc-d-liu-gii-thut-e57db0",
            courseImageUrl:
              "https://res.cloudinary.com/dhvyupck5/image/upload/v1764185499/vlbptqetbhpvonxs47uc.png",
            learnerCount: 2,
            durationMinutes: 176,
            durationHours: 3,
            level: 3,
            price: 1000000.0,
            dealPrice: 0,
            isEnrolled: true,
            isWishList: false,
          },
          {
            courseId: "08286ecb-3a66-4de4-b14a-48b55fea5fda",
            semesterPosition: 3,
            subjectCode: "CSD201",
            status: 3,
            title: "Data Structures and Algorithms",
            shortDescription:
              "DSA nâng cao: list, tree, graph, DP với bộ câu hỏi phỏng vấn.",
            description:
              "Master DSA patterns (Java): lists, trees, graphs, DP with interview sets.",
            slug: "csd201-dsa-advanced",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            learnerCount: 1,
            durationMinutes: 900,
            durationHours: 15,
            level: 2,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
          {
            courseId: "8733c9e2-59a4-48ea-86d7-8c37526c2158",
            semesterPosition: 3,
            subjectCode: "CSD201",
            status: 3,
            title: "Data Structures and Algorithms",
            shortDescription:
              "Bootcamp thuật toán nhập môn: độ phức tạp, cấu trúc tuyến tính.",
            description:
              "Time/space complexity, arrays, stacks/queues, recursion fundamentals.",
            slug: "csd201-algorithms-bootcamp",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            learnerCount: 1,
            durationMinutes: 540,
            durationHours: 9,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
        ],
      },
      {
        subjectCode: "DBI202",
        status: 3,
        insight: {
          score: 62,
          target: 75,
          summary:
            "Kết quả SQL 62/100 đủ viết CRUD nhưng thiếu tư duy thiết kế lược đồ và tối ưu index. Phải nâng chuẩn để không tắc khi build API back-end.",
          reasons: [
            "Sai các câu hỏi về transaction isolation & deadlock (3/6).",
            "Thiếu kinh nghiệm chuẩn hoá: mô hình ERD chỉ đạt 70% yêu cầu, còn dư lặp dữ liệu.",
          ],
        },
        courses: [
          {
            courseId: "5971423e-2d56-4c2e-bfbf-9c2fb5f7704e",
            semesterPosition: 3,
            subjectCode: "DBI202",
            status: 3,
            title: "Database Systems",
            shortDescription:
              "SQL cho dev: join, window func, transaction, isolation, query plan.",
            description:
              "Joins, window functions, transactions, isolation levels, query plans.",
            slug: "dbi202-sql-for-devs",
            courseImageUrl:
              "https://media.geeksforgeeks.org/wp-content/uploads/20240501161048/SQL-Databases.png",
            learnerCount: 0,
            durationMinutes: 720,
            durationHours: 12,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
          {
            courseId: "c4a22bff-1b94-4096-bf00-f280fd68bb62",
            semesterPosition: 3,
            subjectCode: "DBI202",
            status: 3,
            title: "Database Systems",
            shortDescription:
              "Đồ án thiết kế CSDL: từ yêu cầu đến ERD, chuẩn hóa, indexing.",
            description:
              "Case-study: requirements → ERD, normalization, indexing strategy.",
            slug: "dbi202-design-capstone",
            courseImageUrl:
              "https://media.geeksforgeeks.org/wp-content/uploads/20240501161048/SQL-Databases.png",
            learnerCount: 0,
            durationMinutes: 780,
            durationHours: 13,
            level: 2,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
          {
            courseId: "d7e9bf94-7479-47ec-81ee-7e2907a3a378",
            semesterPosition: 3,
            subjectCode: "DBI202",
            status: 3,
            title: "Database Systems",
            shortDescription:
              "Nhập môn CSDL: mô hình quan hệ, SQL cơ bản, chuẩn hóa, indexing.",
            description:
              "Relational modeling, SQL basics, normalization, indexing fundamentals.",
            slug: "dbi202-database-beginner",
            courseImageUrl:
              "https://static.tildacdn.one/tild6238-3035-4335-a333-306335373139/IMG_3349.jpg",
            learnerCount: 1,
            durationMinutes: 600,
            durationHours: 10,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: true,
            isWishList: false,
          },
          {
            courseId: "e6bc79cf-1d6d-4e6c-91d8-8a0b93509965",
            semesterPosition: 3,
            subjectCode: "DBI202",
            status: 3,
            title: "Database Systems",
            shortDescription:
              "Phép nối, Hàm cửa sổ, Giao dịch và Mức độ cô lập là trọng tâm, giúp bạn đọc hiểu và tối ưu hóa Kế hoạch truy vấn hiệu qu",
            description:
              "<p>🚀 Khóa Học Cơ Bản Về Database (Cơ Sở Dữ Liệu)</p><p>Khóa học này cung cấp kiến thức nền tảng vững chắc về hệ thống cơ sở dữ liệu. Bạn sẽ học cách thiết kế, triển khai và quản lý một database hiệu quả.</p><p>Nội dung chính bao gồm:</p><ul><li>Hiểu các mô hình dữ liệu (như mô hình quan hệ).</li><li>Thực hành với ngôn ngữ SQL (Structured Query Language) để thao tác dữ liệu (SELECT, INSERT, UPDATE, DELETE).</li><li>Nắm vững các khái niệm quan trọng như khóa chính, khóa ngoại và chuẩn hóa dữ liệu (Normalization).</li><li>Hoàn thành khóa học, bạn sẽ có khả năng làm việc với các hệ quản trị CSDL phổ biến và là bước đệm lý tưởng cho sự nghiệp phát triển phần mềm hoặc phân tích dữ liệu.</li></ul>",
            slug: "kha-hc-trung-cp-v-database-c-s-d-liu",
            courseImageUrl:
              "https://res.cloudinary.com/dhvyupck5/image/upload/v1764184117/manr23y3ttrgotejzgcg.jpg",
            learnerCount: 2,
            durationMinutes: 11,
            durationHours: 1,
            level: 2,
            price: 500000.0,
            dealPrice: 199000.0,
            isEnrolled: false,
            isWishList: false,
          },
        ],
      },
      {
        subjectCode: "PRJ301",
        status: 0,
        insight: {
          score: 56,
          target: 78,
          summary:
            "Điểm tổng hợp web backend (Servlet + HTML/CSS) đạt 56/100. AI khuyến nghị theo PRJ301 để có sản phẩm web hoàn chỉnh và luyện quy trình MVC.",
          reasons: [
            "Kỹ năng HTML/CSS mới đạt 54/100 nên UI prototype thiếu responsive.",
            "Part backend: chỉ 2/6 bài thực hành kết nối DB thành công ngay lần đầu vì validate và xử lý session chưa chuẩn.",
          ],
        },
        courses: [
          {
            courseId: "67f99314-462e-492c-bd5d-cea4a9251336",
            semesterPosition: 4,
            subjectCode: "PRJ301",
            status: 0,
            title: "Java Web application development",
            shortDescription:
              "Dịch vụ REST Jakarta: JAX-RS, JSON-B, validation, deploy đơn giản.",
            description:
              "JAX-RS intro, JSON-B, validation, DAO vs repository, simple Docker deploy.",
            slug: "prj301-restful-jakarta",
            courseImageUrl:
              "https://media.geeksforgeeks.org/wp-content/uploads/20240501161048/SQL-Databases.png",
            learnerCount: 0,
            durationMinutes: 660,
            durationHours: 11,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
          {
            courseId: "2928e2e9-390b-47cd-82c1-3901c1e6a658",
            semesterPosition: 4,
            subjectCode: "PRJ301",
            status: 0,
            title: "Java Web application development",
            shortDescription:
              "Full-stack Java web theo dự án: JPA, bảo mật, cloud deploy, CI.",
            description:
              "JSP/Servlet + JPA + Security basics, deploy to cloud, CI smoke tests.",
            slug: "prj301-fullstack-project",
            courseImageUrl:
              "https://analyticsstepsfiles.s3.ap-south-1.amazonaws.com/backend/media/thumbnail/7474744/1518749_1635490594_What%20are%20the%20Basics%20of%20Software%20Documentation-Artboard%201.jpg",
            learnerCount: 1,
            durationMinutes: 900,
            durationHours: 15,
            level: 2,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
          {
            courseId: "01c77d7b-05f5-4254-83dd-54e4d685f62c",
            semesterPosition: 4,
            subjectCode: "PRJ301",
            status: 0,
            title: "Java Web application development",
            shortDescription:
              "Xây web Java: Servlet/JSP, MVC, JDBC/JPA, mini-project e-commerce.",
            description:
              "Servlet/JSP, MVC, JDBC/JPA intro, e-commerce mini-project.",
            slug: "prj301-java-web-intermediate",
            courseImageUrl: "https://i.ytimg.com/vi/sk0yrh3DNXo/sddefault.jpg",
            learnerCount: 0,
            durationMinutes: 840,
            durationHours: 14,
            level: 1,
            price: 100000.0,
            dealPrice: 90000.0,
            isEnrolled: false,
            isWishList: false,
          },
        ],
      },
    ],
  },
  internalLearningPath: [
    {
      majorId: "0ba03701-2458-45ce-b7eb-2c46fc9c37ac",
      majorCode: ".NET",
      reason:
        "Major này trực tiếp liên quan đến việc phát triển backend và ứng dụng đa nền tảng với C#. Nội dung học phần có bao gồm các công nghệ phù hợp, đặc biệt là việc áp dụng C# trong Unity, giúp củng cố kiến thức theo mục tiêu nghề nghiệp đã đề ra.",
      positionIndex: 1,
      majorCourseGroups: [
        {
          subjectCode: "PRN212",
          status: 0,
          insight: {
            score: 60,
            target: 82,
            summary:
              "Điểm backend .NET foundation đạt 60/100 do thiếu kinh nghiệm dựng API chuẩn REST, đặc biệt ở phần validation và DI.",
            reasons: [
              "Chỉ đạt 11/20 điểm phần thiết kế tầng Service/Repository (lẫn lộn business logic).",
              "Bị trừ điểm ở bài thi EF Core vì chưa kiểm soát transaction, dễ phát sinh orphan record.",
            ],
          },
          courses: [
            {
              courseId: "71954a2a-8026-4da0-a497-54928b7941d0",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: learn controllers, DI, EF Core, and best practices.",
              slug: "new-02-aspnet-core-for-beginners",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 1,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "9aa6ed66-e909-4cc1-90e4-a854619801a7",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: learn controllers, DI, EF Core, and best practices.",
              slug: "new-03-aspnet-core-for-beginners",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 3,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: true,
            },
            {
              courseId: "05dfe29f-a5ec-4fa0-948d-ef1b32f33981",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: learn controllers, DI, EF Core, and best practices.",
              slug: "new-01-aspnet-core-for-beginners",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 2,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: true,
              isWishList: false,
            },
            {
              courseId: "202b8d62-0e17-454a-8a97-446beee2bfd7",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: controllers, DI, EF Core.",
              slug: "05-aspnet-core-for-beginners-test-quiz-1-3",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 3,
              durationMinutes: 1,
              durationHours: 1,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: true,
              isWishList: true,
            },
            {
              courseId: "52cc27cd-d4a2-480d-9dd6-7c7489530788",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: learn controllers, DI, EF Core, and best practices.",
              slug: "aspnet-core-for-beginners",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 2,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "55544cbd-25e5-4966-8b8a-5bdf49ea20ec",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: learn controllers, DI, EF Core, and best practices.",
              slug: "aspnet-core-web-api-fundamentals",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 9,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: true,
              isWishList: true,
            },
            {
              courseId: "01f8cc6b-8e8b-43de-8a2a-0990f1b59b98",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                ".NET MAUI nhập môn: layout, MVVM-lite, command, navigation.",
              description:
                "Layouts, MVVM-lite, commands, navigation stack, basic persistence.",
              slug: "prn212-maui-essentials",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 2,
              durationMinutes: 480,
              durationHours: 8,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "8f595864-c9c5-45f2-8a4f-c9294ed82f60",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "From zero to deploy: learn controllers, DI, EF Core, and best practices.",
              slug: "new-04-aspnet-core-for-beginners",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 6,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: true,
            },
            {
              courseId: "2141efab-28fc-4ad7-b13b-5808eadbaa4c",
              semesterPosition: 5,
              subjectCode: "PRN212",
              status: 0,
              title: "Basic Cross-Platform Application Programming With .NET",
              shortDescription:
                ".NET MAUI cơ bản: pages, navigation, data binding.",
              description: ".NET MAUI fundamentals: pages, navigation, data binding.",
              slug: "prn212-dotnet-maui-basics",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 0,
              durationMinutes: 540,
              durationHours: 9,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
          ],
        },
        {
          subjectCode: "PRN222",
          status: 0,
          insight: {
            score: 64,
            target: 85,
            summary:
              "Bài đánh giá cross-platform nâng cao đạt 64/100: bạn giỏi triển khai MVVM cơ bản nhưng yếu ở sync offline-first và profiling.",
            reasons: [
              "Chỉ đúng 50% câu hỏi về tối ưu bộ nhớ & async pattern.",
              "Chưa có kinh nghiệm publish app đa nền tảng nên checklist release bị thiếu 4/8 hạng mục.",
            ],
          },
          courses: [
            {
              courseId: "dee8c962-7552-494b-9ed3-2b82c56560e6",
              semesterPosition: 7,
              subjectCode: "PRN222",
              status: 0,
              title: "Advanced Cross-Platform Application Programming With .NET",
              shortDescription: "Xây dựng khóa học OOP",
              description:
                "<p>Tương tác đầu tiên của học viên tiềm năng với khóa học của bạn thường đến từ một mô tả khóa học được thiết kế kỹ lưỡng. Mô tả này đóng vai trò là cầu nối giúp hiểu rõ bản chất, nội dung và tác động tiềm năng của chương trình giáo dục của bạn.</p>",
              slug: "lp-trnh-bng-net",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 4,
              durationMinutes: 94,
              durationHours: 2,
              level: 3,
              price: 1000000.0,
              dealPrice: 299000.0,
              isEnrolled: true,
              isWishList: true,
            },
            {
              courseId: "dfe0ae68-f475-40b6-912c-7f927e1a6a09",
              semesterPosition: 7,
              subjectCode: "PRN222",
              status: 0,
              title: "Advanced Cross-Platform Application Programming With .NET",
              shortDescription:
                "Learn to build web APIs with ASP.NET Core step by step.",
              description:
                "<p>From zero to deploy: learn controllers, DI, EF Core, and best practices.</p><p>From zero to deploy: learn controllers, DI, EF Core, and best practices.</p><p>From zero to deploy: learn controllers, DI, EF Core, and best practices.</p>",
              slug: "new-prn222-enterprise-net-mvvm-expert-06c094",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1762336423/plshvrjywjk9awekgiya.webp",
              learnerCount: 7,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: true,
              isWishList: true,
            },
            {
              courseId: "2294f03a-8449-46b9-9a75-826916bbc065",
              semesterPosition: 7,
              subjectCode: "PRN222",
              status: 0,
              title: "Advanced Cross-Platform Application Programming With .NET",
              shortDescription:
                "MVVM doanh nghiệp: pattern nâng cao, đồng bộ offline-first, profiling.",
              description:
                "Advanced MVVM patterns, offline-first sync, performance profiling.",
              slug: "prn222-enterprise-mvvm-expert",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 0,
              durationMinutes: 900,
              durationHours: 15,
              level: 3,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "d31e57c2-5f31-4352-91af-00ed1c71e131",
              semesterPosition: 7,
              subjectCode: "PRN222",
              status: 0,
              title: "Advanced Cross-Platform Application Programming With .NET",
              shortDescription:
                "Nâng cao .NET đa nền tảng: MVVM, DI, storage, API, deploy.",
              description: "MVVM, DI, local storage, API integration, deployment.",
              slug: "prn222-dotnet-advanced",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 1,
              durationMinutes: 780,
              durationHours: 13,
              level: 2,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
          ],
        },
        {
          subjectCode: "SWD392",
          status: 0,
          insight: {
            score: 60,
            target: 83,
            summary:
              "Phần kiến trúc phần mềm chỉ đạt 60/100: hiểu Clean Architecture nhưng chưa biết cân bằng trade-off khi scale microservices.",
            reasons: [
              "Chưa có minh hoạ cụ thể cho bounded context → diagram domain sai 2/5 case.",
              "Thiếu kinh nghiệm CQRS/Event sourcing nên phần đánh giá mở rộng chỉ đạt 40%.",
            ],
          },
          courses: [
            {
              courseId: "5c71103f-5000-4404-a277-fc688f6a2ef1",
              semesterPosition: 7,
              subjectCode: "SWD392",
              status: 0,
              title: "Software Architecture and Design",
              shortDescription:
                "Kiến trúc phần mềm: Layered, Clean, Hexagonal, CQRS, microservices.",
              description:
                "Layered/Clean/Hexagonal, CQRS, microservices basics, trade-offs.",
              slug: "swd392-architecture-advanced",
              courseImageUrl:
                "https://analyticsstepsfiles.s3.ap-south-1.amazonaws.com/backend/media/thumbnail/7474744/1518749_1635490594_What%20are%20the%20Basics%20of%20Software%20Documentation-Artboard%201.jpg",
              learnerCount: 1,
              durationMinutes: 660,
              durationHours: 11,
              level: 2,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "f6868ece-af64-4c58-a272-5e59e5c85ab5",
              semesterPosition: 7,
              subjectCode: "SWD392",
              status: 0,
              title: "Software Architecture and Design",
              shortDescription:
                "Clean Architecture thực chiến: BCs, aggregate, domain events, ACL.",
              description:
                "Bounded contexts, aggregates, domain events, anti-corruption layers.",
              slug: "swd392-clean-architecture-pro",
              courseImageUrl:
                "https://analyticsstepsfiles.s3.ap-south-1.amazonaws.com/backend/media/thumbnail/7474744/1518749_1635490594_What%20are%20the%20Basics%20of%20Software%20Documentation-Artboard%201.jpg",
              learnerCount: 0,
              durationMinutes: 840,
              durationHours: 14,
              level: 3,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
          ],
        },
        {
          subjectCode: "PRN232",
          status: 0,
          insight: {
            score: 61,
            target: 82,
            summary:
              "Điểm backend đa nền tảng 61/100 cho thấy bạn dựng API được nhưng thiếu kinh nghiệm bảo mật, logging và CI/CD.",
            reasons: [
              "Sai 3/6 câu hỏi về auth (JWT/OIDC) và rate limit.",
              "Pipeline CI/CD chỉ đạt 50% yêu cầu vì chưa cấu hình test & rollback.",
            ],
          },
          courses: [
            {
              courseId: "b3bb3cdf-0f6e-4f6c-89e7-84e7ffd88562",
              semesterPosition: 8,
              subjectCode: "PRN232",
              status: 0,
              title:
                "Building Cross-Platform Back-End Application With .NET",
              shortDescription:
                "API tối giản, Entity Framework Core, cơ chế xác thực, ghi nhật ký hệ thống và quy trình CI/CD cơ bản.",
              description:
                "<p>Học phần này cung cấp kiến thức và kỹ năng cốt lõi để xây dựng ứng dụng back-end đa nền tảng bằng .NET ở mức trung cấp. Sinh viên sẽ được làm việc với <strong>Minimal APIs</strong> để tạo dịch vụ web gọn nhẹ, sử dụng <strong>Entity Framework Core (EF Core)</strong> cho thao tác dữ liệu, và triển khai các kỹ thuật <strong>xác thực (authentication)</strong> giúp bảo vệ API. Môn học cũng hướng dẫn cách thiết lập <strong>logging</strong> nhằm theo dõi và chẩn đoán hệ thống, cùng với việc áp dụng <strong>CI/CD cơ bản</strong> để tự động hóa quy trình build và triển khai ứng dụng.</p><p>Sau khi hoàn thành học phần, sinh viên có khả năng xây dựng, triển khai và bảo trì các dịch vụ back-end hiệu quả, hiện đại và dễ mở rộng dựa trên nền tảng .NET.</p>",
              slug: "pht-trin-back-end-a-nn-tng-vi-net",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1764181553/dhyohgldilepulmzwcxj.png",
              learnerCount: 1,
              durationMinutes: 156,
              durationHours: 3,
              level: 2,
              price: 1000000.0,
              dealPrice: 0,
              isEnrolled: true,
              isWishList: false,
            },
            {
              courseId: "2e580fb4-3331-4e37-bec6-8d5051e15643",
              semesterPosition: 8,
              subjectCode: "PRN232",
              status: 0,
              title:
                "Building Cross-Platform Back-End Application With .NET",
              shortDescription:
                "Khóa học nền tảng về cơ sở dữ liệu cho người mới bắt đầu.",
              description:
                "Khóa học Database cơ bản giúp bạn nắm vững kiến thức từ nền tảng đến thực hành gồm các khái niệm bảng, cột, khóa chính – khóa ngoại, câu lệnh SELECT, INSERT, JOIN… Tất cả bài học được thiết kế cô đọng, dễ hiểu, phù hợp cho sinh viên IT và người tự học.",
              slug: "database-c-bn-t-zero-n-thnh-tho",
              courseImageUrl:
                "https://res.cloudinary.com/ddb7mdg1x/image/upload/v1764180851/DBI_v1tkxi.jpg",
              learnerCount: 1,
              durationMinutes: 180,
              durationHours: 3,
              level: 1,
              price: 399000.0,
              dealPrice: 199000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "00e5d16d-b780-4834-932c-3bdc21821aef",
              semesterPosition: 8,
              subjectCode: "PRN232",
              status: 0,
              title:
                "Building Cross-Platform Back-End Application With .NET",
              shortDescription:
                "API an toàn: JWT/OIDC, validation, audit log, rate limit, health.",
              description:
                "JWT/OIDC, validation, audit logging, rate limiting, health checks.",
              slug: "prn232-secure-apis-advanced",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 0,
              durationMinutes: 720,
              durationHours: 12,
              level: 2,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
            {
              courseId: "d8c50308-c295-457d-addd-5729634442d9",
              semesterPosition: 8,
              subjectCode: "PRN232",
              status: 0,
              title:
                "Building Cross-Platform Back-End Application With .NET",
              shortDescription:
                "Back-end .NET: Minimal APIs, EF Core, auth, logging, CI/CD cơ bản.",
              description: "Minimal APIs, EF Core, auth, logging and basic CI/CD.",
              slug: "prn232-dotnet-backend",
              courseImageUrl:
                "https://res.cloudinary.com/dhvyupck5/image/upload/v1759071127/fdtxmdutifvomsbzxvdp.webp",
              learnerCount: 0,
              durationMinutes: 600,
              durationHours: 10,
              level: 1,
              price: 100000.0,
              dealPrice: 90000.0,
              isEnrolled: false,
              isWishList: false,
            },
          ],
        },
      ],
    },
  ],
  externalLearningPath: [
    {
      majorId: "7deda058-d51a-4c79-b3aa-024dad17d85f",
      majorCode: "ANGULAR_DEV",
      reason:
        "Track này bù lỗ hổng về Angular, giúp bạn củng cố kỹ năng phát triển front-end mà chưa được đề cập trong lộ trình nội bộ.",
      steps: [
        {
          title: "Làm quen với Angular và các khái niệm cơ bản",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Làm quen với Angular và các khái niệm cơ bản",
              link: "https://www.coursera.org/learn/angular17course1",
              provider: "LearnQuest",
              reason:
                "Khóa học này giới thiệu về Angular và các khái niệm cơ bản để phát triển ứng dụng Angular.",
              level: "Beginner",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
        {
          title: "Phát triển ứng dụng hoàn chỉnh với Angular",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Phát triển ứng dụng hoàn chỉnh với Angular",
              link: "https://www.coursera.org/learn/advanced-angular-development",
              provider: "LearnQuest",
              reason:
                "Khóa học này dạy các kỹ năng nâng cao trong phát triển ứng dụng Angular, bao gồm HTTP Requests và Dependency Injection.",
              level: "Beginner",
              rating: null,
              est_Duration_Weeks: null,
            },
            {
              title: "Phát triển ứng dụng hoàn chỉnh với Angular",
              link: "https://www.coursera.org/learn/advanced-angular-topics",
              provider: "LearnQuest",
              reason:
                "Khóa học này chuyên sâu về các chủ đề nâng cao trong Angular, giúp người học áp dụng tốt hơn trong thực tế.",
              level: "Beginner",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
        {
          title: "Tích hợp Angular trong phát triển Full Stack",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Tích hợp Angular trong phát triển Full Stack",
              link: "https://www.coursera.org/learn/secure-full-stack-mean-developer",
              provider: "EC-Council",
              reason:
                "Khóa học này dạy cách phát triển ứng dụng sử dụng Angular trong mô hình MEAN, bao gồm MongoDB và Node.js.",
              level: "Beginner",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
      ],
    },
    {
      majorId: "a928e991-3628-471b-b245-4329ae682944",
      majorCode: "JAVA_ADV",
      reason:
        "Track này bù lỗ hổng về Java, giúp bạn mở rộng kiến thức lập trình mà chưa được đề cập trong lộ trình nội bộ.",
      steps: [
        {
          title: "Nâng cao kỹ năng Java với Microservices",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Nâng cao kỹ năng Java với Microservices",
              link: "https://www.coursera.org/learn/advanced-java",
              provider: "LearnQuest",
              reason:
                "Khóa học này cung cấp kiến thức chuyên sâu về phát triển web với Java và Spring Boot, hỗ trợ cho việc xây dựng microservices.",
              level: "Advanced level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
        {
          title: "Khóa học Java Database Connectivity",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Khóa học Java Database Connectivity",
              link: "https://www.coursera.org/learn/java-database-connectivity-introduction",
              provider: "LearnQuest",
              reason:
                "Khóa học này cung cấp kiến thức cần thiết về JDBC, giúp kết nối và làm việc với cơ sở dữ liệu trong Java.",
              level: "Beginner level",
              rating: null,
              est_Duration_Weeks: null,
            },
          ],
        },
      ],
    },
    {
      majorId: "b354e0b6-3d0e-42f6-8402-de3362ecf9da",
      majorCode: "GO_PROG",
      reason:
        "Track này bù lỗ hổng về Go, giúp bạn làm quen với ngôn ngữ lập trình mới mà chưa được đề cập trong lộ trình nội bộ.",
      steps: [
        {
          title: "Khám Phá Ngôn Ngữ Lập Trình Go",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Khám Phá Ngôn Ngữ Lập Trình Go",
              link: "https://www.coursera.org/specializations/google-golang",
              provider: "University of California, Irvine",
              reason:
                "Khóa học này cung cấp kiến thức về lập trình Go, phù hợp với mục tiêu tìm hiểu ngôn ngữ lập trình Go.",
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

const SUBJECT_STATUS_META: Record<
  CourseStatus,
  {
    label: string;
    badgeClass: string;
    toneClass: string;
    review: string;
  }
> = {
  0: {
    label: "Ưu tiên học",
    badgeClass: "bg-orange-100 text-orange-700",
    toneClass: "border-orange-200 bg-orange-50/60",
    review: "Môn nền tảng, nên bắt đầu sớm để giữ tiến độ chung.",
  },
  1: {
    label: "Đang học",
    badgeClass: "bg-blue-100 text-blue-700",
    toneClass: "border-blue-200 bg-blue-50/60",
    review: "Bạn đang theo học, tiếp tục duy trì nhịp độ hiện tại.",
  },
  2: {
    label: "Đã vững",
    badgeClass: "bg-emerald-100 text-emerald-700",
    toneClass: "border-emerald-200 bg-emerald-50/60",
    review: "Đã hoàn thành tốt, có thể chuyển sang nội dung nâng cao.",
  },
  3: {
    label: "Nâng cao",
    badgeClass: "bg-teal-100 text-teal-700",
    toneClass: "border-teal-200 bg-teal-50/60",
    review: "Đủ nền tảng để thử các khóa chuyên sâu hoặc luyện thi.",
  },
};

const getStatusMeta = (status?: number) =>
  SUBJECT_STATUS_META[(status as CourseStatus) ?? 0] ||
  SUBJECT_STATUS_META[0];

const toCourseCardProps = (course: CourseDto) => {
  const descriptionSource =
    course.shortDescription ||
    course.description?.replace(/<[^>]+>/g, " ") ||
    "";
  const descriptionLines = descriptionSource
    .split(/[.•]| - |:/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    id: course.courseId,
    imageUrl:
      course.courseImageUrl ??
      "https://via.placeholder.com/600x400?text=EduSmart",
    title: course.title,
    descriptionLines,
    instructor: `Giảng viên ${course.subjectCode}`,
    price: course.price ?? undefined,
    dealPrice: course.dealPrice ?? undefined,
    isEnrolled: course.isEnrolled,
    isWishList: course.isWishList,
    routerPush: `/courses/${course.slug}`,
  };
};

const getSemesterNarrative = (groups: CourseGroupDto[]) => {
  const priority = groups.find((g) => (g.status ?? 0) === 0);
  if (priority) {
    return `Ưu tiên củng cố ${priority.subjectCode} và hoàn thiện các môn còn lại.`;
  }
  return "Duy trì nhịp học ổn định ở toàn bộ môn trong kỳ này.";
};

const LearningPathSamplePage = () => {
  const [expandedBasic, setExpandedBasic] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedInternal, setExpandedInternal] = useState<
    Record<string, boolean>
  >({});

  const basicSemesters = useMemo(() => {
    const map = new Map<number, CourseGroupDto[]>();

    SAMPLE_LEARNING_PATH.basicLearningPath.courseGroups.forEach((group) => {
      const semesters = new Set(
        group.courses.map((course) => course.semesterPosition || 0),
      );
      if (semesters.size === 0) {
        semesters.add(0);
      }

      semesters.forEach((semester) => {
        const list = map.get(semester) ?? [];
        const filteredCourses =
          semester === 0
            ? group.courses
            : group.courses.filter(
                (course) => course.semesterPosition === semester,
              );
        if (filteredCourses.length > 0) {
          list.push({ ...group, courses: filteredCourses });
          map.set(semester, list);
        }
      });
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([semester, groups]) => ({ semester, groups }));
  }, []);

  const internalMajors = useMemo(
    () =>
      [...SAMPLE_LEARNING_PATH.internalLearningPath].sort(
        (a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0),
      ),
    [],
  );

  const toggleBasicBlock = (key: string) =>
    setExpandedBasic((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleInternalBlock = (key: string) =>
    setExpandedInternal((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f4] via-white to-[#f2fbfb] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <header className="bg-white/80 dark:bg-slate-900/60 shadow-sm rounded-3xl p-8 border border-orange-100 dark:border-slate-700">
          <p className="uppercase tracking-[0.2em] text-xs text-orange-500 font-semibold mb-2">
            Lộ trình học full-stack
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Dựa trên kết quả khảo sát năng lực của bạn
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Dưới đây là gợi ý học tập chia thành 3 phần: nền tảng bắt buộc,
            chuyên ngành hẹp nội bộ và các track ngoài hệ thống để bạn bù đắp
            kỹ năng còn thiếu. Mỗi kỳ đều có đánh giá, nút xem chi tiết để mở
            các thẻ khóa học (CourseCard) tương ứng.
          </p>
        </header>

        {/* AI insight summary */}
        <section className="grid gap-6 lg:grid-cols-3">
          {AI_PROFILE_CARDS.map((card) => (
            <div
              key={card.id}
              className="rounded-3xl border border-orange-100/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                {card.badge}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {card.summary}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {card.bullets.map((bullet, idx) => (
                  <li key={`${card.id}-bullet-${idx}`} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={`${card.id}-${tag}`}
                    className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Core skill snapshot */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CORE_SKILL_STATUS.map((skill) => (
            <div
              key={skill.key}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-white to-orange-50/60 dark:from-slate-900 dark:to-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">
                    Năng lực trọng tâm
                  </p>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {skill.label}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-orange-500">
                    {skill.score}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    /100 · Chuẩn {skill.target}+
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {skill.status}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {skill.summary}
              </p>
            </div>
          ))}
        </section>

        {/* Basic learning path */}
        <section className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-8 border border-orange-100/70 dark:border-slate-800 shadow-lg shadow-orange-100/40 dark:shadow-none">
          <div className="bg-gradient-to-r from-[#ffe9d3] to-white dark:from-orange-900/30 dark:to-transparent rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-extrabold text-orange-600 mb-2">
              Lộ trình khởi đầu
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              Các môn học nền tảng được đề xuất dựa trên năng lực hiện tại của
              bạn. Cứ bám theo thứ tự từng kỳ để giữ nhịp học ổn định giống như
              layout ở bản thiết kế mẫu.
            </p>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-orange-200" />
            {basicSemesters.map(({ semester, groups }) => (
              <div key={semester} className="relative mb-14 pl-10">
                <div className="absolute left-0 top-2 w-16 h-16 rounded-full bg-white border-4 border-orange-300 shadow-md flex items-center justify-center text-sm font-black text-orange-600">
                  Kỳ {semester}
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-orange-500 font-semibold mb-1">
                        Đánh giá kỳ {semester}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getSemesterNarrative(groups)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {groups
                          .map(
                            (group) =>
                              `${group.subjectCode} · ${
                                getStatusMeta(group.status).label
                              }`,
                          )
                          .join(" • ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiStar className="text-orange-500" />
                      {groups.reduce(
                        (sum, group) => sum + group.courses.length,
                        0,
                      )}{" "}
                      khóa học gợi ý
                    </div>
                  </div>

                  <div className="space-y-6">
                    {groups.map((group) => {
                      const statusMeta = getStatusMeta(group.status);
                      const key = `${semester}-${group.subjectCode}`;
                      const isOpen = Boolean(expandedBasic[key]);

                      return (
                        <div
                          key={key}
                          className={`rounded-2xl border ${statusMeta.toneClass} p-5 transition shadow-sm`}
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm uppercase tracking-wide text-gray-400">
                                {group.subjectCode}
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {statusMeta.review}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {group.courses.length} lựa chọn khóa học
                              </p>
                            </div>
                            <span
                              className={`self-start md:self-auto px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>
                          {group.insight && (
                            <div className="mt-4 rounded-2xl border border-orange-100 bg-white/80 dark:bg-slate-900/80 p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl font-black text-orange-500">
                                  {group.insight.score}
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-400">
                                    Điểm hiện tại
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Chuẩn mục tiêu {group.insight.target}+
                                  </p>
                                </div>
                              </div>
                              <p>{group.insight.summary}</p>
                              <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
                                {group.insight.reasons.map((reason, idx) => (
                                  <li key={`${key}-reason-${idx}`}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleBasicBlock(key)}
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
                          >
                            {isOpen ? "Thu gọn khóa học" : "Xem chi tiết khóa"}
                            {isOpen ? (
                              <FiChevronUp className="h-4 w-4" />
                            ) : (
                              <FiChevronDown className="h-4 w-4" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                              {group.courses.map((course) => (
                                <CourseCard
                                  key={course.courseId}
                                  {...toCourseCardProps(course)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Internal learning path */}
        <section className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-8 border border-cyan-100/70 dark:border-slate-800 shadow-lg shadow-cyan-100/30 dark:shadow-none">
          <div className="bg-gradient-to-r from-[#d9f8f5] to-white dark:from-cyan-900/30 dark:to-transparent rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-extrabold text-[#20c997] mb-2">
              Chuyên ngành hẹp
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              Bạn đã chọn các major nội bộ phù hợp. Học theo thứ tự đã sắp xếp
              để tối ưu hiệu quả và có thể bật/tắt từng cụm môn để xem CourseCard
              giống bản demo.
            </p>
          </div>

          <div className="space-y-8">
            {internalMajors.map((major, majorIdx) => (
              <div
                key={major.majorId}
                className="rounded-3xl border border-cyan-100 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="md:w-1/3">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-semibold">
                      Major {majorIdx + 1}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {major.majorCode}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                      {major.reason}
                    </p>
                  </div>
                  <div className="flex-1 space-y-6">
                    {major.majorCourseGroups.map((group) => {
                      const statusMeta = getStatusMeta(group.status);
                      const key = `${major.majorId}-${group.subjectCode}`;
                      const isOpen = Boolean(expandedInternal[key]);
                      const semesters = Array.from(
                        new Set(
                          group.courses.map((course) => course.semesterPosition),
                        ),
                      ).sort((a, b) => a - b);

                      return (
                        <div
                          key={key}
                          className="border border-cyan-100 dark:border-slate-800 rounded-2xl p-5 bg-cyan-50/40 dark:bg-slate-900/60"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {group.subjectCode}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {statusMeta.review}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-600 dark:text-gray-400">
                                {semesters.map((sem) => (
                                  <span
                                    key={sem}
                                    className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-cyan-100 dark:border-slate-700"
                                  >
                                    Kỳ {sem}
                                  </span>
                                ))}
                                <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-cyan-100 dark:border-slate-700">
                                  {group.courses.length} khóa
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>
                          {group.insight && (
                            <div className="mt-3 rounded-2xl border border-cyan-100 bg-white/80 dark:bg-slate-900/70 p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl font-black text-cyan-500">
                                  {group.insight.score}
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-gray-400">
                                    Điểm hiện tại
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Chuẩn mục tiêu {group.insight.target}+
                                  </p>
                                </div>
                              </div>
                              <p>{group.insight.summary}</p>
                              <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
                                {group.insight.reasons.map((reason, idx) => (
                                  <li key={`${key}-reason-${idx}`}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleInternalBlock(key)}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600"
                          >
                            {isOpen ? "Thu gọn khóa học" : "Xem chi tiết khóa"}
                            {isOpen ? (
                              <FiChevronUp className="h-4 w-4" />
                            ) : (
                              <FiChevronDown className="h-4 w-4" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                              {group.courses.map((course) => (
                                <CourseCard
                                  key={course.courseId}
                                  {...toCourseCardProps(course)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* External learning path */}
        <section className="bg-white/90 dark:bg-slate-900/70 rounded-3xl p-8 border border-lime-100/70 dark:border-slate-800 shadow-lg shadow-lime-100/30 dark:shadow-none">
          <div className="bg-gradient-to-r from-[#e8ffe0] to-white dark:from-lime-900/30 dark:to-transparent rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-extrabold text-lime-600 mb-2">
              Đề xuất lộ trình ngoài
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              Các track bổ sung từ nền tảng đối tác để bù lấp lỗ hổng kỹ năng.
              UI mô phỏng timeline với icon giống mockup: mỗi bước hiển thị khóa
              học gợi ý cùng nút mở link.
            </p>
          </div>

          <div className="space-y-10">
            {SAMPLE_LEARNING_PATH.externalLearningPath.map((track, trackIdx) => (
              <div
                key={track.majorId}
                className="rounded-3xl border border-lime-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-lime-50 text-lime-700 text-sm font-semibold">
                      <FiBook /> Track {trackIdx + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                      {track.majorCode}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                      {track.reason}
                    </p>
                  </div>

                  <div className="flex-1 relative pl-10">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-lime-200" />
                    {track.steps.map((step, stepIdx) => (
                      <div key={step.title} className="relative mb-10 pl-6">
                        <div className="absolute -left-6 top-0 w-10 h-10 rounded-full bg-white border-2 border-lime-300 flex items-center justify-center text-lime-600 font-semibold shadow">
                          {stepIdx + 1}
                        </div>
                        <div className="rounded-2xl border border-lime-100 dark:border-slate-800 bg-lime-50/60 dark:bg-slate-900/60 p-5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="text-sm uppercase tracking-wide text-lime-500 font-semibold">
                                Bước {stepIdx + 1}
                              </p>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                {step.title}
                              </h4>
                            </div>
                            {step.duration_Weeks > 0 && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                ≈ {step.duration_Weeks} tuần
                              </span>
                            )}
                          </div>

                          <div className="mt-4 space-y-4">
                            {step.suggested_Courses.map((course) => (
                              <a
                                key={course.link}
                                href={course.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col sm:flex-row sm:items-start gap-4 border border-lime-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 hover:shadow-md transition"
                              >
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    {course.title}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {course.provider} • {course.level ?? "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    {course.reason}
                                  </p>
                                </div>
                                <span className="inline-flex items-center gap-2 text-lime-600 font-semibold">
                                  Mở khóa học
                                  <FiExternalLink />
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearningPathSamplePage;

