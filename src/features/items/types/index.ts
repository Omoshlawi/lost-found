import { z } from 'zod';
import { DocumentReportSchema, ReportLostOrFoundDocumentSchema } from '../utils';

export interface DocumentReport {}

export type DocumentReportFormData = z.infer<typeof ReportLostOrFoundDocumentSchema>;
