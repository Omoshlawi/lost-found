import { IconMessageCircle, IconSettings, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { TablerIcon } from '@/components';
import { authClient } from '@/lib/api';
import ImpersonateUser from './ImpersonateUser';

const UserActionsMenu = () => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="light" aria-label="User actions menu" size="lg" radius="50%">
          <TablerIcon name="userFilled" stroke={1.5} style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<TablerIcon name="user" size={18} />}>Profile</Menu.Item>
        <Menu.Item leftSection={<IconSettings size={18} />}>Settings</Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={18} />}>Messages</Menu.Item>
        <ImpersonateUser />
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={<TablerIcon name="logout" size={18} />}
          onClick={() => {
            openConfirmModal({
              title: 'Confirm logout',
              children: <Text size="sm">are you sure you want to logout?</Text>,
              labels: { confirm: 'Logout', cancel: 'Cancel' },
              onConfirm: () => {
                authClient.signOut();
              },
            });
          }}
          color="red"
        >
          Logout
        </Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={18} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserActionsMenu;
