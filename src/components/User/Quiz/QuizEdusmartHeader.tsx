"use client";
import React from "react";
import { Layout, Typography } from "antd";

const { Header } = Layout;
const { Title } = Typography;

interface QuizEdusmartHeaderProps {
    className?: string;
}

const QuizEdusmartHeader: React.FC<QuizEdusmartHeaderProps> = ({
    className = "",
}) => {
    return (
        <Header
            className={`bg-[#49bbbd] shadow-lg ${className}`}
            style={{
                padding: "0 2rem",
                height: "auto",
                lineHeight: "normal",
            }}
        >
            <div className="flex items-center justify-start py-4">
                <div className="flex items-center space-x-3">
                    {/* FPT Logo */}
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-green-500 to-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                FPT
                            </span>
                        </div>
                    </div>

                    {/* EduSmart Text */}
                    <Title
                        level={2}
                        className="!mb-0 !text-white font-light italic"
                        style={{
                            fontFamily: "cursive, sans-serif",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                        }}
                    >
                        EduSmart
                    </Title>
                </div>
            </div>
        </Header>
    );
};

export default QuizEdusmartHeader;
