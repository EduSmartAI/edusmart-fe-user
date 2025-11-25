"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Avatar,
  Button,
  Input,
  Pagination,
  Space,
  Typography,
  Divider,
  Empty,
  Spin,
  message,
} from "antd";
import { UserOutlined, SendOutlined, MessageOutlined } from "@ant-design/icons";
import { CourseCommentDetailsDto } from "EduSmart/api/api-course-service";
import { useCourseStore } from "EduSmart/stores/course/courseStore";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

type Props = {
  courseId: string;
};

export default function CourseComments({ courseId }: Props) {
  // State
  const [comments, setComments] = useState<CourseCommentDetailsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // Store
  const courseCommentsCreate = useCourseStore((s) => s.courseCommentsCreate);
  const courseCommentsList = useCourseStore((s) => s.courseCommentsList);
  const courseCommentsRepliesCreate = useCourseStore(
    (s) => s.courseCommentsRepliesCreate,
  );

  // Fetch comments
  const fetchComments = async (page: number = currentPage) => {
    if (!courseId) return;

    setLoading(true);
    try {
      const response = await courseCommentsList({
        courseId,
        page,
        size: pageSize,
      });

      if (response.data.success && response.data.response) {
        setComments(response.data.response.items ?? []);
        setTotalCount(response.data.response.totalCount ?? 0);
        setCurrentPage(response.data.response.pageNumber ?? 1);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Không thể tải bình luận. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Load comments on mount and when courseId changes
  useEffect(() => {
    fetchComments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Handle page change
  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
      fetchComments(1);
    } else {
      setCurrentPage(page);
      fetchComments(page);
    }
  };

  // Handle submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await courseCommentsCreate(
        { content: newComment.trim() },
        { courseId },
      );

      if (response.data.success) {
        message.success("Đã đăng bình luận!");
        setNewComment("");
        // Refresh comments - go to first page to see new comment
        setCurrentPage(1);
        fetchComments(1);
      } else {
        message.error(
          response.data.message ??
            "Không thể đăng bình luận. Vui lòng thử lại!",
        );
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle submit reply
  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) {
      message.warning("Vui lòng nhập nội dung trả lời!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await courseCommentsRepliesCreate(
        parentCommentId,
        { content: replyContent.trim() },
        { courseId },
      );

      if (response.data.success) {
        message.success("Đã đăng trả lời!");
        setReplyContent("");
        setReplyingTo(null);
        // Refresh current page
        fetchComments(currentPage);
      } else {
        message.error(
          response.data.message ?? "Không thể đăng trả lời. Vui lòng thử lại!",
        );
      }
    } catch (error) {
      console.error("Error creating reply:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <div className="course-comments">
      {/* New Comment Input */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-indigo-500"
          />
          <div className="flex-1">
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="mb-2"
            />
            <div className="flex justify-end">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmitComment}
                loading={submitting}
                disabled={!newComment.trim()}
              >
                Đăng bình luận
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      {/* Comments List */}
      <div className="mb-4">
        <Text strong className="text-base">
          <MessageOutlined className="mr-2" />
          Tất cả bình luận ({totalCount})
        </Text>
      </div>

      <Spin spinning={loading}>
        {comments.length === 0 && !loading ? (
          <Empty
            description="Chưa có bình luận nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-8"
          />
        ) : (
          <>
            <List
              itemLayout="vertical"
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item
                  key={comment.commentId}
                  className="!border-b border-neutral-200 dark:border-neutral-800 !px-0"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      size={40}
                      icon={<UserOutlined />}
                      className="flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      {/* User info & timestamp */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Text strong className="text-sm">
                            {comment.userDisplayName ?? "Người dùng"}
                          </Text>
                          <Text type="secondary" className="text-xs ml-2">
                            {moment(comment.createdAt).fromNow()}
                          </Text>
                        </div>
                      </div>

                      {/* Comment content */}
                      <Paragraph className="mb-2 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </Paragraph>

                      {/* Actions */}
                      <Space size="middle" className="text-xs">
                        <Button
                          type="link"
                          size="small"
                          className="!p-0 !h-auto"
                          onClick={() => {
                            if (replyingTo === comment.commentId) {
                              handleCancelReply();
                            } else {
                              setReplyingTo(comment.commentId ?? null);
                              setReplyContent("");
                            }
                          }}
                        >
                          {replyingTo === comment.commentId ? "Hủy" : "Trả lời"}
                        </Button>
                        {comment.replyCount !== undefined &&
                          comment.replyCount > 0 && (
                            <Text type="secondary" className="text-xs">
                              {comment.replyCount} câu trả lời
                            </Text>
                          )}
                      </Space>

                      {/* Reply Input */}
                      {replyingTo === comment.commentId && (
                        <div className="mt-3 pl-4 border-l-2 border-violet-500">
                          <TextArea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Viết câu trả lời của bạn..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Button size="small" onClick={handleCancelReply}>
                              Hủy
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              icon={<SendOutlined />}
                              onClick={() =>
                                handleSubmitReply(comment.commentId ?? "")
                              }
                              loading={submitting}
                              disabled={!replyContent.trim()}
                            >
                              Đăng
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />

            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={handlePageChange}
                  // showSizeChanger
                  // showTotal={(total, range) =>
                  //   `${range[0]}-${range[1]} của ${total} bình luận`
                  // }
                  pageSizeOptions={["6", "10", "20", "50"]}
                />
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  );
}
