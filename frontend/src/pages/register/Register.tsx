import {
  Container,
  Input,
  Paper,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RegisterFormData } from "../../services/types";
import { authService } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container size="xs" style={{ marginTop: 50 }}>
      <Paper shadow="xs" p="md">
        <Stack gap="md">
          <Title order={3} style={{ textAlign: "center" }}>
            Register
          </Title>

          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.currentTarget.value)}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.currentTarget.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.currentTarget.value)}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />

          {error && (
            <Text color="red" size="sm">
              {error}
            </Text>
          )}

          <Button fullWidth onClick={handleSubmit}>
            Register
          </Button>

          <Text size="sm" style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Anchor component={Link} to="/login">
              Login
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Register;
