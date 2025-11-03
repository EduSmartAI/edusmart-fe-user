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
  const test = "## Tổng quan\n- Khóa học đã có 3 bài được chấm với **điểm do AI chấm** trung bình là 33.33. \n- Mức hiệu chỉnh trung bình là 0.\n\n### Bảng tổng quan\n| Chỉ số | Giá trị |\n|---|---|\n| Số đánh giá | 3 |\n| Điểm AI trung bình | 33.33 |\n| Điểm thô trung bình | 33.33 |\n| Mức hiệu chỉnh trung bình | 0 |\n| Số bài theo scope | Lesson: 3 · Module: 0 |\n| Ghi chú | Điểm hiện tại là 'điểm do AI chấm'. Khống hiển thị điểm gốc. |\n\n### Nhận xét tổng quan\n- Kết quả học tập cho thấy điểm số thấp, cho thấy học viên cần cải thiện kỹ năng trong các bài học. Xu hướng điểm hiện tại cho thấy sự cần thiết phải củng cố kiến thức và kỹ năng.\n\n## Điểm mạnh nổi bật\n- Có kiến thức cơ bản về hình ảnh chuyên nghiệp.\n- Giảng viên chia sẻ kiến thức thực tế.\n- Hiểu rõ về khái niệm đánh giá đầu vào và ứng dụng trong thực tế.\n\n## Vấn đề & Khoảng trống kỹ năng\n- Cần cải thiện khả năng phân tích và đánh giá thông tin.\n- Cần tìm hiểu thêm về các phương pháp học nhanh và hiệu quả.\n- Cần củng cố kỹ năng giao tiếp và tạo niềm tin cho học viên.\n\n## Phân tầng chất lượng\n- Dựa trên các mẫu gần nhất, tỷ trọng ước lượng cho thấy không có học viên nào đạt mức xuất sắc, một số học viên có thể ở mức cần củng cố, trong khi đa số đang ở mức nguy cơ. Hạn chế dữ liệu từ số mẫu ít (3 mẫu) có thể ảnh hưởng đến độ chính xác của phân tích.\n\n## Ưu tiên hành động (1–2 tuần)\n- Ôn lại kiến thức về phân tích và đánh giá thông tin mỗi ngày 2–3 bài ngắn.\n- Luyện tập kỹ năng giao tiếp thông qua các buổi thảo luận nhóm.\n- Làm bài tập thực hành về tạo niềm tin cho học viên.\n- Viết nhật ký học tập để theo dõi tiến bộ cá nhân.\n\n## Nhóm rủi ro cao\n### 🔹 Lesson có điểm thấp\n| Lesson | Module liên quan | Điểm AI TB | Số bài | Đánh giá ngắn |\n|---|---|---|---|---|\n| Giữ hình ảnh chuyên nghiệp trước học viên | Củng cố hình ảnh chuyên nghiệp | 0 | 1 | Cần cải thiện kỹ năng và kiến thức. |\n| Tạo sự tin tưởng với học viên | Tạo sự tin tưởng ban đầu | 0 | 1 | Cần củng cố kỹ năng giao tiếp. |\n\n**Phân tích nhanh (Lesson)**\n- Có 2 lesson rủi ro với điểm trung bình từ 0 đến 0.\n- Chủ đề lặp lại đáng chú ý: Củng cố hình ảnh chuyên nghiệp: 1 lesson, Tạo sự tin tưởng ban đầu: 1 lesson.\n- Vấn đề phổ biến: Thiếu kỹ năng phân tích và đánh giá thông tin, kỹ năng giao tiếp yếu.\n- Gợi ý trọng tâm: Cần cải thiện kỹ năng giao tiếp và tạo niềm tin cho học viên.\n\n### 🔸 Module có điểm thấp\n- Không có module nào ở mức rủi ro.\n\n**Phân tích nhanh (Module)**\n- —\n\n## Nguyên nhân gốc\n- Thiếu nền tảng khái niệm trong các bài học.\n- Kỹ năng giao tiếp và tạo niềm tin cho học viên chưa được phát triển.\n- Thời gian luyện tập không đều và không đủ.\n\n## Xu hướng theo thời gian\n- — \n\n## Gợi ý học tập nhanh\n- Tìm kiếm tài liệu học tập trực tuyến về phân tích và đánh giá thông tin.\n- Tham gia các khóa học kỹ năng giao tiếp.\n- Luyện tập qua các bài tập thực hành hàng ngày."

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
