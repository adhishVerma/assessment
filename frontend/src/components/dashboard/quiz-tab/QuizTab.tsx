import React, { useState } from "react";
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

// Placeholder data - replace with API calls
const PLACEHOLDER_SKILLS = [
  { id: 1, name: "JavaScript", level: "Intermediate" },
  { id: 2, name: "React", level: "Advanced" },
  { id: 3, name: "TypeScript", level: "Beginner" },
  { id: 4, name: "Node.js", level: "Intermediate" },
];

const PLACEHOLDER_QUESTIONS = {
  1: [
    // JavaScript questions
    {
      id: 101,
      question: "What is the output of typeof null in JavaScript?",
      options: [
        { value: "A", label: "null" },
        { value: "B", label: "object" },
        { value: "C", label: "undefined" },
        { value: "D", label: "number" },
      ],
    },
    {
      id: 102,
      question: "Which method is used to add elements to the end of an array?",
      options: [
        { value: "A", label: "push()" },
        { value: "B", label: "pop()" },
        { value: "C", label: "shift()" },
        { value: "D", label: "unshift()" },
      ],
    },
    {
      id: 103,
      question: 'What does the "use strict" directive do?',
      options: [
        { value: "A", label: "Makes code run faster" },
        { value: "B", label: "Enables strict mode parsing" },
        { value: "C", label: "Compresses the code" },
        { value: "D", label: "Adds type checking" },
      ],
    },
  ],
  2: [
    // React questions
    {
      id: 201,
      question: "What hook is used for side effects in React?",
      options: [
        { value: "A", label: "useState" },
        { value: "B", label: "useEffect" },
        { value: "C", label: "useContext" },
        { value: "D", label: "useReducer" },
      ],
    },
    {
      id: 202,
      question: "What is JSX?",
      options: [
        { value: "A", label: "A JavaScript library" },
        { value: "B", label: "A syntax extension for JavaScript" },
        { value: "C", label: "A CSS framework" },
        { value: "D", label: "A testing tool" },
      ],
    },
  ],
  3: [
    // TypeScript questions
    {
      id: 301,
      question: "What is the main benefit of TypeScript?",
      options: [
        { value: "A", label: "Faster execution" },
        { value: "B", label: "Static type checking" },
        { value: "C", label: "Smaller bundle size" },
        { value: "D", label: "Better styling" },
      ],
    },
  ],
  4: [
    // Node.js questions
    {
      id: 401,
      question: "What is Node.js built on?",
      options: [
        { value: "A", label: "Python runtime" },
        { value: "B", label: "Chrome V8 engine" },
        { value: "C", label: "Java Virtual Machine" },
        { value: "D", label: "Ruby runtime" },
      ],
    },
  ],
};

const QuizTab = () => {
  const [step, setStep] = useState("skill-selection"); // 'skill-selection' | 'quiz' | 'completed'
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Function to fetch questions based on skill
  const handleSkillSelect = async (skillId) => {
    setSelectedSkill(skillId);

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/questions?skillId=${skillId}`);
    // const data = await response.json();

    // Placeholder: Get questions from mock data
    const fetchedQuestions = PLACEHOLDER_QUESTIONS[skillId] || [];
    setQuestions(fetchedQuestions);
    setStep("quiz");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer("");
  };

  // Function to save answer
  const handleAnswerSave = async (questionId, answer) => {
    // TODO: Replace with actual API call to save answer
    // await fetch('/api/save-answer', {
    //   method: 'POST',
    //   body: JSON.stringify({ questionId, answer, skillId: selectedSkill })
    // });

    console.log("Saving answer:", {
      questionId,
      answer,
      skillId: selectedSkill,
    });

    // Store answer locally
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Function to handle next question
  const handleNext = async () => {
    if (!currentAnswer) {
      alert("Please select an answer before proceeding");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    await handleAnswerSave(currentQuestion.id, currentAnswer);

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
            {PLACEHOLDER_SKILLS.map((skill) => (
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
                <Stack spacing="xs">
                  <Title order={3}>{skill.name}</Title>
                  <Badge color="blue" variant="light">
                    {skill.level}
                  </Badge>
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
              <Title order={3}>{currentQuestion.question}</Title>

              <Radio.Group
                value={currentAnswer}
                onChange={setCurrentAnswer}
                required
              >
                <Stack gap="md">
                  {currentQuestion.options.map((option) => (
                    <Paper
                      key={option.value}
                      p="md"
                      withBorder
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          currentAnswer === option.value
                            ? "#f0f7ff"
                            : "transparent",
                        borderColor:
                          currentAnswer === option.value
                            ? "#228be6"
                            : undefined,
                      }}
                      onClick={() => setCurrentAnswer(option.value)}
                    >
                      <Radio
                        value={option.value}
                        label={`${option.value}. ${option.label}`}
                        styles={{ label: { cursor: "pointer" } }}
                      />
                    </Paper>
                  ))}
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
