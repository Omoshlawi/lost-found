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

export const parseDate = (date?: string, defaultNow?: boolean) => {
  if (!date && !defaultNow) return;
  if (!date && defaultNow) return new Date();
  if (date) return new Date(date);
};
