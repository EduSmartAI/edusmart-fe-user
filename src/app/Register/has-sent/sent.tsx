"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Divider, Typography } from "antd";
import {
  FiCheck,
  FiExternalLink,
  FiHome,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { ZoomIn } from "EduSmart/components/Animation/ZoomIn";

type Props = {
  email: string;
  onResend?: () => Promise<void> | void;
  backHref?: string; // ví dụ "/"
  manageHref?: string; // ví dụ "/account/preferences"
  brand?: string; // ví dụ "EduSmart"
  cooldownSec?: number; // mặc định 30
};

const { Title, Paragraph, Text } = Typography;

/* ===== Utils ===== */
function maskEmail(raw: string) {
  if (!raw || !raw.includes("@")) return "email của bạn";
  const [name, domain] = raw.split("@");
  const n = name.length;
  const head = name.slice(0, Math.min(2, n));
  const tail = n > 4 ? name.slice(-1) : "";
  const masked = `${head}${"*".repeat(Math.max(1, n - head.length - tail.length))}${tail}`;
  return `${masked}@${domain}`;
}

function webmailUrl(email: string): string | null {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (!domain) return null;
  if (domain.includes("gmail")) return "https://mail.google.com/";
  if (
    domain.includes("outlook") ||
    domain.includes("hotmail") ||
    domain.includes("live")
  )
    return "https://outlook.live.com/mail/";
  if (domain.includes("yahoo")) return "https://mail.yahoo.com/";
  if (domain.includes("icloud")) return "https://www.icloud.com/mail/";
  if (domain.includes("proton")) return "https://mail.proton.me/";
  return null;
}

export default function VerificationSentCard({
  email,
  backHref = "/home",
  manageHref = "/Register",
  brand = "EduSmart",
}: Props) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [left]);

  const masked = useMemo(() => maskEmail(email), [email]);
  const providerUrl = useMemo(() => webmailUrl(email), [email]);

  return (
    <div className="w-full max-w-2xl p-4 sm:p-6">
      <ZoomIn>
        <div
          className="
          relative overflow-hidden rounded-3xl
          bg-white/90 dark:bg-slate-900/80 backdrop-blur
          shadow-[0_20px_60px_-15px_rgba(2,6,23,.3)]
          ring-1 ring-slate-200/70 dark:ring-white/10
        "
        >
          {/* viền gradient nhẹ */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent [background:linear-gradient(145deg,rgba(16,185,129,.25),rgba(79,70,229,.25))_border-box] [mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />

          <div className="px-6 sm:px-10 py-8 sm:py-10 text-center">
            {/* icon success + vòng ping */}
            <div className="relative mx-auto mb-6 h-16 w-16">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 dark:from-emerald-900/30 dark:to-cyan-900/30" />
              <div className="absolute -inset-2 rounded-3xl border border-emerald-400/30 dark:border-emerald-300/20 animate-[ping_2s_ease-out_infinite]" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl">
                <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>

            <Title level={2} className="!mb-1 !text-slate-900 dark:!text-white">
              Đã gửi mã xác nhận!
            </Title>
            <Paragraph className="!mt-1 !text-slate-600 dark:!text-slate-300">
              Chúng tôi vừa gửi mã đến{" "}
              <Text strong className="!text-slate-900 dark:!text-white">
                {masked}
              </Text>
              . Vui lòng kiểm tra Hộp thư đến và cả mục Spam/Quảng cáo.
            </Paragraph>

            {/* nút chính */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left sm:text-center">
              <Link href={manageHref} className="no-underline">
                <Button
                  block
                  size="large"
                  icon={<FiUser />}
                  className="h-11 rounded-xl !font-semibold !text-slate-700 dark:!text-slate-100"
                >
                  Quay lại đăng kí
                </Button>
              </Link>

              {providerUrl ? (
                <a href={providerUrl} target="_blank" className="no-underline">
                  <Button
                    block
                    size="large"
                    icon={<FiMail />}
                    className="h-11 rounded-xl !font-semibold"
                  >
                    Mở hộp thư <FiExternalLink className="ml-1" />
                  </Button>
                </a>
              ) : (
                <a href="mailto:" className="no-underline">
                  <Button
                    block
                    size="large"
                    icon={<FiMail />}
                    className="h-11 rounded-xl !font-semibold"
                  >
                    Mở ứng dụng mail
                  </Button>
                </a>
              )}

              <Link href={backHref} className="no-underline">
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<FiHome />}
                  className="h-11 rounded-xl !font-semibold"
                >
                  Về trang chủ
                </Button>
              </Link>
            </div>

            <Divider className="!my-8" />

            {/* hướng dẫn ngắn */}
            <div className="mx-auto max-w-xl text-left sm:text-center">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  • Tìm với từ khóa <b>{brand}</b> trong hộp thư.
                </li>
                <li>
                  • Kiểm tra <i>Spam / Quảng cáo</i> nếu chưa thấy.
                </li>
                <li>• Đảm bảo địa chỉ email là chính xác.</li>
              </ul>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <FiShield />{" "}
                <span>
                  Mã xác nhận chỉ có hiệu lực trong thời gian giới hạn.
                </span>
              </div>
            </div>

            {/* footer brand */}
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
              <FiMail className="opacity-70" />
              <span className="text-sm">{brand} · bảo mật & đơn giản</span>
            </div>
          </div>
        </div>
      </ZoomIn>
    </div>
  );
}
