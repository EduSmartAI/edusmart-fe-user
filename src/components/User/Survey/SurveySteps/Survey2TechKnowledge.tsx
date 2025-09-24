"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Typography, Select } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Survey2FormValues, TechnologyLevel } from "EduSmart/types";
import { TechnologyType } from "EduSmart/enum/enum";

const { Title, Paragraph } = Typography;

interface Survey2TechKnowledgeProps {
  initialData?: Survey2FormValues | null;
  onComplete: (data: Survey2FormValues) => void;
  onBack?: (data: Survey2FormValues) => void;
  technologies?: Array<{
    technologyId: string;
    technologyName: string;
    technologyType: number;
  }>;
  isLoading?: boolean;
}

const Survey2TechKnowledge: React.FC<Survey2TechKnowledgeProps> = ({
  initialData,
  onComplete,
  onBack,
  technologies: apiTechnologies = [],
}) => {
  const [form] = Form.useForm();
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    TechnologyLevel[]
  >([]);

  // Transform API data to component format
  const technologies = apiTechnologies.map((tech) => ({
    id: tech.technologyId,
    name: tech.technologyName,
    type: tech.technologyType as TechnologyType,
  }));

  useEffect(() => {
    if (initialData) {
      // Combine all technology levels from different categories
      const allTechs = [
        ...(initialData.programmingLanguages || []),
        ...(initialData.frameworks || []),
        ...(initialData.tools || []),
        ...(initialData.platforms || []),
        ...(initialData.databases || []),
        ...(initialData.others || []),
      ];
      setSelectedTechnologies(allTechs);
    }
  }, [initialData]);

  const handleTechnologyAdd = (technologyId: string) => {
    const technology = technologies.find((t) => t.id === technologyId);
    if (!technology) return;

    const exists = selectedTechnologies.find(
      (t) => t.technologyId === technologyId,
    );
    if (exists) return;

    const newTech: TechnologyLevel = {
      technologyId: technology.id,
      technologyName: technology.name,
      level: "basic",
    };

    setSelectedTechnologies((prev) => [...prev, newTech]);
  };

  const handleTechnologyRemove = (technologyId: string) => {
    setSelectedTechnologies((prev) =>
      prev.filter((tech) => tech.technologyId !== technologyId),
    );
  };

  const getTechnologiesByType = (type: TechnologyType) => {
    return technologies.filter((tech) => tech.type === type);
  };

  const getSelectedTechnologiesByType = (type: TechnologyType) => {
    return selectedTechnologies.filter((tech) => {
      const techData = technologies.find((t) => t.id === tech.technologyId);
      return techData?.type === type;
    });
  };

  const getCurrentData = (): Survey2FormValues => {
    return {
      programmingLanguages: getSelectedTechnologiesByType(
        TechnologyType.ProgrammingLanguage,
      ),
      frameworks: getSelectedTechnologiesByType(TechnologyType.Framework),
      tools: getSelectedTechnologiesByType(TechnologyType.Tool),
      platforms: getSelectedTechnologiesByType(TechnologyType.Platform),
      databases: getSelectedTechnologiesByType(TechnologyType.Database),
      others: getSelectedTechnologiesByType(TechnologyType.Other),
    };
  };

  const onFinish = () => {
    const result = getCurrentData();
    window.scrollTo({ top: 0, behavior: "smooth" });
    onComplete(result);
  };

  const handleBack = () => {
    if (onBack) {
      const currentData = getCurrentData();
      onBack(currentData);
    }
  };

  const renderTechnologySection = (type: TechnologyType, title: string) => {
    const availableTechs = getTechnologiesByType(type);
    const selectedTechs = getSelectedTechnologiesByType(type);
    const unselectedTechs = availableTechs.filter(
      (tech) =>
        !selectedTechs.find((selected) => selected.technologyId === tech.id),
    );

    return (
      <Card
        size="small"
        className="border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
      >
        <div className="mb-6">
          <Title
            level={4}
            className="!mb-4 !text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              {type === TechnologyType.ProgrammingLanguage && "💻"}
              {type === TechnologyType.Framework && "⚛️"}
              {type === TechnologyType.Tool && "🛠️"}
              {type === TechnologyType.Platform && "☁️"}
              {type === TechnologyType.Database && "🗄️"}
            </div>
            {title}
          </Title>

          {/* Add Technology Dropdown */}
          <div className="mb-6">
            <Select
              placeholder={`Chọn ${title.toLowerCase()} để thêm vào danh sách`}
              style={{ width: "100%" }}
              onSelect={(value: string | undefined) =>
                value && handleTechnologyAdd(value)
              }
              value={undefined}
              options={unselectedTechs.map((tech) => ({
                label: tech.name,
                value: tech.id,
              }))}
              size="large"
              className="rounded-lg"
              disabled={unselectedTechs.length === 0}
            />
            {unselectedTechs.length === 0 && selectedTechs.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Đã chọn tất cả {title.toLowerCase()} có sẵn
              </div>
            )}
          </div>

          {/* Selected Technologies as Tags */}
          <div className="min-h-[80px]">
            {selectedTechs.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Đã chọn {selectedTechs.length} {title.toLowerCase()}:
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedTechs.map((tech) => (
                    <div
                      key={tech.technologyId}
                      className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {tech.technologyName}
                      </span>

                      {/* <Select
                        value={tech.level}
                        size="small"
                        style={{ width: 100 }}
                        onChange={(level) =>
                          handleLevelChange(tech.technologyId, level)
                        }
                        options={TECH_LEVELS}
                        className="rounded"
                      /> */}

                      {/* <Tag
                        color={getLevelColor(tech.level)}
                        className="rounded-full px-2 py-0 text-xs"
                      >
                        {TECH_LEVELS.find((l) => l.value === tech.level)?.label}
                      </Tag> */}

                      <Button
                        type="text"
                        size="small"
                        danger
                        onClick={() =>
                          handleTechnologyRemove(tech.technologyId)
                        }
                        className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full w-5 h-5 flex items-center justify-center p-0 ml-1"
                        title={`Xóa ${tech.technologyName}`}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                {/* <div className="text-3xl mb-3">
                  {type === "programming_language" && "💻"}
                  {type === "framework" && "⚛️"}
                  {type === "tool" && "🛠️"}
                  {type === "platform" && "☁️"}
                  {type === "database" && "🗄️"}
                </div>
                <div className="text-gray-500 dark:text-gray-400 font-medium">
                  Chưa chọn {title.toLowerCase()} nào
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Sử dụng dropdown phía trên để thêm {title.toLowerCase()}
                </div> */}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="text-2xl">💻</span>
          </div>
          <Title
            level={1}
            className="!mb-3 !text-3xl text-gray-800 dark:text-gray-100"
          >
            Độ am hiểu công nghệ
          </Title>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Đánh giá mức độ am hiểu của bạn với các công nghệ khác nhau
          </Paragraph>
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-8">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              {/* Sắp xếp tuần tự từ trên xuống dưới */}
              <div className="space-y-6 flex flex-col gap-6">
                {renderTechnologySection(
                  TechnologyType.ProgrammingLanguage,
                  "Ngôn ngữ lập trình",
                )}

                {renderTechnologySection(TechnologyType.Framework, "Framework")}

                {renderTechnologySection(TechnologyType.Tool, "Công cụ")}

                {renderTechnologySection(TechnologyType.Platform, "Nền tảng")}

                {renderTechnologySection(
                  TechnologyType.Database,
                  "Cơ sỏ dữ liệu",
                )}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  size="large"
                  className="px-6 py-3 h-auto rounded-xl border-gray-200 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
                >
                  Quay lại
                </Button>

                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  htmlType="submit"
                  size="large"
                  disabled={selectedTechnologies.length === 0}
                  className="px-8 py-3 h-auto rounded-xl bg-blue-600 hover:bg-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Tiếp tục
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Survey2TechKnowledge;
