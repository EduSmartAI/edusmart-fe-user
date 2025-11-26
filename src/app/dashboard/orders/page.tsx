"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Empty,
  Spin,
  Card,
  Tooltip,
} from "antd";
import { PaymentClient, CourseClient } from "EduSmart/hooks/apiClient";
import type {
  SelectOrderResponseEntity,
  OrderItemEntity,
} from "EduSmart/api/api-payment-service";

const { Text } = Typography;

// Order status mapping - simple colors only
const ORDER_STATUS = {
  1: { text: "Chờ thanh toán", color: "orange" },
  2: { text: "Đã thanh toán", color: "green" },
  3: { text: "Đã hủy", color: "default" },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<SelectOrderResponseEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [courseNames, setCourseNames] = useState<Record<string, string>>({});

  const fetchOrders = async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    try {
      const response = await PaymentClient.api.v1OrderSelectOrderList({
        pageIndex: page - 1,
        pageSize,
      });

      if (response.data?.success && response.data.response) {
        const ordersData = response.data.response;
        setOrders(ordersData);
        setPagination({
          current: page,
          pageSize,
          total: response.data.totalRecords || 0,
        });

        // Fetch course names for all order items
        const allCourseIds = new Set<string>();
        ordersData.forEach((order) => {
          order.orderItems?.forEach((item) => {
            if (item.courseId) allCourseIds.add(item.courseId);
          });
        });

        const courseNamesMap: Record<string, string> = {};
        await Promise.all(
          Array.from(allCourseIds).map(async (courseId) => {
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
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price?: number) => {
    if (!price) return "0₫";
    return `${price.toLocaleString("vi-VN")}₫`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (orderId: string) => (
        <Tooltip title={orderId}>
          <Text
            strong
            className="font-mono text-xs"
            style={{ color: "#1890ff" }}
          >
            {orderId?.toUpperCase()}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 160,
      render: (date: string) => (
        <Text className="text-sm">{formatDate(date)}</Text>
      ),
    },
    {
      title: "Số khóa học",
      dataIndex: "orderItems",
      key: "itemCount",
      width: 120,
      align: "center" as const,
      render: (items: OrderItemEntity[]) => (
        <Text strong className="text-sm">
          {items?.length || 0}
        </Text>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "finalAmount",
      key: "finalAmount",
      width: 140,
      align: "right" as const,
      render: (amount: number) => (
        <Space direction="vertical" size={0} className="w-full text-right">
          {/* {record.discount && record.discount > 0 && (
            <Text delete type="secondary" className="text-xs">
              {formatPrice(record.subtotal)}
            </Text>
          )} */}
          <Text strong className="text-base">
            {formatPrice(amount)}
          </Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center" as const,
      render: (status: number) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center" as const,
      render: (_: unknown, record: SelectOrderResponseEntity) => (
        <Button
          type="link"
          onClick={() => router.push(`/dashboard/orders/${record.orderId}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record: SelectOrderResponseEntity) => {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
        <Text strong className="block mb-3 text-sm">
          Chi tiết đơn hàng:
        </Text>
        <Space direction="vertical" className="w-full" size="small">
          {record.orderItems?.map((item: OrderItemEntity, index: number) => (
            <div
              key={item.orderItemId || index}
              className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <Text className="text-sm">
                  {item.courseId && courseNames[item.courseId]
                    ? courseNames[item.courseId]
                    : "Đang tải..."}
                </Text>
              </div>
              <Space size="large">
                {item.discount && item.discount > 0 && (
                  <Text delete type="secondary" className="text-xs">
                    {formatPrice(item.price)}
                  </Text>
                )}
                <Text strong className="text-sm">
                  {formatPrice(item.finalPrice)}
                </Text>
              </Space>
            </div>
          ))}
        </Space>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <Card>
          <Empty description="Bạn chưa có đơn hàng nào" className="py-12" />
        </Card>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="orderId"
            loading={isLoading}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => (record.orderItems?.length || 0) > 0,
            }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} đơn hàng`,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: (page, pageSize) => {
                fetchOrders(page, pageSize);
              },
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      )}
    </div>
  );
}
