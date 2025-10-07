import { AppShell, Burger, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SidebarButton from "../../components/sidebar/SidebarButton";
import { IconBook, IconBrandReact, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import QuestionsTab from "../../components/dashboard/questions-tab/QuestionsTab";
import UsersTab from "../../components/dashboard/users-tab/UsersTab";
import SkillsTab from "../../components/dashboard/skills-tab/SkillsTab";

const AdminDashboard = () => {
  const [opened, { toggle }] = useDisclosure();
  const [activeTab, setActiveTab] = useState<"questions" | "users" | "skills">(
    "questions"
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "questions":
        return <QuestionsTab />;
      case "users":
        return <UsersTab />;
      case "skills":
        return <SkillsTab />;
      default:
        return <QuestionsTab />;
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
          <Text style={{ fontWeight: 700 }}>Admin Dashboard</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {/* Links */}
        <Stack gap="sm">
          <SidebarButton
            icon={<IconBook />}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </SidebarButton>
          <SidebarButton
            icon={<IconUsers />}
            onClick={() => setActiveTab("users")}
          >
            Users
          </SidebarButton>
          <SidebarButton
            icon={<IconBrandReact />}
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </SidebarButton>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{renderTabContent()}</AppShell.Main>
    </AppShell>
  );
};

export default AdminDashboard;
