"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Button,
  Input,
  Empty,
  Spin,
  message,
  Typography,
  Space,
  Popconfirm,
  Tag,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { LessonNoteDto } from "EduSmart/api/api-course-service";
import { useCourseStore } from "EduSmart/stores/course/courseStore";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

const { TextArea } = Input;
const { Text, Title } = Typography;

type Props = {
  lessonId: string;
  currentVideoTime?: number; // Current video playback time in seconds
  onJumpToTime?: (timeSeconds: number) => void; // Callback to jump video to specific time
};

export default function LessonNotes({
  lessonId,
  currentVideoTime = 0,
  onJumpToTime,
}: Props) {
  // State
  const [notes, setNotes] = useState<LessonNoteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Store
  const lessonNotesCreate = useCourseStore((s) => s.lessonNotesCreate);
  const lessonNotesList = useCourseStore((s) => s.lessonNotesList);
  const lessonNotesUpdate = useCourseStore((s) => s.lessonNotesUpdate);
  const lessonNotesDelete = useCourseStore((s) => s.lessonNotesDelete);

  // Fetch notes
  const fetchNotes = async (page: number = currentPage) => {
    if (!lessonId) return;

    setLoading(true);
    try {
      const response = await lessonNotesList({
        lessonId,
        page,
        size: pageSize,
      });

      if (response.data.success && response.data.response) {
        setNotes(response.data.response.items ?? []);
        setTotalCount(response.data.response.totalCount ?? 0);
        setCurrentPage(response.data.response.pageNumber ?? 1);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      message.error("Không thể tải ghi chú. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Load notes on mount and when lessonId changes
  useEffect(() => {
    fetchNotes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Handle create note
  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) {
      message.warning("Vui lòng nhập nội dung ghi chú!");
      return;
    }

    // Get current video time from video element
    const videoElement = document.querySelector("video");
    const timeSeconds = videoElement
      ? Math.floor(videoElement.currentTime)
      : Math.floor(currentVideoTime);

    setSubmitting(true);
    try {
      const response = await lessonNotesCreate(
        {
          content: newNoteContent.trim(),
          timeSeconds,
        },
        { lessonId },
      );

      if (response.data.success) {
        message.success("Đã tạo ghi chú!");
        setNewNoteContent("");

        // Refresh notes
        setTimeout(() => {
          fetchNotes(1);
        }, 300);
      } else {
        message.error(
          response.data.message ?? "Không thể tạo ghi chú. Vui lòng thử lại!",
        );
      }
    } catch (error) {
      console.error("Error creating note:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update note
  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) {
      message.warning("Vui lòng nhập nội dung ghi chú!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await lessonNotesUpdate(
        noteId,
        { content: editContent.trim() },
        { lessonId },
      );

      if (response.data.success) {
        message.success("Đã cập nhật ghi chú!");
        setEditingNoteId(null);
        setEditContent("");

        // Refresh notes
        setTimeout(() => {
          fetchNotes(currentPage);
        }, 300);
      } else {
        message.error(
          response.data.message ??
            "Không thể cập nhật ghi chú. Vui lòng thử lại!",
        );
      }
    } catch (error) {
      console.error("Error updating note:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete note
  const handleDeleteNote = async (noteId: string) => {
    setSubmitting(true);
    try {
      const response = await lessonNotesDelete(noteId, { lessonId });

      if (response.data.success) {
        message.success("Đã xóa ghi chú!");

        // Refresh notes
        setTimeout(() => {
          fetchNotes(currentPage);
        }, 300);
      } else {
        message.error(
          response.data.message ?? "Không thể xóa ghi chú. Vui lòng thử lại!",
        );
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const startEditing = (note: LessonNoteDto) => {
    setEditingNoteId(note.noteId ?? null);
    setEditContent(note.content ?? "");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="lesson-notes">
      {/* Create Note Section */}
      <Card
        size="small"
        className="mb-4"
        title={
          <Space>
            <PlusOutlined />
            <span>Tạo ghi chú mới</span>
          </Space>
        }
      >
        <Space direction="vertical" className="w-full">
          {/* <div className="flex items-center gap-2 text-sm text-neutral-500">
            <ClockCircleOutlined />
            <Text type="secondary">
              Thời điểm: {formatTime(Math.floor(currentVideoTime))}
            </Text>
          </div> */}
          <TextArea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Nhập nội dung ghi chú tại thời điểm này..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleCreateNote}
              loading={submitting}
              disabled={!newNoteContent.trim()}
            >
              Lưu ghi chú
            </Button>
          </div>
        </Space>
      </Card>

      {/* Notes List Header */}
      <div className="mb-4 flex items-center justify-between">
        <Title level={5} className="!mb-0">
          <FileTextOutlined className="mr-2" />
          Ghi chú của bạn ({totalCount})
        </Title>
      </div>

      {/* Notes List */}
      <Spin spinning={loading}>
        {notes.length === 0 && !loading ? (
          <Empty
            description="Chưa có ghi chú nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-8"
          />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={notes}
            renderItem={(note) => (
              <List.Item
                key={note.noteId}
                className="!border-b border-neutral-200 dark:border-neutral-800 !px-0"
              >
                <Card size="small" className="w-full">
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-2">
                    <Space>
                      <Tag
                        color="blue"
                        className="cursor-pointer"
                        onClick={() =>
                          onJumpToTime && onJumpToTime(note.timeSeconds ?? 0)
                        }
                      >
                        <ClockCircleOutlined className="mr-1" />
                        {formatTime(note.timeSeconds ?? 0)}
                      </Tag>
                      <Text type="secondary" className="text-xs">
                        {moment(note.createdAt).fromNow()}
                      </Text>
                    </Space>

                    {/* Action Buttons */}
                    {editingNoteId !== note.noteId && (
                      <Space size="small">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => startEditing(note)}
                        >
                          Sửa
                        </Button>
                        <Popconfirm
                          title="Xóa ghi chú"
                          description="Bạn có chắc muốn xóa ghi chú này?"
                          onConfirm={() => handleDeleteNote(note.noteId ?? "")}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            loading={submitting}
                          >
                            Xóa
                          </Button>
                        </Popconfirm>
                      </Space>
                    )}
                  </div>

                  {/* Note Content */}
                  {editingNoteId === note.noteId ? (
                    <div>
                      <TextArea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        className="mb-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={cancelEditing}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          icon={<SaveOutlined />}
                          onClick={() => handleUpdateNote(note.noteId ?? "")}
                          loading={submitting}
                          disabled={!editContent.trim()}
                        >
                          Lưu
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Text className="whitespace-pre-wrap">{note.content}</Text>
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );
}
