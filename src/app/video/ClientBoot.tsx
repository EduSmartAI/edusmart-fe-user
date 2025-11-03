// ví dụ: src/app/ClientBoot.tsx
"use client";
import { useEffect } from "react";
import { cleanupAction } from "../(auth)/action";

export default function ClientBoot() {
  useEffect(() => {
    cleanupAction().catch(() => {});
  }, []);
  return null;
}
