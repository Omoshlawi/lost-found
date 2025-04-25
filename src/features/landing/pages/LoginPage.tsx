import { Box, Container } from '@mantine/core';
import { LoginForm } from '../forms';
import styles from './Auth.module.css';

const LoginPage = () => {
  return (
    <Box h={'100vh'} w={'100%'} display={'flex'} flex={1} pt={'xl'}>
      <Container
        size={'xl'}
        mb={100}
        bg={'gray.0'}
        p={30}
        h={'fit-content'}
        className={styles.formContainer}
      >
        <LoginForm />
      </Container>
    </Box>
  );
};

export default LoginPage;
