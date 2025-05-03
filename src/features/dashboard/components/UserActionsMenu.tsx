import React from 'react';
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { TablerIcon } from '@/components';

const UserActionsMenu = () => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="light" aria-label="User actions menu" size={'lg'} radius={'50%'}>
          <TablerIcon name="userFilled" stroke={1.5} style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<TablerIcon name="user" size={18} />}>Profile</Menu.Item>
        <Menu.Item leftSection={<IconSettings size={18} />}>Settings</Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={18} />}>Messages</Menu.Item>
        <Menu.Label>Admin</Menu.Label>
        <Menu.Item leftSection={<TablerIcon name="userQuestion" size={18} />}>
          Impersonate user
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item color="red" leftSection={<IconTrash size={18} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserActionsMenu;
