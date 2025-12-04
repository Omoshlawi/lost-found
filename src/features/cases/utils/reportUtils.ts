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
      return 'green';
    case FoundDocumentCaseStatus.SUBMITTED:
      return 'blue';
    case FoundDocumentCaseStatus.VERIFIED:
      return 'gray';
    case FoundDocumentCaseStatus.MATCHED:
      return 'yellow';
    case FoundDocumentCaseStatus.CLAIMED:
      return 'green';
    case FoundDocumentCaseStatus.COMPLETED:
      return 'green';
    default:
      return 'blue';
  }
};
