// app/learning-path/assessment/processing/page.tsx
import { Suspense } from "react";
import { Spin } from "antd";
import ProcessingClient from "./Client";

// (Tuỳ chọn) Nếu bạn muốn chắc chắn không SSG trang này:
// export const dynamic = "force-dynamic";

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <ProcessingClient />
    </Suspense>
  );
}
