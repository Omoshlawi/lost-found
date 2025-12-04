// utils/reportUtils.ts
import dayjs from 'dayjs';
import { FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';

export const formatDate = (dateString?: string) => {
  if (!dateString) {
    return 'N/A';
  }
  return dayjs(dateString).format('DD/MM/YYYY');
};

export const getStatusColor = (status?: FoundDocumentCaseStatus | LostDocumentCaseStatus) => {
  switch (status) {
    case FoundDocumentCaseStatus.DRAFT:
      return 'gray';
    case FoundDocumentCaseStatus.SUBMITTED:
      return 'blue';
    case FoundDocumentCaseStatus.VERIFIED:
      return 'teal';
    case FoundDocumentCaseStatus.REJECTED:
      return 'red';
    case FoundDocumentCaseStatus.COMPLETED:
      return 'green';
    default:
      return 'blue';
  }
};
