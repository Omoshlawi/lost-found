import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton, TablerIcon } from '@/components';
import { useAddresses } from '@/features/addresses/hooks';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase, FoundDocumentCaseFormData } from '../types';
import { FoundDocumentCaseSchema } from '../utils/validation';

type UpdateCaseAddressFormProps = {
  documentCase: DocumentCase;
  onSuccess?: (documentCase: DocumentCase) => void;
  closeWorkspace?: () => void;
};

const UpdateCaseAddressForm: FC<UpdateCaseAddressFormProps> = ({
  documentCase,
  onSuccess,
  closeWorkspace,
}) => {
  const form = useForm<Pick<FoundDocumentCaseFormData, 'addressId'>>({
    defaultValues: {
      addressId: documentCase.addressId,
    },
    resolver: zodResolver(FoundDocumentCaseSchema.pick({ addressId: true })),
  });

  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const { updateDocumentCase } = useDocumentCaseApi();

  const handleSubmit: SubmitHandler<Pick<FoundDocumentCaseFormData, 'addressId'>> = async (
    data
  ) => {
    try {
      const updatedCase = await updateDocumentCase(documentCase.id, {
        addressId: data.addressId,
      });
      showNotification({
        title: 'Success',
        message: 'Case address updated successfully',
        color: 'green',
      });

      onSuccess?.(updatedCase);
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<Pick<FoundDocumentCaseFormData, 'addressId'>>(error);
      if (e.detail) {
        showNotification({
          title: 'Error updating case address',
          message: e.detail,
          color: 'red',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof Pick<FoundDocumentCaseFormData, 'addressId'>, {
            message: val as string,
          })
        );
      }
    }
  };

  const addressOptions = addresses.map((address) => ({
    value: address.id,
    label: address.label || address.address1 || address.formatted || address.id,
  }));

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <Stack p="md" h="100%" justify="space-between" gap="lg">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="addressId"
            render={({ field, fieldState }) =>
              isLoadingAddresses ? (
                <InputSkeleton />
              ) : (
                <Select
                  {...field}
                  value={field.value || null}
                  data={addressOptions}
                  label="Address"
                  error={fieldState.error?.message}
                  nothingFoundMessage="No addresses found"
                  searchable
                  placeholder="Select address"
                  leftSection={<TablerIcon name="mapPin" size={18} />}
                />
              )
            }
          />
        </Stack>

        <Group gap="sm">
          <Button
            flex={1}
            variant="default"
            onClick={closeWorkspace}
            leftSection={<TablerIcon name="x" size={18} />}
          >
            Cancel
          </Button>
          <Button
            flex={1}
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            leftSection={<TablerIcon name="check" size={18} />}
          >
            Update Address
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default UpdateCaseAddressForm;
