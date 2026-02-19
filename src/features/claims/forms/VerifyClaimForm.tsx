import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useClaimApi } from '../hooks';
import { Claim, VerifyClaimFormData } from '../types';
import { verifyClaimSchema } from '../utils/validation';

type VerifyClaimFormProps = {
  claim: Claim;
  onClose: () => void;
  onSuccess?: (claim: Claim) => void;
};

const VerifyClaimForm = ({ claim, onClose, onSuccess }: VerifyClaimFormProps) => {
  const form = useForm<VerifyClaimFormData>({
    defaultValues: {},
    resolver: zodResolver(verifyClaimSchema),
  });
  const { verifyClaim } = useClaimApi();
  const handleSubmit: SubmitHandler<VerifyClaimFormData> = async (data) => {
    try {
      const updatedClaim = await verifyClaim(claim.id, data);
      onSuccess?.(updatedClaim);
      showNotification({
        title: 'Claim verified',
        message: 'Claim verified successfully',
        color: 'green',
      });
      onClose();
    } catch (error) {
      const e = handleApiErrors<VerifyClaimFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error rejecting claim`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof VerifyClaimFormData, { message: val })
        );
      }
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <Select
                data={[
                  { value: 'DOCUMENTS_VALIDATED', label: 'Documents validated' },
                  { value: 'MANUAL_REVIEW_APPROVED', label: 'Manual review approved' },
                  { value: 'DISPUTE_RESOLVED_IN_FAVOR', label: 'Dispute resolved in favor' },
                  { value: 'ADDITIONAL_EVIDENCE_ACCEPTED', label: 'Additional evidence accepted' },
                  { value: 'OTHER', label: 'Other' },
                ]}
                label="Verification reason"
                value={field.value}
                placeholder="Select a reason"
                onChange={(_value, _option) => field.onChange(_value)}
                error={fieldState.error?.message}
                ref={field.ref}
                clearable
              />
            )}
          />
          <Controller
            control={form.control}
            name="comment"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Comment"
                error={fieldState.error?.message}
                placeholder="Add a comment"
              />
            )}
          />
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={onClose}>
            Cancel
          </Button>
          <Button
            radius={0}
            flex={1}
            fullWidth
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default VerifyClaimForm;
