import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTransitionReasons } from '@/features/status-transitions/hooks';
import { handleApiErrors } from '@/lib/api';
import { useClaimApi } from '../hooks';
import { Claim, ClaimStatus, VerifyClaimFormData } from '../types';
import { verifyClaimSchema } from '../utils/validation';

type RejectReviewFormProps = {
  claim: Claim;
  onClose: () => void;
  onSuccess?: (claim: Claim) => void;
};

const RejectReviewForm: FC<RejectReviewFormProps> = ({ claim, onClose, onSuccess }) => {
  const form = useForm<VerifyClaimFormData>({
    defaultValues: {},
    resolver: zodResolver(verifyClaimSchema),
  });
  const { reasons } = useTransitionReasons({
    entityType: 'Claim',
    fromStatus: claim.status,
    toStatus: ClaimStatus.REJECTED,
    auto: 'false',
  });
  const { rejectReviewedClaim } = useClaimApi();
  const handleSubmit: SubmitHandler<VerifyClaimFormData> = async (data) => {
    try {
      const updatedClaim = await rejectReviewedClaim(claim.id, data);
      onSuccess?.(updatedClaim);
      showNotification({
        title: 'Claim rejected',
        message: 'Claim rejected successfully',
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
                data={reasons.map((reason) => ({ value: reason.id, label: reason.label }))}
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

export default RejectReviewForm;
