import { ColumnDef } from '@tanstack/react-table';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  TablerIcon,
} from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { handleApiErrors } from '@/lib/api';
import { AddressLocaleForm } from '../forms';
import { useAddressLocales, useAddressLocalesApi } from '../hooks';
import { AddressLocale, AddressLocaleFormData } from '../types';

const AddressLocalesPage = () => {
  const localeQuery = useAddressLocales();
  const { deleteAddressLocale, restoreAddressLocale, mutateAddressLocales } = useAddressLocalesApi();
  const { bgColor } = useAppColors();

  const handleLaunchForm = (locale?: AddressLocale) => {
    const dispose = launchWorkspace(
      <AddressLocaleForm locale={locale} closeWorkspace={() => dispose()} />,
      {
        title: locale ? 'Edit address locale' : 'New address locale',
        width: 'wide',
        expandable: true,
      }
    );
  };

  const handleDelete = (locale: AddressLocale) => {
    modals.openConfirmModal({
      title: 'Delete address locale',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the locale{' '}
          <Text span fw={600}>
            {locale.code}
          </Text>
          ? This action can be reverted using restore.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteAddressLocale(locale.id);
          showNotification({
            title: 'Locale deleted',
            message: 'The locale was deleted successfully.',
            color: 'green',
          });
          mutateAddressLocales();
        } catch (error) {
          const validation = handleApiErrors<AddressLocaleFormData>(error);
          showNotification({
            title: 'Failed to delete locale',
            message: validation.detail ?? 'Unknown error occurred',
            color: 'red',
          });
        }
      },
    });
  };

  const handleRestore = async (locale: AddressLocale) => {
    try {
      await restoreAddressLocale(locale.id);
      showNotification({
        title: 'Locale restored',
        message: 'The locale was restored successfully.',
        color: 'green',
      });
      mutateAddressLocales();
    } catch (error) {
      const validation = handleApiErrors<AddressLocaleFormData>(error);
      showNotification({
        title: 'Failed to restore locale',
        message: validation.detail ?? 'Unknown error occurred',
        color: 'red',
      });
    }
  };

  const columns = buildColumns({
    onEdit: handleLaunchForm,
    onDelete: handleDelete,
    onRestore: handleRestore,
  });

  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Address locales"
          subTitle="Define reusable locale formats per country/region"
          icon="worldPin"
        />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...localeQuery}
          data={localeQuery.locales}
          title="Address locales"
          columns={columns}
          nothingFoundMessage="No locales found. Click add to create one."
          renderExpandedRow={({ original }) => <AddressLocaleDetails locale={original} />}
          onAdd={() => handleLaunchForm()}
        />
      </Paper>
    </Stack>
  );
};

export default AddressLocalesPage;

type ColumnHandlers = {
  onEdit: (locale: AddressLocale) => void;
  onDelete: (locale: AddressLocale) => void;
  onRestore: (locale: AddressLocale) => void;
};

const buildColumns = (handlers: ColumnHandlers): ColumnDef<AddressLocale>[] => [
  {
    id: 'expand',
    header: ({ table }) => {
      const expanded = table.getIsAllRowsExpanded();
      return (
        <ActionIcon variant="subtle" onClick={() => table.toggleAllRowsExpanded(!expanded)}>
          <TablerIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      );
    },
    cell: ({ row }) => {
      const expanded = row.getIsExpanded();
      return (
        <ActionIcon variant="subtle" onClick={() => row.toggleExpanded(!expanded)}>
          <TablerIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 0,
  },
  {
    header: 'Code',
    accessorKey: 'code',
  },
  {
    header: 'Country',
    accessorKey: 'country',
  },
  {
    header: 'Region',
    accessorKey: 'regionName',
  },
  {
    header: 'Tags',
    accessorKey: 'tags',
    cell: ({ row: { original } }) =>
      original.tags && original.tags.length ? (
        <Group gap={4}>
          {original.tags.map((tag) => (
            <Badge key={tag} variant="light" color="blue">
              {tag}
            </Badge>
          ))}
        </Group>
      ) : (
        '—'
      ),
  },
  {
    header: 'Updated',
    accessorKey: 'updatedAt',
    cell: ({ row: { original } }) => new Date(original.updatedAt).toLocaleString(),
  },
  {
    header: 'Status',
    accessorKey: 'voided',
    cell: ({ row: { original } }) => (
      <Badge color={original.voided ? 'red' : 'green'} variant="light">
        {original.voided ? 'Voided' : 'Active'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="outline">
            <TablerIcon name="dotsVertical" size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Manage</Menu.Label>
          <Menu.Item
            leftSection={<TablerIcon name="edit" size={14} />}
            onClick={() => handlers.onEdit(original)}
          >
            Edit
          </Menu.Item>
          {!original.voided && (
            <Menu.Item
              color="red"
              leftSection={<TablerIcon name="trash" size={14} />}
              onClick={() => handlers.onDelete(original)}
            >
              Delete
            </Menu.Item>
          )}
          {original.voided && (
            <Menu.Item
              color="green"
              leftSection={<TablerIcon name="history" size={14} />}
              onClick={() => handlers.onRestore(original)}
            >
              Restore
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    ),
  },
];

const AddressLocaleDetails = ({ locale }: { locale: AddressLocale }) => (
  <Stack gap="md">
    <Stack gap={0}>
      <Text size="sm" c="dimmed">
        Description
      </Text>
      <Text size="sm">{locale.description ?? '—'}</Text>
    </Stack>

    {locale.tags && locale.tags.length > 0 && (
      <Group gap={4}>
        {locale.tags.map((tag) => (
          <Badge key={tag} variant="light" color="blue">
            {tag}
          </Badge>
        ))}
      </Group>
    )}

    <Stack gap="xs">
      <Text size="sm" fw={600}>
        Levels
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        {locale.formatSpec.levels.map((level) => (
          <Paper key={`${level.level}-${level.label}`} p="xs" withBorder>
            <Stack gap={2}>
              <Text size="sm" fw={600}>
                {level.label} ({level.level.toUpperCase()})
              </Text>
              <Text size="xs" c="dimmed">
                Required: {level.required ? 'Yes' : 'No'}
              </Text>
              {level.aliases && level.aliases.length > 0 && (
                <Text size="xs">Aliases: {level.aliases.join(', ')}</Text>
              )}
              {level.helperText && (
                <Text size="xs" c="dimmed">
                  {level.helperText}
                </Text>
              )}
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>

    <Stack gap="xs">
      <Text size="sm" fw={600}>
        Metadata
      </Text>
      <Stack gap={4}>
        <Text size="sm">Instructions: {locale.formatSpec.metadata?.instructions ?? '—'}</Text>
        <Text size="sm">
          Preferred fields:{' '}
          {locale.formatSpec.metadata?.preferredFields?.length
            ? locale.formatSpec.metadata?.preferredFields.join(', ')
            : '—'}
        </Text>
        {locale.formatSpec.metadata?.validation && (
          <Stack gap={2}>
            {Object.entries(locale.formatSpec.metadata.validation).map(([field, rule]) => (
              <Text key={field} size="xs">
                <Text span fw={600}>
                  {field}
                </Text>
                : {rule}
              </Text>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>

    {locale.formatSpec.postalCode && (
      <Stack gap={2}>
        <Text size="sm" fw={600}>
          Postal code spec
        </Text>
        <Text size="sm">Label: {locale.formatSpec.postalCode.label}</Text>
        <Text size="sm">Required: {locale.formatSpec.postalCode.required ? 'Yes' : 'No'}</Text>
        <Text size="sm">
          Description: {locale.formatSpec.postalCode.description ?? '—'}
        </Text>
      </Stack>
    )}

    {locale.formatSpec.displayTemplate && (
      <Stack gap={2}>
        <Text size="sm" fw={600}>
          Display template
        </Text>
        <Text size="sm" ff="monospace">
          {locale.formatSpec.displayTemplate}
        </Text>
      </Stack>
    )}

    {locale.examples && locale.examples.length > 0 && (
      <Stack gap="xs">
        <Text size="sm" fw={600}>
          Examples
        </Text>
        {locale.examples.map((example) => (
          <Paper key={example.label} withBorder p="sm">
            <Stack gap={4}>
              <Text size="sm" fw={600}>
                {example.label}
              </Text>
              {example.notes && (
                <Text size="xs" c="dimmed">
                  {example.notes}
                </Text>
              )}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                {Object.entries(example.address).map(([field, value]) => (
                  <Stack key={field} gap={0}>
                    <Text size="xs" c="dimmed">
                      {field}
                    </Text>
                    <Text size="sm">{value ?? '—'}</Text>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>
          </Paper>
        ))}
      </Stack>
    )}
  </Stack>
);

