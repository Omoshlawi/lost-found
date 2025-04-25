import { Box, Container } from '@mantine/core';
import { RegistrationForm } from '../forms';
import styles from './Auth.module.css';

const RegisterPage = () => {
  return (
    <Box h={'100vh'} w={'100%'} display={'flex'} flex={1} pt={'xl'}>
      <Container
        size={'xs'}
        mb={100}
        bg={'gray.0'}
        p={30}
        h={'fit-content'}
        className={styles.formContainer}
      >
        <RegistrationForm />
      </Container>
    </Box>
  );
};

export default RegisterPage;
