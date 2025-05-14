import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  NumberInput,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { ImageProcessFormValues } from '@/features/items/types';
import { ImageProcessOptionsSchema } from '@/features/items/utils';

type DocumentFilterFormProps = {
  onSubmit?: SubmitHandler<ImageProcessFormValues>;
};

const DocumentFilterForm: React.FC<DocumentFilterFormProps> = ({ onSubmit }) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  // React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ImageProcessFormValues>({
    resolver: zodResolver(ImageProcessOptionsSchema) as any,
    defaultValues: {
      lightness: 1,
      saturation: 1,
      brightness: 1,
      hue: 1,
    },
  });

  return (
    <form onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}>
      <Stack>
        <pre>{JSON.stringify({ values: watch(), errors,  }, null, 2)}</pre>

        <Title order={4} c={theme.primaryColor}>
          Dimensions
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Controller
            name="width"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Width"
                placeholder="Auto"
                min={1}
                max={5000}
                error={errors.width?.message}
                {...field}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Height"
                placeholder="Auto"
                min={1}
                max={5000}
                error={errors.height?.message}
                {...field}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </SimpleGrid>

        <Controller
          name="fit"
          control={control}
          render={({ field }) => (
            <Select
              label="Fit"
              data={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'fill', label: 'Fill' },
                { value: 'inside', label: 'Inside' },
                { value: 'outside', label: 'Outside' },
              ]}
              error={errors.fit?.message}
              {...field}
            />
          )}
        />

        <Divider
          my="sm"
          color={colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]}
        />
        <Title order={4} c={theme.primaryColor}>
          Adjustments
        </Title>

        <Controller
          name="grayScale"
          control={control}
          render={({ field }) => (
            <Switch
              label="Grayscale"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              error={errors.grayScale?.message}
              color={theme.primaryColor}
            />
          )}
        />

        <Controller
          name="contrast"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Contrast
              </Text>
              <Slider
                min={-100}
                max={100}
                step={1}
                marks={[
                  { value: -100, label: '-100' },
                  { value: 0, label: '0' },
                  { value: 100, label: '100' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Controller
          name="brightness"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Brightness
              </Text>
              <Slider
                min={-100}
                max={100}
                step={1}
                marks={[
                  { value: -100, label: '-100' },
                  { value: 0, label: '0' },
                  { value: 100, label: '100' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Controller
          name="hue"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Hue
              </Text>
              <Slider
                min={-360}
                max={360}
                step={1}
                marks={[
                  { value: -360, label: '-360' },
                  { value: 0, label: '0' },
                  { value: 360, label: '360' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Controller
          name="saturation"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Saturation
              </Text>
              <Slider
                min={-100}
                max={100}
                step={1}
                marks={[
                  { value: -100, label: '-100' },
                  { value: 0, label: '0' },
                  { value: 100, label: '100' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Controller
          name="lightness"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Lightness
              </Text>
              <Slider
                min={-100}
                max={100}
                step={1}
                marks={[
                  { value: -100, label: '-100' },
                  { value: 0, label: '0' },
                  { value: 100, label: '100' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Controller
          name="sharpness"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Sharpness
              </Text>
              <Slider
                min={0}
                max={100}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Controller
          name="blur"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Blur
              </Text>
              <Slider
                min={0}
                max={20}
                step={0.1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                ]}
                value={field.value ?? 0}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Divider
          my="sm"
          color={colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]}
        />
        <Title order={4} c={colorScheme === 'dark' ? 'blue.4' : 'blue.7'}>
          Advanced
        </Title>

        <Controller
          name="normalize"
          control={control}
          render={({ field }) => (
            <Switch
              label="Normalize"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              error={errors.normalize?.message}
            />
          )}
        />

        <Controller
          name="threshold"
          control={control}
          render={({ field, fieldState }) => (
            <Stack gap={'xs'}>
              <Text size="sm" fw={500}>
                Threshold
              </Text>
              <Slider
                min={0}
                max={255}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 128, label: '128' },
                  { value: 255, label: '255' },
                ]}
                value={field.value ?? 128}
                onChange={field.onChange}
                color={theme.primaryColor}
              />
              {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
            </Stack>
          )}
        />

        <Button type="submit" mt="md">
          Apply Filters
        </Button>
      </Stack>
    </form>
  );
};

export default DocumentFilterForm;
