import { TablerIconName } from '@/components';

/** Maps each backend operation code to a Tabler icon name. */
export const OPERATION_ICONS: Record<string, TablerIconName> = {
  RECEIPT:          'packageImport',    // document received at station
  TRANSFER_OUT:     'arrowRight',       // outbound transfer
  TRANSFER_IN:      'arrowLeft',        // inbound transfer
  REQUISITION:      'clipboardList',    // station requests document
  HANDOVER:         'userCheck',        // final handover to owner
  DISPOSAL:         'trash',            // permanent write-off
  RETURN:           'arrowBack',        // return after failed delivery
  AUDIT:            'clipboardCheck',   // location audit / no-op
  CONDITION_UPDATE: 'alertCircle',      // condition note / no-op
};

export const getOperationIcon = (code: string): TablerIconName =>
  OPERATION_ICONS[code] ?? 'bolt';
