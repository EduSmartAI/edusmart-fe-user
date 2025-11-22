"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Upload,
  message,
  Spin,
  Empty,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { RcFile } from "antd/es/upload";
import { uploadTranscriptClient } from "EduSmart/hooks/api-client/studentApiClient";

export interface TranscriptRecord {
  studentTranscriptId: string;
  semester: string;
  semesterNumber: number;
  subjectCode: string;
  prerequisite: string;
  replacedSubject?: string;
  subjectName: string;
  credit: number;
  grade: number;
  status: string;
  createdAt: string;
}

interface AcademicTranscriptProps {
  data: TranscriptRecord[];
  showStats?: boolean;
  onUploadSuccess?: () => void;
}

export default function AcademicTranscript({
  data,
  showStats = true,
  onUploadSuccess,
}: AcademicTranscriptProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Reset all filters
  const handleReset = () => {
    setSearchText("");
    setSelectedSemester(null);
    setSelectedStatus(null);
  };

  // Handle file upload
  const handleUpload = async (file: RcFile) => {
    try {
      setUploading(true);
      console.log("🟢 Starting upload for file:", file.name);
      const result = await uploadTranscriptClient(file);
      console.log("🟢 Upload result:", result);
      console.log(
        "🟢 result.success type:",
        typeof result.success,
        "value:",
        result.success,
      );

      if (result.success === true) {
        console.log("✅ Success branch - showing success message");
        message.success(result.message || "Upload bảng điểm thành công");
        onUploadSuccess?.();
      } else {
        console.warn("⚠️ Upload failed - showing error message");
        console.warn("⚠️ Error details:", {
          success: result.success,
          message: result.message,
          messageId: result.messageId,
          detailErrors: result.detailErrors,
        });
        // Show error message with longer duration
        message.error({
          content: (
            <div>
              <div className="font-semibold">{result.message}</div>
              {result.detailErrors && (
                <div className="text-sm mt-1">{result.detailErrors}</div>
              )}
            </div>
          ),
          duration: 5,
        });
        console.warn("⚠️ Error message displayed");
      }
    } catch (error) {
      console.error("❌ Upload exception:", error);
      message.error({
        content: (
          <div>
            <div className="font-semibold">
              {error instanceof Error
                ? error.message
                : "Có lỗi xảy ra khi upload bảng điểm"}
            </div>
            <div className="text-sm mt-1">
              Vui lòng thử lại hoặc liên hệ với quản trị viên.
            </div>
          </div>
        ),
        duration: 5,
      });
    } finally {
      setUploading(false);
    }
    return false;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const passedCourses = data.filter((item) => item.status === "Passed");
    const totalCredits = passedCourses.reduce(
      (sum, item) => sum + item.credit,
      0,
    );
    const totalGradePoints = passedCourses.reduce(
      (sum, item) => sum + item.grade * item.credit,
      0,
    );
    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    return {
      totalCourses: data.length,
      passedCourses: passedCourses.length,
      totalCredits,
      gpa: gpa.toFixed(2),
    };
  }, [data]);

  // Get unique semesters
  const semestersNumber = useMemo(() => {
    const uniqueSemestersNumber = Array.from(
      new Set(data.map((item) => item.semesterNumber)),
    );
    return uniqueSemestersNumber.sort((a, b) => a - b);
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.subjectName
          .toLowerCase()
          .includes(searchText.toLowerCase().trim()) ||
        item.subjectCode
          .toLowerCase()
          .includes(searchText.toLowerCase().trim());
      const matchesSemester =
        selectedSemester === null || item.semesterNumber === selectedSemester;
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [data, searchText, selectedSemester, selectedStatus]);

  // Get status tag
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      "Not started": { color: "default", label: "Chưa bắt đầu" },
      Passed: { color: "success", label: "Đã qua" },
      "Not passed": { color: "error", label: "Không qua" },
      Studying: { color: "processing", label: "Đang học" },
    };
    const config = statusMap[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const columns: ColumnsType<TranscriptRecord> = [
    {
      title: "Kỳ",
      dataIndex: "semesterNumber",
      key: "semesterNumber",
      width: 40,
      align: "center",
      fixed: "left",
      render: (num: number) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {num}
        </span>
      ),
    },
    {
      title: "Tên kỳ",
      dataIndex: "semester",
      key: "semester",
      width: 110,
      render: (semester: string) => (
        <span className="text-gray-900 dark:text-white">
          {semester || "N/A"}
        </span>
      ),
    },
    {
      title: "Mã môn",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: 120,
      align: "center",
      fixed: "left",
      render: (code: string) => (
        <span className="font-mono font-semibold text-gray-900 dark:text-white">
          {code}
        </span>
      ),
    },
    {
      title: "Môn tiên quyết",
      dataIndex: "prerequisite",
      key: "prerequisite",
      width: 150,
      render: (prerequisite: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {prerequisite || "-"}
        </span>
      ),
    },
    // {
    //   title: "Môn thay thế",
    //   dataIndex: "replacedSubject",
    //   key: "replacedSubject",
    //   width: 120,
    //   render: (replaced: string | undefined) => (
    //     <span className="text-sm text-gray-600 dark:text-gray-400">
    //       {replaced || "-"}
    //     </span>
    //   ),
    // },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
      key: "subjectName",
      width: 350,
      render: (name: string) => (
        <span className="text-gray-900 dark:text-white">{name}</span>
      ),
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
      key: "credit",
      width: 80,
      align: "center",
      render: (credit: number) => (
        <span className=" text-gray-900 dark:text-white">{credit}</span>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "grade",
      key: "grade",
      width: 80,
      align: "center",
      render: (grade: number) => (
        <Tag color="blue">{grade > 0 ? grade.toFixed(1) : "-"}</Tag>
      ),
      sorter: (a, b) => a.grade - b.grade,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      fixed: "right",
      render: (status: string) => getStatusTag(status),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Spin spinning={uploading}>
          <Upload
            accept=".xlsx,.xls,.csv"
            maxCount={1}
            beforeUpload={handleUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} size="large" disabled={uploading}>
              {uploading ? "Đang upload..." : "Upload bảng điểm"}
            </Button>
          </Upload>
        </Spin>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Định dạng: Excel (.xlsx, .xls) - Đúng mẫu bảng điểm nhà trường
        </span>
      </div>

      {/* Statistics */}
      {/* {showStats && (
        <Card className="border border-gray-200 dark:border-gray-700 mb-4">
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                  {stats.totalCourses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng số môn
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="text-3xl font-semibold text-green-600 dark:text-green-400 mb-1">
                  {stats.passedCourses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Môn đã qua
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {stats.totalCredits}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng tín chỉ
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="text-center">
                <div className="text-3xl font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  {stats.gpa}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  GPA
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )} */}

      {/* Filters */}
      {/* <Card className="border border-gray-200 dark:border-gray-700 mb-4"> */}
      <div className="flex flex-col md:flex-row gap-4 mt-3">
        <Input.Search
          placeholder="Tìm kiếm môn học hoặc mã môn..."
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1"
          size="large"
        />
        <Select
          placeholder="Chọn học kỳ"
          allowClear
          value={selectedSemester}
          onChange={setSelectedSemester}
          className="w-full md:w-48"
          size="large"
          options={[
            { label: "Tất cả học kỳ", value: null },
            ...semestersNumber.map((sem) => ({ label: sem, value: sem })),
          ]}
        />
        <Select
          placeholder="Chọn trạng thái"
          allowClear
          value={selectedStatus}
          onChange={setSelectedStatus}
          className="w-full md:w-48"
          size="large"
          options={[
            { label: "Tất cả trạng thái", value: null },
            { label: "Đã qua", value: "Passed" },
            { label: "Đang học", value: "Studying" },
            { label: "Không qua", value: "Not passed" },
            { label: "Chưa bắt đầu", value: "Not started" },
          ]}
        />
        <Button type="primary" onClick={handleReset} size="large">
          Thiết lập lại
        </Button>
      </div>
      {/* </Card> */}

      {/* Table */}
      <div className="dark:border-gray-600">
        {data.length === 0 ? (
          <Empty
            description="Chưa có bảng điểm. Vui lòng upload file bảng điểm"
            style={{ marginTop: 48, marginBottom: 48 }}
          />
        ) : (
          <Table
            columns={columns}
            bordered
            size="middle"
            dataSource={filteredData}
            rowKey="studentTranscriptId"
            locale={{ emptyText: "Không có dữ liệu" }}
            pagination={false}
            className="academic-transcript-table"
          />
        )}
      </div>
    </div>
  );
}
