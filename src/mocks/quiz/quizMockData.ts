// File mock data cho quiz
import {
    QuizSeries,
    QuestionType,
    UserAnswer,
    QuizStatus,
    Question,
    Quiz,
} from "EduSmart/types";

// ======================== EXTENDED TYPES FOR MOCK DATA ========================
// Extended interfaces với các thuộc tính bổ sung cho mock data
interface MockQuestion extends Question {
    isRequired?: boolean; // Câu hỏi bắt buộc hay tùy chọn
    explanation?: string; // Giải thích đáp án
    order?: number; // Thứ tự câu hỏi
}

interface MockQuiz extends Omit<Quiz, "questions"> {
    questions: MockQuestion[];
    isSelected?: boolean; // User đã chọn quiz này chưa (cho UI state)
    passingScore?: number; // Điểm đạt (cho business logic)
    timeLimitMinutes?: number; // Thời gian giới hạn
}

interface MockQuizSeries extends Omit<QuizSeries, "quizzes"> {
    quizzes: MockQuiz[];
    passingScore?: number; // Điểm đạt cho toàn series
    timeLimitMinutes?: number; // Thời gian giới hạn cho toàn series
}

// Export extended types for external use
export type { MockQuestion, MockQuiz, MockQuizSeries };

const seriesOOPQuizzes: MockQuiz[] = [
    {
        id: "quiz-oop-core",
        title: "OOP Cơ bản",
        description:
            "Đây là bài test OOP với mục tiêu đánh giá kiến thức nền tảng về OOP.",
        status: QuizStatus.NOT_STARTED,
        isSelected: false, // User chưa chọn quiz này
        passingScore: 60,
        timeLimitMinutes: 20,
        questions: [
            // 1
            {
                id: "q1",
                text: "Câu 1: Tính năng nào của OOP thể hiện khả năng tái sử dụng mã nguồn?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Trừu tượng hoá (Abstraction)" },
                    { id: "a2", text: "Đa hình (Polymorphism)" },
                    { id: "a3", text: "Đóng gói (Encapsulation)" },
                    { id: "a4", text: "Kế thừa (Inheritance)" },
                ],
                isRequired: true,
                explanation:
                    "Kế thừa cho phép lớp con dùng lại thuộc tính/phương thức của lớp cha, giảm lặp code.",
                order: 1,
            },
            // 2
            {
                id: "q2",
                text: "Câu 2: Khái niệm nào giúp che giấu chi tiết cài đặt và chỉ lộ ra giao diện cần thiết?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Đa hình (Polymorphism)" },
                    { id: "a2", text: "Đóng gói (Encapsulation)" },
                    { id: "a3", text: "Kế thừa (Inheritance)" },
                    { id: "a4", text: "Trừu tượng hoá (Abstraction)" },
                ],
                isRequired: true,
                explanation:
                    "Trừu tượng hoá tập trung vào 'cái gì' thay vì 'như thế nào', ẩn đi phần triển khai.",
                order: 2,
            },
            // 3
            {
                id: "q3",
                text: "Câu 3: Phát biểu nào mô tả đúng về đa hình (Polymorphism)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Cùng một lời gọi phương thức có thể thực thi khác nhau tuỳ đối tượng cụ thể tại runtime",
                    },
                    {
                        id: "a2",
                        text: "Một lớp chỉ có duy nhất một constructor",
                    },
                    {
                        id: "a3",
                        text: "Thuộc tính chỉ nhìn thấy trong cùng lớp",
                    },
                    { id: "a4", text: "Một lớp có thể có nhiều lớp cha" },
                ],
                isRequired: true,
                explanation:
                    "Đa hình cho phép chọn phương thức thực thi dựa trên kiểu đối tượng thực tế (dynamic dispatch).",
                order: 3,
            },
            // 4
            {
                id: "q4",
                text: "Câu 4: Overriding (ghi đè phương thức) là gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Định nghĩa nhiều phương thức cùng tên khác tham số",
                    },
                    {
                        id: "a2",
                        text: "Định nghĩa lại phương thức của lớp cha ở lớp con",
                    },
                    { id: "a3", text: "Ẩn thuộc tính của lớp cha" },
                    { id: "a4", text: "Tạo đối tượng từ interface" },
                ],
                isRequired: true,
                explanation:
                    "Overriding: lớp con cung cấp triển khai mới cho phương thức đã có ở lớp cha.",
                order: 4,
            },
            // 5
            {
                id: "q5",
                text: "Câu 5: Access modifier nào giới hạn quyền truy cập chỉ trong nội bộ chính lớp đó?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "public" },
                    { id: "a2", text: "protected" },
                    { id: "a3", text: "private" },
                    { id: "a4", text: "internal/package" },
                ],
                isRequired: true,
                explanation:
                    "`private` chỉ truy cập được trong chính lớp khai báo, giúp đóng gói dữ liệu.",
                order: 5,
            },
            // 6
            {
                id: "q6",
                text: "Câu 6: Phát biểu nào mô tả đúng về quan hệ 'has-a' giữa các lớp?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Đa hình" },
                    { id: "a2", text: "Kế thừa (is-a)" },
                    {
                        id: "a3",
                        text: "Kết hợp/Thành phần (Composition/Aggregation)",
                    },
                    { id: "a4", text: "Trừu tượng hoá" },
                ],
                isRequired: true,
                explanation:
                    "Quan hệ 'has-a' thường được cài đặt bằng composition/aggregation: một đối tượng chứa đối tượng khác.",
                order: 6,
            },
            // 7
            {
                id: "q7",
                text: "Câu 7: Mục đích chính của constructor trong một lớp là gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Ghi đè phương thức của lớp cha" },
                    {
                        id: "a2",
                        text: "Khởi tạo trạng thái ban đầu cho đối tượng",
                    },
                    { id: "a3", text: "Ẩn thông tin triển khai" },
                    { id: "a4", text: "Tạo interface" },
                ],
                isRequired: true,
                explanation:
                    "Constructor dùng để khởi tạo thuộc tính, đảm bảo đối tượng ở trạng thái hợp lệ ngay khi tạo.",
                order: 7,
            },
            // 8
            {
                id: "q8",
                text: "Câu 8: Phát biểu đúng về sự khác nhau giữa Abstract Class và Interface?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Abstract class chỉ chứa phương thức trừu tượng, không có phương thức cài đặt",
                    },
                    {
                        id: "a2",
                        text: "Interface cho phép định nghĩa hợp đồng; abstract class có thể chứa cả cài đặt lẫn phương thức trừu tượng",
                    },
                    {
                        id: "a3",
                        text: "Interface luôn nhanh hơn abstract class",
                    },
                    {
                        id: "a4",
                        text: "Abstract class không thể kế thừa lớp khác",
                    },
                ],
                isRequired: true,
                explanation:
                    "Interface định nghĩa 'hợp đồng'; abstract class có thể cung cấp sẵn một phần cài đặt + phương thức trừu tượng.",
                order: 8,
            },
            // 9
            {
                id: "q9",
                text: "Câu 9: Khi nào xảy ra dynamic dispatch trong OOP?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Khi chọn phương thức thực thi dựa trên kiểu đối tượng thực tại thời điểm chạy",
                    },
                    { id: "a2", text: "Khi biên dịch chương trình" },
                    { id: "a3", text: "Khi nạp lớp vào bộ nhớ" },
                    { id: "a4", text: "Khi khởi tạo biến cục bộ" },
                ],
                isRequired: true,
                explanation:
                    "Dynamic dispatch quyết định phương thức cụ thể tại runtime, nền tảng của đa hình.",
                order: 9,
            },
            // 10 (MULTIPLE CHOICE)
            {
                id: "q10",
                text: "Câu 10: Chọn các nguyên lý thuộc bộ SOLID (có thể chọn nhiều đáp án).",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "a1", text: "Single Responsibility Principle" },
                    { id: "a2", text: "Keep It Simple, Stupid (KISS)" },
                    { id: "a3", text: "Open/Closed Principle" },
                    { id: "a4", text: "Don't Repeat Yourself (DRY)" },
                ],
                isRequired: true,
                explanation:
                    "SOLID gồm: SRP, OCP, LSP, ISP, DIP. KISS/DRY là guideline khác, không thuộc SOLID.",
                order: 10,
            },
            // 11 (Optional question)
            {
                id: "q11",
                text: "Câu 11: Mẫu thiết kế nào giúp tạo đối tượng mà không lộ lớp cụ thể cho phía gọi?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Singleton" },
                    { id: "a2", text: "Factory Method" },
                    { id: "a3", text: "Observer" },
                    { id: "a4", text: "Decorator" },
                ],
                isRequired: false, // ❌ Optional question để test validation
                explanation:
                    "Factory Method/Factory ẩn chi tiết lớp cụ thể, chỉ trả về interface/abstraction.",
                order: 11,
            },
        ],
    },
];

const seriesDatabaseQuizzes: MockQuiz[] = [
    {
        id: "quiz-db-core",
        title: "Cơ bản về Cơ sở dữ liệu",
        description:
            "Quiz này kiểm tra kiến thức nền tảng về hệ quản trị cơ sở dữ liệu.",
        status: QuizStatus.NOT_STARTED,
        isSelected: false, // User chưa chọn quiz này
        passingScore: 60,
        timeLimitMinutes: 20,
        questions: [
            // 1
            {
                id: "q1",
                text: "Câu 1: SQL viết tắt của cụm từ nào?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Structured Query Language" },
                    { id: "a2", text: "Sequential Query Logic" },
                    { id: "a3", text: "System Query Level" },
                    { id: "a4", text: "Standard Question Language" },
                ],
                isRequired: true,
                explanation:
                    "SQL = Structured Query Language, ngôn ngữ truy vấn có cấu trúc.",
                order: 1,
            },
            // 2
            {
                id: "q2",
                text: "Câu 2: Khoá chính (Primary Key) có đặc điểm nào?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Có thể null" },
                    { id: "a2", text: "Có thể trùng lặp" },
                    { id: "a3", text: "Không null, không trùng lặp" },
                    { id: "a4", text: "Tự động sắp xếp bản ghi" },
                ],
                isRequired: true,
                explanation: "Primary key đảm bảo tính duy nhất và không null.",
                order: 2,
            },
            // 3
            {
                id: "q3",
                text: "Câu 3: Câu lệnh nào dùng để thêm bản ghi mới vào bảng?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "INSERT INTO" },
                    { id: "a2", text: "UPDATE" },
                    { id: "a3", text: "ALTER TABLE" },
                    { id: "a4", text: "SELECT INTO" },
                ],
                isRequired: true,
                explanation: "`INSERT INTO` dùng để thêm bản ghi vào bảng.",
                order: 3,
            },
            // 4
            {
                id: "q4",
                text: "Câu 4: Từ khoá nào trong SQL dùng để lọc kết quả theo điều kiện?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "ORDER BY" },
                    { id: "a2", text: "GROUP BY" },
                    { id: "a3", text: "WHERE" },
                    { id: "a4", text: "HAVING" },
                ],
                isRequired: true,
                explanation:
                    "`WHERE` dùng để lọc bản ghi trước khi nhóm/tính toán.",
                order: 4,
            },
            // 5
            {
                id: "q5",
                text: "Câu 5: Quan hệ 1-N (one-to-many) thường được biểu diễn qua đâu?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Khóa chính – khóa ngoại" },
                    { id: "a2", text: "Hai khóa chính" },
                    { id: "a3", text: "Một trường tự tăng" },
                    { id: "a4", text: "Bảng tạm" },
                ],
                isRequired: true,
                explanation:
                    "Quan hệ 1-N biểu diễn bằng primary key ở bảng cha và foreign key ở bảng con.",
                order: 5,
            },
            // 6 (MULTIPLE CHOICE)
            {
                id: "q6",
                text: "Câu 6: Chọn tất cả các từ khoá thuộc nhóm thao tác DML (Data Manipulation Language).",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "a1", text: "SELECT" },
                    { id: "a2", text: "INSERT" },
                    { id: "a3", text: "UPDATE" },
                    { id: "a4", text: "CREATE" },
                ],
                isRequired: true,
                explanation:
                    "DML gồm SELECT, INSERT, UPDATE, DELETE. CREATE thuộc DDL.",
                order: 6,
            },
            // 7
            {
                id: "q7",
                text: "Câu 7: Chỉ mục (Index) trong cơ sở dữ liệu giúp gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Tăng tốc truy vấn tìm kiếm" },
                    { id: "a2", text: "Giảm dung lượng lưu trữ" },
                    { id: "a3", text: "Tránh dữ liệu trùng lặp" },
                    { id: "a4", text: "Tự động tạo backup" },
                ],
                isRequired: true,
                explanation:
                    "Index cải thiện hiệu suất truy vấn nhưng tốn thêm bộ nhớ.",
                order: 7,
            },
            // 8
            {
                id: "q8",
                text: "Câu 8: Câu lệnh nào dùng để thay đổi cấu trúc bảng?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "UPDATE" },
                    { id: "a2", text: "ALTER TABLE" },
                    { id: "a3", text: "TRUNCATE" },
                    { id: "a4", text: "DROP" },
                ],
                isRequired: true,
                explanation:
                    "`ALTER TABLE` dùng để thêm/sửa/xoá cột, thay đổi ràng buộc bảng.",
                order: 8,
            },
            // 9
            {
                id: "q9",
                text: "Câu 9: SQL constraint nào đảm bảo giá trị của cột phải thoả mãn điều kiện cho trước?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "CHECK" },
                    { id: "a2", text: "DEFAULT" },
                    { id: "a3", text: "UNIQUE" },
                    { id: "a4", text: "FOREIGN KEY" },
                ],
                isRequired: true,
                explanation:
                    "`CHECK` đảm bảo dữ liệu nhập phải thoả mãn điều kiện nhất định.",
                order: 9,
            },
            // 10 (MULTIPLE CHOICE)
            {
                id: "q10",
                text: "Câu 10: Chọn các loại JOIN trong SQL (có thể chọn nhiều đáp án).",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "a1", text: "INNER JOIN" },
                    { id: "a2", text: "OUTER JOIN" },
                    { id: "a3", text: "CROSS JOIN" },
                    { id: "a4", text: "SELF JOIN" },
                ],
                isRequired: true,
                explanation: "SQL có INNER, OUTER, CROSS, SELF JOIN.",
                order: 10,
            },
            // 11 (Optional question)
            {
                id: "q11",
                text: "Câu 11: Phát biểu nào đúng về Transaction trong cơ sở dữ liệu?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Transaction chỉ có thể chứa một câu lệnh SQL",
                    },
                    { id: "a2", text: "Transaction đảm bảo tính ACID" },
                    { id: "a3", text: "Transaction không thể rollback" },
                    {
                        id: "a4",
                        text: "Transaction chỉ áp dụng cho việc đọc dữ liệu",
                    },
                ],
                isRequired: false, // ❌ Optional question để test validation
                explanation:
                    "Transaction đảm bảo tính Atomicity, Consistency, Isolation, và Durability (ACID).",
                order: 11,
            },
        ],
    },
];

const seriesNetworkQuizzes: MockQuiz[] = [
    {
        id: "quiz-network-core",
        title: "Mạng Máy Tính Cơ bản",
        description:
            "Bài test này kiểm tra kiến thức nền tảng về mạng, từ mô hình OSI đến các giao thức và thiết bị.",
        status: QuizStatus.NOT_STARTED,
        isSelected: false, // User chưa chọn quiz này
        passingScore: 60,
        timeLimitMinutes: 20,
        questions: [
            // 1
            {
                id: "n1",
                text: "Câu 1: Lớp nào trong mô hình OSI chịu trách nhiệm chuyển đổi dữ liệu thành các khung (frames)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Lớp vật lý (Physical Layer)" },
                    {
                        id: "a2",
                        text: "Lớp liên kết dữ liệu (Data Link Layer)",
                    },
                    { id: "a3", text: "Lớp mạng (Network Layer)" },
                    { id: "a4", text: "Lớp giao vận (Transport Layer)" },
                ],
                isRequired: true,
                explanation:
                    "Lớp liên kết dữ liệu chia luồng bit thành các frame và quản lý truy cập vào đường truyền (MAC address).",
                order: 1,
            },
            // 2
            {
                id: "n2",
                text: "Câu 2: Giao thức nào cung cấp kết nối đáng tin cậy (reliable) và có định hướng kết nối (connection-oriented)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "UDP" },
                    { id: "a2", text: "IP" },
                    { id: "a3", text: "TCP" },
                    { id: "a4", text: "HTTP" },
                ],
                isRequired: true,
                explanation:
                    "TCP (Transmission Control Protocol) đảm bảo dữ liệu được gửi đi một cách tin cậy và theo đúng thứ tự.",
                order: 2,
            },
            // 3
            {
                id: "n3",
                text: "Câu 3: Địa chỉ nào dùng để nhận dạng duy nhất một thiết bị trên mạng cục bộ (LAN)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Địa chỉ IP" },
                    { id: "a2", text: "Địa chỉ cổng (Port)" },
                    { id: "a3", text: "Địa chỉ MAC" },
                    { id: "a4", text: "Địa chỉ URI" },
                ],
                isRequired: true,
                explanation:
                    "Địa chỉ MAC (Media Access Control) là địa chỉ vật lý duy nhất được gán cho card mạng.",
                order: 3,
            },
            // 4
            {
                id: "n4",
                text: "Câu 4: Chức năng chính của bộ định tuyến (router) là gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Kết nối nhiều thiết bị vào một mạng" },
                    {
                        id: "a2",
                        text: "Phân giải tên miền thành địa chỉ IP",
                    },
                    {
                        id: "a3",
                        text: "Chuyển tiếp gói tin giữa các mạng khác nhau",
                    },
                    { id: "a4", text: "Tạo tường lửa bảo vệ" },
                ],
                isRequired: true,
                explanation:
                    "Router hoạt động ở lớp mạng (Layer 3), dùng để định tuyến gói tin giữa các mạng con.",
                order: 4,
            },
            // 5
            {
                id: "n5",
                text: "Câu 5: Giao thức nào giúp gán địa chỉ IP động (dynamic IP) cho các thiết bị trong mạng?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "FTP" },
                    { id: "a2", text: "DNS" },
                    { id: "a3", text: "DHCP" },
                    { id: "a4", text: "HTTP" },
                ],
                isRequired: true,
                explanation:
                    "DHCP (Dynamic Host Configuration Protocol) tự động gán địa chỉ IP, subnet mask và gateway cho các thiết bị.",
                order: 5,
            },
            // 6 (MULTIPLE CHOICE)
            {
                id: "n6",
                text: "Câu 6: Chọn các giao thức thuộc lớp ứng dụng (Application Layer) của mô hình TCP/IP.",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "a1", text: "HTTP" },
                    { id: "a2", text: "DNS" },
                    { id: "a3", text: "IP" },
                    { id: "a4", text: "SMTP" },
                ],
                isRequired: true,
                explanation:
                    "HTTP, DNS, và SMTP là các giao thức được người dùng cuối tương tác trực tiếp, thuộc lớp ứng dụng. IP thuộc lớp mạng.",
                order: 6,
            },
            // 7
            {
                id: "n7",
                text: "Câu 7: Thiết bị nào hoạt động ở lớp liên kết dữ liệu (Data Link Layer) và có thể học địa chỉ MAC?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Hub" },
                    { id: "a2", text: "Switch" },
                    { id: "a3", text: "Router" },
                    { id: "a4", text: "Modem" },
                ],
                isRequired: true,
                explanation:
                    "Switch học và lưu trữ địa chỉ MAC để chuyển tiếp frame đến đúng cổng, giảm thiểu xung đột mạng.",
                order: 7,
            },
            // 8
            {
                id: "n8",
                text: "Câu 8: Sự khác biệt chính giữa mô hình OSI và TCP/IP là gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "OSI có nhiều lớp hơn và mang tính lý thuyết, TCP/IP thực tế hơn",
                    },
                    {
                        id: "a2",
                        text: "OSI chỉ dùng cho mạng LAN, TCP/IP dùng cho mạng WAN",
                    },
                    {
                        id: "a3",
                        text: "TCP/IP bảo mật hơn OSI",
                    },
                    {
                        id: "a4",
                        text: "OSI chỉ dùng cho Windows, TCP/IP dùng cho Linux",
                    },
                ],
                isRequired: true,
                explanation:
                    "Mô hình OSI có 7 lớp và là một khung lý thuyết. TCP/IP có 4-5 lớp, được sử dụng rộng rãi trong thực tế.",
                order: 8,
            },
            // 9
            {
                id: "n9",
                text: "Câu 9: Giao thức nào dùng để truyền tải các tập tin qua mạng?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "FTP (File Transfer Protocol)" },
                    {
                        id: "a2",
                        text: "ICMP (Internet Control Message Protocol)",
                    },
                    { id: "a3", text: "ARP (Address Resolution Protocol)" },
                    { id: "a4", text: "SMTP (Simple Mail Transfer Protocol)" },
                ],
                isRequired: true,
                explanation:
                    "FTP được thiết kế chuyên biệt cho việc truyền và nhận file giữa client và server.",
                order: 9,
            },
            // 10 (MULTIPLE CHOICE)
            {
                id: "n10",
                text: "Câu 10: Chọn hai giao thức chính của lớp giao vận (Transport Layer).",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "a1", text: "HTTP" },
                    { id: "a2", text: "TCP" },
                    { id: "a3", text: "IP" },
                    { id: "a4", text: "UDP" },
                ],
                isRequired: true,
                explanation:
                    "Lớp giao vận xử lý việc truyền dữ liệu giữa các tiến trình, với hai giao thức chính là TCP (đáng tin cậy) và UDP (không đáng tin cậy, nhanh).",
                order: 10,
            },
            // 11 (Optional question)
            {
                id: "n11",
                text: "Câu 11: Giao thức nào được sử dụng để kiểm tra kết nối mạng (ping)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "ICMP" },
                    { id: "a2", text: "ARP" },
                    { id: "a3", text: "RARP" },
                    { id: "a4", text: "SNMP" },
                ],
                isRequired: false, // ❌ Optional question để test validation
                explanation:
                    "ICMP (Internet Control Message Protocol) được sử dụng cho các thông điệp điều khiển như ping, traceroute.",
                order: 11,
            },
        ],
    },
];

const seriesDataStructuresQuizzes: MockQuiz[] = [
    {
        id: "quiz-data-structures-algorithms",
        title: "Cấu trúc dữ liệu & Giải thuật",
        description:
            "Bài test này kiểm tra kiến thức nền tảng về các cấu trúc dữ liệu và độ phức tạp của giải thuật.",
        status: QuizStatus.NOT_STARTED,
        isSelected: false, // User chưa chọn quiz này
        passingScore: 65,
        timeLimitMinutes: 20,
        questions: [
            // 1
            {
                id: "ds-1",
                text: "Câu 1: Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Last-In, First-Out)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Queue" },
                    { id: "a2", text: "Stack" },
                    { id: "a3", text: "Array" },
                    { id: "a4", text: "Linked List" },
                ],
                isRequired: true,
                explanation:
                    "Stack hoạt động như một chồng đĩa, phần tử được thêm vào cuối cùng sẽ được lấy ra đầu tiên.",
                order: 1,
            },
            // 2
            {
                id: "ds-2",
                text: "Câu 2: Cấu trúc dữ liệu nào có thời gian truy cập ngẫu nhiên (random access) là O(1)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Linked List" },
                    { id: "a2", text: "Stack" },
                    { id: "a3", text: "Array" },
                    { id: "a4", text: "Binary Search Tree" },
                ],
                isRequired: true,
                explanation:
                    "Mảng (Array) cho phép truy cập bất kỳ phần tử nào bằng chỉ số trong thời gian hằng số.",
                order: 2,
            },
            // 3
            {
                id: "ds-3",
                text: "Câu 3: Phát biểu nào sau đây mô tả đúng về một Binary Search Tree (BST)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Mỗi node có thể có nhiều hơn 2 node con",
                    },
                    {
                        id: "a2",
                        text: "Tất cả các node con bên trái của một node đều nhỏ hơn node đó, và tất cả các node con bên phải đều lớn hơn",
                    },
                    {
                        id: "a3",
                        text: "Các node được lưu trữ theo thứ tự chèn vào",
                    },
                    { id: "a4", text: "Cây luôn cân bằng hoàn hảo" },
                ],
                isRequired: true,
                explanation:
                    "Đặc điểm chính của BST là duy trì một thứ tự sắp xếp nhất định cho các node.",
                order: 3,
            },
            // 4
            {
                id: "ds-4",
                text: "Câu 4: Độ phức tạp thời gian (time complexity) để tìm kiếm một phần tử trong một mảng đã sắp xếp sử dụng thuật toán tìm kiếm nhị phân (Binary Search) là gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "O(n)" },
                    { id: "a2", text: "O(log n)" },
                    { id: "a3", text: "O(n^2)" },
                    { id: "a4", text: "O(1)" },
                ],
                isRequired: true,
                explanation:
                    "Binary Search loại bỏ một nửa số phần tử cần tìm sau mỗi lần lặp, do đó độ phức tạp là logarit.",
                order: 4,
            },
            // 5
            {
                id: "ds-5",
                text: "Câu 5: Cấu trúc dữ liệu nào phù hợp nhất để triển khai một hệ thống quản lý tác vụ (task manager) nơi các tác vụ được thực hiện theo thứ tự FCFS (First-Come, First-Served)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Stack" },
                    { id: "a2", text: "Queue" },
                    { id: "a3", text: "Array" },
                    { id: "a4", text: "Hash Table" },
                ],
                isRequired: true,
                explanation:
                    "Queue (hàng đợi) hoạt động theo nguyên tắc FIFO, giống như một hàng người đợi.",
                order: 5,
            },
            // 6 (MULTIPLE CHOICE)
            {
                id: "ds-6",
                text: "Câu 6: Chọn những đặc điểm của một danh sách liên kết (Linked List).",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    {
                        id: "a1",
                        text: "Lưu trữ các phần tử ở các vị trí bộ nhớ không liền kề",
                    },
                    { id: "a2", text: "Truy cập ngẫu nhiên hiệu quả O(1)" },
                    {
                        id: "a3",
                        text: "Thao tác thêm/xóa phần tử hiệu quả hơn mảng",
                    },
                    { id: "a4", text: "Cần biết kích thước cố định từ trước" },
                ],
                isRequired: true,
                explanation:
                    "Linked List sử dụng con trỏ để liên kết các node, cho phép lưu trữ phân tán và thêm/xóa nhanh.",
                order: 6,
            },
            // 7
            {
                id: "ds-7",
                text: "Câu 7: Thuật toán sắp xếp nào có độ phức tạp thời gian trung bình (average-case) là O(n log n)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Bubble Sort" },
                    { id: "a2", text: "Quick Sort" },
                    { id: "a3", text: "Selection Sort" },
                    { id: "a4", text: "Insertion Sort" },
                ],
                isRequired: true,
                explanation:
                    "Quick Sort có độ phức tạp trung bình O(n log n), nhưng trong trường hợp xấu nhất có thể lên O(n^2).",
                order: 7,
            },
            // 8
            {
                id: "ds-8",
                text: "Câu 8: Thuật toán sắp xếp nào có độ phức tạp thời gian tốt nhất trong trường hợp xấu nhất (worst-case) là O(n log n)?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Bubble Sort" },
                    { id: "a2", text: "Quick Sort" },
                    { id: "a3", text: "Merge Sort" },
                    { id: "a4", text: "Insertion Sort" },
                ],
                isRequired: true,
                explanation:
                    "Merge Sort luôn có độ phức tạp O(n log n) trong mọi trường hợp, trong khi Quick Sort có thể lên đến O(n^2) trong trường hợp xấu nhất.",
                order: 8,
            },
            // 9
            {
                id: "ds-9",
                text: "Câu 9: Hash Table (Bảng băm) có ưu điểm gì trong việc tìm kiếm dữ liệu?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Luôn sắp xếp dữ liệu theo thứ tự" },
                    {
                        id: "a2",
                        text: "Tìm kiếm với độ phức tạp trung bình O(1)",
                    },
                    { id: "a3", text: "Sử dụng ít bộ nhớ nhất" },
                    {
                        id: "a4",
                        text: "Không bao giờ xảy ra xung đột (collision)",
                    },
                ],
                isRequired: true,
                explanation:
                    "Hash Table sử dụng hàm băm để ánh xạ key thành index, cho phép truy cập trực tiếp với độ phức tạp O(1) trong trường hợp lý tưởng.",
                order: 9,
            },
            // 10 (MULTIPLE CHOICE)
            {
                id: "ds-10",
                text: "Câu 10: Chọn các đặc điểm của thuật toán Depth-First Search (DFS).",
                type: QuestionType.MULTIPLE_CHOICE,
                options: [
                    { id: "a1", text: "Sử dụng Stack hoặc đệ quy" },
                    { id: "a2", text: "Luôn tìm được đường đi ngắn nhất" },
                    { id: "a3", text: "Duyệt theo chiều sâu trước" },
                    { id: "a4", text: "Sử dụng Queue để lưu trữ" },
                ],
                isRequired: true,
                explanation:
                    "DFS sử dụng Stack (hoặc đệ quy) và duyệt theo chiều sâu. BFS mới sử dụng Queue và tìm đường đi ngắn nhất.",
                order: 10,
            },
            // 11 (Optional question)
            {
                id: "ds-11",
                text: "Câu 11: Độ phức tạp không gian (space complexity) của một giải thuật thể hiện điều gì?",
                type: QuestionType.SINGLE_CHOICE,
                options: [
                    { id: "a1", text: "Thời gian chạy của giải thuật" },
                    { id: "a2", text: "Lượng bộ nhớ mà giải thuật sử dụng" },
                    { id: "a3", text: "Số lần lặp lại của giải thuật" },
                    { id: "a4", text: "Độ khó của giải thuật" },
                ],
                isRequired: false, // ❌ Optional question để test validation
                explanation:
                    "Độ phức tạp không gian đo lường lượng bộ nhớ cần thiết để giải thuật chạy hoàn tất, bao gồm cả bộ nhớ tạm thời.",
                order: 11,
            },
        ],
    },
];

// ================ Exported Mock Data =================//
// MOCK DATA cho toàn bộ quiz series
export const sampleQuizSeries: MockQuizSeries = {
    id: "series-1",
    title: "Mini Series Kiểm Tra Nền Tảng IT",
    description: "Gồm 4 quiz nhỏ để kiểm tra kiến thức cơ bản IT.",
    passingScore: 60,
    timeLimitMinutes: 60,
    quizzes: [
        ...seriesOOPQuizzes,
        ...seriesDatabaseQuizzes,
        ...seriesNetworkQuizzes,
        ...seriesDataStructuresQuizzes,
    ],
};

// MOCK DATA cho quiz selection scenarios
export const sampleQuizSeriesWithSelections: MockQuizSeries = {
    ...sampleQuizSeries,
    id: "series-1-selected",
    quizzes: [
        {
            ...seriesOOPQuizzes[0],
            isSelected: true, // ✅ User chọn làm quiz này
            status: QuizStatus.SELECTED,
        },
        {
            ...seriesDatabaseQuizzes[0],
            isSelected: false, // ❌ User không chọn quiz này
            status: QuizStatus.SKIPPED,
        },
        {
            ...seriesNetworkQuizzes[0],
            isSelected: true, // ✅ User chọn làm quiz này
            status: QuizStatus.SELECTED,
        },
        {
            ...seriesDataStructuresQuizzes[0],
            isSelected: true, // ✅ User chọn làm quiz này
            status: QuizStatus.SELECTED,
        },
    ],
};

// MOCKING ANSWERS BY QUIZ
export const sampleQuizAnswers: Record<string, UserAnswer[]> = {
    "quiz-oop-core": [
        { questionId: "q1", selectedOptions: ["a4"] }, // Inheritance
        { questionId: "q2", selectedOptions: ["a4"] }, // Abstraction
        { questionId: "q3", selectedOptions: ["a1"] }, // Polymorphism
        { questionId: "q4", selectedOptions: ["a2"] }, // Overriding
        { questionId: "q5", selectedOptions: ["a3"] }, // private
        { questionId: "q6", selectedOptions: ["a3"] }, // Composition
        { questionId: "q7", selectedOptions: ["a2"] }, // Constructor
        { questionId: "q8", selectedOptions: ["a2"] }, // Interface vs Abstract
        { questionId: "q9", selectedOptions: ["a1"] }, // Dynamic dispatch
        { questionId: "q10", selectedOptions: ["a1", "a3"] }, // SOLID: SRP, OCP
        { questionId: "q11", selectedOptions: ["a2"] }, // Factory Method (optional)
    ],
    "quiz-db-core": [
        { questionId: "q1", selectedOptions: ["a1"] }, // SQL
        { questionId: "q2", selectedOptions: ["a3"] }, // Primary Key
        { questionId: "q3", selectedOptions: ["a1"] }, // INSERT INTO
        { questionId: "q4", selectedOptions: ["a3"] }, // WHERE
        { questionId: "q5", selectedOptions: ["a1"] }, // 1-N relationship
        { questionId: "q6", selectedOptions: ["a1", "a2", "a3"] }, // DML (SELECT, INSERT, UPDATE)
        { questionId: "q7", selectedOptions: ["a1"] }, // Index
        { questionId: "q8", selectedOptions: ["a2"] }, // ALTER TABLE
        { questionId: "q9", selectedOptions: ["a1"] }, // CHECK constraint
        { questionId: "q10", selectedOptions: ["a1", "a2", "a3", "a4"] }, // All JOIN types
        { questionId: "q11", selectedOptions: ["a2"] }, // ACID (optional)
    ],
    "quiz-network-core": [
        { questionId: "n1", selectedOptions: ["a2"] }, // Data Link Layer
        { questionId: "n2", selectedOptions: ["a3"] }, // TCP
        { questionId: "n3", selectedOptions: ["a3"] }, // MAC address
        { questionId: "n4", selectedOptions: ["a3"] }, // Router function
        { questionId: "n5", selectedOptions: ["a3"] }, // DHCP
        { questionId: "n6", selectedOptions: ["a1", "a2", "a4"] }, // Application Layer (HTTP, DNS, SMTP)
        { questionId: "n7", selectedOptions: ["a2"] }, // Switch
        { questionId: "n8", selectedOptions: ["a1"] }, // OSI vs TCP/IP
        { questionId: "n9", selectedOptions: ["a1"] }, // FTP
        { questionId: "n10", selectedOptions: ["a2", "a4"] }, // Transport Layer (TCP, UDP)
        { questionId: "n11", selectedOptions: ["a1"] }, // ICMP (optional)
    ],
    "quiz-data-structures-algorithms": [
        { questionId: "ds-1", selectedOptions: ["a2"] }, // Stack LIFO
        { questionId: "ds-2", selectedOptions: ["a3"] }, // Array O(1)
        { questionId: "ds-3", selectedOptions: ["a2"] }, // BST properties
        { questionId: "ds-4", selectedOptions: ["a2"] }, // Binary Search O(log n)
        { questionId: "ds-5", selectedOptions: ["a2"] }, // Queue FIFO
        { questionId: "ds-6", selectedOptions: ["a1", "a3"] }, // Linked List (non-contiguous, efficient add/remove)
        { questionId: "ds-7", selectedOptions: ["a2"] }, // Quick Sort average case
        { questionId: "ds-8", selectedOptions: ["a3"] }, // Merge Sort worst case
        { questionId: "ds-9", selectedOptions: ["a2"] }, // Hash Table O(1)
        { questionId: "ds-10", selectedOptions: ["a1", "a3"] }, // DFS (Stack, depth-first)
        { questionId: "ds-11", selectedOptions: ["a2"] }, // Space complexity (optional)
    ],
};

// ✅ Mock data cho correct answers (chỉ dùng trong result phase)
export const correctAnswersByQuiz: Record<string, Record<string, string[]>> = {
    "quiz-oop-core": {
        q1: ["a4"], // Inheritance
        q2: ["a4"], // Abstraction
        q3: ["a1"], // Polymorphism
        q4: ["a2"], // Overriding
        q5: ["a3"], // private
        q6: ["a3"], // Composition
        q7: ["a2"], // Constructor
        q8: ["a2"], // Interface vs Abstract
        q9: ["a1"], // Dynamic dispatch
        q10: ["a1", "a3"], // SOLID: SRP, OCP
        q11: ["a2"], // Factory Method
    },
    "quiz-db-core": {
        q1: ["a1"], // SQL
        q2: ["a3"], // Primary Key
        q3: ["a1"], // INSERT INTO
        q4: ["a3"], // WHERE
        q5: ["a1"], // 1-N relationship
        q6: ["a1", "a2", "a3"], // DML
        q7: ["a1"], // Index
        q8: ["a2"], // ALTER TABLE
        q9: ["a1"], // CHECK constraint
        q10: ["a1", "a2", "a3", "a4"], // JOIN types
        q11: ["a2"], // ACID
    },
    "quiz-network-core": {
        n1: ["a2"], // Data Link Layer
        n2: ["a3"], // TCP
        n3: ["a3"], // MAC address
        n4: ["a3"], // Router
        n5: ["a3"], // DHCP
        n6: ["a1", "a2", "a4"], // Application Layer
        n7: ["a2"], // Switch
        n8: ["a1"], // OSI vs TCP/IP
        n9: ["a1"], // FTP
        n10: ["a2", "a4"], // Transport Layer
        n11: ["a1"], // ICMP
    },
    "quiz-data-structures-algorithms": {
        "ds-1": ["a2"], // Stack
        "ds-2": ["a3"], // Array
        "ds-3": ["a2"], // BST
        "ds-4": ["a2"], // Binary Search
        "ds-5": ["a2"], // Queue
        "ds-6": ["a1", "a3"], // Linked List
        "ds-7": ["a2"], // Quick Sort
        "ds-8": ["a3"], // Merge Sort
        "ds-9": ["a2"], // Hash Table
        "ds-10": ["a1", "a3"], // DFS
        "ds-11": ["a2"], // Space complexity
    },
};

// Mock answers for only selected quizzes (simulate selective quiz completion)
export const selectedQuizAnswers: Record<string, UserAnswer[]> = {
    // Only answers for selected quizzes: OOP, Network, DataStructures (skip Database)
    "quiz-oop-core": sampleQuizAnswers["quiz-oop-core"],
    "quiz-network-core": sampleQuizAnswers["quiz-network-core"],
    "quiz-data-structures-algorithms":
        sampleQuizAnswers["quiz-data-structures-algorithms"],
    // ❌ No answers for "quiz-db-core" because it was skipped
};

// ✅ Mock data cho incomplete answers (để test validation)
export const incompleteQuizAnswers: Record<string, UserAnswer[]> = {
    "quiz-oop-core": [
        { questionId: "q1", selectedOptions: ["a4"] },
        { questionId: "q2", selectedOptions: ["a4"] },
        { questionId: "q3", selectedOptions: ["a1"] },
        // ❌ Missing q4, q5, q6, q7, q8, q9, q10 (required questions)
        { questionId: "q11", selectedOptions: ["a2"] }, // Optional is answered
    ],
    "quiz-db-core": [
        { questionId: "q1", selectedOptions: ["a1"] },
        { questionId: "q2", selectedOptions: ["a3"] },
        // ❌ Missing q3-q10 (required questions)
        // ❌ Missing q11 (optional question)
    ],
    // Các quiz khác không có answers - để test series incomplete
};

// Mock data cho empty answers (để test edge cases)
export const emptyQuizAnswers: Record<string, UserAnswer[]> = {
    "quiz-oop-core": [],
    "quiz-db-core": [],
    "quiz-network-core": [],
    "quiz-data-structures-algorithms": [],
};

// Mock data for different series states
export const mockSeriesStates = {
    // Phase 1: Quiz selection phase
    quizSelection: {
        ...sampleQuizSeries,
        // All quizzes are not selected initially
        quizzes: sampleQuizSeries.quizzes.map((quiz) => ({
            ...quiz,
            isSelected: false,
            status: QuizStatus.NOT_STARTED,
        })) as MockQuiz[],
    } as MockQuizSeries,

    // Phase 2: Some quizzes selected
    partialSelection: {
        ...sampleQuizSeries,
        quizzes: [
            {
                ...sampleQuizSeries.quizzes[0],
                isSelected: true,
                status: QuizStatus.SELECTED,
            },
            {
                ...sampleQuizSeries.quizzes[1],
                isSelected: false,
                status: QuizStatus.SKIPPED,
            },
            {
                ...sampleQuizSeries.quizzes[2],
                isSelected: true,
                status: QuizStatus.SELECTED,
            },
            {
                ...sampleQuizSeries.quizzes[3],
                isSelected: false,
                status: QuizStatus.NOT_STARTED,
            },
        ] as MockQuiz[],
    } as MockQuizSeries,

    // Phase 3: In progress (some completed, some in progress)
    inProgress: {
        ...sampleQuizSeries,
        quizzes: [
            {
                ...sampleQuizSeries.quizzes[0],
                isSelected: true,
                status: QuizStatus.COMPLETED,
            },
            {
                ...sampleQuizSeries.quizzes[1],
                isSelected: false,
                status: QuizStatus.SKIPPED,
            },
            {
                ...sampleQuizSeries.quizzes[2],
                isSelected: true,
                status: QuizStatus.IN_PROGRESS,
            },
            {
                ...sampleQuizSeries.quizzes[3],
                isSelected: true,
                status: QuizStatus.SELECTED,
            },
        ] as MockQuiz[],
    } as MockQuizSeries,

    // Phase 4: Ready to submit (all selected quizzes completed)
    readyToSubmit: {
        ...sampleQuizSeries,
        quizzes: [
            {
                ...sampleQuizSeries.quizzes[0],
                isSelected: true,
                status: QuizStatus.COMPLETED,
            },
            {
                ...sampleQuizSeries.quizzes[1],
                isSelected: false,
                status: QuizStatus.SKIPPED,
            },
            {
                ...sampleQuizSeries.quizzes[2],
                isSelected: true,
                status: QuizStatus.COMPLETED,
            },
            {
                ...sampleQuizSeries.quizzes[3],
                isSelected: true,
                status: QuizStatus.COMPLETED,
            },
        ] as MockQuiz[],
    } as MockQuizSeries,
};

// Mock data for different user scenarios
export const mockUserScenarios = {
    // Scenario 1: User wants to do all quizzes
    allQuizzes: {
        selectedQuizIds: [
            "quiz-oop-core",
            "quiz-db-core",
            "quiz-network-core",
            "quiz-data-structures-algorithms",
        ],
        answers: sampleQuizAnswers,
    },

    // Scenario 2: User selects only 3 out of 4 quizzes
    selectiveQuizzes: {
        selectedQuizIds: [
            "quiz-oop-core",
            "quiz-network-core",
            "quiz-data-structures-algorithms",
        ],
        answers: selectedQuizAnswers,
    },

    // Scenario 3: User selects minimal quizzes (1 quiz only)
    minimalQuizzes: {
        selectedQuizIds: ["quiz-oop-core"],
        answers: {
            "quiz-oop-core": sampleQuizAnswers["quiz-oop-core"],
        },
    },

    // Scenario 4: User skips all quizzes
    skipAll: {
        selectedQuizIds: [],
        answers: {},
    },
};

// Export helper function to get quiz by selection
export function getQuizzesBySelection(series: MockQuizSeries): {
    selectedQuizzes: MockQuiz[];
    skippedQuizzes: MockQuiz[];
} {
    const selectedQuizzes = series.quizzes.filter((quiz) => quiz.isSelected);
    const skippedQuizzes = series.quizzes.filter((quiz) => !quiz.isSelected);

    return { selectedQuizzes, skippedQuizzes };
}
