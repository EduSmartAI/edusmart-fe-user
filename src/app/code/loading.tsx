"use client";

import type { FC } from "react";
import React from "react";
import { Layout, Card, Skeleton, Spin } from "antd";

const { Header, Content } = Layout;

const LoadingPage: FC = () => {
  return (
    <Layout className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <Header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
        <div className="flex items-center gap-3">
          <Skeleton.Input
            active
            size="small"
            className="!h-6 !w-32 rounded-md"
          />
          <Skeleton.Input
            active
            size="small"
            className="!h-5 !w-12 rounded-md"
          />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton.Input
            active
            size="small"
            className="!h-8 !w-28 rounded-md"
          />
          <Skeleton.Avatar active size="small" />
        </div>
      </Header>

      <Content className="p-4">
        <div className="grid h-[calc(100vh-72px)] grid-cols-[minmax(260px,360px)_minmax(0,1fr)] gap-4">
          {/* Left: description panel */}
          <Card className="h-full overflow-hidden bg-slate-900/90">
            <Skeleton
              active
              title={{ width: "60%" }}
              paragraph={{ rows: 12 }}
            />
          </Card>

          {/* Right: code editor + testcase area */}
          <div className="flex h-full flex-col gap-4">
            {/* Code editor area */}
            <Card className="flex-1 bg-slate-900/90">
              <div className="flex h-full items-center justify-center">
                <Spin size="large" />
              </div>
            </Card>

            {/* Testcase / result area */}
            <Card className="h-56 bg-slate-900/90">
              <Skeleton
                active
                title={{ width: "40%" }}
                paragraph={{ rows: 4 }}
              />
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoadingPage;
