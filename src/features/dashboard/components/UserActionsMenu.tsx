import { Link } from 'react-router-dom';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';
import { authClient } from '@/lib/api';
import ImpersonateUser from './ImpersonateUser';

const UserActionsMenu = () => {
  return (
    <Menu position="bottom-end" withArrow>
      <Menu.Target>
        <ActionIcon variant="light" aria-label="User actions menu" size="lg" radius="50%">
          <TablerIcon name="userCircle" stroke={1.5} style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<TablerIcon name="user" size={16} />}
          component={Link}
          to="/dashboard/settings/profile"
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<TablerIcon name="settings" size={16} />}
          component={Link}
          to="/dashboard/settings"
        >
          Settings
        </Menu.Item>

        <ImpersonateUser />

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<TablerIcon name="logout" size={16} />}
          onClick={() =>
            modals.openConfirmModal({
              title: 'Sign out',
              children: <Text size="sm">Are you sure you want to sign out?</Text>,
              labels: { confirm: 'Sign out', cancel: 'Cancel' },
              confirmProps: { color: 'red' },
              onConfirm: () => authClient.signOut(),
            })
          }
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserActionsMenu;
