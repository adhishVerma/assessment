import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  Group,
  ActionIcon,
  Stack,
  Title,
  Paper,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { skillService } from "../../../services/skillService";
import { Skill } from "../../../services/types";

const SkillsTab = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillService.getAll();
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle opening modal for create/edit
  const handleOpenModal = (skill: Skill | null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        description: skill.description || "",
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    open();
  };

  // Handle form submission (CREATE or UPDATE)
  const handleSubmit = async () => {
    // TODO: Replace with actual API calls
    try {
      if (editingSkill) {
        // UPDATE - PUT /api/skills/:id
        const updatedSkill = await skillService.update(
          editingSkill.id,
          formData
        );

        setSkills(
          skills.map((skill) =>
            skill.id === editingSkill.id ? { ...updatedSkill } : skill
          )
        );
      } else {
        // CREATE - POST /api/skills
        const newSkill = await skillService.create(formData);
        setSkills([...skills, newSkill]);
      }
      close();
    } catch (error) {
      console.error("Error saving skill:", error);
      // TODO: Add error notification
    }
  };

  // Handle soft delete (DELETE)
  const handleDelete = async (id: number) => {
    try {
      if (window.confirm("Are you sure you want to delete this skill?")) {
        // SOFT DELETE - PATCH /api/skills/:id
        await skillService.delete(id);

        // For placeholder, we'll filter it out
        setSkills(skills.filter((skill) => skill.id !== id));

        // Or if you want to keep deleted items:
        // setSkills(
        //   skills.map(skill =>
        //     skill.id === id
        //       ? { ...skill, isDeleted: true, deletedAt: new Date() }
        //       : skill
        //   )
        // );
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      // TODO: Add error notification
    }
  };

  // Filter out soft-deleted skills
  const activeSkills = skills.filter((skill) => !skill.isDeleted);

  const rows = activeSkills.map((skill) => (
    <Table.Tr key={skill.id}>
      <Table.Td>
        <Text fw={500}>{skill.name}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed" lineClamp={2}>
          {skill.description || "No description"}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => handleOpenModal(skill)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => handleDelete(skill.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Skills Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => handleOpenModal(null)}
        >
          Add Skill
        </Button>
      </Group>

      <Paper shadow="sm" p="md" withBorder>
        {activeSkills.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            No skills found. Click "Add Skill" to create one.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Skill Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th style={{ width: "120px", textAlign: "right" }}>
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Paper>

      {/* Create/Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
        size="md"
      >
        <Stack>
          <TextInput
            label="Skill Name"
            placeholder="e.g., JavaScript, Python, React"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={
              formData.name && formData.name.length > 255
                ? "Name is too long"
                : null
            }
          />

          <Textarea
            label="Description"
            placeholder="Brief description of the skill (optional)"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editingSkill ? "Update" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default SkillsTab;
