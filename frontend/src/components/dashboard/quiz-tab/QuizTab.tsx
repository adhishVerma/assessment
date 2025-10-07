import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Radio,
  Group,
  Stack,
  Title,
  Text,
  Progress,
  Container,
  Badge,
  Paper,
} from "@mantine/core";
import { Question, Skill } from "../../../services/types";
import { skillService } from "../../../services/skillService";
import { questionService } from "../../../services/questionService";
import { quizService } from "../../../services/quizService";

const QuizTab = () => {
  const [step, setStep] = useState("skill-selection"); // 'skill-selection' | 'quiz' | 'completed'
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const skillsList = await skillService.getAll();
      setSkills(skillsList);
    } catch (err) {
      console.error(err);
      setError("Failed to load skills");
    }
  };

  // Function to start quiz session and fetch questions
  const handleSkillSelect = async (skillId: number) => {
    setSelectedSkill(skillId);
    setLoading(true);
    setError(null);
    
    try {
      // Start quiz session
      const startResponse = await quizService.startSession(skillId);
      setSessionId(startResponse.id);
      
      // Fetch questions for the skill
      const fetchedQuestions = await questionService.getBySkill(skillId);
      setQuestions(fetchedQuestions);
      
      setStep("quiz");
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentAnswer("");
    } catch (err) {
      console.error(err);
      setError("Failed to start quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to save answer
  const handleAnswerSave = async (
    questionId: number,
    selectedAnswer: "A" | "B" | "C" | "D"
  ) => {
    if (!sessionId) {
      console.error("No active session");
      return;
    }

    try {
      const response = await quizService.submitAnswer(
        sessionId,
        questionId,
        selectedAnswer
      );
      
      console.log("Answer saved:", response);

      // Store answer locally
      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedAnswer,
      }));
    } catch (err) {
      console.error("Failed to save answer:", err);
      setError("Failed to save answer. Please try again.");
      throw err;
    }
  };

  // Function to handle next question
  const handleNext = async () => {
    if (!currentAnswer) {
      alert("Please select an answer before proceeding");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    // Convert the selected answer text to its letter label
    let answerLabel: "A" | "B" | "C" | "D";
    if (currentAnswer === currentQuestion.optionA) answerLabel = "A";
    else if (currentAnswer === currentQuestion.optionB) answerLabel = "B";
    else if (currentAnswer === currentQuestion.optionC) answerLabel = "C";
    else answerLabel = "D";
    
    setLoading(true);
    setError(null);
    
    try {
      await handleAnswerSave(currentQuestion.id, answerLabel);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setCurrentAnswer("");
      } else {
        // Submit quiz
        await handleSubmitQuiz();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle quiz submission
  const handleSubmitQuiz = async () => {
    if (!sessionId) {
      console.error("No active session");
      return;
    }

    try {
      await quizService.completeSession(sessionId);
      console.log("Quiz completed successfully");
      setStep("completed");
    } catch (err) {
      console.error("Failed to complete quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  // Reset quiz
  const handleRestart = () => {
    setStep("skill-selection");
    setSelectedSkill(null);
    setSessionId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer("");
    setError(null);
  };

  // Skill Selection Step
  if (step === "skill-selection") {
    return (
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <div>
            <Title order={2} mb="xs">
              Select a Skill
            </Title>
            <Text color="dimmed">Choose a skill to start your quiz</Text>
          </div>

          {error && (
            <Paper p="md" withBorder style={{ backgroundColor: "#fff5f5", borderColor: "#ff6b6b" }}>
              <Text color="red">{error}</Text>
            </Paper>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {skills.map((skill) => (
              <Card
                key={skill.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => !loading && handleSkillSelect(skill.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Stack gap="xs">
                  <Title order={3}>{skill.name}</Title>
                  <Text variant="light">{skill.description}</Text>
                  <Button variant="light" fullWidth mt="md" loading={loading}>
                    Start Quiz
                  </Button>
                </Stack>
              </Card>
            ))}
          </div>
        </Stack>
      </Container>
    );
  }

  // Quiz Step
  if (step === "quiz") {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Paper p="md" withBorder>
            <Group justify="between" mb="xs">
              <Text w={500}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <Badge>{Math.round(progress)}% Complete</Badge>
            </Group>
            <Progress value={progress} size="sm" radius="xl" />
          </Paper>

          {error && (
            <Paper p="md" withBorder style={{ backgroundColor: "#fff5f5", borderColor: "#ff6b6b" }}>
              <Text color="red">{error}</Text>
            </Paper>
          )}

          <Card shadow="md" padding="xl" radius="md" withBorder>
            <Stack gap="xl">
              <Title order={3}>{currentQuestion.questionText}</Title>

              <Radio.Group
                value={currentAnswer}
                onChange={setCurrentAnswer}
                required
              >
                <Stack gap="md">
                  {/* Option A */}
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        currentAnswer === currentQuestion.optionA
                          ? "#f0f7ff"
                          : "transparent",
                      borderColor:
                        currentAnswer === currentQuestion.optionA
                          ? "#228be6"
                          : undefined,
                    }}
                    onClick={() => setCurrentAnswer(currentQuestion.optionA)}
                  >
                    <Radio
                      value={currentQuestion.optionA}
                      label={`A. ${currentQuestion.optionA}`}
                      styles={{ label: { cursor: "pointer" } }}
                    />
                  </Paper>
                  {/* Option B */}
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        currentAnswer === currentQuestion.optionB
                          ? "#f0f7ff"
                          : "transparent",
                      borderColor:
                        currentAnswer === currentQuestion.optionB
                          ? "#228be6"
                          : undefined,
                    }}
                    onClick={() => setCurrentAnswer(currentQuestion.optionB)}
                  >
                    <Radio
                      value={currentQuestion.optionB}
                      label={`B. ${currentQuestion.optionB}`}
                      styles={{ label: { cursor: "pointer" } }}
                    />
                  </Paper>
                  {/* Option C */}
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        currentAnswer === currentQuestion.optionC
                          ? "#f0f7ff"
                          : "transparent",
                      borderColor:
                        currentAnswer === currentQuestion.optionC
                          ? "#228be6"
                          : undefined,
                    }}
                    onClick={() => setCurrentAnswer(currentQuestion.optionC)}
                  >
                    <Radio
                      value={currentQuestion.optionC}
                      label={`C. ${currentQuestion.optionC}`}
                      styles={{ label: { cursor: "pointer" } }}
                    />
                  </Paper>
                  {/* Option D */}
                  <Paper
                    p="md"
                    withBorder
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        currentAnswer === currentQuestion.optionD
                          ? "#f0f7ff"
                          : "transparent",
                      borderColor:
                        currentAnswer === currentQuestion.optionD
                          ? "#228be6"
                          : undefined,
                    }}
                    onClick={() => setCurrentAnswer(currentQuestion.optionD)}
                  >
                    <Radio
                      value={currentQuestion.optionD}
                      label={`D. ${currentQuestion.optionD}`}
                      styles={{ label: { cursor: "pointer" } }}
                    />
                  </Paper>
                </Stack>
              </Radio.Group>

              <Group justify="between" mt="md">
                <Button
                  onClick={handleNext}
                  size="md"
                  disabled={!currentAnswer}
                  loading={loading}
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Submit Quiz"}
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    );
  }

  // Completion Step
  if (step === "completed") {
    return (
      <Container size="md" py="xl">
        <Card shadow="md" padding="xl" radius="md" withBorder>
          <Stack gap="lg" align="center">
            <div style={{ fontSize: "4rem" }}>🎉</div>
            <Title order={2}>Quiz Completed!</Title>
            <Text size="lg">
              You've successfully completed the quiz. Your answers have been
              submitted.
            </Text>
            <Badge size="xl" variant="filled" color="green">
              {Object.keys(answers).length} Questions Answered
            </Badge>
            <Button onClick={handleRestart} size="lg" mt="md">
              Take Another Quiz
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return null;
};

export default QuizTab;