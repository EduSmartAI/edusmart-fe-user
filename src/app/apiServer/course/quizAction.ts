import { StudentCourseQuizSelectResponse, StudentQuizCourseInsertResponse } from "EduSmart/api/api-quiz-service";
import apiServer from "EduSmart/lib/apiServer";

export async function GetResultOfQuizByQuizResultId(
  id: string,
): Promise<{
  data: StudentCourseQuizSelectResponse;
}> {
  try {
    const res = await apiServer.quiz.api.v1CourseQuizSelectStudentQuizCourseList({
      StudentQuizCourseId: id ?? "",
    });
    if (res.data?.success && res.data.response) {
      console.log("CheckCourseById - res:", res.data.response)
      console.log("CheckCourseById - res:", res.data.success)
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}

export async function SubmitLessonOrModuleQuiz(
  lessonId: string,
  moduleId: string,
  quizId: string,
  isHasModule: boolean,
  courseId: string,
  answers: {
    questionId: string;
    selectedAnswerIds: string[];
  }[],
): Promise<{
  data: StudentQuizCourseInsertResponse;
}> {
  try {
    const studentQuizAnswers = answers.flatMap(answer => 
      answer.selectedAnswerIds.map(answerId => ({
        questionId: answer.questionId,
        answerId: answerId
      }))
    );

    const res = await apiServer.quiz.api.v1CourseQuizInsertStudentQuizCourseCreate({
        lessonId: isHasModule ? undefined : lessonId,
        moduleId: isHasModule ? moduleId : undefined,
        quizId: quizId,
        courseId: courseId,
        studentQuizAnswers: studentQuizAnswers,
    });
    if (res.data?.success && res.data.response) {
      console.log("CheckCourseById - res:", res.data.response)
      console.log("CheckCourseById - res:", res.data.success)
      return {
        data: res.data ?? {},
      };
    }
    return {
      data: res.data ?? {},
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: {},
    };
  }
}

