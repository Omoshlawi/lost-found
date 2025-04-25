import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Flex, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { authClient, handleApiErrors } from '@/lib/api';
import { showSnackbar } from '@/lib/utils';
import { RegistrationFormData } from '../types';
import { RegistrationValidationSchema } from '../utils/validation';

const RegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const navigate = useNavigate();

  const form = useForm<RegistrationFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    resolver: zodResolver(RegistrationValidationSchema),
  });
  const handleSubmit: SubmitHandler<RegistrationFormData> = async (values) => {
    try {
      const { data, error } = await authClient.signUp.email({
        ...values,
        name: `${values.firstName} ${values.lastName}`,
      });
      if (error) {
        throw error;
      }
      showSnackbar({
        title: 'Registration successful',
        message: 'You have successfully registered',
        color: 'green',
        position: 'bottom-left',
      });
      if (callbackUrl) navigate(callbackUrl, { replace: true });
    } catch (error) {
      const e = handleApiErrors<RegistrationFormData>(error);
      if (e.detail) {
        showSnackbar({
          title: 'Registration Failed',
          message: e.detail,
          color: 'red',
        });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof RegistrationFormData, { message: val })
        );
    }
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack gap={'md'}>
        <Box>
          <Text variant="gradient" size="xl" mb="md" style={{ textWrap: 'wrap' }} fw={700}>
            Sign Up
          </Text>
          <Text c={'gray'}>Enter your information to create an account</Text>
        </Box>
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
        <Button type="submit" loading={form.formState.isSubmitting} variant="gradient">
          Register
        </Button>
        <Flex justify={'flex-start'} align={'center'}>
          <Text>Already have an account?</Text>
          <Link
            to={`/login${callbackUrl ? '?callbackUrl=' + encodeURIComponent(callbackUrl) : ''}`}
          >
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
