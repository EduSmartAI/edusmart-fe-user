"use client";
import React, { useState } from "react";
import { Card, Form, Input, Select, Button, Typography, Space, Alert } from "antd";
import ReactMarkdown from "react-markdown";
import { Client } from "@gradio/client";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";

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

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    setError("");
    setMarkdown("");

    try {
      // Kết nối tới Gradio server
      const client = await Client.connect(values.serverUrl!.replace(/\/+$/, ""));
      // Gọi endpoint /ui_run với 2 tham số
      const result = await client.predict("/ui_run", {
        topic: values.topic,
        audience: values.audience,
      });

      // Gradio trả về 1 phần tử string (kết quả markdown)
      const output = (result?.data ?? result) as string | string[] | { data: string };
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
    <Card style={{ maxWidth: 960, margin: "24px auto" }} bodyStyle={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3} style={{ marginBottom: 8 }}>
            Course Writer (Gradio → Ant Design)
          </Title>
          <Text type="secondary">
            Điền <code>topic</code> và chọn <code>audience</code> → gọi <code>/ui_run</code> và render Markdown.
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

        {error && <Alert type="error" showIcon message="Error" description={error} />}

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
      </Space>
    </Card>
    
    </BaseScreenAdmin>
  );
}
