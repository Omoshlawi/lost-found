import { z } from 'zod';
import { DocumentReportSchema, ReportLostOrFoundDocumentSchema } from '../utils';

export interface DocumentReport {}

export interface County {
  code: string;
  name: string;
  subCounties: SubCounty[];
}

export interface SubCounty {
  code: string;
  name: string;
  countyCode: string;
  wards: Ward[];
}

export interface Ward {
  code: string;
  name: string;
  countyCode: string;
  subCountyCode: string;
}

export type DocumentReportFormData = z.infer<typeof ReportLostOrFoundDocumentSchema>;
