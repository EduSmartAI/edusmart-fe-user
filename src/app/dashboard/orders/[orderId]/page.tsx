"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Button,
  Spin,
  Result,
  Steps,
  Table,
  Row,
  Col,
  Space,
} from "antd";
import { PaymentClient, CourseClient } from "EduSmart/hooks/apiClient";
import type { SelectOrderResponseEntity } from "EduSmart/api/api-payment-service";
import type { CourseDetailForGuestDto } from "EduSmart/api/api-course-service";

const { Title, Text } = Typography;

// Order status mapping
const ORDER_STATUS = {
  1: { text: "Chờ thanh toán", color: "orange" },
  2: { text: "Đã thanh toán", color: "green" },
  3: { text: "Đã hủy", color: "default" },
  4: { text: "Hoàn tiền", color: "blue" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<SelectOrderResponseEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [courseNames, setCourseNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      setIsLoading(true);
      try {
        const response = await PaymentClient.api.v1OrderSelectOrderList({
          orderId: orderId,
        });

        if (response.data?.success && response.data.response) {
          const orders = response.data.response;
          if (orders && orders.length > 0) {
            const orderData = orders[0];
            setOrder(orderData);

            // Fetch course names for all order items
            if (orderData.orderItems && orderData.orderItems.length > 0) {
              const courseIds = orderData.orderItems
                .map((item) => item.courseId)
                .filter((id): id is string => !!id);

              const courseNamesMap: Record<string, string> = {};
              await Promise.all(
                courseIds.map(async (courseId) => {
                  try {
                    const courseResponse =
                      await CourseClient.api.v1CoursesDetail(courseId);
                    if (
                      courseResponse.data?.success &&
                      courseResponse.data.response
                    ) {
                      courseNamesMap[courseId] =
                        courseResponse.data.response.title || courseId;
                    }
                  } catch (error) {
                    console.error(`Failed to fetch course ${courseId}:`, error);
                    courseNamesMap[courseId] = courseId;
                  }
                }),
              );
              setCourseNames(courseNamesMap);
            }
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const formatPrice = (price?: number) => {
    if (!price) return "0₫";
    return `${price.toLocaleString("vi-VN")}₫`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status?: number) => {
    return (
      ORDER_STATUS[status as keyof typeof ORDER_STATUS] || {
        text: "Không xác định",
        color: "default",
      }
    );
  };

  const getOrderSteps = () => {
    const status = order?.status || 1;
    let current = 0;
    let stepStatus: "error" | "wait" | "process" | "finish" | undefined =
      undefined;

    if (status === 2) {
      current = 2;
      stepStatus = "finish";
    } else if (status === 3 || status === 4) {
      current = 1;
      stepStatus = "error";
    } else {
      current = 0;
      stepStatus = "process";
    }

    return {
      current,
      status: stepStatus,
      items: [
        {
          title: "Đơn hàng đã tạo",
          description: formatDate(order?.orderDate),
        },
        {
          title: "Thanh toán",
          description:
            status === 2
              ? formatDate(order?.paidAt)
              : status === 3
                ? "Đã hủy"
                : status === 4
                  ? "Đã hoàn tiền"
                  : "Chờ thanh toán",
        },
        {
          title: "Hoàn tất",
          description: status === 2 ? "Đơn hàng thành công" : "",
        },
      ],
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <Result
        status="404"
        title="Không tìm thấy đơn hàng"
        subTitle="Đơn hàng không tồn tại hoặc đã bị xóa."
        extra={
          <Button
            type="primary"
            onClick={() => router.push("/dashboard/orders")}
          >
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const steps = getOrderSteps();

  const courseColumns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên khóa học",
      dataIndex: "courseId",
      key: "courseId",
      render: (courseId: string) => (
        <Text>{courseNames[courseId] || "Đang tải..."}</Text>
      ),
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (price: number) => (
        <Text type="secondary">{formatPrice(price)}</Text>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      align: "right" as const,
      render: (discount: number) => (
        <Text type={discount > 0 ? "danger" : "secondary"}>
          {discount > 0 ? `-${formatPrice(discount)}` : "—"}
        </Text>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "finalPrice",
      key: "finalPrice",
      align: "right" as const,
      render: (finalPrice: number) => (
        <Text strong>{formatPrice(finalPrice)}</Text>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Order Information */}
      <Card>
        <Space direction="vertical" size="large" className="w-full">
          {/* Two Columns Layout */}
          <Row gutter={24}>
            {/* Left Column - Order Details */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle" className="w-full">
                <Text strong className="text-base">
                  Thông tin chi tiết
                </Text>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="flex justify-between mb-3">
                      <Text type="secondary">Mã đơn hàng</Text>
                      <Text>{orderId.toUpperCase()}</Text>
                    </div>
                    <div className="flex justify-between mb-3">
                      <Text type="secondary">Trạng thái</Text>
                      <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
                    </div>
                    <div className="flex justify-between mb-3">
                      <Text type="secondary">Ngày đặt</Text>
                      <Text>{formatDate(order.orderDate)}</Text>
                    </div>
                    <div className="flex justify-between mb-3">
                      <Text type="secondary">Ngày thanh toán</Text>
                      <Text>
                        {order.paidAt ? formatDate(order.paidAt) : "—"}
                      </Text>
                    </div>
                    <div className="flex justify-between mb-3">
                      <Text type="secondary">Số lượng khóa học</Text>
                      <Text>{order.orderItems?.length || 0}</Text>
                    </div>
                    <div className="flex justify-between mb-3">
                      <Text type="secondary">Đơn vị tiền tệ</Text>
                      <Text>{order.currency || "VND"}</Text>
                    </div>
                  </Space>
                </div>
              </Space>
            </Col>

            {/* Right Column - Price Summary */}
            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle" className="w-full">
                <Text strong className="text-base">
                  Tóm tắt đơn hàng
                </Text>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <Space direction="vertical" className="w-full" size="small">
                    <div className="flex justify-between mb-3">
                      <Text>Tạm tính</Text>
                      <Text>{formatPrice(order.subtotal)}</Text>
                    </div>
                    {order.discount && order.discount > 0 && (
                      <div className="flex justify-between mb-3">
                        <Text>Giảm giá</Text>
                        <Text>-{formatPrice(order.discount)}</Text>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Text strong>Tổng cộng:</Text>
                      <Text strong className="text-lg">
                        {formatPrice(order.finalAmount)}
                      </Text>
                    </div>
                  </Space>
                </div>
              </Space>
            </Col>
          </Row>

          {/* Timeline - Full Width */}
          <div className="my-2">
            <Text strong className="text-base block mb-3">
              Tiến trình đơn hàng
            </Text>
            <Steps {...steps} direction="horizontal" size="small" />
          </div>
        </Space>
      </Card>

      {/* Order Items */}
      <Card title="Danh sách khóa học">
        <Table
          columns={courseColumns}
          dataSource={order.orderItems || []}
          rowKey="orderItemId"
          pagination={false}
        />
      </Card>

      {/* Actions */}
      {/* {order.status === 2 && (
        <Card>
          <div className="text-center">
            <Text type="secondary" className="block mb-4">
              Đơn hàng đã được thanh toán thành công. Bạn có thể bắt đầu học
              ngay.
            </Text>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/dashboard/my-courses")}
            >
              Vào học ngay
            </Button>
          </div>
        </Card>
      )} */}

      {/* {order.status === 1 && (
        <Card>
          <div className="text-center">
            <Text type="secondary" className="block mb-4">
              Đơn hàng đang chờ thanh toán. Vui lòng hoàn tất thanh toán để bắt
              đầu học.
            </Text>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/cart")}
            >
              Tiếp tục thanh toán
            </Button>
          </div>
        </Card>
      )} */}
    </div>
  );
}
