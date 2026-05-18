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
import { DashboardPageHeader, ErrorState, launchWorkspace, TablerIcon } from '@/components';
import { formatDate } from '@/lib/utils';
import TemplateForm from '../forms/TemplateForm';
import { useTemplate, useTemplateVersions } from '../hooks';
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

  const handleEdit = () => {
    const close = launchWorkspace(
      <TemplateForm template={template as Template} onClose={() => close()} />,
      { title: `Edit Template: ${template?.name}`, expandable: true, width: 'extra-wide' }
    );
  };

  if (isLoading) return <Loader />;
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
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {versions.map((v) => (
                  <Table.Tr key={v.id}>
                    <Table.Td>
                      <Badge variant="light" size="xs">
                        v{v.version}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{v.changeNote ?? '—'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(v.createdAt)}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default TemplateDetailPage;
