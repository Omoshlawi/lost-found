import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Flex, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import handleAPIErrors from '@/lib/api/handleApiErrors';
import { useAuthAPi } from '../hooks';
import { LoginFormData } from '../types';
import { LoginValidationSchema } from '../utils/validation';

const LoginForm = () => {
  const { loginUser } = useAuthAPi();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    defaultValues: {
      identifier: '',
      password: '',
    },
    resolver: zodResolver(LoginValidationSchema),
  });
  const handleSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await loginUser(data);
      // TODO: show success message
      if (callbackUrl) navigate(callbackUrl, { replace: true });
    } catch (error) {
      const e = handleAPIErrors<LoginFormData>(error);
      if (e.detail) {
        // TODO: Show error message in a toast
        alert(e.detail);
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof LoginFormData, { message: val })
        );
      }
    }
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
          name="identifier"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Email or Phone number"
              error={fieldState.error?.message}
              placeholder="e.g joedoe@abc.com or 254712345678"
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
          <Link
            to={`/register${callbackUrl ? '?callbackUrl=' + encodeURIComponent(callbackUrl) : ''}`}
          >
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
