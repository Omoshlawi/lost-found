import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';
import ConfirmCollectionForm from '../forms/ConfirmCollectionForm';
import { DocumentCase } from '../types';

interface CaseCollectionAlertProps {
  documentCase: DocumentCase;
}

const CaseCollectionAlert = ({ documentCase }: CaseCollectionAlertProps) => {
  const handleEnterCode = () => {
    const id = modals.open({
      title: 'Enter Finder Code',
      centered: true,
      children: (
        <ConfirmCollectionForm documentCase={documentCase} onClose={() => modals.close(id)} />
      ),
    });
  };

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
          <Button
            size="xs"
            color="teal"
            leftSection={<TablerIcon name="keyframe" size={13} />}
            onClick={handleEnterCode}
          >
            Enter Code
          </Button>
        </Group>
      </Stack>
    </Alert>
  );
};

export default CaseCollectionAlert;
