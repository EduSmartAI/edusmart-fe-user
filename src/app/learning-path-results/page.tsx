"use client";

import React, { useState } from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import CourseCard from "EduSmart/components/CourseCard/CourseCard";
import { Button } from "antd";
import { FiTarget, FiTrendingUp, FiGlobe, FiStar, FiBookOpen } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Mock data for courses
const mockFoundationCourses = {
  semester1: [
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Nhập môn Lập trình",
      descriptionLines: ["Học cơ bản về lập trình", "Thuật toán và cấu trúc dữ liệu", "Thực hành với Python"],
      instructor: "TS. Nguyễn Văn A",
      price: "Miễn phí",
      routerPush: "/course/intro-programming"
    },
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Toán rời rạc",
      descriptionLines: ["Logic toán học", "Lý thuyết tập hợp", "Đại số Boolean"],
      instructor: "PGS. Trần Thị B",
      price: "Miễn phí",
      routerPush: "/course/discrete-math"
    }
  ],
  semester2: [
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Cấu trúc dữ liệu và Giải thuật",
      descriptionLines: ["Array, Linked List, Stack, Queue", "Tree, Graph algorithms", "Sorting và Searching"],
      instructor: "TS. Lê Văn C",
      price: "Miễn phí",
      routerPush: "/course/data-structures"
    },
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Lập trình hướng đối tượng",
      descriptionLines: ["Khái niệm OOP", "Inheritance, Polymorphism", "Design Patterns cơ bản"],
      instructor: "ThS. Phạm Thị D",
      price: "Miễn phí",
      routerPush: "/course/oop"
    }
  ],
  semester3: [
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Cơ sở dữ liệu",
      descriptionLines: ["Thiết kế CSDL", "SQL và NoSQL", "Database optimization"],
      instructor: "TS. Hoàng Văn E",
      price: "Miễn phí",
      routerPush: "/course/database"
    },
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Mạng máy tính",
      descriptionLines: ["TCP/IP Protocol", "Network Security", "Web Technologies"],
      instructor: "PGS. Vũ Thị F",
      price: "Miễn phí",
      routerPush: "/course/networking"
    }
  ],
  semester4: [
    {
      imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
      title: "Công nghệ phần mềm",
      descriptionLines: ["SDLC methodologies", "Agile và Scrum", "Testing strategies"],
      instructor: "TS. Đỗ Văn G",
      price: "Miễn phí",
      routerPush: "/course/software-engineering"
    }
  ]
};

const mockSpecializations = [
  {
    id: "react",
    name: "Full-stack React Developer",
    description: "Phát triển ứng dụng web hiện đại với React ecosystem",
    icon: "⚛️",
    courses: [
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "React Fundamentals",
        descriptionLines: ["Components và JSX", "State và Props", "Event Handling"],
        instructor: "Nguyễn Frontend",
        price: "1,500,000 VND",
        routerPush: "/course/react-fundamentals"
      },
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "Advanced React & Redux",
        descriptionLines: ["Redux Toolkit", "Context API", "Performance Optimization"],
        instructor: "Trần React Pro",
        price: "2,000,000 VND",
        routerPush: "/course/advanced-react"
      },
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "Node.js & Express",
        descriptionLines: ["RESTful APIs", "Authentication", "Database Integration"],
        instructor: "Lê Backend",
        price: "1,800,000 VND",
        routerPush: "/course/nodejs-express"
      }
    ]
  },
  {
    id: "dotnet",
    name: ".NET Developer",
    description: "Xây dựng ứng dụng enterprise với .NET ecosystem",
    icon: "🔷",
    courses: [
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "C# Programming",
        descriptionLines: ["C# Syntax và OOP", "LINQ và Collections", "Async Programming"],
        instructor: "Phạm DotNet",
        price: "1,600,000 VND",
        routerPush: "/course/csharp-programming"
      },
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "ASP.NET Core Web API",
        descriptionLines: ["RESTful Web APIs", "Entity Framework", "Authentication & Authorization"],
        instructor: "Vũ ASP.NET",
        price: "2,200,000 VND",
        routerPush: "/course/aspnet-core"
      }
    ]
  },
  {
    id: "java",
    name: "Java Enterprise Developer",
    description: "Phát triển ứng dụng doanh nghiệp với Java Spring",
    icon: "☕",
    courses: [
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "Java Core Programming",
        descriptionLines: ["Java Fundamentals", "Collections Framework", "Multithreading"],
        instructor: "Hoàng Java",
        price: "1,400,000 VND",
        routerPush: "/course/java-core"
      },
      {
        imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
        title: "Spring Boot Framework",
        descriptionLines: ["Spring Boot Basics", "Spring Data JPA", "Spring Security"],
        instructor: "Đỗ Spring",
        price: "2,100,000 VND",
        routerPush: "/course/spring-boot"
      }
    ]
  }
];

const mockAdditionalCourses = [
  {
    imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
    title: "AWS Cloud Practitioner",
    descriptionLines: ["Cloud Computing Basics", "AWS Services Overview", "Cost Optimization"],
    instructor: "Amazon Web Services",
    price: "$99",
    routerPush: "/course/aws-cloud",
    isExternal: true,
    platform: "AWS Training"
  },
  {
    imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
    title: "Machine Learning Specialization",
    descriptionLines: ["Supervised Learning", "Neural Networks", "Practical Projects"],
    instructor: "Andrew Ng",
    price: "$49/month",
    routerPush: "/course/ml-specialization",
    isExternal: true,
    platform: "Coursera"
  },
  {
    imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
    title: "Docker & Kubernetes",
    descriptionLines: ["Container Technology", "Orchestration", "DevOps Practices"],
    instructor: "Mumshad Mannambeth",
    price: "$84.99",
    routerPush: "/course/docker-kubernetes",
    isExternal: true,
    platform: "Udemy"
  },
  {
    imageUrl: "https://img-c.udemycdn.com/course/480x270/3142166_a637_3.jpg",
    title: "System Design Interview",
    descriptionLines: ["Scalability Concepts", "Database Design", "Microservices"],
    instructor: "Alex Xu",
    price: "$199",
    routerPush: "/course/system-design",
    isExternal: true,
    platform: "Educative"
  }
];

export default function LearningPathResults() {
  const router = useRouter();
  const [selectedSpecialization, setSelectedSpecialization] = useState(mockSpecializations[0]);

  const handleGoHome = () => {
    router.push("/");
  };

  const SemesterSection = ({ semester, courses, title }: { semester: string; courses: any[]; title: string }) => (
    <div className="mb-12 relative">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
          {semester}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h4>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mt-1"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16">
        {courses.map((course, index) => (
          <div key={index} className="transform hover:scale-105 transition-transform duration-300">
            <CourseCard {...course} />
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
          <div className="text-center mb-12 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Lộ trình học tập{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                dành riêng cho bạn
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dựa trên kết quả khảo sát và đánh giá năng lực, chúng tôi đã tạo ra lộ trình học tập 
              phù hợp nhất để giúp bạn đạt được mục tiêu nghề nghiệp.
            </p>
          </div>

          {/* Section 1: Foundation Courses */}
          <div className="mb-16 relative">
            {/* Background Highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-25 to-transparent dark:from-blue-900/10 dark:via-blue-800/5 dark:to-transparent rounded-3xl -m-4"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-blue-700 dark:text-blue-400 mb-2 drop-shadow-lg">
                        Lộ trình khởi đầu
                      </h2>
                      {/* <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mb-3 shadow-sm"></div> */}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Các môn học nền tảng bắt buộc từ kỳ 1 đến kỳ 4
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-blue-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <div className="relative z-10">
              <SemesterSection 
                semester="1" 
                courses={mockFoundationCourses.semester1} 
                title="Kỳ 1 - Nhập môn" 
              />
              <SemesterSection 
                semester="2" 
                courses={mockFoundationCourses.semester2} 
                title="Kỳ 2 - Cơ sở" 
              />
              <SemesterSection 
                semester="3" 
                courses={mockFoundationCourses.semester3} 
                title="Kỳ 3 - Nâng cao" 
              />
              <SemesterSection 
                semester="4" 
                courses={mockFoundationCourses.semester4} 
                title="Kỳ 4 - Ứng dụng" 
              />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Specialization Courses */}
          <div className="mb-16 relative">
            {/* Background Highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-25 to-transparent dark:from-green-900/10 dark:via-emerald-800/5 dark:to-transparent rounded-3xl -m-4"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-green-700 dark:text-green-400 mb-2 drop-shadow-lg">
                        Chuyên ngành hẹp phù hợp
                      </h2>
                      {/* <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mb-3 shadow-sm"></div> */}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      AI đề xuất các chuyên ngành hẹp phù hợp với năng lực và sở thích của bạn
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {mockSpecializations.map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`relative cursor-pointer rounded-xl p-4 transition-all duration-300 transform hover:scale-105 ${
                      selectedSpecialization.id === spec.id
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/50'
                        : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {/* Selection Indicator */}
                    {selectedSpecialization.id === spec.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      selectedSpecialization.id === spec.id 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      <span className="text-2xl">{spec.icon}</span>
                    </div>
                    
                    {/* Content */}
                    <div>
                      <h3 className={`font-bold text-lg mb-1.5 ${
                        selectedSpecialization.id === spec.id 
                          ? 'text-white' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {spec.name}
                      </h3>
                      <p className={`text-xs leading-relaxed ${
                        selectedSpecialization.id === spec.id 
                          ? 'text-white/90' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {spec.description}
                      </p>
                    </div>
                    
                    {/* Bottom Accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl ${
                      selectedSpecialization.id === spec.id 
                        ? 'bg-white/30' 
                        : 'bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100'
                    }`}></div>
                  </div>
                ))}
              </div>

              {/* Selected Specialization Courses */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">{selectedSpecialization.icon}</span>
                  Lộ trình {selectedSpecialization.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedSpecialization.courses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                  ))}
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Courses */}
          <div className="mb-16 relative">
            {/* Background Highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-violet-25 to-transparent dark:from-purple-900/10 dark:via-violet-800/5 dark:to-transparent rounded-3xl -m-4"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full"></div>
                  <div className="pl-6">
                    <div className="inline-block">
                      <h2 className="text-3xl font-black text-purple-700 dark:text-purple-400 mb-2 drop-shadow-lg">
                        Đề xuất các khóa học bên ngoài
                      </h2>
                      {/* <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full mb-3 shadow-sm"></div> */}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Các khóa học từ các nền tảng uy tín để nâng cao kỹ năng chuyên môn
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-100 dark:bg-purple-900/20 rounded-full transform translate-x-18 -translate-y-18"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-50 dark:bg-violet-900/10 rounded-full transform -translate-x-16 translate-y-16"></div>
                <div className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
                {mockAdditionalCourses.map((course, index) => (
                  <div key={index} className="relative transform hover:scale-105 transition-transform duration-300 flex justify-center">
                    {course.isExternal && (
                      <div className="absolute top-3 right-3 z-10 bg-purple-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                        {course.platform}
                      </div>
                    )}
                    <div className="w-full max-w-sm">
                      <CourseCard {...course} />
                    </div>
                  </div>
                ))}
              </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {/* <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Sẵn sàng bắt đầu hành trình học tập?</h3>
              <p className="text-blue-100 mb-6">
                Hãy bắt đầu với các khóa học nền tảng và tiến tới chuyên ngành mơ ước của bạn
              </p>
              <Button 
                size="large" 
                onClick={handleGoHome}
                className="bg-white text-blue-600 border-none hover:bg-gray-100 px-8 py-3 h-auto font-semibold rounded-xl"
                icon={<FiBookOpen className="w-5 h-5" />}
              >
                Bắt đầu học ngay
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </BaseScreenAdmin>
  );
}
