export enum DropdownOptions {
  Latest = 1,
  Oldest = 2,
  Popular = 3,
}

// Technology Type enum - matches BE enum
export enum TechnologyType {
  ProgrammingLanguage = 1,
  Framework = 2,
  Tool = 3,
  Platform = 4,
  Database = 5,
  Other = 6,
}

// Technology Type display names
export const TechnologyTypeLabels: Record<TechnologyType, string> = {
  [TechnologyType.ProgrammingLanguage]: "Ngôn ngữ lập trình",
  [TechnologyType.Framework]: "Framework",
  [TechnologyType.Tool]: "Công cụ",
  [TechnologyType.Platform]: "Nền tảng",
  [TechnologyType.Database]: "Cơ sở dữ liệu",
  [TechnologyType.Other]: "Khác",
};
