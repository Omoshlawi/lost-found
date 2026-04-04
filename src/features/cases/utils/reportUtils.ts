// utils/reportUtils.ts
import dayjs from 'dayjs';

export const formatDate = (dateString?: string) => {
  if (!dateString) {
    return 'N/A';
  }
  return dayjs(dateString).format('DD/MM/YYYY');
};
