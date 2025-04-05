import React from 'react';
import { Container } from '@mantine/core';
import { LoginForm } from '../forms';

const LoginPage = () => {
  return (
    <Container size={'xs'} mt={100} mb={100}>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
