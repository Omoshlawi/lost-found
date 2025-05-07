import React from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { DocumentReport } from '../types';

type ReportDocumentInfoFormProps = {
  report: DocumentReport;
  onSuccess?: (report: DocumentReport) => void;
  closeWorkspace?: () => void;
};

const ReportDocumentInfoForm: React.FC<ReportDocumentInfoFormProps> = ({
  report,
  onSuccess,
  closeWorkspace,
}) => {
  return (
    <form
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <Stack>
        
      </Stack>
      <Group gap={1}>
        <Button flex={1} variant="default" radius={0} onClick={closeWorkspace}>
          Cancel
        </Button>
        <Button flex={1} radius={0} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default ReportDocumentInfoForm;
