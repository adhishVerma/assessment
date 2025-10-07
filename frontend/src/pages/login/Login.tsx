import {
  Container,
  Input,
  Paper,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IconX } from "@tabler/icons-react";
import { authService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);

    try {
      const { user } = await authService.login({
        email: values.email,
        password: values.password,
      });
      setUser(user);
    } catch (err: any) {
      // Handle axios error response
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <Container size="xs" style={{ marginTop: 50 }}>
      <Paper shadow="xs" p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Title order={3} style={{ textAlign: "center" }}>
              Login
            </Title>

            {error && (
              <Alert
                color="red"
                title="Error"
                icon={<IconX size={16} />}
                withCloseButton
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <Input
              placeholder="Email"
              type="email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <Input
              placeholder="Password"
              type="password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />

            <Button fullWidth type="submit" loading={form.submitting}>
              Login
            </Button>

            <Text size="sm" style={{ textAlign: "center" }}>
              Create an account?{" "}
              <Anchor component={Link} to="/register">
                Register
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
