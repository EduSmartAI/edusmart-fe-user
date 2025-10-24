import React from "react";
import BaseScreenAdmin from "EduSmart/layout/BaseScreenAdmin";
import { MultiColorThemeProvider } from "EduSmart/components/Themes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseScreenAdmin>
      <MultiColorThemeProvider>{children}</MultiColorThemeProvider>
    </BaseScreenAdmin>
  );
}
