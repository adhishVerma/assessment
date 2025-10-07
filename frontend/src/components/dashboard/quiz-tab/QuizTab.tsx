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

const QuizTab = () => {
  const [step, setStep] = useState("skill-selection"); // 'skill-selection' | 'quiz' | 'completed'
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const skillsList = await skillService.getAll();
      setSkills(skillsList);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to fetch questions based on skill
  const handleSkillSelect = async (skillId: number) => {
    setSelectedSkill(skillId);
    try {
      const fetchedQuestions = await questionService.getBySkill(skillId);
      setQuestions(fetchedQuestions);
      setStep("quiz");
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentAnswer("");
    } catch (err) {
      console.error(err);
    }
  };

  // Function to save answer
  const handleAnswerSave = async (
    questionId: number,
    selectedAnswer: "A" | "B" | "C" | "D"
  ) => {
    // TODO: Replace with actual API call to save answer
    // await fetch('/api/save-answer', {
    //   method: 'POST',
    //   body: JSON.stringify({ questionId, answer, skillId: selectedSkill })
    // });

    console.log("Saving answer:", {
      questionId,
      selectedAnswer,
      skillId: selectedSkill,
    });

    // Store answer locally
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
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

    await handleAnswerSave(currentQuestion.id, answerLabel);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer("");
    } else {
      // Submit quiz
      await handleSubmitQuiz();
    }
  };

  // Function to handle quiz submission
  const handleSubmitQuiz = async () => {
    // TODO: Replace with actual API call
    // await fetch('/api/submit-quiz', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     skillId: selectedSkill,
    //     answers
    //   })
    // });

    console.log("Submitting quiz:", { skillId: selectedSkill, answers });
    setStep("completed");
  };

  // Reset quiz
  const handleRestart = () => {
    setStep("skill-selection");
    setSelectedSkill(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer("");
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
                onClick={() => handleSkillSelect(skill.id)}
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
                  <Button variant="light" fullWidth mt="md">
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
