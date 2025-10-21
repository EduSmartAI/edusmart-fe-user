import React from 'react';
import BaseScreenAdmin from 'EduSmart/layout/BaseScreenAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseScreenAdmin>
      {children}
    </BaseScreenAdmin>
  );
}