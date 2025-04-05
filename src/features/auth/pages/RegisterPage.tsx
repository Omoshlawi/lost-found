import React from 'react';
import { Container } from '@mantine/core';
import { RegistrationForm } from '../forms';

const RegisterPage = () => {
  return (
    <Container size={'xs'} mt={100} mb={100}>
      <RegistrationForm />
    </Container>
  );
};

export default RegisterPage;
