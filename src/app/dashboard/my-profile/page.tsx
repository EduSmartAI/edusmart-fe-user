export const dynamic = "force-dynamic";
export const revalidate = 120;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Result, Button } from "antd";
import MyProfileClient from "./MyProfileClient";
import { getStudentTranscriptServer } from "EduSmart/app/(student)/studentAction";
import apiServer from "EduSmart/lib/apiServer";

export const metadata: Metadata = {
  title: "EduSmart – Hồ sơ cá nhân",
  description: "Xem và quản lý thông tin cá nhân, bảng điểm học tập",
};

async function fetchStudentProfile() {
  try {
    const response =
      await apiServer.student.api.v1StudentSelectStudentProfileList();

    if (response.data?.success && response.data?.response) {
      const profile = response.data.response;

      // Enrich profile with major and semester names if IDs exist but names don't
      if (profile.majorId && !profile.majorName) {
        try {
          const majorsRes =
            await apiServer.quiz.api.v1ExternalQuizSelectMajorsList();
          if (majorsRes.data?.response) {
            const major = majorsRes.data.response.find(
              (m: any) => m.majorId === profile.majorId,
            );
            if (major) {
              profile.majorName = major.majorName;
            }
          }
        } catch (error) {
          console.warn("⚠️ SERVER: Could not fetch majors:", error);
        }
      }

      if (profile.semesterId && !profile.semesterName) {
        try {
          const semestersRes =
            await apiServer.quiz.api.v1ExternalQuizSelectSemestersList();
          if (semestersRes.data?.response) {
            const semester = semestersRes.data.response.find(
              (s: any) => s.semesterId === profile.semesterId,
            );
            if (semester) {
              profile.semesterName = semester.semesterName;
            }
          }
        } catch (error) {
          console.warn("⚠️ SERVER: Could not fetch semesters:", error);
        }
      }

      // Ensure technologies and learningGoals are arrays
      if (!profile.technologies) {
        profile.technologies = [];
      }
      if (!profile.learningGoals) {
        profile.learningGoals = [];
      }

      return {
        success: true,
        data: profile,
      };
    }

    return {
      success: false,
      data: null,
    };
  } catch (error) {
    console.error("❌ SERVER: Error fetching profile:", error);
    return {
      success: false,
      data: null,
    };
  }
}

async function fetchAcademicTranscript() {
  try {
    const result = await getStudentTranscriptServer();
    return {
      success: true,
      data: result.response,
    };
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return {
      success: true,
      data: [],
    };
  }
}

export default async function MyProfilePage() {
  try {
    // Fetch data in parallel
    const [profileResult, transcriptResult] = await Promise.all([
      fetchStudentProfile(),
      fetchAcademicTranscript(),
    ]);

    if (!profileResult.success || !profileResult.data) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <Result
            status="error"
            title="Không thể tải thông tin cá nhân"
            subTitle="Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại sau."
            extra={
              <Button type="primary" href="/dashboard" size="large">
                Quay về Dashboard
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <MyProfileClient
        profile={profileResult.data as any}
        transcript={transcriptResult.data || []} // Ensure transcript is always an array, never null
      />
    );
  } catch (error) {
    console.error("Error loading profile page:", error);
    return notFound();
  }
}
