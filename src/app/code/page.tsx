import { SubmitPayload } from "EduSmart/components/Code/CodeEditor";
import CodeEditorContainer from "EduSmart/components/Code/CodeEditorContainer";

export default function Page() {
  async function handleSubmit(payload: SubmitPayload) {
    "use server";
    console.log("Submit từ CodeEditor:", payload);
  }

  return <CodeEditorContainer onSubmit={handleSubmit} />;
}
