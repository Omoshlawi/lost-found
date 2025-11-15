import React from 'react';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Group,
  Loader,
  Menu,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { useSearchUser } from '@/hooks/usesearchUser';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import { authClient } from '@/lib/api';
import { User } from '@/types/auth';

const ImpersonateUser = () => {
  const { data, refetch } = authClient.useSession();
  const session = data?.session;
  const { hasAccess } = useUserHasSystemAccess({
    user: ['impersonate'],
  });

  if (!session?.impersonatedBy && !hasAccess) {
    return null;
  }

  return (
    <>
      <Menu.Item
        leftSection={<TablerIcon name="userQuestion" size={18} />}
        onClick={async () => {
          if (session?.impersonatedBy) {
            const { error } = await authClient.admin.stopImpersonating();
            if (error) {
              showNotification({
                color: 'red',
                title: 'Error stopping impersonation',
                message: error?.message,
              });
            } else {
              showNotification({
                color: 'teal',
                title: 'Success',
                message: 'Impersonation stoped succesfully',
              });
            }
            refetch();
          } else {
            const id = openModal({
              title: 'Impersonate User',
              size: 'md',
              children: (
                <Search
                  onClick={async (user) => {
                    closeModal(id);
                    await authClient.admin.impersonateUser(
                      {
                        userId: user.id,
                      },
                      {
                        onSuccess(_) {
                          showNotification({
                            color: 'teal',
                            title: 'Impersonation succesfull',
                            message: `Impersonating user ${user.email}`,
                          });
                        },
                        onError(context) {
                          showNotification({
                            color: 'red',
                            title: `Error impersonation user ${user.email}`,
                            message: context.error.message,
                          });
                        },
                      }
                    );
                    refetch();
                  }}
                />
              ),
            });
          }
        }}
      >
        {session?.impersonatedBy ? 'Stop Impersonation' : 'Impersonate user'}
      </Menu.Item>
    </>
  );
};

export default ImpersonateUser;

const Search = ({ onClick }: { onClick: (user: User) => void }) => {
  const userSearchAsync = useSearchUser();

  return (
    <Stack gap="md">
      <TextInput
        leftSection={<TablerIcon name="search" size={16} />}
        placeholder="Search by email..."
        rightSection={userSearchAsync.isLoading && <Loader size="xs" />}
        value={userSearchAsync.filters?.searchValue}
        onChange={({ target: { value: searchValue } }) =>
          userSearchAsync.setFilters({
            searchField: 'email',
            searchValue,
          })
        }
        size="md"
      />

      {userSearchAsync.users.length > 0 ? (
        <ScrollArea.Autosize mah={400}>
          <Stack gap="xs">
            {userSearchAsync.users.map((user, index) => (
              <React.Fragment key={user.id}>
                {index > 0 && <Divider />}
                <Card
                  padding="sm"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => onClick(user)}
                >
                  <Group wrap="nowrap" gap="sm">
                    <Avatar size="md" radius="xl" color="blue">
                      {user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Stack gap={2} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <Text fw={500} size="sm" lineClamp={1} style={{ wordBreak: 'break-all' }}>
                        {user.email}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {user.displayUsername || 'No username'}
                      </Text>
                    </Stack>
                    <Box style={{ flexShrink: 0 }}>
                      <TablerIcon name="chevronRight" size={16} />
                    </Box>
                  </Group>
                </Card>
              </React.Fragment>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      ) : (
        <Box py="xl">
          <Text c="dimmed" ta="center" size="sm">
            {userSearchAsync.filters?.searchValue
              ? 'No users found'
              : 'Start typing to search for users'}
          </Text>
        </Box>
      )}
    </Stack>
  );
};
