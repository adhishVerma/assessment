import { Container, Input, Paper, Button, Stack, Title, Text, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <Container size="xs" style={{ marginTop: 50 }}>
      <Paper shadow="xs" p="md">
        <Stack gap="md">
          <Title order={3} style={{ textAlign: 'center' }}>Login</Title>
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Button fullWidth>Login</Button>
          <Text size="sm" style={{ textAlign: "center" }}>
            Create an account?{" "}
            <Anchor component={Link} to="/register">
              Register
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
