import React, { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useClaimApi } from '../hooks';
import { Claim, RejectClaimFormData } from '../types';
import { rejectClaimSchema } from '../utils/validation';

type RejectClaimFormProps = {
  claim: Claim;
  onClose: () => void;
  onSuccess?: (claim: Claim) => void;
};

const RejectClaimForm: FC<RejectClaimFormProps> = ({ claim, onClose, onSuccess }) => {
  const form = useForm<RejectClaimFormData>({
    defaultValues: {},
    resolver: zodResolver(rejectClaimSchema),
  });
  const { rejectClaim } = useClaimApi();
  const handleSubmit: SubmitHandler<RejectClaimFormData> = async (data) => {
    try {
      const updatedClaim = await rejectClaim(claim.id, data);
      onSuccess?.(updatedClaim);
      showNotification({
        title: 'Claim rejected',
        message: 'Claim rejected successfully',
        color: 'green',
      });
      onClose();
    } catch (error) {
      const e = handleApiErrors<RejectClaimFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error rejecting claim`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof RejectClaimFormData, { message: val })
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
                  { value: 'INVALID_DOCUMENT', label: 'Invalid document' },
                  { value: 'INCOMPLETE_DOCUMENTATION', label: 'Incomplete documentation' },
                  { value: 'INCORRECT_INFORMATION', label: 'Incorrect information' },
                  { value: 'DUPLICATE_CLAIM', label: 'Duplicate claim' },
                  { value: 'NOT_ELIGIBLE', label: 'Not eligible' },
                  { value: 'POLICY_VIOLATION', label: 'Policy violation' },
                  { value: 'FRAUD_SUSPECTED', label: 'Fraud suspected' },
                  { value: 'FRAUD_CONFIRMED', label: 'Fraud confirmed' },
                  {
                    value: 'NEW_EVIDENCE_INVALIDATES_CLAIM',
                    label: 'New evidence invalidates claim',
                  },
                  { value: 'VERIFIED_BY_MISTAKE', label: 'Verified by mistake' },
                  { value: 'OTHER', label: 'Other' },
                ]}
                label="Reject reason"
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

export default RejectClaimForm;
