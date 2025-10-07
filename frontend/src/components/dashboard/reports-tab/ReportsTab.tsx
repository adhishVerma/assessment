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
  Loader,
  Center,
  SegmentedControl,
  Tabs,
  Table,
  Alert,
  Button,
} from "@mantine/core";
import {
  IconTrophy,
  IconTarget,
  IconTrendingUp,
  IconAlertTriangle,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
  IconChartBar,
  IconBulb,
} from "@tabler/icons-react";
import { reportService } from "../../../services/reportService";
import { QuizReport, SkillGap, TimeFilter } from "../../../services/types";
import { useAuth } from "../../../contexts/AuthContext";

interface Props {
  userId?: number;
}

const ReportsTab = ({ userId }: Props) => {
  const { user } = useAuth();
  const id = userId || user?.id;

  const [reports, setReports] = useState<QuizReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (id) {
      fetchReports();
    } else {
      setReports(null);
      setError("User ID is required to fetch reports");
    }
  }, [id, timeFilter]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        setError("User ID is required.");
        return;
      }
      const data = await reportService.getUserReport(id, timeFilter);
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status: SkillGap["status"]) => {
    switch (status) {
      case "excellent":
        return "green";
      case "good":
        return "blue";
      case "needs-improvement":
        return "yellow";
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  const getTrendIcon = (trend: SkillGap["trend"]) => {
    switch (trend) {
      case "improving":
        return <IconArrowUp size={16} />;
      case "declining":
        return <IconArrowDown size={16} />;
      case "stable":
        return <IconMinus size={16} />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: SkillGap["trend"]) => {
    switch (trend) {
      case "improving":
        return "green";
      case "declining":
        return "red";
      case "stable":
        return "gray";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ minHeight: 400 }}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading your reports...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertTriangle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header with Time Filter */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} mb="xs">
              Quiz Reports
            </Title>
            <Text c="dimmed">
              View your performance, identify skill gaps, and track progress
            </Text>
          </div>

          <SegmentedControl
            value={timeFilter}
            onChange={(value) => setTimeFilter(value as TimeFilter)}
            data={[
              { label: "All Time", value: "all" },
              { label: "This Month", value: "month" },
              { label: "This Week", value: "week" },
            ]}
          />
        </Group>

        {/* Activity Summary */}
        {timeFilter === "all" && reports?.recentActivity && (
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="xl">
              {["week", "month", "total"].map((key) => (
                <div key={key}>
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    {key === "week"
                      ? "This Week"
                      : key === "month"
                      ? "This Month"
                      : "All Time"}
                  </Text>
                  <Text size="lg" fw={700}>
                    {
                      reports.recentActivity?.[
                        key as keyof typeof reports.recentActivity
                      ]
                    }{" "}
                    quizzes
                  </Text>
                </div>
              ))}
            </Group>
          </Card>
        )}

        {/* Summary Stats */}
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Paper p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                  Total Quizzes
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {reports?.totalQuizzes ?? 0}
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
                  {reports?.averageScore?.toFixed(1) ?? 0}%
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
                  {reports?.excellentScore ?? 0}
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="yellow">
                <IconTrophy size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Tabs for views */}
        <Tabs
          value={activeTab}
          onChange={(value) => {
            if (value) {
              setActiveTab(value);
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
              Quiz History
            </Tabs.Tab>
            <Tabs.Tab value="skill-gaps" leftSection={<IconBulb size={16} />}>
              Skill Gap Analysis
            </Tabs.Tab>
          </Tabs.List>

          {/* Quiz History Tab */}
          <Tabs.Panel value="overview" pt="xl">
            <Stack gap="md">
              {!reports?.topicWise || reports.topicWise.length === 0 ? (
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
                reports.topicWise.map((report) => (
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
                          <Badge
                            color={getScoreColor(report.scorePercent)}
                            variant="filled"
                          >
                            {getScoreBadgeLabel(report.scorePercent)}
                          </Badge>
                        </Group>

                        <Text size="sm" c="dimmed" mb="md">
                          Completed on{" "}
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
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
          </Tabs.Panel>

          {/* Skill Gap Analysis Tab */}
          <Tabs.Panel value="skill-gaps" pt="xl">
            <Stack gap="md">
              {reports?.skillGaps && reports.skillGaps.length > 0 ? (
                <>
                  {reports.skillGaps.some(
                    (gap) => gap.status === "critical"
                  ) && (
                    <Alert
                      icon={<IconAlertTriangle size={16} />}
                      title="Areas Needing Attention"
                      color="red"
                      variant="light"
                    >
                      You have skills that need immediate attention. Focus on
                      practicing to improve your overall performance.
                    </Alert>
                  )}

                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={4} mb="md">
                      Skill Performance Analysis
                    </Title>
                    <Table striped highlightOnHover>
                      <thead>
                        <tr>
                          <th>Skill</th>
                          <th>Avg Score</th>
                          <th>Quizzes</th>
                          <th>Status</th>
                          <th>Trend</th>
                          <th>Last Attempted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.skillGaps.map((gap) => (
                          <tr key={gap.skillId}>
                            <td>
                              <Text fw={500}>{gap.skillName}</Text>
                            </td>
                            <td>
                              <Group gap="xs">
                                <Progress
                                  value={gap.averageScore}
                                  color={getScoreColor(gap.averageScore)}
                                  size="sm"
                                  style={{ width: 80 }}
                                />
                                <Text size="sm" fw={600}>
                                  {gap.averageScore}%
                                </Text>
                              </Group>
                            </td>
                            <td>{gap.quizzesTaken}</td>
                            <td>
                              <Badge
                                color={getStatusColor(gap.status)}
                                variant="light"
                              >
                                {gap.status
                                  .split("-")
                                  .map(
                                    (w) =>
                                      w.charAt(0).toUpperCase() + w.slice(1)
                                  )
                                  .join(" ")}
                              </Badge>
                            </td>
                            <td>
                              <Badge
                                color={getTrendColor(gap.trend)}
                                variant="light"
                                leftSection={getTrendIcon(gap.trend)}
                              >
                                {gap.trend.charAt(0).toUpperCase() +
                                  gap.trend.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              <Text size="sm" c="dimmed">
                                {new Date(gap.lastAttempted).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Text>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card>

                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group gap="sm" mb="md">
                      <IconBulb size={20} />
                      <Title order={4}>Recommendations</Title>
                    </Group>
                    <Stack gap="sm">
                      {reports.skillGaps
                        .filter(
                          (gap) =>
                            gap.status === "critical" ||
                            gap.status === "needs-improvement"
                        )
                        .slice(0, 3)
                        .map((gap) => (
                          <Paper key={gap.skillId} p="sm" withBorder>
                            <Group justify="space-between">
                              <div>
                                <Text fw={500}>{gap.skillName}</Text>
                                <Text size="sm" c="dimmed">
                                  Current average: {gap.averageScore}%
                                </Text>
                              </div>
                              <Button variant="light" size="xs">
                                Practice Now
                              </Button>
                            </Group>
                          </Paper>
                        ))}
                    </Stack>
                  </Card>
                </>
              ) : (
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                  <Stack align="center" gap="xs">
                    <Text size="lg" c="dimmed">
                      No skill data available yet
                    </Text>
                    <Text size="sm" c="dimmed">
                      Take multiple quizzes to see skill gap analysis
                    </Text>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default ReportsTab;
