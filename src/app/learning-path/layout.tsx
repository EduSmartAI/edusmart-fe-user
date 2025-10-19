import { MultiColorThemeProvider } from "EduSmart/components/Themes";
// import LearningPathErrorBoundary from "EduSmart/components/LearningPath/LearningPathErrorBoundary";

export default function LearningPathRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MultiColorThemeProvider>{children}</MultiColorThemeProvider>;
}
