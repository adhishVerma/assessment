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
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <Container size="xs" style={{ marginTop: 50 }}>
      <Paper shadow="xs" p="md">
        <Stack gap="md">
          <Title order={3} style={{ textAlign: "center" }}>Register</Title>
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Confirm Password" type="password" />
          <Button fullWidth>Register</Button>
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
