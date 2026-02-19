import dayjs from 'dayjs';
import React, { FC, ReactNode } from 'react';
import { Box, Divider, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
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
      <Group align="flex-start" justify="space-between">
        <Group>
          <ThemeIcon radius={0} size={60} variant="light">
            {typeof icon === 'string' && <TablerIcon name={icon} />}
            {typeof icon === 'function' && <>{icon()}</>}
          </ThemeIcon>
          <Group h="100%" flex={1}>
            <Stack gap={2} align="flex-start" h="100%">
              <Title order={3}>{title}</Title>
              {typeof subTitle === 'string' && (
                <Text size="sm" c="dimmed">
                  {subTitle}
                </Text>
              )}
              {typeof subTitle === 'function' && <>{subTitle()}</>}
            </Stack>
          </Group>
        </Group>
        {traiiling ? (
          traiiling
        ) : (
          <Group gap="xs" visibleFrom="sm">
            <TablerIcon name="calendar" size={20} />
            <Text c="dimmed">{dayjs().format('ddd DD MMM, YYYY')}</Text>
          </Group>
        )}
      </Group>
      <Divider />
    </Box>
  );
};

export default DashboardPageHeader;
