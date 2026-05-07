import { DocumentOperationTypeCode } from '../types';

export const getCounterpartLabel = (code: string): string =>
  code === DocumentOperationTypeCode.TRANSFER_OUT ? 'Destination Station' : 'Source Station';
