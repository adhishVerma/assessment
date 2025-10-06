import { Box, Container } from "@mantine/core";
import styles from "./NotFound.module.css"

const NotFound = () => {
  return (
    <Container size="md" className={styles.container}>
      <Box>
        <h3>Not Found</h3>
      </Box>
    </Container>
  );
};

export default NotFound;
