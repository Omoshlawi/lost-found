import dayjs from 'dayjs';
import { FC, ReactNode } from 'react';
import { Box, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { TablerIcon, TablerIconName } from '../TablerIcon';

type PageHeaderProps = {
  title: string;
  subTitle: string | (() => React.JSX.Element);
  icon: TablerIconName | (() => React.JSX.Element);
  traiiling?: ReactNode;
};

const DashboardPageHeader: FC<PageHeaderProps> = ({ icon, subTitle, title, traiiling }) => {
  return (
    <Box>
      <Group justify="space-between" align="center" mb="xs">
        <Group gap="xs" align="center">
          {typeof icon === 'string' && (
            <TablerIcon
              name={icon}
              size={18}
              stroke={1.75}
              style={{ color: 'var(--mantine-color-civicBlue-6)', flexShrink: 0 }}
            />
          )}
          {typeof icon === 'function' && icon()}
          <Stack gap={0}>
            <Title
              order={4}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 }}
            >
              {title}
            </Title>
            {typeof subTitle === 'string' && (
              <Text size="xs" c="dimmed">
                {subTitle}
              </Text>
            )}
            {typeof subTitle === 'function' && subTitle()}
          </Stack>
        </Group>

        {traiiling ?? (
          <Group gap={6} visibleFrom="sm">
            <TablerIcon name="calendar" size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
            <Text size="xs" c="dimmed">
              {dayjs().format('ddd DD MMM, YYYY')}
            </Text>
          </Group>
        )}
      </Group>
      <Divider />
    </Box>
  );
};

export default DashboardPageHeader;
