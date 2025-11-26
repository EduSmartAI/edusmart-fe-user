// src/components/Stats.tsx
import React from "react";

interface StatItem {
  value: string;
  label: string;
  colorClass: string;
}

const stats: StatItem[] = [
  { value: "15K+", label: "Học viên đang học", colorClass: "text-blue-500" },
  { value: "92%", label: "Hoàn thành lộ trình", colorClass: "text-blue-400" },
  { value: "350+", label: "Chủ đề luyện tập", colorClass: "text-blue-500" },
  { value: "80+", label: "Chuyên gia hướng dẫn", colorClass: "text-blue-400" },
  { value: "16", label: "Năm phát triển", colorClass: "text-blue-500" },
];

const Stats: React.FC = () => (
  <section className="pt-12 bg-white dark:bg-gray-900">
    {/* Header */}
    <div className="max-w-3xl mx-auto text-center px-4">
      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white pb-12">
        Thành công của chúng tôi
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Những con số dưới đây phản ánh mức độ gắn bó của học viên với lộ trình
        học tập được cá nhân hóa bởi EduSmart. AI đánh giá tiến độ mỗi ngày và
        tự động đề xuất nội dung phù hợp để bạn luôn đi đúng hướng.
      </p>
    </div>

    {/* Stats grid */}
    <div className="mt-12 max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center">
      {stats.map((item, idx) => (
        <div key={idx}>
          <span
            className={`text-4xl md:text-5xl font-extrabold ${item.colorClass}`}
          >
            {item.value}
          </span>
          <p className="mt-2 text-gray-800 dark:text-gray-200">{item.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
