import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Group, Stack } from '@mantine/core';
import { DocumentCaseFormData } from '../../types';
import AddressFormInputs from './AddressFormInputs';

type AddressInfoStepProps = {
  onPrevious?: () => void;
  onNext?: () => void;
};
const AddressInfoStep: React.FC<AddressInfoStepProps> = ({ onPrevious, onNext }) => {
  const form = useFormContext<DocumentCaseFormData>();

  return (
    <Stack justify="space-between" flex={1} h={'100%'}>
      <Stack>
        <AddressFormInputs />
      </Stack>
      <Group gap={1}>
        <Button variant="default" radius={0} flex={1} onClick={onPrevious}>
          Previous
        </Button>
        <Button
          radius={0}
          flex={1}
          onClick={async () => {
            const isValid = await form.trigger(
              ['countyCode', 'subCountyCode', 'wardCode', 'landMark'],
              { shouldFocus: true }
            );
            if (isValid) onNext?.();
          }}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
};

export default AddressInfoStep;
