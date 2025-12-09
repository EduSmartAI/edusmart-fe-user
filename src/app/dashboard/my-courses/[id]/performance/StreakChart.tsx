"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

const ColumnChart = dynamic(
  () => import("@ant-design/charts").then((mod) => mod.Column),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[200px]">
        <Spin size="small" />
      </div>
    ),
  },
);

interface StreakChartData {
  label: string;
  days: number;
}

interface StreakChartProps {
  data: StreakChartData[];
  maxStreakDays: number;
  hasData: boolean;
}

export default function StreakChart({ data, maxStreakDays, hasData }: StreakChartProps) {
  if (!hasData || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Chưa đủ dữ liệu để hiển thị biểu đồ streak.
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          Hãy học đều đặn để tạo dữ liệu streak
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ColumnChart
        data={data}
        xField="label"
        yField="days"
        height={200}
        autoFit
        animation={false}
        color="l(90) 0:#22d3ee 0.5:#10b981 1:#0ea5e9"
        columnWidthRatio={0.55}
        padding={[12, 16, 40, 40]}
        legend={false}
        xAxis={{
          title: undefined,
          label: {
            autoHide: true,
            autoRotate: false,
            style: {
              fill: "#6b7280",
              fontSize: 11,
            },
          },
          line: {
            style: {
              stroke: "#e5e7eb",
            },
          },
        }}
        yAxis={{
          title: { 
            text: "Ngày",
            style: {
              fill: "#6b7280",
              fontSize: 12,
            },
          },
          min: 0,
          max: Math.max(maxStreakDays, 1),
          tickInterval: Math.max(1, Math.ceil(maxStreakDays / 5)),
          label: {
            formatter: (val: string) => `${Number(val)}`,
            style: {
              fill: "#6b7280",
              fontSize: 11,
            },
          },
          line: {
            style: {
              stroke: "#e5e7eb",
            },
          },
          grid: {
            line: {
              style: {
                stroke: "#f3f4f6",
                lineDash: [4, 4],
              },
            },
          },
        }}
        tooltip={{
          formatter: (datum: { label: string; days: number }) => ({
            name: "Số ngày",
            value: `${datum.days} ngày`,
          }),
          domStyles: {
            "g2-tooltip": {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "8px 12px",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
        columnStyle={{
          radius: [12, 12, 0, 0],
          fill: "l(90) 0:#22d3ee 0.5:#10b981 1:#0ea5e9",
          stroke: "#0ea5e9",
          lineWidth: 1.25,
          shadowColor: "rgba(16, 185, 129, 0.35)",
          shadowBlur: 12,
          shadowOffsetY: 4,
        }}
      />
      <div className="mt-3 text-center">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Cột càng cao → streak dài hơn
        </p>
      </div>
    </div>
  );
}

