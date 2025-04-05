import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button, Flex, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { RegistrationFormData } from '../types';
import { RegistrationValidationSchema } from '../utils/validation';

const RegistrationForm = () => {
  const form = useForm<RegistrationFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
    resolver: zodResolver(RegistrationValidationSchema),
  });
  const handleSubmit: SubmitHandler<RegistrationFormData> = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack gap={'md'}>
        <Text
          variant="gradient"
          size="xl"
          mb="md"
          style={{ textWrap: 'wrap' }}
          fw={700}
          ta={'center'}
        >
          Create an account
        </Text>
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="First name"
              error={fieldState.error?.message}
              placeholder="e.g joe"
            />
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Last name"
              error={fieldState.error?.message}
              placeholder="e.g doe"
            />
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Email address"
              type="email"
              error={fieldState.error?.message}
              placeholder="e.g joedoe@abc.com"
            />
          )}
        />
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Phone number"
              error={fieldState.error?.message}
              placeholder="e.g 254712345678"
            />
          )}
        />

        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              label="Confirm Password"
              error={fieldState.error?.message}
              placeholder="*********"
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              label="Password"
              error={fieldState.error?.message}
              placeholder="*********"
            />
          )}
        />
        <Button type="submit">Register</Button>
        <Flex justify={'flex-start'} align={'center'}>
          <Text>Already have an account?</Text>
          <Link to={'/login'}>
            <Button variant="transparent" p={'xs'}>
              Sign in
            </Button>
          </Link>
        </Flex>
      </Stack>
    </form>
  );
};

export default RegistrationForm;
