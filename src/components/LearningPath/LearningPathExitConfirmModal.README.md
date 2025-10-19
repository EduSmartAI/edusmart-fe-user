# LearningPathExitConfirmModal

Reusable confirmation modal component for Learning Path flow. Use this when user wants to exit from survey, quiz, or any form where data might be lost.

## Features

- ✅ Customizable title, content, and button text
- ✅ Multiple types: `warning`, `danger`, `info`
- ✅ Optional warning message section
- ✅ Loading state support
- ✅ Responsive design with dark mode support
- ✅ Accessible (centered modal, keyboard support)

## Basic Usage

```tsx
import { LearningPathExitConfirmModal } from "EduSmart/components/LearningPath";
import { useState } from "react";

function MyComponent() {
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowExitModal(true)}>Exit</button>

      <LearningPathExitConfirmModal
        open={showExitModal}
        onConfirm={() => {
          // Handle exit logic
          clearAllData();
          router.push("/learning-path");
        }}
        onCancel={() => setShowExitModal(false)}
      />
    </>
  );
}
```

## Advanced Usage

### Survey Exit

```tsx
<LearningPathExitConfirmModal
  open={showExitModal}
  title="Xác nhận thoát khảo sát"
  content="Bạn có chắc chắn muốn thoát khảo sát? Tất cả dữ liệu đã nhập sẽ bị xóa hoàn toàn."
  warningMessage="Bạn sẽ phải bắt đầu lại từ đầu nếu muốn tiếp tục lộ trình học tập."
  confirmText="Thoát khảo sát"
  cancelText="Tiếp tục làm"
  onConfirm={handleConfirmExit}
  onCancel={handleCancelExit}
  type="danger"
/>
```

### Quiz Exit

```tsx
<LearningPathExitConfirmModal
  open={showExitModal}
  title="Thoát khỏi bài kiểm tra?"
  content="Bạn đang trong quá trình làm bài kiểm tra. Thoát ra sẽ làm mất toàn bộ tiến độ."
  warningMessage="Thời gian làm bài sẽ không được hoàn trả."
  confirmText="Thoát ngay"
  cancelText="Ở lại"
  onConfirm={handleExitQuiz}
  onCancel={() => setShowExitModal(false)}
  type="warning"
/>
```

### Form Exit

```tsx
<LearningPathExitConfirmModal
  open={showExitModal}
  title="Bạn có thay đổi chưa lưu"
  content="Có một số thay đổi chưa được lưu. Bạn có muốn thoát mà không lưu?"
  confirmText="Thoát không lưu"
  cancelText="Quay lại"
  onConfirm={handleExitWithoutSaving}
  onCancel={() => setShowExitModal(false)}
  type="info"
/>
```

### With Loading State

```tsx
const [isExiting, setIsExiting] = useState(false);

<LearningPathExitConfirmModal
  open={showExitModal}
  confirmLoading={isExiting}
  onConfirm={async () => {
    setIsExiting(true);
    await clearDataFromServer();
    setIsExiting(false);
    router.push("/learning-path");
  }}
  onCancel={() => setShowExitModal(false)}
/>;
```

## Props

| Prop             | Type                              | Default                             | Description                                    |
| ---------------- | --------------------------------- | ----------------------------------- | ---------------------------------------------- |
| `open`           | `boolean`                         | **Required**                        | Whether the modal is visible                   |
| `onConfirm`      | `() => void`                      | **Required**                        | Callback when user confirms exit               |
| `onCancel`       | `() => void`                      | **Required**                        | Callback when user cancels                     |
| `title`          | `string`                          | `"Xác nhận thoát"`                  | Title of the modal                             |
| `content`        | `string`                          | `"Bạn có chắc chắn muốn thoát?..."` | Main content/message                           |
| `warningMessage` | `string`                          | `undefined`                         | Optional warning message (shown in orange box) |
| `confirmText`    | `string`                          | `"Thoát"`                           | Text for the confirm button                    |
| `cancelText`     | `string`                          | `"Hủy"`                             | Text for the cancel button                     |
| `confirmLoading` | `boolean`                         | `false`                             | Show loading state on confirm button           |
| `type`           | `"warning" \| "danger" \| "info"` | `"warning"`                         | Type affects icon and button colors            |

## Types

### `warning` (default)

- Orange icon and button
- Use for: general warnings, non-critical exits

### `danger`

- Red icon and button
- Use for: data loss, permanent actions, critical exits

### `info`

- Blue icon and button
- Use for: informational confirmations, soft warnings

## Integration Examples

### In Survey Page

```tsx
// pages/survey/page.tsx
import { LearningPathExitConfirmModal } from "EduSmart/components/LearningPath";
import { learningPathProgress } from "EduSmart/components/LearningPath";
import { useSurvey } from "EduSmart/hooks/survey";

const [showExitModal, setShowExitModal] = useState(false);
const survey = useSurvey();

const handleExitClick = () => setShowExitModal(true);

const handleConfirmExit = () => {
  learningPathProgress.clearProgress();
  survey.resetSurvey();
  localStorage.removeItem("survey-storage");
  setShowExitModal(false);
  router.push("/learning-path");
};

// In JSX
<LearningPathExitConfirmModal
  open={showExitModal}
  onConfirm={handleConfirmExit}
  onCancel={() => setShowExitModal(false)}
  type="danger"
/>;
```

### In Quiz Page

```tsx
// pages/quiz/page.tsx
const handleExitQuiz = () => {
  // Clear quiz progress
  quizStore.clearProgress();
  // Mark step as incomplete
  learningPathProgress.clearStep(2);
  // Redirect
  router.push("/learning-path");
};

<LearningPathExitConfirmModal
  open={showExitModal}
  title="Thoát bài kiểm tra?"
  warningMessage="Điểm số sẽ không được tính nếu bạn thoát giữa chừng."
  onConfirm={handleExitQuiz}
  onCancel={() => setShowExitModal(false)}
/>;
```

## Styling

The component uses Tailwind CSS and Ant Design. You can customize further with:

```tsx
// Custom className (add to Modal wrapper)
className = "my-custom-modal";

// Or override Ant Design theme in your app
```

## Accessibility

- ✅ Keyboard navigation (Esc to close, Enter to confirm)
- ✅ Focus trap within modal
- ✅ Screen reader friendly
- ✅ Semantic HTML structure

## Notes

- Modal is centered on screen
- Works with dark mode
- Mobile responsive
- Uses Ant Design Modal under the hood
