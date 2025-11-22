"use client";
import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Alert,
} from "antd";
import ReactMarkdown from "react-markdown";
import { Client } from "@gradio/client";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import { MarkdownView } from "EduSmart/components/MarkDown/MarkdownView";

const { Title, Text } = Typography;

type Audience =
  | "beginner"
  | "beginner-to-intermediate"
  | "intermediate"
  | "advanced";

const AUDIENCE_OPTIONS: { label: string; value: Audience }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Beginner → Intermediate", value: "beginner-to-intermediate" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

type FormValues = {
  serverUrl?: string; // ví dụ: http://127.0.0.1:7860/
  topic: string;
  audience: Audience;
};

const DEFAULT_VALUES: FormValues = {
  serverUrl: "https://3571e896146e.ngrok-free.app",
  topic: "Hello!!",
  audience: "beginner-to-intermediate",
};

export default function GradioCourseGenerator() {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");
  const test = "## Tổng quan tiến độ\n- Bạn đã hoàn thành 1 trong tổng số 2 bài học, đạt 50% tiến độ. Điều này cho thấy bạn đang nỗ lực để tiếp cận kiến thức mới.\n- Điểm gốc của bạn là 60, trong khi điểm do AI chấm là 50, cho thấy bạn cần cố gắng hơn để cải thiện kỹ năng.\n\n## Điểm mạnh\n- Sự hiểu biết về chỉ số của phần tử đầu tiên trong mảng C.\n\n## Cần cải thiện\n- Đọc lại tài liệu về mảng và chuỗi trong C.\n- Luyện tập với các câu hỏi về C để cải thiện kỹ năng.\n- Tìm kiếm các nguồn tài liệu và hướng dẫn trực tuyến để hỗ trợ học tập.\n\n## Hành động đề xuất (1–2 tuần tới)\n- Ôn lại tài liệu về mảng và chuỗi trong C, mỗi ngày 30 phút.\n- Luyện tập với 5–10 câu hỏi cơ bản về C mỗi tuần.\n- Thực hành viết mã với các bài tập từ bài học, hoàn thành ít nhất 2 bài trong module này.\n\n## Mục tiêu 7–14 ngày tới\n- Hoàn thành thêm 1 bài trong chương \"Functions and Arrays\" trong vòng 7 ngày.\n- Dành 20 phút mỗi ngày để luyện lại các khái niệm về mảng và chuỗi trong C trong 2 tuần tới.\n\n## Câu hỏi tự phản chiếu\n- Phần nào bạn thấy tốn nhiều thời gian nhất?\n- Thói quen học nào khiến bạn dễ xao nhãng?\n- Nếu chỉ chọn 1 kỹ năng để cải thiện tuần này, bạn sẽ chọn gì?\n\n## Bài học nên ưu tiên trong module hiện tại\n- [Arrays: Declaration and Initialization](https://www.edusmart.pro.vn/course/d95ac9f4-a95f-422d-8270-623db7115e2d/learn?lessonId=f5fc4412-b716-433e-8217-afa9c2b9158e) – Củng cố kiến thức về cách khai báo và khởi tạo mảng.\n- [Function Basics: Declaration and Definition](https://www.edusmart.pro.vn/course/d95ac9f4-a95f-422d-8270-623db7115e2d/learn?lessonId=4f7b7a8d-2b26-44ea-b041-474d459689c5) – Nắm vững cách khai báo và định nghĩa hàm trong C.\n\nHãy tiếp tục cố gắng, bạn đang đi đúng hướng!"

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    setError("");
    setMarkdown("");

    try {
      // Kết nối tới Gradio server
      const client = await Client.connect(
        values.serverUrl!.replace(/\/+$/, ""),
      );
      // Gọi endpoint /ui_run với 2 tham số
      const result = await client.predict("/ui_run", {
        topic: values.topic,
        audience: values.audience,
      });

      // Gradio trả về 1 phần tử string (kết quả markdown)
      const output = (result?.data ?? result) as
        | string
        | string[]
        | { data: string };
      const text =
        typeof output === "string"
          ? output
          : Array.isArray(output)
            ? String(output[0] ?? "")
            : String(output?.data ?? output ?? "");

      setMarkdown(text);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || "Failed to call Gradio endpoint.");
      } else {
        setError("Failed to call Gradio endpoint.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseScreenAdmin>
      <Card
        style={{ maxWidth: 960, margin: "24px auto" }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>
              Course Writer (Gradio → Ant Design)
            </Title>
            <Text type="secondary">
              Điền <code>topic</code> và chọn <code>audience</code> → gọi{" "}
              <code>/ui_run</code> và render Markdown.
            </Text>
          </div>

          <Form<FormValues>
            form={form}
            layout="vertical"
            initialValues={DEFAULT_VALUES}
            onFinish={onFinish}
          >
            <Form.Item
              label="Gradio Server URL"
              name="serverUrl"
              extra="Ví dụ: http://127.0.0.1:7860/"
              rules={[
                { required: true, message: "Server URL is required" },
                { type: "url", message: "Server URL không hợp lệ" },
              ]}
            >
              <Input placeholder="http://127.0.0.1:7860/" />
            </Form.Item>

            <Form.Item
              label="Chủ đề (topic)"
              name="topic"
              rules={[{ required: true, message: "Vui lòng nhập topic" }]}
            >
              <Input placeholder="Ví dụ: Introduction to Git" />
            </Form.Item>

            <Form.Item
              label="Đối tượng (audience)"
              name="audience"
              rules={[{ required: true, message: "Vui lòng chọn audience" }]}
            >
              <Select options={AUDIENCE_OPTIONS} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Generate
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setMarkdown("");
                    setError("");
                  }}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {error && (
            <Alert type="error" showIcon message="Error" description={error} />
          )}

          <Card
            title="Kết quả Markdown"
            loading={loading}
            bodyStyle={{ maxHeight: 500, overflow: "auto" }}
          >
            {markdown ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            ) : (
              <Text type="secondary">Chưa có kết quả.</Text>
            )}
          </Card>
          <MarkdownView content={test} collapsible collapsedHeight={320} />
        </Space>
      </Card>
    </BaseScreenAdmin>
  );
}
