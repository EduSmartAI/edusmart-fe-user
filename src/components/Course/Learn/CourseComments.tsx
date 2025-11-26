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
  Tag,
} from "antd";
import {
  UserOutlined,
  SendOutlined,
  MessageOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
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
  interface CommentWithReplies extends CourseCommentDetailsDto {
    replies?: CourseCommentDetailsDto[];
    replyCount?: number;
  }

  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [allCommentsData, setAllCommentsData] = useState<CommentWithReplies[]>(
    [],
  );

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
      // Fetch all comments (backend returns all with pageSize=1000)
      const response = await courseCommentsList({
        courseId,
        page: currentPage - 1,
        size: 1000,
      });

      if (response.data.success && response.data.response) {
        const allComments = response.data.response.items ?? [];

        // Filter only top-level comments (parentCommentId = null)
        const topLevelComments = allComments.filter((c) => !c.parentCommentId);

        // Sort top-level comments by createdAt (newest first)
        topLevelComments.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );

        // Build replies map
        const repliesMap = new Map<string, CourseCommentDetailsDto[]>();
        allComments.forEach((c) => {
          if (c.parentCommentId) {
            const existing = repliesMap.get(c.parentCommentId) ?? [];
            repliesMap.set(c.parentCommentId, [...existing, c]);
          }
        });

        // Attach replies to parent comments and sort by createdAt
        const commentsWithReplies = topLevelComments.map((c) => {
          const replies = repliesMap.get(c.commentId ?? "") ?? [];
          // Sort replies by createdAt (oldest first)
          const sortedReplies = replies.sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime(),
          );
          return {
            ...c,
            replies: sortedReplies,
            replyCount: sortedReplies.length,
          };
        });

        console.log("=== Comments Processing ===");
        console.log("Total items from API:", allComments.length);
        console.log("Parent comments:", topLevelComments.length);
        console.log(
          "Reply comments:",
          allComments.length - topLevelComments.length,
        );
        console.log("Comments with replies:", commentsWithReplies);

        // Store all comments data for client-side pagination
        setAllCommentsData(commentsWithReplies);
        setTotalCount(topLevelComments.length);

        // Apply client-side pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedComments = commentsWithReplies.slice(
          startIndex,
          endIndex,
        );

        console.log("=== Pagination ===");
        console.log("Current page:", page);
        console.log("Page size:", pageSize);
        console.log("Start index:", startIndex);
        console.log("End index:", endIndex);
        console.log("Paginated comments:", paginatedComments);
        console.log("Paginated comments length:", paginatedComments.length);

        setComments(paginatedComments);
        setCurrentPage(page);
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

  // Handle page change (client-side pagination)
  const handlePageChange = (page: number, size?: number) => {
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
      // Re-paginate with new page size
      const startIndex = 0;
      const endIndex = size;
      const paginatedComments = allCommentsData.slice(startIndex, endIndex);
      setComments(paginatedComments);
    } else {
      setCurrentPage(page);
      // Re-paginate with new page
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedComments = allCommentsData.slice(startIndex, endIndex);
      setComments(paginatedComments);
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
                        <div className="flex items-center gap-2">
                          <Text strong className="text-sm">
                            {comment.userDisplayName ?? "Người dùng"}
                          </Text>
                          <Text type="secondary" className="text-xs">
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
                        {/* Show actual replies count */}
                        {comment.replyCount && comment.replyCount > 0 && (
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

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {comment.replies.map(
                            (reply: CourseCommentDetailsDto) => (
                              <div
                                key={reply.commentId}
                                className="flex items-start gap-3 pl-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border-l-2 border-violet-400"
                              >
                                <Avatar
                                  size={32}
                                  icon={<UserOutlined />}
                                  className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-500"
                                />
                                <div className="flex-1 min-w-0">
                                  {/* User info & timestamp with Teacher badge */}
                                  <div className="flex items-center gap-2 mb-1">
                                    <Text strong className="text-sm">
                                      {reply.userDisplayName ?? "Người dùng"}
                                    </Text>
                                    {/* Teacher badge - you can add logic to check if user is teacher */}
                                    <Tag
                                      icon={<CheckCircleFilled />}
                                      color="success"
                                      className="!m-0 text-xs"
                                    >
                                      Giáo viên
                                    </Tag>
                                    <Text type="secondary" className="text-xs">
                                      {moment(reply.createdAt).fromNow()}
                                    </Text>
                                  </div>

                                  {/* Reply content */}
                                  <Paragraph className="mb-0 text-sm whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                                    {reply.content}
                                  </Paragraph>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />

            {/* Pagination */}
            {totalCount > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={handlePageChange}
                  showSizeChanger
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} bình luận`
                  }
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
