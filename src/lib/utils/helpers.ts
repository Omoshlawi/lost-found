import { NotificationData, notifications } from '@mantine/notifications';

export const getNameInitials = (name: string) => {
  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};
export const getNameInitialsFromEmail = (email: string) => {
  const name = email.split('@')[0];
  return getNameInitials(name);
};

export const showSnackbar = (notification: NotificationData) => {
  notifications.show({
    ...notification,
    style: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
    },
  });
};
