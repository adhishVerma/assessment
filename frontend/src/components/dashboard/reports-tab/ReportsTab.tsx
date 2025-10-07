import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  Badge,
  Progress,
  RingProgress,
  SimpleGrid,
  Paper,
  ThemeIcon,
} from "@mantine/core";
import { IconTrophy, IconTarget, IconTrendingUp } from "@tabler/icons-react";
// import { quizService } from "../../../services/quizService";
import { userService } from "../../../services/userService";
import { QuizReport } from "../../../services/types";

interface Props {
  userId?: number;
}

const ReportsTab = ({ userId }: Props) => {
  const [reports, setReports] = useState<QuizReport>();

  useEffect(() => {
    const fetchReports = async () => {
      if (userId) {
        const data = await userService.getUserReport(userId);
        setReports(data);
      }
    };
    fetchReports();
  }, [userId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "green";
    if (score >= 75) return "blue";
    if (score >= 60) return "yellow";
    return "red";
  };

  const getScoreBadgeLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">
            Quiz Reports
          </Title>
          <Text c="dimmed">View your past quiz performance and scores</Text>
        </div>

        {/* Summary Stats */}
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Paper p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                  Total Quizzes
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {reports?.totalQuizzes}
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="blue">
                <IconTarget size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                  Average Score
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {reports?.averageScore}%
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="green">
                <IconTrendingUp size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                  Excellent Scores
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {reports?.excellentScore}
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="yellow">
                <IconTrophy size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Quiz Results List */}
        <Stack gap="md">
          {reports?.totalQuizzes === 0 ? (
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Stack align="center" gap="xs">
                <Text size="lg" c="dimmed">
                  No quiz results yet
                </Text>
                <Text size="sm" c="dimmed">
                  Take a quiz to see your results here
                </Text>
              </Stack>
            </Card>
          ) : (
            reports?.topicWise.map((report) => (
              <Card
                key={report.quizId}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="sm" mb="xs">
                      <Title order={4}>{report.skillName}</Title>
                      {/* <Badge variant="light" size="sm">
                        {report. || "Medium"}
                      </Badge> */}
                      <Badge
                        color={getScoreColor(report.scorePercent)}
                        variant="filled"
                      >
                        {getScoreBadgeLabel(report.scorePercent)}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mb="md">
                      Started on{" "}
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>

                    <Group gap="xl">
                      <div>
                        <Text size="xs" c="dimmed" fw={500}>
                          Correct Answers
                        </Text>
                        <Text size="sm" fw={600}>
                          {report.correct} / {report.total}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="xs" c="dimmed" fw={500} mb={4}>
                          Score
                        </Text>
                        <Progress
                          value={report.scorePercent}
                          color={getScoreColor(report.scorePercent)}
                          size="lg"
                          radius="xl"
                        />
                      </div>
                    </Group>
                  </div>

                  <RingProgress
                    size={100}
                    thickness={8}
                    roundCaps
                    sections={[
                      {
                        value: report.scorePercent,
                        color: getScoreColor(report.scorePercent),
                      },
                    ]}
                    label={
                      <div style={{ textAlign: "center" }}>
                        <Text size="xl" fw={700}>
                          {report.scorePercent}%
                        </Text>
                      </div>
                    }
                  />
                </Group>
              </Card>
            ))
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default ReportsTab;
