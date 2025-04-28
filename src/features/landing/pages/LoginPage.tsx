import { Container, Flex, Paper } from '@mantine/core';
import { LoginForm } from '../forms';

const LoginPage = () => {
  return (
    <Flex h={'100vh'} w={'100%'} display={'flex'} flex={1} pt={'xl'} justify={'center'}>
      <Paper mb={100} p={'xs'} h={'fit-content'} shadow="lg" withBorder w={'420px'} radius={'sm'}>
        <Container size={'xl'}>
          <LoginForm />
        </Container>
      </Paper>
    </Flex>
  );
};

export default LoginPage;
