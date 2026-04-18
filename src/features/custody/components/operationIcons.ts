import { TablerIconName } from '@/components';

export const OPERATION_ICONS: Record<string, TablerIconName> = {
  AUDIT: 'clipboardCheck',
  CONDITION_UPDATE: 'alertCircle',
  DISPOSAL: 'trash',
  TRANSFER_OUT: 'arrowRight',
  RETURN: 'arrowBack',
  INTAKE: 'packageImport',
  RELEASE: 'packageExport',
};

export const getOperationIcon = (code: string): TablerIconName =>
  OPERATION_ICONS[code] ?? 'bolt';
