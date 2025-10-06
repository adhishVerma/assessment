import { useState } from 'react';
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
  ThemeIcon
} from '@mantine/core';
import { IconTrophy, IconTarget, IconTrendingUp } from '@tabler/icons-react';

// Placeholder data - replace with API call
const PLACEHOLDER_REPORTS = [
  {
    id: 1,
    skillName: 'JavaScript',
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    date: '2025-10-05',
    level: 'Intermediate'
  },
  {
    id: 2,
    skillName: 'React',
    score: 92,
    totalQuestions: 15,
    correctAnswers: 14,
    date: '2025-10-04',
    level: 'Advanced'
  },
  {
    id: 3,
    skillName: 'TypeScript',
    score: 78,
    totalQuestions: 12,
    correctAnswers: 9,
    date: '2025-10-03',
    level: 'Beginner'
  },
  {
    id: 4,
    skillName: 'Node.js',
    score: 88,
    totalQuestions: 18,
    correctAnswers: 16,
    date: '2025-10-02',
    level: 'Intermediate'
  },
  {
    id: 5,
    skillName: 'CSS',
    score: 95,
    totalQuestions: 10,
    correctAnswers: 10,
    date: '2025-10-01',
    level: 'Advanced'
  }
];

const ReportsTab = () => {
  const [reports] = useState(PLACEHOLDER_REPORTS);

  // TODO: Replace with actual API call
  // useEffect(() => {
  //   const fetchReports = async () => {
  //     const response = await fetch('/api/quiz-reports');
  //     const data = await response.json();
  //     setReports(data);
  //   };
  //   fetchReports();
  // }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'green';
    if (score >= 75) return 'blue';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const getScoreBadgeLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const averageScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)
    : 0;

  const totalQuizzes = reports.length;
  const excellentQuizzes = reports.filter(r => r.score >= 90).length;

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        <div>
          <Title order={2} mb="xs">Quiz Reports</Title>
          <Text color="dimmed">View your past quiz performance and scores</Text>
        </div>

        {/* Summary Stats */}
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Paper p="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" weight={500} transform="uppercase">
                  Total Quizzes
                </Text>
                <Text size="xl" weight={700} mt="xs">
                  {totalQuizzes}
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="blue">
                <IconTarget size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" weight={500} transform="uppercase">
                  Average Score
                </Text>
                <Text size="xl" weight={700} mt="xs">
                  {averageScore}%
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="green">
                <IconTrendingUp size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" weight={500} transform="uppercase">
                  Excellent Scores
                </Text>
                <Text size="xl" weight={700} mt="xs">
                  {excellentQuizzes}
                </Text>
              </div>
              <ThemeIcon size="xl" variant="light" color="yellow">
                <IconTrophy size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Quiz Results List */}
        <Stack spacing="md">
          {reports.length === 0 ? (
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Stack align="center" spacing="xs">
                <Text size="lg" color="dimmed">
                  No quiz results yet
                </Text>
                <Text size="sm" color="dimmed">
                  Take a quiz to see your results here
                </Text>
              </Stack>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group position="apart" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group spacing="sm" mb="xs">
                      <Title order={4}>{report.skillName}</Title>
                      <Badge variant="light" size="sm">
                        {report.level}
                      </Badge>
                      <Badge color={getScoreColor(report.score)} variant="filled">
                        {getScoreBadgeLabel(report.score)}
                      </Badge>
                    </Group>
                    
                    <Text size="sm" color="dimmed" mb="md">
                      Completed on {new Date(report.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>

                    <Group spacing="xl">
                      <div>
                        <Text size="xs" color="dimmed" weight={500}>
                          Correct Answers
                        </Text>
                        <Text size="sm" weight={600}>
                          {report.correctAnswers} / {report.totalQuestions}
                        </Text>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text size="xs" color="dimmed" weight={500} mb={4}>
                          Score
                        </Text>
                        <Progress 
                          value={report.score} 
                          color={getScoreColor(report.score)}
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
                    sections={[{ value: report.score, color: getScoreColor(report.score) }]}
                    label={
                      <div style={{ textAlign: 'center' }}>
                        <Text size="xl" weight={700}>
                          {report.score}%
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