/*
 - File này định nghĩa các pure business logic cốt lõi cho hệ thống quiz
 - Các hàm ở đây không phụ thuộc vào state cụ thể nào, chỉ nhận input và trả về output.
 - Các hàm này có thể được tái sử dụng trong các store, component, hoặc service khác nhau
*/

import { Quiz, UserAnswer, QuizSeries, QuizStatus } from "EduSmart/types";

// ===== HELPER FUNCTIONS =====
// Kiểm tra xem câu trả lời đã hoàn thành (có lựa chọn) chưa
export const isAnswerCompleted = (answer: UserAnswer): boolean => {
    return answer.selectedOptions && answer.selectedOptions.length > 0;
};

// ===== QUIZ COMPLETION LOGIC =====
export const calculateQuizCompletion = (
    quiz: Quiz,
    answers: UserAnswer[],
): {
    isCompleted: boolean;
    progress: number;
    answeredCount: number;
    totalQuestions: number;
} => {
    const totalQuestions = quiz.questions.length;

    // 1. Đếm số câu hỏi đã được trả lời hoàn chỉnh
    const answeredQuestions = answers.filter(isAnswerCompleted);
    const answeredCount = answeredQuestions.length;

    // 2. Kiểm tra xem đã trả lời tất cả câu hỏi của một quiz chưa
    const isCompleted = answeredCount === totalQuestions;

    // 3. Tính toán progress theo phần trăm
    const progress =
        totalQuestions > 0
            ? Math.round((answeredCount / totalQuestions) * 100)
            : 0;

    return {
        isCompleted,
        progress,
        answeredCount,
        totalQuestions,
    };
};

// ===== NAVIGATION LOGIC =====
export const calculateNavigationInfo = (
    selectedQuizIds: string[],
    currentQuizId: string | null,
): {
    currentIndex: number; // Vị trí hiện tại trong danh sách đã chọn
    canGoNext: boolean;
    canGoPrev: boolean;
    nextQuizId: string | null;
    prevQuizId: string | null;
    totalSelected: number; // Tổng số quiz đã chọn
} => {
    // 1. Không có quiz nào được chọn
    if (!selectedQuizIds || selectedQuizIds.length === 0) {
        return {
            currentIndex: -1,
            canGoNext: false,
            canGoPrev: false,
            nextQuizId: null,
            prevQuizId: null,
            totalSelected: 0,
        };
    }

    // 2. Chưa có quiz hiện tại (chưa bắt đầu)
    if (!currentQuizId) {
        return {
            currentIndex: -1,
            canGoNext: selectedQuizIds.length > 0, // Có thể đi tiếp nếu có quiz đã chọn
            canGoPrev: false,
            nextQuizId: selectedQuizIds[0] || null, // Quiz đầu tiên trong danh sách
            prevQuizId: null,
            totalSelected: selectedQuizIds.length,
        };
    }

    // 3. Tìm vị trí của quiz hiện tại trong danh sách đã chọn
    const currentIndex = selectedQuizIds.indexOf(currentQuizId);

    // 4. Nếu quiz hiện tại không nằm trong danh sách đã chọn
    if (currentIndex === -1) {
        return {
            currentIndex: -1,
            canGoNext: false,
            canGoPrev: false,
            nextQuizId: null,
            prevQuizId: null,
            totalSelected: selectedQuizIds.length,
        };
    }

    // 5. Xác định khả năng di chuyển
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < selectedQuizIds.length - 1;

    // 6. Xác định quizId tiếp theo và trước đó
    const prevQuizId = canGoPrev ? selectedQuizIds[currentIndex - 1] : null;
    const nextQuizId = canGoNext ? selectedQuizIds[currentIndex + 1] : null;

    return {
        currentIndex,
        canGoNext,
        canGoPrev,
        nextQuizId,
        prevQuizId,
        totalSelected: selectedQuizIds.length,
    };
};

// ===== SERIES PROGRESS CALCULATION =====
// Tính toán progress tổng thể của series - bao nhiêu quiz hoàn thành, tổng progress %
export const calculateSeriesProgress = (
    series: QuizSeries,
    selectedQuizIds: string[],
    userAnswers: Record<string, UserAnswer[]>,
): {
    totalQuizzes: number;
    selectedQuizzes: number;
    completedQuizzes: number;
    inProgressQuizzes: number;
    notStartedQuizzes: number;
    totalQuestions: number;
    answeredQuestions: number;
    overallProgress: number;
    canSubmit: boolean;
    completionRate: number;
} => {
    // 1. Đếm tổng số quiz và số quiz đã chọn
    const totalQuizzes = series.quizzes.length;
    const selectedQuizzes = selectedQuizIds.length;

    // 2. Khởi tạo các biến đếm
    let completedQuizzes = 0;
    let inProgressQuizzes = 0;
    let notStartedQuizzes = 0;
    let totalQuestions = 0;
    let answeredQuestions = 0;

    // 3. Duyệt qua từng quiz đã chọn để tính toán trạng thái và tiến độ
    selectedQuizIds.forEach((quizId) => {
        const quiz = series.quizzes.find((q) => q.id === quizId);
        if (!quiz) return; // Bỏ qua nếu quiz không tồn tại

        // Lấy câu trả lời của người dùng cho quiz này & tính toán tiến độ
        const answers = userAnswers[quizId] || [];
        const quizCompletion = calculateQuizCompletion(quiz, answers);

        // Cộng dồn số câu hỏi và câu trả lời
        totalQuestions += quizCompletion.totalQuestions;
        answeredQuestions += quizCompletion.answeredCount;

        // Cập nhật trạng thái quiz
        if (quizCompletion.isCompleted) {
            completedQuizzes++;
        } else if (quizCompletion.answeredCount > 0) {
            inProgressQuizzes++;
        } else {
            notStartedQuizzes++;
        }
    });

    // 4. Tính toán tiến độ tổng thể của series theo phần trăm (%)
    const overallProgress =
        totalQuestions > 0
            ? Math.round((answeredQuestions / totalQuestions) * 100)
            : 0;

    // 5. Tính tỷ lệ hoàn thành (số quiz hoàn thành / số quiz đã chọn)
    const completionRate =
        selectedQuizzes > 0
            ? Math.round((completedQuizzes / selectedQuizzes) * 100)
            : 0;

    // 6. Xác định xem người dùng có thể nộp bài hay không (đã hoàn thành tất cả quiz đã chọn chưa?)
    const canSubmit =
        selectedQuizzes > 0 && completedQuizzes === selectedQuizzes;

    return {
        totalQuizzes,
        selectedQuizzes,
        completedQuizzes,
        inProgressQuizzes,
        notStartedQuizzes,
        totalQuestions,
        answeredQuestions,
        overallProgress,
        canSubmit,
        completionRate,
    };
};

// ===== TIME CALCULATION =====
// Tính thời gian làm quiz theo phút
export const calculateTimeSpent = (
    startTime: Date | undefined,
    endTime: Date = new Date(),
): number => {
    // 1. Kiểm tra nếu startTime không tồn tại
    if (!startTime) {
        return 0; // Chưa bắt đầu hoặc không có thông tin thời gian
    }

    // 2. Đảm bảo endTime là hợp lệ
    if (!endTime || !(endTime instanceof Date) || isNaN(endTime.getTime())) {
        endTime = new Date(); // Fallback: sử dụng thời gian hiện tại
    }

    // 3. Đảm bảo startTime là hợp lệ
    if (!(startTime instanceof Date) || isNaN(startTime.getTime())) {
        return 0; // Invalid start time
    }

    // 4. Tính hiệu số thời gian theo milliseconds
    const timeDiffMs = endTime.getTime() - startTime.getTime();

    // 5. Nếu hiệu số âm, trả về 0 (endTime trước startTime)
    if (timeDiffMs < 0) {
        return 0; // Invalid time range
    }

    // 6. Chuyển đổi milliseconds sang phút và làm tròn
    const timeInMinutes = Math.round(timeDiffMs / 60000); // 1 minute = 60,000 ms

    return timeInMinutes;
};

// ===== QUIZ STATUS DETERMINATION =====
// Xác định status hiện tại của quiz (NOT_STARTED, SELECTED, IN_PROGRESS, COMPLETED)
export const determineQuizStatus = (
    quizId: string,
    selectedQuizIds: string[],
    userAnswers: Record<string, UserAnswer[]>,
    quiz?: Quiz,
): QuizStatus => {
    // 1. Nếu quizId không hợp lệ, trả về NOT_STARTED
    if (!quizId?.trim()) {
        return QuizStatus.NOT_STARTED;
    }

    // 2. Kiểm tra xem quiz có được chọn không
    const isSelected = selectedQuizIds.includes(quizId);

    // Nếu quiz không được chọn, trạng thái là NOT_STARTED
    if (!isSelected) {
        return QuizStatus.NOT_STARTED;
    }

    // 3. Lấy câu trả lời của người dùng cho quiz này
    const answers = userAnswers[quizId] || [];

    // 4. Kiểm tra xem có câu trả lời nào đã hoàn thành chưa
    const hasAnswers = answers.some((answer) => isAnswerCompleted(answer));

    // Nếu quiz được chọn nhưng chưa có câu trả lời nào, trạng thái là SELECTED
    if (!hasAnswers) {
        return QuizStatus.SELECTED;
    }

    // 5. Nếu có câu trả lời, kiểm tra trạng thái hoàn thành dựa trên quiz info (nếu có)
    if (quiz) {
        const completion = calculateQuizCompletion(quiz, answers);

        if (completion.isCompleted) {
            return QuizStatus.COMPLETED;
        } else {
            return QuizStatus.IN_PROGRESS;
        }
    }

    // 6. Fallback: Nếu không có thông tin quiz, nhưng có câu trả lời, coi là IN_PROGRESS
    return QuizStatus.IN_PROGRESS;
};

// ===== USER ANSWER LOGIC =====
// Tạo mới hoặc cập nhật UserAnswer khi người dùng trả lời câu hỏi
export const createUserAnswer = (
    questionId: string,
    selectedOptions: string[],
): UserAnswer => {
    // 1. Nếu questionId không hợp lệ, ném lỗi
    if (!questionId?.trim()) {
        throw new Error("questionId is required and cannot be empty");
    }

    // 2. Đảm bảo selectedOptions là mảng, nếu không thì khởi tạo mảng rỗng
    const safeSelectedOptions = Array.isArray(selectedOptions)
        ? selectedOptions
        : [];

    // 3. Lọc và làm sạch các lựa chọn (loại bỏ null, undefined, chuỗi rỗng)
    const cleanedOptions = safeSelectedOptions
        .filter(
            (option) =>
                option != null &&
                typeof option === "string" &&
                option.trim().length > 0,
        )
        .map((option) => option.trim());

    return {
        questionId: questionId.trim(),
        selectedOptions: cleanedOptions,
    };
};

// Cập nhật UserAnswer với lựa chọn mới khi user thay đổi answer
export const updateUserAnswer = (
    existingAnswer: UserAnswer,
    newSelectedOptions: string[],
): UserAnswer => {
    // 1. Kiểm tra existingAnswer và questionId hợp lệ
    if (!existingAnswer || !existingAnswer.questionId?.trim()) {
        throw new Error("existingAnswer is required with valid questionId");
    }

    // 2. Đảm bảo newSelectedOptions là mảng, nếu không thì khởi tạo mảng rỗng
    const safeSelectedOptions = Array.isArray(newSelectedOptions)
        ? newSelectedOptions
        : [];

    // 3. Lọc và làm sạch các lựa chọn mới (loại bỏ null, undefined, chuỗi rỗng)
    const cleanedOptions = safeSelectedOptions
        .filter(
            (option) =>
                option != null &&
                typeof option === "string" &&
                option.trim().length > 0,
        )
        .map((option) => option.trim());

    // 4. Tạo UserAnswer mới với selectedOptions được cập nhật
    // Giữ nguyên questionId từ existing answer, chỉ update selectedOptions
    return {
        questionId: existingAnswer.questionId, // Giữ nguyên
        selectedOptions: cleanedOptions, // Options mới đã được làm sạch
    };
};
