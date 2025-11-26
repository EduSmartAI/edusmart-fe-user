"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Avatar,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
  Divider,
  Checkbox,
  Spin,
} from "antd";
import AcademicTranscript, {
  TranscriptRecord,
} from "EduSmart/components/User/AcademicTranscript";
import type { UploadFile } from "antd/es/upload/interface";
import moment from "moment";
import {
  updateStudentProfileClient,
  getStudentProfileClient,
} from "EduSmart/hooks/api-client/studentApiClient";
import apiClient from "EduSmart/hooks/apiClient";

interface Technology {
  technologyId: string;
  technologyName: string;
  technologyType: number;
  technologyTypeName: string;
}

interface LearningGoal {
  goalId?: string; // From profile API
  learningGoalId?: string; // From list API
  goalName?: string; // From profile API
  learningGoalName?: string; // From list API
  learningGoalType: number;
  learningGoalTypeName?: string;
}

interface StudentProfile {
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: number;
  avatarUrl: string;
  address: string;
  bio: string;
  majorId: string;
  majorName: string | null;
  semesterId: string;
  semesterName: string | null;
  technologies: Technology[];
  learningGoals: LearningGoal[];
}

interface MyProfileClientProps {
  profile: StudentProfile;
  transcript: TranscriptRecord[];
}

export default function MyProfileClient({
  profile: initialProfile,
  transcript,
}: MyProfileClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [majors, setMajors] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [semesters, setSemesters] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [technologies, setTechnologies] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [learningGoals, setLearningGoals] = useState<any[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  // Format date from yyyy-mm-dd to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getGenderLabel = (gender: number) => {
    return gender === 1 ? "Nam" : gender === 2 ? "Nữ" : "Khác";
  };

  // Load data when modal opens
  useEffect(() => {
    if (isEditModalOpen) {
      loadFormData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditModalOpen]);

  const loadFormData = async () => {
    setLoading(true);
    try {
      // Load majors, semesters, technologies, learning goals
      const [majorsRes, semestersRes, techRes, goalsRes] = await Promise.all([
        apiClient.quizService.api.v1ExternalQuizSelectMajorsList(),
        apiClient.quizService.api.v1ExternalQuizSelectSemestersList(),
        apiClient.quizService.api.v1ExternalQuizSelectTechnologiesList(),
        apiClient.quizService.api.v1ExternalQuizSelectLearningGoalsList(),
      ]);

      if (majorsRes.data?.response) {
        setMajors(majorsRes.data.response);
      }
      if (semestersRes.data?.response) {
        setSemesters(semestersRes.data.response);
      }
      if (techRes.data?.response) {
        setTechnologies(techRes.data.response);
      }
      if (goalsRes.data?.response) {
        setLearningGoals(goalsRes.data.response);
      }

      // Set initial form values
      const techIds = profile.technologies?.map((t) => t.technologyId) || [];
      // Handle both goalId (from profile API) and learningGoalId (from list API)
      const goalIds =
        (profile.learningGoals
          ?.map((g) => g.goalId || g.learningGoalId)
          .filter(Boolean) as string[]) || [];

      setSelectedTechIds(techIds);
      setSelectedGoalIds(goalIds);

      // Parse dateOfBirth - could be in various formats
      let parsedDate = null;
      if (profile.dateOfBirth) {
        // Try parsing as ISO format (YYYY-MM-DD) or DD-MM-YYYY
        parsedDate = moment(
          profile.dateOfBirth,
          ["YYYY-MM-DD", "DD-MM-YYYY"],
          true,
        );
        if (!parsedDate.isValid()) {
          parsedDate = moment(profile.dateOfBirth);
        }
      }

      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: parsedDate,
        gender: profile.gender,
        address: profile.address,
        bio: profile.bio,
        majorId: profile.majorId,
        semesterId: profile.semesterId,
      });
    } catch (error) {
      console.error("Error loading form data:", error);
      message.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validate Technologies and LearningGoals (backend requires at least 1 item)
      if (!selectedTechIds || selectedTechIds.length === 0) {
        message.error("Vui lòng chọn ít nhất 1 công nghệ");
        setLoading(false);
        return;
      }

      if (!selectedGoalIds || selectedGoalIds.length === 0) {
        message.error("Vui lòng chọn ít nhất 1 định hướng tương lai");
        setLoading(false);
        return;
      }

      // Prepare data for API
      // Format date as DD-MM-YYYY (backend expects this format)
      let formattedDate: string | undefined;
      if (values.dateOfBirth) {
        const day = String(values.dateOfBirth.date()).padStart(2, "0");
        const month = String(values.dateOfBirth.month() + 1).padStart(2, "0");
        const year = values.dateOfBirth.year();
        formattedDate = `${day}-${month}-${year}`;
      }

      const updateData: {
        FirstName?: string;
        LastName?: string;
        DateOfBirth?: string;
        PhoneNumber?: string;
        Gender?: number;
        Address?: string;
        Bio?: string;
        MajorId?: string;
        SemesterId?: string;
        Technologies?: string[];
        LearningGoals?: string[];
        Avatar?: File;
      } = {
        FirstName: values.firstName,
        LastName: values.lastName,
        DateOfBirth: formattedDate,
        PhoneNumber: values.phoneNumber,
        Gender: values.gender,
        Address: values.address,
        Bio: values.bio,
        MajorId: values.majorId,
        SemesterId: values.semesterId,
        Technologies: selectedTechIds,
        LearningGoals: selectedGoalIds,
      };

      // Add avatar if uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        updateData.Avatar = fileList[0].originFileObj;
      }

      // Debug log
      console.log("📤 Sending update data:", {
        ...updateData,
        Avatar: updateData.Avatar ? "File uploaded" : "No file",
      });

      const result = await updateStudentProfileClient(updateData);

      console.log("📥 Update result:", result);

      if (result.success) {
        message.success(result.message || "Cập nhật thông tin thành công!");

        // Fetch updated profile
        const profileResult = await getStudentProfileClient();
        if (profileResult.success && profileResult.data) {
          const updatedProfile = profileResult.data as StudentProfile;

          // Load majors and semesters if not already loaded
          let currentMajors = majors;
          let currentSemesters = semesters;

          if (majors.length === 0 || semesters.length === 0) {
            const [majorsRes, semestersRes] = await Promise.all([
              apiClient.quizService.api.v1ExternalQuizSelectMajorsList(),
              apiClient.quizService.api.v1ExternalQuizSelectSemestersList(),
            ]);

            if (majorsRes.data?.response) {
              currentMajors = majorsRes.data.response;
              setMajors(currentMajors);
            }
            if (semestersRes.data?.response) {
              currentSemesters = semestersRes.data.response;
              setSemesters(currentSemesters);
            }
          }

          // Enrich profile with major and semester names
          if (updatedProfile.majorId && currentMajors.length > 0) {
            const major = currentMajors.find(
              (m) => m.majorId === updatedProfile.majorId,
            );
            if (major) {
              updatedProfile.majorName = major.majorName;
            }
          }

          if (updatedProfile.semesterId && currentSemesters.length > 0) {
            const semester = currentSemesters.find(
              (s) => s.semesterId === updatedProfile.semesterId,
            );
            if (semester) {
              updatedProfile.semesterName = semester.semesterName;
            }
          }

          setProfile(updatedProfile);

          // IMPORTANT: Update selected IDs from the new profile
          const newTechIds =
            updatedProfile.technologies?.map((t) => t.technologyId) || [];
          const newGoalIds =
            (updatedProfile.learningGoals
              ?.map((g) => g.goalId || g.learningGoalId)
              .filter(Boolean) as string[]) || [];

          setSelectedTechIds(newTechIds);
          setSelectedGoalIds(newGoalIds);
        }

        // Close modal and reset form
        setIsEditModalOpen(false);
        setFileList([]);

        // Refresh server-side data
        console.log("🔄 Refreshing page data...");
        router.refresh();
      } else {
        console.error("❌ Update failed:", result);
        message.error(result.message || "Cập nhật thông tin thất bại");
        if (result.detailErrors) {
          console.error("📋 Detail errors:", result.detailErrors);
          // Show detail errors to user if available
          if (typeof result.detailErrors === "string") {
            message.error(result.detailErrors, 5);
          }
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Vui lòng kiểm tra lại thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const handleLearningGoalChange = (values: string[]) => {
    const goalIds = values as string[];

    // Nếu không có learning goals, return empty
    if (learningGoals.length === 0) {
      setSelectedGoalIds(goalIds);
      return;
    }

    // ID của mục "Chưa có định hướng" (mục đầu tiên)
    // Support both field names
    const noGoalId =
      learningGoals[0]?.learningGoalId || learningGoals[0]?.goalId;

    // Kiểm tra xem có chọn "Chưa có định hướng" không
    const hasNoGoal = goalIds.includes(noGoalId);
    const previousHasNoGoal = selectedGoalIds.includes(noGoalId);

    // Nếu vừa chọn "Chưa có định hướng" (trước đó không có)
    if (hasNoGoal && !previousHasNoGoal) {
      // Chỉ giữ lại "Chưa có định hướng", bỏ hết các mục khác
      setSelectedGoalIds([noGoalId]);
    }
    // Nếu chọn mục khác trong khi đã có "Chưa có định hướng"
    else if (hasNoGoal && goalIds.length > 1) {
      // Bỏ "Chưa có định hướng", giữ lại các mục khác
      const filtered = goalIds.filter((id) => id !== noGoalId);
      setSelectedGoalIds(filtered);
    }
    // Trường hợp bình thường
    else {
      setSelectedGoalIds(goalIds);
    }
  };

  const tabItems = [
    {
      key: "info",
      label: "Thông tin cá nhân",
      children: (
        <div className="bg-white dark:bg-gray-800">
          <Card className="border border-gray-200 dark:border-gray-700">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-6">
                <Avatar
                  size={100}
                  src={profile.avatarUrl}
                  className="border-2 border-gray-300 dark:border-gray-600"
                >
                  {profile.fullName?.charAt(0)}
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {profile.fullName}
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-1">
                    {profile.majorName || "Chưa có thông tin chuyên ngành"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {profile.semesterName || "Chưa có thông tin học kỳ"}
                  </p>
                </div>
              </div>
              <Button type="primary" onClick={handleEditProfile} size="large">
                Chỉnh sửa thông tin
              </Button>
            </div>

            {/* Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ</label>
                  <Input
                    value={profile.lastName}
                    size="large"
                    variant={"filled"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tên</label>
                  <Input
                    value={profile.firstName}
                    size="large"
                    variant={"filled"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngày sinh
                  </label>
                  <Input
                    value={formatDate(profile.dateOfBirth)}
                    size="large"
                    variant={"filled"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Giới tính
                  </label>
                  <Input
                    value={getGenderLabel(profile.gender)}
                    size="large"
                    variant={"filled"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số điện thoại
                  </label>
                  <Input
                    value={profile.phoneNumber}
                    size="large"
                    variant={"filled"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Địa chỉ
                  </label>
                  <Input
                    value={profile.address}
                    size="large"
                    variant={"filled"}
                  />
                </div>
                {profile.bio && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Giới thiệu
                    </label>
                    <Input.TextArea
                      value={profile.bio}
                      rows={3}
                      size="large"
                      variant={"filled"}
                    />
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* Technologies Section */}
            {profile.technologies && profile.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Độ am hiểu công nghệ
                </h3>
                <div className="space-y-3">
                  {profile.technologies.map((tech, idx) => (
                    <div key={tech.technologyId}>
                      <label className="block text-sm font-medium mb-2">
                        {idx + 1}. {tech.technologyTypeName}
                      </label>
                      <Input
                        value={tech.technologyName}
                        size="large"
                        variant={"filled"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.technologies &&
              profile.technologies.length > 0 &&
              profile.learningGoals &&
              profile.learningGoals.length > 0 && <Divider />}

            {/* Learning Goals Section */}
            {profile.learningGoals && profile.learningGoals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Định hướng tương lai
                </h3>
                <div className="space-y-3">
                  {profile.learningGoals.map((goal) => (
                    <div key={goal.goalId || goal.learningGoalId}>
                      <Input
                        value={goal.goalName || goal.learningGoalName}
                        size="large"
                        variant={"filled"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: "transcript",
      label: "Bảng điểm",
      children: (
        <AcademicTranscript
          data={transcript}
          onUploadSuccess={() => window.location.reload()}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <Tabs
          items={tabItems}
          defaultActiveKey="info"
          size="large"
          className="bg-white dark:bg-gray-800 rounded-lg"
        />
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleSaveProfile}
        width={800}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" className="mt-4" variant="filled">
            {/* Basic Information */}
            <Divider orientation="left">Thông tin cơ bản</Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Họ"
                name="lastName"
                rules={[{ required: true, message: "Vui lòng nhập họ" }]}
              >
                <Input placeholder="Nhập họ" size="large" />
              </Form.Item>

              <Form.Item
                label="Tên"
                name="firstName"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Nhập tên" size="large" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                  className="w-full"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính" size="large">
                  <Select.Option value={1}>Nam</Select.Option>
                  <Select.Option value={2}>Nữ</Select.Option>
                  <Select.Option value={3}>Khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" size="large" />
              </Form.Item>
            </div>

            <Form.Item label="Giới thiệu bản thân" name="bio">
              <Input.TextArea
                rows={3}
                placeholder="Viết vài dòng giới thiệu về bản thân..."
                size="large"
              />
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* Academic Information */}
            <Divider orientation="left">Thông tin học tập</Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Chuyên ngành"
                name="majorId"
                rules={[
                  { required: true, message: "Vui lòng chọn chuyên ngành" },
                ]}
              >
                <Select
                  placeholder="Chọn chuyên ngành"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {majors.map((major) => (
                    <Select.Option key={major.majorId} value={major.majorId}>
                      {major.majorName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Học kỳ hiện tại"
                name="semesterId"
                rules={[{ required: true, message: "Vui lòng chọn học kỳ" }]}
              >
                <Select
                  placeholder="Chọn học kỳ"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                >
                  {semesters.map((semester) => (
                    <Select.Option
                      key={semester.semesterId}
                      value={semester.semesterId}
                    >
                      {semester.semesterName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Technologies */}
            <Divider orientation="left">Độ am hiểu công nghệ</Divider>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <Checkbox.Group
                value={selectedTechIds}
                onChange={(values) => setSelectedTechIds(values as string[])}
                className="w-full"
              >
                <div className="space-y-4">
                  {/* Ngôn ngữ lập trình */}
                  {technologies.filter((t) => t.technologyType === 1).length >
                    0 && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Ngôn ngữ lập trình
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technologies
                          .filter((t) => t.technologyType === 1)
                          .map((tech) => (
                            <Checkbox
                              key={tech.technologyId}
                              value={tech.technologyId}
                            >
                              {tech.technologyName}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Framework */}
                  {technologies.filter((t) => t.technologyType === 2).length >
                    0 && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Framework
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technologies
                          .filter((t) => t.technologyType === 2)
                          .map((tech) => (
                            <Checkbox
                              key={tech.technologyId}
                              value={tech.technologyId}
                            >
                              {tech.technologyName}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Công cụ */}
                  {technologies.filter((t) => t.technologyType === 3).length >
                    0 && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Công cụ
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technologies
                          .filter((t) => t.technologyType === 3)
                          .map((tech) => (
                            <Checkbox
                              key={tech.technologyId}
                              value={tech.technologyId}
                            >
                              {tech.technologyName}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Nền tảng */}
                  {technologies.filter((t) => t.technologyType === 4).length >
                    0 && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Nền tảng
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technologies
                          .filter((t) => t.technologyType === 4)
                          .map((tech) => (
                            <Checkbox
                              key={tech.technologyId}
                              value={tech.technologyId}
                            >
                              {tech.technologyName}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Cơ sở dữ liệu */}
                  {technologies.filter((t) => t.technologyType === 5).length >
                    0 && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Cơ sở dữ liệu
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technologies
                          .filter((t) => t.technologyType === 5)
                          .map((tech) => (
                            <Checkbox
                              key={tech.technologyId}
                              value={tech.technologyId}
                            >
                              {tech.technologyName}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Khác */}
                  {technologies.filter((t) => t.technologyType === 6).length >
                    0 && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Khác
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {technologies
                          .filter((t) => t.technologyType === 6)
                          .map((tech) => (
                            <Checkbox
                              key={tech.technologyId}
                              value={tech.technologyId}
                            >
                              {tech.technologyName}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </Checkbox.Group>
            </div>

            {/* Learning Goals */}
            <Divider orientation="left">Định hướng tương lai</Divider>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <Checkbox.Group
                value={selectedGoalIds}
                onChange={handleLearningGoalChange}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningGoals.map((goal) => (
                    <div
                      key={goal.learningGoalId || goal.goalId}
                      className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <Checkbox
                        value={goal.learningGoalId || goal.goalId}
                        className="w-full"
                      >
                        <span className="font-medium">
                          {goal.learningGoalName || goal.goalName}
                        </span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}
