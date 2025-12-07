"use client";

import React, { useState } from "react";
import { Card, Tabs, Tag } from "antd";
import { MarkdownBlock } from "EduSmart/components/MarkDown/MarkdownBlock";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import {
  FiCheck,
  FiPlus,
  FiMinus,
  FiMove,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

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
        subjectCode: "CSI104",
        subjectName: "Introduction to Computing",
        status: 2,
        semesterPosition: 1,
        analysisMarkdown:
          "## Introduction to computing (CSI104)\n### Tình hình\n- Điểm: 8.5 – Tình hình tốt, bạn đã có kiến thức cơ bản về máy tính.\n### Kiến thức trọng tâm\n- Cần nắm vững các khái niệm cơ bản về phần cứng, phần mềm và hệ điều hành.\n### Lộ trình 2–4 tuần\n- **Tuần 1**: 2 buổi ôn tập về phần cứng và phần mềm.\n- **Tuần 2**: 2 buổi thực hành sử dụng các phần mềm lập trình cơ bản.\n\n### Cảnh báo\n- Không có.",
        courses: [],
      },
      {
        subjectCode: "MAE101",
        subjectName: "Mathematics for Engineering",
        status: 2,
        semesterPosition: 1,
        analysisMarkdown:
          "## Mathematics for Engineering (MAE101)\n### Tình hình\n- Điểm hiện tại: 8.9 – Đây là một điểm tốt, cho thấy bạn đã nắm vững kiến thức cơ bản.\n### Kiến thức trọng tâm\n- Nắm vững các khái niệm toán học ứng dụng trong kỹ thuật, bao gồm đại số, giải tích và hình học.\n### Lộ trình 2–4 tuần\n- 2 buổi ôn tập lại các bài tập khó trong môn học để củng cố kiến thức.\n- 1 buổi tham gia thảo luận nhóm để giải quyết các vấn đề khó khăn.\n\n### Cảnh báo\n- Không có.",
        courses: [],
      },
      {
        subjectCode: "CEA201",
        subjectName: "Computer Organization and Architecture",
        status: 2,
        semesterPosition: 1,
        analysisMarkdown:
          "## Computer Organization and Architecture (CEA201)\n### Tình hình\n- Điểm hiện tại: 9.2 – Đây là một điểm xuất sắc.\n### Kiến thức trọng tâm\n- Nắm rõ cấu trúc và hoạt động của máy tính, bao gồm CPU, bộ nhớ và các thiết bị ngoại vi.\n### Lộ trình 2–4 tuần\n- 2 buổi ôn tập lại các khái niệm về kiến trúc máy tính.\n- 1 buổi tham gia thảo luận nhóm.\n\n### Cảnh báo\n- Không có.",
        courses: [],
      },
      {
        subjectCode: "PRF192",
        subjectName: "Programming Fundamentals",
        status: 2,
        semesterPosition: 1,
        analysisMarkdown: null,
        courses: [],
      },
      {
        subjectCode: "PRO192",
        subjectName: "Object-Oriented Programming",
        status: 0,
        semesterPosition: 2,
        analysisMarkdown:
          "## Object-Oriented Programming (PRO192)\n### Tình hình\n- Điểm hiện tại là chưa có, môn này phụ thuộc vào PRF192.\n### Kiến thức trọng tâm\n- **PRF192 (Programming Fundamentals) – Kỳ 1**: 7.2 – cần ôn lại để cải thiện điểm.\n### Cảnh báo\n- ⚠️ Object-Oriented Programming là điều kiện đầu vào cho Basic Cross-Platform Application Programming With .NET (kỳ 5). Điểm hiện tại 5.5/10 có thể khiến môn sau khó bắt nhịp nếu không củng cố.\n- ⚠️ Object-Oriented Programming là điều kiện đầu vào cho Data Structures and Algorithms (kỳ 3).\n- ⚠️ Object-Oriented Programming là điều kiện đầu vào cho Java Web application development (kỳ 4).\n### Lộ trình 2–4 tuần\n- **Buổi 1-2**: Ôn lại các khái niệm cơ bản trong PRF192, tập trung vào các cấu trúc dữ liệu và thuật toán.\n- **Buổi 3-4**: Thực hành lập trình với các bài tập cụ thể.\n\n### Môn tiền đề quan trọng\n- Programming Fundamentals (PRF192) – Kỳ 1: điểm 7.2/10 – đã đạt chuẩn",
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
        subjectCode: "MAD101",
        subjectName: "Discrete Mathematics",
        status: 2,
        semesterPosition: 2,
        analysisMarkdown: null,
        courses: [],
      },
      {
        subjectCode: "OSG202",
        subjectName: "Operating Systems",
        status: 2,
        semesterPosition: 2,
        analysisMarkdown: null,
        courses: [],
      },
      {
        subjectCode: "DBI202",
        subjectName: "Database Systems",
        status: 1,
        semesterPosition: 3,
        analysisMarkdown:
          "## Database Systems (DBI202)\n### Tình hình\n- Điểm hiện tại: 8.8 – Đạt yêu cầu.\n### Kiến thức trọng tâm\n- Hiểu rõ các khái niệm cơ bản về hệ thống cơ sở dữ liệu và SQL.\n### Lộ trình 2–4 tuần\n- Tuần 1: 2 buổi ôn tập lý thuyết về cơ sở dữ liệu, nắm vững các loại cơ sở dữ liệu.\n- Tuần 2: 2 buổi thực hành viết truy vấn SQL.\n\n### Cảnh báo\n- Không có.",
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
        subjectName: "Data Structures and Algorithms",
        status: 0,
        semesterPosition: 3,
        analysisMarkdown:
          "## Data Structures and Algorithms (CSD201)\n### Tình hình\n- Điểm: 8.3 – Tình hình tốt, nhưng cần cải thiện để đạt yêu cầu cao hơn.\n### Kiến thức trọng tâm\n- Cần nắm vững các cấu trúc dữ liệu cơ bản như danh sách, cây, đồ thị và các thuật toán sắp xếp, tìm kiếm.\n### Môn nền tảng quan trọng\n- **Object-Oriented Programming (PRO192) – Kỳ 2**: Chưa có điểm – cần hoàn thành trước khi học sâu môn hiện tại.\n### Cảnh báo\n- ⚠️ Object-Oriented Programming (PRO192) – Kỳ 2: điểm 5.5/10 đang dưới chuẩn nhưng là tiền đề của Data Structures and Algorithms. Cần củng cố sớm.\n### Lộ trình 2–4 tuần\n- **Tuần 1**: 3 buổi ôn tập về lập trình hướng đối tượng.\n- **Tuần 2**: 2 buổi làm bài tập về cấu trúc dữ liệu.\n\n### Môn tiền đề quan trọng\n- Object-Oriented Programming (PRO192) – Kỳ 2: điểm 5.5/10 – đang dưới chuẩn, ưu tiên củng cố",
        courses: [
          {
            courseId: "1a8d54b8-b0bf-4db9-b72a-f98aa4c4bb39",
            title: "Data Structures and Algorithms",
            shortDescription:
              "Khóa học giúp nắm vững cấu trúc dữ liệu, thuật toán và tư duy tối ưu để giải quyết bài toán hiệu quả hơn.",
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
        subjectCode: "MAS291",
        subjectName: "Statistics & Probability",
        status: 0,
        semesterPosition: 4,
        analysisMarkdown:
          "## Statistics & Probability (MAS291)\n### Tình hình\n- Điểm hiện tại: 6.5 – Bạn cần cải thiện để đạt yêu cầu.\n### Kiến thức trọng tâm\n- Khái niệm cơ bản về xác suất: Nắm vững các định nghĩa và công thức.\n- Phân tích dữ liệu: Học cách sử dụng thống kê để phân tích thông tin.\n### Môn nền tảng quan trọng\n- Mathematics for Engineering (MAE101) – Kỳ 1: Chưa có điểm – cần hoàn thành trước khi học sâu môn hiện tại.\n### Cảnh báo\n- Không có.\n### Lộ trình 2–4 tuần\n- 4 buổi: Ôn tập kiến thức từ MAE101 và thực hành bài tập thống kê.\n\n### Môn tiền đề quan trọng\n- Mathematics for Engineering (MAE101) – Kỳ 1: điểm 8.9/10 – đã đạt chuẩn",
        courses: [],
      },
      {
        subjectCode: "PRJ301",
        subjectName: "Java Web Application Development",
        status: 0,
        semesterPosition: 4,
        analysisMarkdown:
          "## Java Web application development (PRJ301)\n### Tình hình\n- Điểm hiện tại: 8.5 – Điểm này cho thấy bạn có kiến thức tốt trong phát triển ứng dụng web.\n### Kiến thức trọng tâm\n- Nắm vững các công nghệ phát triển web, bao gồm Java, HTML, CSS và JavaScript.\n### Môn nền tảng quan trọng\n- Database Systems (DBI202) – Kỳ 3: Chưa có điểm – cần hoàn thành trước.\n- Object-Oriented Programming (PRO192) – Kỳ 2: Chưa có điểm – cần hoàn thành trước.\n### Cảnh báo\n- ⚠️ Object-Oriented Programming (PRO192) – Kỳ 2: điểm 5.5/10 đang dưới chuẩn nhưng là tiền đề. Cần củng cố sớm.\n### Lộ trình 2–4 tuần\n- 2 buổi ôn lại các khái niệm trong Database Systems và Object-Oriented Programming.\n- 1 buổi tham gia thảo luận nhóm về phát triển ứng dụng web.\n\n### Môn tiền đề quan trọng\n- Database Systems (DBI202) – Kỳ 3: điểm 8.8/10 – đã đạt chuẩn\n- Object-Oriented Programming (PRO192) – Kỳ 2: điểm 5.5/10 – đang dưới chuẩn, ưu tiên củng cố",
        courses: [
          {
            courseId: "aab3c620-1e08-442d-911b-afb604027d83",
            title: "Java Web Application Development",
            shortDescription:
              "Khóa học nâng cao giúp bạn làm chủ Spring MVC, REST API và Spring Security.",
            courseImageUrl:
              "https://www.javaindia.in/blog/wp-content/uploads/2020/09/java-web-development.png",
            durationHours: 4,
            level: 3,
            dealPrice: 299000,
            price: 549000,
            teacherName: "An Teacher",
            tagNames: ["Software Engineering", "Java"],
          },
        ],
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
      majorId: "0816d022-755e-4089-a117-6d11d51524b8",
      majorCode: "FULLSTACK_DEV",
      reason:
        "Track này giúp bổ sung kiến thức về Python và JavaScript, những công nghệ quan trọng cho lập trình viên FullStack mà bạn chưa được học.",
      steps: [
        {
          title: "Phát triển ứng dụng Full Stack với Node.js và Express",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Phát triển ứng dụng Full Stack với Node.js và Express",
              link: "https://www.coursera.org/learn/developing-backend-apps-with-nodejs-and-express",
              provider: "IBM",
              reason:
                "Khóa học này hỗ trợ việc phát triển backend sử dụng Node.js và Express, phù hợp với mục tiêu học lập trình Full Stack.",
              level: "Intermediate level",
            },
          ],
        },
        {
          title: "Khóa học về phát triển Frontend với JavaScript",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Khóa học về phát triển Frontend với JavaScript",
              link: "https://www.coursera.org/learn/frontend-development-for-java-full-stack",
              provider: "Board Infinity",
              reason:
                "Khóa học này dạy về HTML, CSS và JavaScript, rất cần thiết để phát triển frontend trong việc học lập trình Full Stack.",
              level: "Intermediate level",
            },
          ],
        },
        {
          title: "Dự án Capstone về phát triển ứng dụng Full Stack",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Dự án Capstone về phát triển ứng dụng Full Stack",
              link: "https://www.coursera.org/learn/ibm-cloud-native-full-stack-development-capstone",
              provider: "IBM",
              reason:
                "Khóa dự án này giúp áp dụng kỹ năng phát triển ứng dụng Full Stack trong một dự án thực tế.",
              level: "Advanced level",
            },
          ],
        },
      ],
    },
    {
      majorId: "5c1b632c-0728-44d5-af3b-f567962f7eee",
      majorCode: "REACT_ADV",
      reason:
        "Track này giúp củng cố kiến thức về ReactJS, mang lại chiều sâu cho kỹ năng frontend của bạn, điều mà internal chưa đề cập.",
      steps: [
        {
          title: "Chương Trình Nâng Cao React",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Chương Trình Nâng Cao React",
              link: "https://www.coursera.org/learn/advanced-react",
              provider: "Meta",
              reason:
                "Khóa học này tập trung vào các khái niệm nâng cao trong React, phù hợp với mục tiêu nắm vững các khái niệm nâng cao về React.",
              level: "Intermediate level",
            },
            {
              title: "Chương Trình Nâng Cao React",
              link: "https://www.coursera.org/learn/learn-advanced-react",
              provider: "Scrimba",
              reason:
                "Khóa học này cung cấp kiến thức sâu về các mẫu React nâng cao, hỗ trợ trong việc triển khai các ứng dụng phức tạp.",
              level: "Advanced level",
            },
            {
              title: "Chương Trình Nâng Cao React",
              link: "https://www.coursera.org/learn/packt-advanced-react-projects-and-ecommerce-development-neuup",
              provider: "Packt",
              reason:
                "Khóa học này tập trung vào các dự án thực tế trong React, giúp áp dụng kiến thức vào thực tế.",
              level: "Intermediate level",
            },
          ],
        },
      ],
    },
    {
      majorId: "12621e8a-c43f-452a-a46e-1144b88c2eb0",
      majorCode: "PYTHON_WEB",
      reason:
        "Track này bổ sung cho bạn kiến thức về phát triển web với Python, một ngôn ngữ quan trọng mà bạn chưa được học trong internal.",
      steps: [
        {
          title: "Khóa Học Nền Tảng Python cho Dữ Liệu Web",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Khóa Học Nền Tảng Python cho Dữ Liệu Web",
              link: "https://www.coursera.org/learn/python-network-data",
              provider: "University of Michigan",
              reason:
                "Khóa học này cung cấp kiến thức về việc thu thập và xử lý dữ liệu web bằng Python, liên quan đến việc truy xuất dữ liệu từ web và API.",
              level: "Beginner level",
            },
          ],
        },
        {
          title: "Xây Dựng Ứng Dụng Web với Django",
          duration_Weeks: 0,
          suggested_Courses: [
            {
              title: "Xây Dựng Ứng Dụng Web với Django",
              link: "https://www.coursera.org/learn/django-web-framework",
              provider: "Meta",
              reason:
                "Khóa học này giảng dạy về Django, framework rất phù hợp để xây dựng ứng dụng web với Python.",
              level: "Beginner level",
            },
            {
              title: "Xây Dựng Ứng Dụng Web với Django",
              link: "https://www.coursera.org/learn/django-build-web-apps",
              provider: "University of Michigan",
              reason:
                "Khóa học này cung cấp kiến thức nâng cao về xây dựng ứng dụng web trên Django, phù hợp với mục tiêu xây dựng ứng dụng web.",
              level: "Intermediate level",
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
  // Mặc định rỗng - người dùng tự chọn
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [majorOrder, setMajorOrder] = useState<string[]>([]);
  const [draggedMajor, setDraggedMajor] = useState<string | null>(null);
  const [viewingMajorId, setViewingMajorId] = useState<string | null>(null);

  const toggleSection = (section: "basic" | "internal" | "external") => {
    setSectionsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedMajor(null);
  };

  // Handle major toggle for selection
  const handleMajorToggle = (majorId: string) => {
    if (!majorId) return;
    if (selectedMajors.includes(majorId)) {
      setSelectedMajors((prev) => prev.filter((id) => id !== majorId));
      setMajorOrder((prev) => prev.filter((id) => id !== majorId));
    } else {
      setSelectedMajors((prev) => [...prev, majorId]);
      setMajorOrder((prev) => [...prev, majorId]);
    }
  };

  // Move major up/down in order
  const moveMajorUp = (majorId: string) => {
    const i = majorOrder.indexOf(majorId);
    if (i > 0) {
      const arr = [...majorOrder];
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      setMajorOrder(arr);
    }
  };

  const moveMajorDown = (majorId: string) => {
    const i = majorOrder.indexOf(majorId);
    if (i !== -1 && i < majorOrder.length - 1) {
      const arr = [...majorOrder];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      setMajorOrder(arr);
    }
  };

  // Enhanced drag handlers
  const handleDragStartEnhanced = (e: React.DragEvent, majorId: string) => {
    setDraggedMajor(majorId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", majorId);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropEnhanced = (e: React.DragEvent, targetMajorId: string) => {
    e.preventDefault();
    if (!draggedMajor || draggedMajor === targetMajorId) {
      setDraggedMajor(null);
      return;
    }
    const draggedIndex = majorOrder.indexOf(draggedMajor);
    const targetIndex = majorOrder.indexOf(targetMajorId);
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedMajor(null);
      return;
    }
    const arr = [...majorOrder];
    arr.splice(draggedIndex, 1);
    arr.splice(targetIndex, 0, draggedMajor);
    setMajorOrder(arr);
    setDraggedMajor(null);
  };

  // Đếm tổng số khóa học trong một major
  const getTotalCourses = (
    major: (typeof sampleData.internalLearningPath)[0],
  ) => {
    return major.majorCourseGroups.reduce(
      (acc, cg) => acc + cg.courses.length,
      0,
    );
  };

  // Lấy danh sách kỳ từ danh sách môn (groups) - lấy từ group.semesterPosition
  const getSemestersFromGroups = (
    groups: (typeof sampleData.internalLearningPath)[0]["majorCourseGroups"],
  ) => {
    const set = new Set<number>();
    groups.forEach((g) => {
      const sem = g.semesterPosition ?? 0;
      if (sem > 0) set.add(sem);
    });
    return Array.from(set).sort((a, b) => a - b);
  };

  // Lọc mỗi group theo 1 kỳ cụ thể - lấy từ group.semesterPosition
  const filterGroupsBySemester = (
    groups: (typeof sampleData.internalLearningPath)[0]["majorCourseGroups"],
    sem: number,
  ) => groups.filter((g) => (g.semesterPosition ?? 0) === sem);

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
    <div className="space-y-5">
      {/* ========== 1. LỘ TRÌNH KHỞI ĐẦU ========== */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Section Header - Clickable */}
        <div
          className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={() => toggleSection("basic")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                1
              </div> */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    Phần 1
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sampleData.basicLearningPath.courseGroups.length} môn học
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Lộ trình khởi đầu
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Dựa trên năng lực hiện tại của bạn, hệ thống chúng tôi đề xuất
                  bạn nên củng cố các môn học nền tảng sau
                </p>
              </div>
            </div>
            <span
              className={`text-gray-400 text-lg transition-transform duration-200 ${
                sectionsOpen.basic ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>
        </div>

        {/* Content - Collapsible */}
        {sectionsOpen.basic && (
          <div className="p-6">
            {/* Danh sách môn học - sắp xếp theo kỳ */}
            {(() => {
              // Sắp xếp theo kỳ học
              const sortedGroups = [
                ...sampleData.basicLearningPath.courseGroups,
              ].sort((a, b) => a.semesterPosition - b.semesterPosition);

              return (
                <div className="space-y-3">
                  {sortedGroups.map((group) => {
                    const statusInfo = getStatusInfo(group.status);
                    const isExpanded = expandedSubject === group.subjectCode;

                    return (
                      <div
                        key={group.subjectCode}
                        className={`rounded-lg border overflow-hidden transition-all ${
                          isExpanded
                            ? "border-gray-300 dark:border-gray-600 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {/* Subject Row - Clickable */}
                        <div
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                            isExpanded
                              ? "bg-gray-50 dark:bg-gray-800"
                              : "bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                          onClick={() =>
                            setExpandedSubject(
                              isExpanded ? null : group.subjectCode,
                            )
                          }
                        >
                          {/* Semester Badge */}
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex-shrink-0">
                            Kỳ {group.semesterPosition}
                          </span>

                          {/* Subject Code */}
                          <span className="font-semibold text-gray-900 dark:text-white flex-shrink-0">
                            {group.subjectCode}
                          </span>

                          {/* Subject Name */}
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 min-w-0 truncate">
                            {(group as { subjectName?: string }).subjectName ||
                              ""}
                          </span>

                          {/* Course count + Status */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {group.courses.length > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {group.courses.length} khóa học
                              </span>
                            )}
                            <Tag
                              color={statusInfo.color as string}
                              className="text-xs"
                            >
                              {statusInfo.label}
                            </Tag>
                          </div>

                          {/* Expand indicator */}
                          <span
                            className={`text-gray-400 transition-transform text-sm flex-shrink-0 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700">
                            {/* Analysis Markdown */}
                            {group.analysisMarkdown && (
                              <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                                <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-strong:text-gray-700 dark:prose-strong:text-gray-300 prose-h2:text-base prose-h3:text-sm prose-h2:mb-3 prose-h3:mb-2 prose-ul:my-2 prose-li:my-0.5">
                                  <MarkdownBlock
                                    markdown={group.analysisMarkdown}
                                  />
                                </div>
                              </div>
                            )}

                            {/* No analysis message */}
                            {!group.analysisMarkdown && (
                              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Môn học này không có phân tích chi tiết.
                                </p>
                              </div>
                            )}

                            {/* Courses */}
                            {group.courses.length > 0 && (
                              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Khóa học đề xuất
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {group.courses.length} khóa học
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
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
              );
            })()}
          </div>
        )}
      </section>

      {/* ========== 2. CHUYÊN NGÀNH HẸP ========== */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Section Header - Clickable */}
        <div
          className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={() => toggleSection("internal")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <div className="w-10 h-10 rounded-lg bg-[#49BBBD] flex items-center justify-center text-white font-bold text-sm">
                2
              </div> */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#49BBBD] dark:text-cyan-400 uppercase tracking-wider">
                    Phần 2
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sampleData.internalLearningPath.length} chuyên ngành
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {sampleData.status === 2
                    ? "Chuyên ngành hẹp"
                    : "Chuyên ngành hẹp phù hợp"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {sampleData.status === 2
                    ? "Học theo thứ tự đã sắp xếp để hiệu quả nhất"
                    : "Hệ thống đề xuất các chuyên ngành phù hợp với năng lực của bạn"}
                </p>
              </div>
            </div>
            <span
              className={`text-gray-400 text-lg transition-transform duration-200 ${
                sectionsOpen.internal ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>
        </div>

        {/* Content - Collapsible */}
        {/* Content - Collapsible */}
        {sectionsOpen.internal && (
          <div className="p-6">
            {/* TIMELINE VIEW - Status = 2 */}
            {sampleData.status === 2 && (
              <div className="space-y-6">
                {sampleData.internalLearningPath.map((path, index) => {
                  const id = path.majorId;
                  const isExpanded = expandedMajor === id;
                  const sems = getSemestersFromGroups(path.majorCourseGroups);

                  return (
                    <div key={id} className="relative">
                      <div
                        onClick={() => setExpandedMajor(isExpanded ? null : id)}
                        className={`cursor-pointer rounded-xl p-6 transition-all duration-300 border ${
                          isExpanded
                            ? "border border-[#49BBBD] bg-teal-50/50 dark:bg-teal-900/20 shadow-lg"
                            : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-teal-200 dark:hover:border-cyan-600 hover:shadow-md"
                        }`}
                      >
                        {/* Header combo */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black shadow-md ${
                              index === 0
                                ? "bg-gradient-to-br from-[#49BBBD] to-cyan-600 text-white"
                                : "bg-gradient-to-br from-teal-400 to-cyan-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                {path.majorCode}
                              </h3>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {getTotalCourses(path)} khóa học
                            </span>
                          </div>
                        </div>

                        {/* Reason */}
                        {path.reason && (
                          <p
                            className={`text-sm leading-relaxed ${
                              isExpanded
                                ? "text-gray-700 dark:text-gray-300 mb-4"
                                : "text-gray-600 dark:text-gray-400 line-clamp-2 mb-1"
                            }`}
                          >
                            {path.reason}
                          </p>
                        )}

                        {/* CTA collapsed */}
                        {!isExpanded && (
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-[#49BBBD] dark:text-cyan-400 text-sm font-semibold">
                              Xem chi tiết theo kỳ
                            </span>
                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        )}

                        {/* Expanded: Kỳ → Môn → Khóa */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-teal-200 dark:border-cyan-800">
                            {sems.map((sem) => {
                              const groupsForSem = filterGroupsBySemester(
                                path.majorCourseGroups,
                                sem,
                              );
                              if (groupsForSem.length === 0) return null;
                              return (
                                <div
                                  key={`major-${id}-sem-${sem}`}
                                  className="mb-10"
                                >
                                  <div className="flex items-center mb-5">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
                                      {sem}
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Kỳ {sem}
                                      </h4>
                                      <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                                    </div>
                                  </div>

                                  <div className="space-y-6">
                                    {groupsForSem.map((cg) => (
                                      <div
                                        key={cg.subjectCode}
                                        className="mb-6"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-3">
                                            <div className="px-2 py-1 rounded-md bg-[#49BBBD] text-white text-xs font-bold">
                                              {cg.subjectCode}
                                            </div>
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                cg.status === 0
                                                  ? "bg-gray-100 text-gray-700"
                                                  : cg.status === 1
                                                    ? "bg-blue-100 text-blue-700"
                                                    : cg.status === 2
                                                      ? "bg-emerald-100 text-emerald-700"
                                                      : "bg-amber-100 text-amber-700"
                                              }`}
                                            >
                                              {cg.status === 0
                                                ? "Chưa bắt đầu"
                                                : cg.status === 1
                                                  ? "Đang học"
                                                  : cg.status === 2
                                                    ? "Hoàn thành"
                                                    : "Bỏ qua"}
                                            </span>
                                          </div>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {cg.courses.length} khóa học
                                          </span>
                                        </div>

                                        {cg.courses.length > 0 && (
                                          <div className="flex flex-wrap gap-4">
                                            {cg.courses.map((course, i) => (
                                              <div
                                                key={`${cg.subjectCode}-${i}`}
                                                className="transform hover:scale-[1.02] transition-all duration-300"
                                              >
                                                <CourseCard
                                                  id={course.courseId}
                                                  imageUrl={
                                                    course.courseImageUrl
                                                  }
                                                  title={course.title}
                                                  descriptionLines={
                                                    course.shortDescription
                                                      ? [
                                                          course.shortDescription,
                                                        ]
                                                      : []
                                                  }
                                                  instructor={`${cg.subjectCode} - Kỳ ${sem}`}
                                                  level={course.level}
                                                  price={course.price}
                                                  dealPrice={course.dealPrice}
                                                  routerPush={`/course/${course.courseId}`}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {cg.courses.length === 0 && (
                                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            Chưa có khóa học cho môn này
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* GRID VIEW - Status = 1 (chọn & sắp xếp) */}
            {sampleData.status === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {sampleData.internalLearningPath.map((path, idx) => {
                    const id = path.majorId;
                    const total = getTotalCourses(path);
                    return (
                      <div
                        key={id || idx}
                        onClick={() =>
                          setViewingMajorId(viewingMajorId === id ? null : id)
                        }
                        className={`relative cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
                          viewingMajorId === id
                            ? "bg-gradient-to-r from-[#49BBBD] to-cyan-600 text-white border-[#49BBBD] shadow-lg"
                            : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-cyan-600 hover:shadow-md"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className={`font-bold text-base leading-tight ${
                              viewingMajorId === id
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {path.majorCode}
                          </h3>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              viewingMajorId === id
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {total} khóa học
                          </div>
                        </div>

                        {/* Reason - Expand khi đang xem card */}
                        <p
                          className={`text-sm mb-3 transition-all duration-300 ${
                            viewingMajorId === id ? "" : "line-clamp-2"
                          } ${
                            viewingMajorId === id
                              ? "text-white/90"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {path.reason || `${total} khóa học chuyên sâu`}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMajorToggle(id);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedMajors.includes(id)
                                ? viewingMajorId === id
                                  ? "bg-white text-black hover:bg-gray-50 shadow-sm"
                                  : "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-800 dark:text-teal-100"
                                : viewingMajorId === id
                                  ? "bg-white/20 text-white hover:bg-white/30 border border-white/40"
                                  : "bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400"
                            }`}
                          >
                            {selectedMajors.includes(id) ? (
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

                          <div
                            className={`text-xs ${
                              viewingMajorId === id
                                ? "text-white/70"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {viewingMajorId === id ? "Đang xem" : "Nhấn để xem"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Courses of selected major — Kỳ → Môn → Khoá */}
                {viewingMajorId && (
                  <div>
                    {(() => {
                      const selectedPath = sampleData.internalLearningPath.find(
                        (p) => p.majorId === viewingMajorId,
                      );
                      if (!selectedPath) return null;

                      const sems = getSemestersFromGroups(
                        selectedPath.majorCourseGroups,
                      );

                      return (
                        <>
                          <div className="mb-6">
                            {/* <h3 className="text-2xl font-black text-[#49BBBD] dark:text-cyan-400 drop-shadow-lg">
                              Lộ trình {selectedPath.majorCode}
                            </h3> */}
                          </div>

                          {sems.map((sem) => {
                            const groupsForSem = filterGroupsBySemester(
                              selectedPath.majorCourseGroups,
                              sem,
                            );
                            if (groupsForSem.length === 0) return null;
                            return (
                              <div
                                key={`view-${viewingMajorId}-sem-${sem}`}
                                className="mb-10"
                              >
                                <div className="flex items-center mb-5">
                                  {/* <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-base font-bold mr-4 shadow-md">
                                    {sem}
                                  </div> */}
                                  <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                      Kỳ {sem}
                                    </h4>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-1.5"></div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  {groupsForSem.map((cg) => (
                                    <div key={cg.subjectCode} className="mb-6">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                          <div className="px-2 py-1 rounded-md bg-[#49BBBD] text-white text-xs font-bold">
                                            {cg.subjectCode}
                                          </div>
                                          <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                              cg.status === 0
                                                ? "bg-gray-100 text-gray-700"
                                                : cg.status === 1
                                                  ? "bg-blue-100 text-blue-700"
                                                  : cg.status === 2
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                          >
                                            {cg.status === 0
                                              ? "Chưa bắt đầu"
                                              : cg.status === 1
                                                ? "Đang học"
                                                : cg.status === 2
                                                  ? "Hoàn thành"
                                                  : "Bỏ qua"}
                                          </span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {cg.courses.length} khóa học
                                        </span>
                                      </div>

                                      {cg.courses.length > 0 && (
                                        <div className="flex flex-wrap gap-4">
                                          {cg.courses.map((course, i) => (
                                            <div
                                              key={`${cg.subjectCode}-${i}`}
                                              className="transform hover:scale-[1.02] transition-all duration-300"
                                            >
                                              <CourseCard
                                                id={course.courseId}
                                                imageUrl={course.courseImageUrl}
                                                title={course.title}
                                                descriptionLines={
                                                  course.shortDescription
                                                    ? [course.shortDescription]
                                                    : []
                                                }
                                                instructor={`${cg.subjectCode} - Kỳ ${sem}`}
                                                level={course.level}
                                                price={course.price}
                                                dealPrice={course.dealPrice}
                                                routerPush={`/course/${course.courseId}`}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {cg.courses.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                          Chưa có khóa học cho môn này
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Empty State - Chưa chọn gì */}
                {selectedMajors.length === 0 && !viewingMajorId && (
                  <div className="mt-6 p-6 rounded-xl border-1 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <FiPlus className="w-8 h-8 text-teal-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Chưa chọn chuyên ngành nào
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      Hãy nhấn vào các thẻ chuyên ngành ở trên để xem chi tiết,
                      sau đó nhấn &quot;Chọn combo&quot; để thêm vào lộ trình
                      học của bạn.
                    </p>
                  </div>
                )}

                {/* Selected Order Management */}
                {selectedMajors.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-6">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <span className="text-2xl font-bold text-[#49BBBD] dark:text-cyan-400 drop-shadow-lg">
                          Thứ tự học đã chọn
                        </span>
                        <span className="ml-3 text-base font-medium text-gray-500 dark:text-gray-400">
                          ({selectedMajors.length} combo)
                        </span>
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {majorOrder.map((majorId, index) => {
                        const path = sampleData.internalLearningPath.find(
                          (p) => p.majorId === majorId,
                        );
                        if (!path) return null;

                        const total = getTotalCourses(path);
                        const isDragging = draggedMajor === majorId;

                        return (
                          <div
                            key={majorId}
                            draggable
                            onDragStart={(e) =>
                              handleDragStartEnhanced(e, majorId)
                            }
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDrop={(e) => handleDropEnhanced(e, majorId)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-move ${
                              isDragging
                                ? "bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-cyan-600 opacity-50 scale-105 shadow-lg"
                                : "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-cyan-700 hover:shadow-md hover:bg-teal-100 dark:hover:bg-teal-900/30"
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing">
                                <FiMove className="w-5 h-5" />
                              </div>
                              <div className="w-8 h-8 bg-[#49BBBD] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                  {path.majorCode}
                                </h5>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {total} khóa học
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => moveMajorUp(majorId)}
                                disabled={index === 0}
                                className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Di chuyển lên"
                              >
                                <FiChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                              </button>
                              <button
                                onClick={() => moveMajorDown(majorId)}
                                disabled={index === majorOrder.length - 1}
                                className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              </>
            )}
          </div>
        )}
      </section>

      {/* ========== 3. KHÓA HỌC BÊN NGOÀI ========== */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Section Header - Clickable */}
        <div
          className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={() => toggleSection("external")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                3
              </div> */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    Phần 3
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sampleData.externalLearningPath.length} track
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Đề xuất khóa học bên ngoài
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Các khóa học bổ sung từ nền tảng ngoài để bù lấp lỗ hổng kỹ
                  năng
                </p>
              </div>
            </div>
            <span
              className={`text-gray-400 text-lg transition-transform duration-200 ${
                sectionsOpen.external ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>
        </div>

        {/* Content - Collapsible */}
        {sectionsOpen.external && (
          <div className="p-6">
            <div className="space-y-6">
              {sampleData.externalLearningPath.map((track, trackIdx) => (
                <div
                  key={track.majorCode}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Track Header */}
                  <div className="bg-gray-50 dark:bg-gray-800 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {trackIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {track.majorCode.replace(/_/g, " ")}
                          </h4>
                          <Tag color="purple" className="text-xs">
                            {track.steps.length} bước
                          </Tag>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {track.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Steps Timeline */}
                  <div className="p-5 bg-white dark:bg-gray-900">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                      <div className="space-y-6">
                        {track.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="relative pl-10">
                            {/* Step dot */}
                            <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white">
                                {stepIdx + 1}
                              </span>
                            </div>

                            {/* Step Content */}
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                                {step.title}
                              </h5>

                              {/* Courses Grid */}
                              <div className="grid gap-3">
                                {step.suggested_Courses.map(
                                  (course, courseIdx) => (
                                    <a
                                      key={courseIdx}
                                      href={course.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {course.title}
                                          </div>
                                          {"reason" in course &&
                                            course.reason && (
                                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                {course.reason as string}
                                              </p>
                                            )}
                                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                              {course.provider}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {course.level}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                          <span className="text-purple-600 dark:text-purple-400 text-sm">
                                            →
                                          </span>
                                        </div>
                                      </div>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
