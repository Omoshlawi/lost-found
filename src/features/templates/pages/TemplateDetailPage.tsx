import { useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Code,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, ErrorState, launchWorkspace, TablerIcon } from '@/components';
import { formatDate } from '@/lib/utils';
import TemplateForm from '../forms/TemplateForm';
import { useTemplate, useTemplateVersions, usetemplateApi } from '../hooks';
import { Template } from '../types';

const TYPE_COLORS: Record<string, string> = {
  notification: 'blue',
  prompt: 'yellow',
  invoice: 'green',
  print: 'teal',
};

const TemplateDetailPage = () => {
  const { id: key } = useParams<{ id: string }>();
  const { template, isLoading, error } = useTemplate(key);
  const { versions, isLoading: versionsLoading } = useTemplateVersions(key);
  const { rollbackTemplate } = usetemplateApi();

  const handleEdit = () => {
    const close = launchWorkspace(
      <TemplateForm template={template as Template} onClose={() => close()} />,
      { title: `Edit Template: ${template?.name}`, expandable: true, width: 'extra-wide' }
    );
  };

  const handleRestore = (version: number) => {
    modals.openConfirmModal({
      title: `Restore to v${version}`,
      centered: true,
      children: (
        <Text size="sm">
          This will replace the current template content with the content from{' '}
          <Text span fw={600}>v{version}</Text> and save it as a new version. This action can be
          undone by restoring to any other version.
        </Text>
      ),
      labels: { confirm: 'Restore', cancel: 'Cancel' },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        try {
          await rollbackTemplate(key!, version);
          showNotification({
            title: 'Template restored',
            message: `Template restored to v${version} successfully.`,
            color: 'green',
          });
        } catch {
          showNotification({
            title: 'Restore failed',
            message: 'Could not restore the template. Please try again.',
            color: 'red',
          });
        }
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error || !template) {
    return <ErrorState error={error} title="Template" message="Template not found" />;
  }

  const slots = template.slots as unknown as Record<string, string>;

  return (
    <Stack gap="md">
      <DashboardPageHeader
        icon="listNumbers"
        title={template.name}
        subTitle={() => (
          <Group gap="xs">
            <Badge size="xs" variant="outline">
              {template.key}
            </Badge>
            <Badge size="xs" color={TYPE_COLORS[template.type] ?? 'gray'}>
              {template.type}
            </Badge>
            {template.description && (
              <Text c="dimmed" size="sm">
                {template.description}
              </Text>
            )}
          </Group>
        )}
        traiiling={
          <Button
            variant="light"
            size="xs"
            leftSection={<TablerIcon name="edit" size={14} />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        }
      />

      <Tabs defaultValue="slots">
        <Tabs.List>
          <Tabs.Tab value="slots" leftSection={<TablerIcon name="template" size={12} />}>
            Slots
          </Tabs.Tab>
          <Tabs.Tab value="versions" leftSection={<TablerIcon name="history" size={12} />}>
            Version History
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="slots" pt="md">
          <Stack gap="lg">
            {Object.entries(slots).map(([slotName, content]) => (
              <Stack key={slotName} gap="xs">
                <Title order={6} tt="uppercase" c="dimmed" size="xs">
                  {slotName.replace(/_/g, ' ')}
                </Title>
                <ScrollArea.Autosize mah={400}>
                  <Code block style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {content || '(empty)'}
                  </Code>
                </ScrollArea.Autosize>
              </Stack>
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="versions" pt="md">
          {versionsLoading ? (
            <Loader size="sm" />
          ) : versions.length === 0 ? (
            <Text c="dimmed" size="sm">
              No version history available.
            </Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Version</Table.Th>
                  <Table.Th>Change Note</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {versions.map((v) => {
                  const isCurrent = v.version === template.version;
                  return (
                    <Table.Tr key={v.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <Badge variant="light" size="xs">
                            v{v.version}
                          </Badge>
                          {isCurrent && (
                            <Badge variant="dot" color="green" size="xs">
                              current
                            </Badge>
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{v.changeNote ?? '—'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(v.createdAt)}</Text>
                      </Table.Td>
                      <Table.Td>
                        {!isCurrent && (
                          <Button
                            variant="subtle"
                            size="compact-xs"
                            leftSection={<TablerIcon name="restore" size={12} />}
                            onClick={() => handleRestore(v.version)}
                          >
                            Restore
                          </Button>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default TemplateDetailPage;
