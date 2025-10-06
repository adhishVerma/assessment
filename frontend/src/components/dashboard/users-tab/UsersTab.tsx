import { useState, useEffect } from "react";
import {
  Container,
  Stack,
  Title,
  Card,
  Text,
  Badge,
  TextInput,
  Group,
  Button,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconSearch, IconArrowLeft } from "@tabler/icons-react";
import ReportsTab from "../reports-tab/ReportsTab";
import "mantine-datatable/styles.layer.css";

interface User {
  id: number;
  name: string;
  email: string;
  testsCompleted: number;
  avgScore: number;
  lastTestDate?: string;
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State to track selected user and view
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setUsers(data);

      // Mock data
      const mockUsers: User[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          testsCompleted: 5,
          avgScore: 85.5,
          lastTestDate: "2025-10-05",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          testsCompleted: 3,
          avgScore: 92.0,
          lastTestDate: "2025-10-04",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          testsCompleted: 7,
          avgScore: 78.3,
          lastTestDate: "2025-10-03",
        },
        {
          id: 4,
          name: "Alice Williams",
          email: "alice.williams@example.com",
          testsCompleted: 2,
          avgScore: 88.5,
          lastTestDate: "2025-10-02",
        },
        {
          id: 5,
          name: "Charlie Brown",
          email: "charlie.brown@example.com",
          testsCompleted: 4,
          avgScore: 81.2,
          lastTestDate: "2025-10-01",
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (user: User) => {
    console.log("User clicked:", user);
    setSelectedUserId(user.id);
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Conditional rendering: show ReportsTab if user is selected, otherwise show user list
  if (selectedUserId && selectedUser) {
    return (
      <Container size="xl" p="md">
        <Stack gap="lg">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBackToList}
            >
              Back to Users
            </Button>
          </Group>
          <div>
            <Text size="sm" c="dimmed">
              Viewing report for
            </Text>
            <Group gap="xs">
              <Text size="lg" fw={500}>
                {selectedUser.name}
              </Text>
              <Text size="sm" c="dimmed">
                ({selectedUser.email})
              </Text>
            </Group>
          </div>
          {/* Render the ReportsTab component with the selected user's ID */}
          <ReportsTab />
        </Stack>
      </Container>
    );
  }

  // Default view: User list table
  return (
    <Container size="xl" p="md">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Users</Title>
          <Badge size="lg" variant="filled">
            {users.length} Total Users
          </Badge>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <TextInput
              placeholder="Search by name or email..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="md"
            />

            <DataTable
              withTableBorder
              striped
              highlightOnHover
              columns={[
                {
                  accessor: "name",
                  title: "Name",
                  width: "25%",
                  render: (user: User) => <Text fw={500}>{user.name}</Text>,
                },
                {
                  accessor: "email",
                  title: "Email",
                  width: "30%",
                  render: (user: User) => (
                    <Text c="dimmed" size="sm">
                      {user.email}
                    </Text>
                  ),
                },
                {
                  accessor: "testsCompleted",
                  title: "Tests Completed",
                  textAlign: "center",
                  width: "15%",
                  render: (user: User) => (
                    <Badge variant="light" color="blue">
                      {user.testsCompleted}
                    </Badge>
                  ),
                },
                {
                  accessor: "avgScore",
                  title: "Avg Score",
                  textAlign: "center",
                  width: "15%",
                  render: (user: User) => (
                    <Badge
                      variant="light"
                      color={
                        user.avgScore >= 90
                          ? "green"
                          : user.avgScore >= 75
                          ? "yellow"
                          : "red"
                      }
                    >
                      {user.avgScore.toFixed(1)}%
                    </Badge>
                  ),
                },
                {
                  accessor: "lastTestDate",
                  title: "Last Test",
                  textAlign: "center",
                  width: "15%",
                  render: (user: User) => (
                    <Text size="sm" c="dimmed">
                      {user.lastTestDate
                        ? new Date(user.lastTestDate).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  ),
                },
              ]}
              records={filteredUsers}
              fetching={loading}
              noRecordsText="No users found"
              onRowClick={({ record }) => handleRowClick(record)}
              style={{ cursor: "pointer" }}
              minHeight={300}
            />

            <Text size="xs" c="dimmed" ta="center">
              Click on any row to view user's detailed report
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default UsersTab;
