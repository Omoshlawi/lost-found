import dayjs from 'dayjs';
import { FC, ReactNode } from 'react';
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
    <Box pb="md">
      <Group justify="space-between" align="center" mb="sm">
        <Group gap="sm" align="center">
          <ThemeIcon size={42} color="civicBlue" variant="light">
            {typeof icon === 'string' && <TablerIcon name={icon} size={20} stroke={1.5} />}
            {typeof icon === 'function' && icon()}
          </ThemeIcon>
          <Box>
            <Title
              order={3}
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {title}
            </Title>
            {typeof subTitle === 'string' && (
              <Text size="sm" c="dimmed" mt={2}>
                {subTitle}
              </Text>
            )}
            {typeof subTitle === 'function' && subTitle()}
          </Box>
        </Group>

        {traiiling ?? (
          <Stack gap={0} align="flex-end" visibleFrom="sm">
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              c="civicGold.6"
              style={{ letterSpacing: '0.1em' }}
            >
              {dayjs().format('ddd')}
            </Text>
            <Text size="sm" fw={500} c="dimmed">
              {dayjs().format('DD MMM YYYY')}
            </Text>
          </Stack>
        )}
      </Group>
      <Divider />
    </Box>
  );
};

export default DashboardPageHeader;
