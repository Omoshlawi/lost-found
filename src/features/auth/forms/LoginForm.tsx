import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
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
        <Button type="submit">Login</Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
