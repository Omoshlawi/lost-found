import {
  Button,
  Center,
  CenterProps,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { TablerIcon, TablerIconName } from "../TablerIcon";
import { IconPlus } from "@tabler/icons-react";

interface EmptyStateProps extends CenterProps {
  title?: string;
  message?: string;
  icon?: TablerIconName;
  onAdd?: () => void;
}

// Empty State Component
function EmptyState({
  title = "No data found",
  message = "There are no records to display",
  icon = "databaseOff",
  onAdd,
  ...props
}: EmptyStateProps) {
  return (
    <Center py={60} {...props}>
      <Stack align="center" gap="md">
        <ThemeIcon size={64} radius="xl" variant="light" color="gray">
          <TablerIcon name={icon} size={32} />
        </ThemeIcon>
        <Stack align="center" gap="xs">
          <Text size="lg" fw={500} c="dimmed">
            {title}
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            {message}
          </Text>
        </Stack>
        {onAdd && (
          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={onAdd}
          >
            Add
          </Button>
        )}
      </Stack>
    </Center>
  );
}

export default EmptyState;
