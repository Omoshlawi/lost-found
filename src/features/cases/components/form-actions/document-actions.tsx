import React, { FC, ReactNode } from 'react';
import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../../hooks';
import { DocumentCase } from '../../types';

type ActionProps = {
  docCase: DocumentCase;
  renderTrigger: (props: { onClick: () => void }) => ReactNode;
};
export const DeleteDocumentCase: FC<ActionProps> = ({ docCase, renderTrigger }) => {
  const { deleteDocumentCase } = useDocumentCaseApi();

  const handleDelete = () => {
    openConfirmModal({
      title: 'Delete Case',
      children: (
        <Text size="sm">
          Are you sure you want to delete this case? This action is destructive and can only be
          reversed by an admin.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteDocumentCase(docCase.id);
          showNotification({ title: 'Deleted', message: 'Case deleted.', color: 'green' });
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) {
            showNotification({ title: 'Error', message: e.detail, color: 'red' });
          }
        }
      },
    });
  };
  return <>{renderTrigger({ onClick: handleDelete })}</>;
};
