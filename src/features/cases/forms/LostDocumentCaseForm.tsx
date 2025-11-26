/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DocumentCase, LostDocumentCaseFormData } from '../types';
import { LostDocumentCaseSchema } from '../utils';

type LostDocumentCaseFormProps = {
  case?: DocumentCase;
  closeWorkspace?: () => void;
  onSuccess?: (caseData: DocumentCase) => void;
};

const LostDocumentCaseForm = ({
  case: docCase,
  closeWorkspace,
  onSuccess,
}: LostDocumentCaseFormProps) => {
  const form = useForm<LostDocumentCaseFormData>({
    defaultValues: {},
    resolver: zodResolver(LostDocumentCaseSchema),
  });
  return <div>LostDocumentCaseForm</div>;
};

export default LostDocumentCaseForm;
