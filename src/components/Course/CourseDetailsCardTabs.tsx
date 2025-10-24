"use client";

import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

type Props = {
  title?: string;
  items: TabsProps["items"];
  defaultActiveKey?: string;
  tabsClassName?: string;
};

export default function CourseDetailsCardTabs({
  title = "Course details",
  items,
  defaultActiveKey = "overview",
  tabsClassName,
}: Props) {
  return (
    <div className="mt-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="px-3 py-2 lg:px-4 lg:py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="px-2 lg:px-4 pt-4 pb-16">
        <Tabs
          defaultActiveKey={defaultActiveKey}
          items={items}
          className={tabsClassName ?? "[&_.ant-tabs-nav]:mb-0"}
        />
      </div>
    </div>
  );
}
