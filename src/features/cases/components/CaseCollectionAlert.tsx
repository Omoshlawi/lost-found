import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { TablerIcon } from '@/components';
import { DocumentCase } from '../types';
import { VerifyDocumentCollectionCode } from './form-actions';

interface CaseCollectionAlertProps {
  documentCase: DocumentCase;
}

const CaseCollectionAlert = ({ documentCase }: CaseCollectionAlertProps) => {
  return (
    <Alert
      variant="light"
      color="teal"
      icon={<TablerIcon name="keyframe" size={16} />}
      title="Collection in progress — code issued to finder"
    >
      <Stack gap="sm">
        <Text size="sm">
          A handover code has been sent to the finder. Ask them to share it and enter it below to
          confirm handover. Case editing is locked until confirmed or cancelled.
        </Text>
        <Group>
          <VerifyDocumentCollectionCode
            documentCase={documentCase}
            renderTrigger={({ onClick }) => (
              <Button
                size="xs"
                color="teal"
                leftSection={<TablerIcon name="keyframe" size={13} />}
                onClick={onClick}
              >
                Enter Code
              </Button>
            )}
          />
        </Group>
      </Stack>
    </Alert>
  );
};

export default CaseCollectionAlert;
