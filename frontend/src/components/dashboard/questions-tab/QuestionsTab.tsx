import { useState, useEffect } from "react";
import {
  Stack,
  Group,
  Button,
  Select,
  TextInput,
  Textarea,
  Radio,
  Card,
  Title,
  Text,
  Stepper,
  Container,
  ActionIcon,
  Badge,
  Divider,
} from "@mantine/core";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowLeft,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import "mantine-datatable/styles.layer.css";
import { skillService } from "../../../services/skillService";
import { questionService } from "../../../services/questionService";

interface Skill {
  id: number;
  name: string;
}

interface Question {
  id: number;
  skillId: number;
  skill?: Skill;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isDeleted: boolean;
}

const QuestionsTab = () => {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );

  // Mock data - replace with API calls
  const [skills, setSkills] = useState<Skill[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    skillId: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A" as "A" | "B" | "C" | "D",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
  });

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch questions when skill is selected
  useEffect(() => {
    if (selectedSkillId) {
      fetchQuestionsBySkill(selectedSkillId);
    }
  }, [selectedSkillId]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const data = await skillService.getAll();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsBySkill = async (skillId: string) => {
    try {
      setLoading(true);
      // Replace with actual API call
      const data = await questionService.getBySkill(parseInt(skillId));
      // const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = () => {
    setView("create");
    setActiveStep(0);
    setEditingQuestionId(null);
    setFormData({
      skillId: "",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "A",
      difficulty: "MEDIUM",
    });
  };

  const handleEditQuestion = (question: Question) => {
    setView("edit");
    setActiveStep(0); // Start at step 0 (question details) since skill is fixed
    setEditingQuestionId(question.id);
    setFormData({
      skillId: question.skillId.toString(),
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctOption: question.correctOption,
      difficulty: question.difficulty,
    });
  };

  const handleBackToList = () => {
    setView("list");
    setActiveStep(0);
    setEditingQuestionId(null);
  };

  const handleNextStep = () => {
    // In edit mode, skip the skill selection step
    if (view === "edit") {
      if (activeStep < 1) {
        setActiveStep(activeStep + 1);
      }
    } else {
      if (activeStep < 2) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmitQuestion = async () => {
    try {
      setLoading(true);

      if (view === "edit" && editingQuestionId) {
        // Update existing question
        // const response = await fetch(`/api/questions/${editingQuestionId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });

        console.log("Updating question:", editingQuestionId, formData);

        // Update local state
        setQuestions(
          questions.map((q) =>
            q.id === editingQuestionId
              ? {
                  ...q,
                  ...formData,
                  skillId: parseInt(formData.skillId),
                  skill: skills.find(
                    (s) => s.id === parseInt(formData.skillId)
                  )!,
                }
              : q
          )
        );
      } else {
        // Create new question
        // const response = await fetch('/api/questions', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });

        console.log("Creating question:", formData);

        // Add to local state (with mock ID)
        const newQuestion: Question = {
          id: Math.max(...questions.map((q) => q.id), 0) + 1,
          skillId: parseInt(formData.skillId),
          skill: skills.find((s) => s.id === parseInt(formData.skillId))!,
          questionText: formData.questionText,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          correctOption: formData.correctOption,
          difficulty: formData.difficulty,
          isDeleted: false,
        };
        setQuestions([...questions, newQuestion]);
      }

      handleBackToList();
    } catch (error) {
      console.error("Error saving question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/questions/${questionId}`, { method: 'DELETE' });
      console.log("Deleting question:", questionId);
      setQuestions(questions.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const isStepValid = (step: number): boolean => {
    // In edit mode, we skip step 0, so adjust validation
    if (view === "edit") {
      switch (step) {
        case 0:
          return (
            !!formData.questionText &&
            !!formData.optionA &&
            !!formData.optionB &&
            !!formData.optionC &&
            !!formData.optionD
          );
        case 1:
          return !!formData.correctOption && !!formData.difficulty;
        default:
          return false;
      }
    } else {
      switch (step) {
        case 0:
          return !!formData.skillId;
        case 1:
          return (
            !!formData.questionText &&
            !!formData.optionA &&
            !!formData.optionB &&
            !!formData.optionC &&
            !!formData.optionD
          );
        case 2:
          return !!formData.correctOption && !!formData.difficulty;
        default:
          return false;
      }
    }
  };

  // Render List View
  if (view === "list") {
    return (
      <Container size="xl" p="md">
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Question Bank</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateQuestion}
            >
              Create New Question
            </Button>
          </Group>

          <Select
            label="Select Skill"
            placeholder="Choose a skill to view questions"
            data={skills.map((skill) => ({
              value: skill.id.toString(),
              label: skill.name,
            }))}
            value={selectedSkillId}
            onChange={setSelectedSkillId}
            searchable
            clearable
          />

          {selectedSkillId && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="lg" fw={500}>
                    Questions for{" "}
                    {
                      skills.find((s) => s.id === parseInt(selectedSkillId))
                        ?.name
                    }
                  </Text>
                  <Badge>{questions.length} questions</Badge>
                </Group>

                <DataTable
                  columns={[
                    {
                      accessor: "questionText",
                      title: "Question",
                      width: "40%",
                    },
                    {
                      accessor: "difficulty",
                      title: "Difficulty",
                      render: (record: Question) => (
                        <Badge
                          color={
                            record.difficulty === "EASY"
                              ? "green"
                              : record.difficulty === "MEDIUM"
                              ? "yellow"
                              : "red"
                          }
                        >
                          {record.difficulty}
                        </Badge>
                      ),
                    },
                    {
                      accessor: "correctOption",
                      title: "Correct Answer",
                      render: (record: Question) => (
                        <Badge variant="light">
                          Option {record.correctOption}
                        </Badge>
                      ),
                    },
                    {
                      accessor: "actions",
                      title: "Actions",
                      textAlign: "right",
                      render: (record: Question) => (
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleEditQuestion(record)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeleteQuestion(record.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      ),
                    },
                  ]}
                  records={questions}
                  fetching={loading}
                  noRecordsText="No questions found for this skill"
                />
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    );
  }

  // Render Create/Edit View with Stepper
  return (
    <Container size="lg" p="md">
      <Stack gap="lg">
        <Group>
          <ActionIcon variant="subtle" onClick={handleBackToList} size="lg">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>
            {view === "edit" ? "Edit Question" : "Create New Question"}
          </Title>
        </Group>

        {/* Show skill info in edit mode */}
        {view === "edit" && (
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group>
              <Text size="sm" c="dimmed">
                Skill:
              </Text>
              <Badge size="lg" variant="filled">
                {skills.find((s) => s.id.toString() === formData.skillId)?.name}
              </Badge>
              <Text size="xs" c="dimmed" fs="italic">
                (Skill cannot be changed when editing)
              </Text>
            </Group>
          </Card>
        )}

        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          allowNextStepsSelect={false}
        >
          {/* Only show skill selection step in create mode */}
          {view === "create" && (
            <Stepper.Step
              label="Select Skill"
              description="Choose the skill category"
            >
              <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
                <Select
                  label="Skill"
                  placeholder="Select a skill"
                  data={skills.map((skill) => ({
                    value: skill.id.toString(),
                    label: skill.name,
                  }))}
                  value={formData.skillId}
                  onChange={(value) =>
                    setFormData({ ...formData, skillId: value || "" })
                  }
                  searchable
                  required
                  size="md"
                />
              </Card>
            </Stepper.Step>
          )}

          <Stepper.Step
            label="Question Details"
            description="Enter question and options"
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
              <Stack gap="md">
                <Textarea
                  label="Question Text"
                  placeholder="Enter your question here"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                  required
                  minRows={3}
                  autosize
                />

                <Divider label="Options" labelPosition="center" />

                <TextInput
                  label="Option A"
                  placeholder="Enter option A"
                  value={formData.optionA}
                  onChange={(e) =>
                    setFormData({ ...formData, optionA: e.target.value })
                  }
                  required
                />

                <TextInput
                  label="Option B"
                  placeholder="Enter option B"
                  value={formData.optionB}
                  onChange={(e) =>
                    setFormData({ ...formData, optionB: e.target.value })
                  }
                  required
                />

                <TextInput
                  label="Option C"
                  placeholder="Enter option C"
                  value={formData.optionC}
                  onChange={(e) =>
                    setFormData({ ...formData, optionC: e.target.value })
                  }
                  required
                />

                <TextInput
                  label="Option D"
                  placeholder="Enter option D"
                  value={formData.optionD}
                  onChange={(e) =>
                    setFormData({ ...formData, optionD: e.target.value })
                  }
                  required
                />
              </Stack>
            </Card>
          </Stepper.Step>

          <Stepper.Step
            label="Configuration"
            description="Set correct answer and difficulty"
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
              <Stack gap="xl">
                <Radio.Group
                  label="Correct Answer"
                  value={formData.correctOption}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      correctOption: value as "A" | "B" | "C" | "D",
                    })
                  }
                  required
                >
                  <Stack mt="xs" gap="sm">
                    <Radio
                      value="A"
                      label={`Option A: ${formData.optionA || "(Not entered)"}`}
                    />
                    <Radio
                      value="B"
                      label={`Option B: ${formData.optionB || "(Not entered)"}`}
                    />
                    <Radio
                      value="C"
                      label={`Option C: ${formData.optionC || "(Not entered)"}`}
                    />
                    <Radio
                      value="D"
                      label={`Option D: ${formData.optionD || "(Not entered)"}`}
                    />
                  </Stack>
                </Radio.Group>

                <Radio.Group
                  label="Difficulty Level"
                  value={formData.difficulty}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      difficulty: value as "EASY" | "MEDIUM" | "HARD",
                    })
                  }
                  required
                >
                  <Group mt="xs">
                    <Radio value="EASY" label="Easy" />
                    <Radio value="MEDIUM" label="Medium" />
                    <Radio value="HARD" label="Hard" />
                  </Group>
                </Radio.Group>
              </Stack>
            </Card>
          </Stepper.Step>

          <Stepper.Completed>
            <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
              <Stack gap="md">
                <Title order={4}>Review Your Question</Title>
                <Divider />

                <div>
                  <Text size="sm" c="dimmed">
                    Skill
                  </Text>
                  <Text fw={500}>
                    {
                      skills.find((s) => s.id.toString() === formData.skillId)
                        ?.name
                    }
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Question
                  </Text>
                  <Text fw={500}>{formData.questionText}</Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Options
                  </Text>
                  <Stack gap="xs" mt="xs">
                    <Text>A: {formData.optionA}</Text>
                    <Text>B: {formData.optionB}</Text>
                    <Text>C: {formData.optionC}</Text>
                    <Text>D: {formData.optionD}</Text>
                  </Stack>
                </div>

                <Group>
                  <div>
                    <Text size="sm" c="dimmed">
                      Correct Answer
                    </Text>
                    <Badge color="green" size="lg">
                      Option {formData.correctOption}
                    </Badge>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">
                      Difficulty
                    </Text>
                    <Badge
                      color={
                        formData.difficulty === "EASY"
                          ? "green"
                          : formData.difficulty === "MEDIUM"
                          ? "yellow"
                          : "red"
                      }
                      size="lg"
                    >
                      {formData.difficulty}
                    </Badge>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Stepper.Completed>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            onClick={handlePrevStep}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Group>
            <Button variant="subtle" onClick={handleBackToList}>
              Cancel
            </Button>
            {/* Adjust max step based on mode */}
            {activeStep < (view === "edit" ? 1 : 2) ? (
              <Button
                onClick={handleNextStep}
                disabled={!isStepValid(activeStep)}
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuestion}
                disabled={!isStepValid(activeStep)}
                loading={loading}
                color={view === "edit" ? "blue" : "green"}
              >
                {view === "edit" ? "Update Question" : "Create Question"}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Container>
  );
};

export default QuestionsTab;
