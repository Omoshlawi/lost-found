import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  Button,
  Center,
  Container,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { LoginFormData } from '../types';
import { LoginValidationSchema } from '../utils/validation';

const LoginForm = () => {
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginValidationSchema),
  });
  const handleSubmit: SubmitHandler<LoginFormData> = (data) => {
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
          Welcome back! Please login to your account
        </Text>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Email address"
              error={fieldState.error?.message}
              placeholder="e.g joedoe@abc.com"
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
        <Button type="submit" variant="gradient">
          Login
        </Button>
        <Flex justify={'flex-start'} align={'center'}>
          <Text>Don't have an account?</Text>
          <Link to={'/register'}>
            <Button variant="transparent" p={'xs'}>
              Sign up
            </Button>
          </Link>
        </Flex>
      </Stack>
    </form>
  );
};

export default LoginForm;
