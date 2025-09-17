// Simple React component to test Quiz Store integration
import React from "react";
import { useQuizStore } from "../../stores/Quiz/QuizStore";
import { mockQuizSeries } from "./quizStoreTestData";

export const QuizStoreTestComponent: React.FC = () => {
    const {
        // State
        currentSeries,
        selectedQuizIds,
        currentQuizId,
        seriesStatus,
        userAnswers,

        // Actions
        initializeSeries,
        resetSeries,
        toggleQuizSelection,
        startSelectedQuizzes,
        updateAnswer,
        navigateToNextQuiz,
        navigateToPreviousQuiz,

        // Computed
        getSeriesProgress,
        getQuizProgress,
        getNavigationInfo,
        validateSubmission,
        getQuizStatus,
    } = useQuizStore();

    const seriesProgress = getSeriesProgress();
    const validation = validateSubmission();
    const navInfo = getNavigationInfo();

    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h2>🧪 Quiz Store Test Component</h2>

            {/* Control Panel */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>🎮 Controls</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => initializeSeries(mockQuizSeries)}>
                        Initialize Series
                    </button>
                    <button onClick={resetSeries}>Reset Store</button>
                    <button onClick={() => toggleQuizSelection("quiz_1")}>
                        Toggle Quiz 1
                    </button>
                    <button onClick={() => toggleQuizSelection("quiz_2")}>
                        Toggle Quiz 2
                    </button>
                    <button onClick={() => toggleQuizSelection("quiz_3")}>
                        Toggle Quiz 3
                    </button>
                    <button
                        onClick={startSelectedQuizzes}
                        disabled={selectedQuizIds.length === 0}
                    >
                        Start Selected Quizzes
                    </button>
                </div>
            </div>

            {/* Series Info */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>📊 Series Information</h3>
                <p>
                    <strong>Title:</strong>{" "}
                    {currentSeries?.title || "No series loaded"}
                </p>
                <p>
                    <strong>Status:</strong> {seriesStatus}
                </p>
                <p>
                    <strong>Selected Quizzes:</strong>{" "}
                    {selectedQuizIds.join(", ") || "None"}
                </p>
                <p>
                    <strong>Current Quiz:</strong> {currentQuizId || "None"}
                </p>
                <p>
                    <strong>Total Quizzes:</strong>{" "}
                    {currentSeries?.quizzes.length || 0}
                </p>
            </div>

            {/* Progress */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>📈 Progress</h3>
                <p>
                    <strong>Selected:</strong> {seriesProgress.selectedQuizzes}/
                    {seriesProgress.totalQuizzes}
                </p>
                <p>
                    <strong>Completed:</strong>{" "}
                    {seriesProgress.completedQuizzes}
                </p>
                <p>
                    <strong>In Progress:</strong>{" "}
                    {seriesProgress.inProgressQuizzes}
                </p>
                <p>
                    <strong>Overall Progress:</strong>{" "}
                    {seriesProgress.overallProgress}%
                </p>
                <p>
                    <strong>Can Submit:</strong>{" "}
                    {seriesProgress.canSubmit ? "✅" : "❌"}
                </p>
            </div>

            {/* Navigation */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>🧭 Navigation</h3>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                    }}
                >
                    <button
                        onClick={navigateToPreviousQuiz}
                        disabled={!navInfo.canGoPrev}
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={navigateToNextQuiz}
                        disabled={!navInfo.canGoNext}
                    >
                        Next →
                    </button>
                </div>
                <p>
                    <strong>Position:</strong> {navInfo.currentIndex + 1}/
                    {navInfo.totalSelected}
                </p>
                <p>
                    <strong>Can Go Previous:</strong>{" "}
                    {navInfo.canGoPrev ? "✅" : "❌"}
                </p>
                <p>
                    <strong>Can Go Next:</strong>{" "}
                    {navInfo.canGoNext ? "✅" : "❌"}
                </p>
            </div>

            {/* Validation */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>✅ Validation</h3>
                <p>
                    <strong>Can Submit:</strong>{" "}
                    {validation.canSubmit ? "✅" : "❌"}
                </p>
                <p>
                    <strong>Completed Quizzes:</strong>{" "}
                    {validation.completedQuizzes.length}
                </p>
                <p>
                    <strong>Incomplete Quizzes:</strong>{" "}
                    {validation.incompleteQuizzes.length}
                </p>
                {validation.missingRequirements.length > 0 && (
                    <div>
                        <strong>Missing Requirements:</strong>
                        <ul>
                            {validation.missingRequirements.map(
                                (req, index) => (
                                    <li key={index}>{req}</li>
                                ),
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Quiz Details */}
            {currentSeries && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "15px",
                        border: "1px solid #ccc",
                    }}
                >
                    <h3>📋 Quiz Details</h3>
                    {currentSeries.quizzes.map((quiz) => {
                        const progress = getQuizProgress(quiz.id);
                        const status = getQuizStatus(quiz.id);
                        const isSelected = selectedQuizIds.includes(quiz.id);

                        return (
                            <div
                                key={quiz.id}
                                style={{
                                    margin: "10px 0",
                                    padding: "10px",
                                    backgroundColor: isSelected
                                        ? "#e6f3ff"
                                        : "#f5f5f5",
                                    border:
                                        currentQuizId === quiz.id
                                            ? "2px solid #007bff"
                                            : "1px solid #ddd",
                                }}
                            >
                                <h4>
                                    {quiz.title} {isSelected ? "✅" : ""}
                                </h4>
                                <p>
                                    <strong>Status:</strong> {status}
                                </p>
                                <p>
                                    <strong>Progress:</strong>{" "}
                                    {progress.answered}/{progress.total} (
                                    {progress.percentage}%)
                                </p>
                                <p>
                                    <strong>Completed:</strong>{" "}
                                    {progress.completed ? "✅" : "❌"}
                                </p>

                                {/* Quick answer buttons for testing */}
                                {quiz.questions.map((question) => (
                                    <div
                                        key={question.id}
                                        style={{ margin: "5px 0" }}
                                    >
                                        <span style={{ fontSize: "12px" }}>
                                            {question.text.substring(0, 30)}...
                                        </span>
                                        <button
                                            style={{
                                                marginLeft: "10px",
                                                fontSize: "10px",
                                            }}
                                            onClick={() =>
                                                updateAnswer(
                                                    quiz.id,
                                                    question.id,
                                                    [question.options[0].id],
                                                )
                                            }
                                        >
                                            Answer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* User Answers Debug */}
            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                }}
            >
                <h3>🔍 Debug: User Answers</h3>
                <pre
                    style={{
                        fontSize: "10px",
                        background: "#f0f0f0",
                        padding: "10px",
                    }}
                >
                    {JSON.stringify(userAnswers, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default QuizStoreTestComponent;
