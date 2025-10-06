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
import { userService } from "../../../services/userService";
import { UserItem } from "../../../services/types";

const UsersTab = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // State to track selected user and view
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the actual API using userService
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (user: UserItem) => {
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
          <ReportsTab userId={selectedUserId}/>
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
                  render: (user: UserItem) => <Text fw={500}>{user.name}</Text>,
                },
                {
                  accessor: "email",
                  title: "Email",
                  width: "30%",
                  render: (user: UserItem) => (
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
                  render: (user: UserItem) => (
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
                  render: (user: UserItem) => (
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
                  render: (user: UserItem) => (
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
