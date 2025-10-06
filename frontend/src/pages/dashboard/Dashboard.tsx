import { AppShell, Burger, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBook, IconChartBar } from "@tabler/icons-react";
import SidebarButton from "../../components/sidebar/SidebarButton";
import QuizTab from "../../components/dashboard/quiz-tab/QuizTab";
import ReportsTab from "../../components/dashboard/reports-tab/ReportsTab";
import { useState } from "react";

const Dashboard = () => {
  const [opened, { toggle }] = useDisclosure();
  const [activeTab, setActiveTab] = useState<"quiz" | "reports">("quiz");


  const renderTabContent = () => {
    switch (activeTab) {
      case "quiz":
        return <QuizTab />;
      case "reports":
        return <ReportsTab />;
      default:
        return <QuizTab />;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text style={{ fontWeight: 700 }}>My Dashboard</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {/* Links */}
        <Stack gap="sm">
          <SidebarButton
            icon={<IconBook />}
            onClick={() => setActiveTab("quiz")}
          >
            Quiz
          </SidebarButton>
          <SidebarButton
            icon={<IconChartBar />}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </SidebarButton>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{renderTabContent()}</AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
