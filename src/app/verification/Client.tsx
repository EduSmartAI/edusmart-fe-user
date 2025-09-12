"use client";
import React from "react";
import { Button } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useSpring, useTrail, animated } from "@react-spring/web";
import { useRouter } from "next/navigation";
interface ResultScreenProps {
  type: "success" | "error";
  title: string;
  description: string;
}

export default function ResultScreen({
  type,
  title,
  description,
}: ResultScreenProps) {
  const isSuccess = type === "success";
  const router = useRouter();
  // Stagger cho text + button
  const trail = useTrail(2, {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 180, friction: 18 },
    delay: 400,
  });

  // Animation icon
  const iconAnim = useSpring({
    from: { opacity: 0, scale: 0.5, rotateZ: -30 },
    to: { opacity: 1, scale: 1, rotateZ: 0 },
    config: { tension: 200, friction: 12 },
  });

  const onContinue = () => {
    if (isSuccess){
      router.push("/Login");
    }
    router.push("/Register");
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-6 ${
        isSuccess
          ? "bg-gradient-to-br from-emerald-200 via-white to-cyan-300"
          : "bg-gradient-to-br from-red-300 via-white to-rose-300"
      }`}
    >
      {/* Icon */}
      <animated.div style={iconAnim}>
        {isSuccess ? (
          <CheckCircleFilled className="!text-7xl !text-green-500 drop-shadow-lg" />
        ) : (
          <CloseCircleFilled className="!text-7xl !text-red-500 drop-shadow-lg" />
        )}
      </animated.div>

      {/* Title */}
      <animated.div
        style={trail[0]}
        className={`text-3xl font-extrabold tracking-wide my-6 ${
          isSuccess
            ? "bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent"
        }`}
      >
        {title}
      </animated.div>

      {/* Description */}
      <animated.p
        style={trail[1]}
        className="text-center text-gray-600 leading-relaxed max-w-md mb-8"
      >
        {description}
      </animated.p>

      {/* Button */}
      <animated.div style={trail[1]} className="transition-transform">
        <Button
          type="primary"
          size="large"
          onClick={onContinue}
          className={`!px-10 !h-12 !text-lg !font-semibold !rounded-xl 
               shadow-lg hover:shadow-xl ${
                 isSuccess
                   ? "!bg-gradient-to-r !from-green-500 !to-emerald-600"
                   : "!bg-gradient-to-r !from-red-500 !to-rose-600"
               }`}
        >
          {isSuccess ? "Tiếp tục" : "Quay lại đăng ký"}
        </Button>
      </animated.div>
    </div>
  );
}
