import React, { useEffect } from 'react';
import { Controller, FieldPath, useFormContext } from 'react-hook-form';
import { Select, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton } from '@/components';
import { useDocumentTypes } from '@/features/admin/hooks';
import { DocumentReportFormData } from '../../types';

type DocumentFormInputsProps = {
  enabledFields?: Array<FieldPath<DocumentReportFormData['document']>>;
};
const DocumentFormInputs: React.FC<DocumentFormInputsProps> = ({ enabledFields = [] }) => {
  const form = useFormContext<DocumentReportFormData>();
  const { documentTypes, isLoading, error } = useDocumentTypes();

  useEffect(() => {
    if (error) {
      showNotification({
        message: error?.message ?? 'An error ocuured while fetching document types',
        title: 'Error loading document types',
      });
    }
  }, [error]);

  return (
    <>
      <Controller
        control={form.control}
        name="document.typeId"
        render={({ field, fieldState }) =>
          !isLoading ? (
            <Select
              {...field}
              data={documentTypes.map((doc) => ({ label: doc.name, value: doc.id }))}
              label="Document Type"
              error={fieldState.error?.message}
              placeholder="Type of document"
            />
          ) : (
            <InputSkeleton />
          )
        }
      />
      {enabledFields.includes('ownerName') && (
        <Controller
          control={form.control}
          name="document.ownerName"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Owner name"
              error={fieldState.error?.message}
              placeholder="Owner full name"
            />
          )}
        />
      )}
      {enabledFields.includes('documentNumber') && (
        <Controller
          control={form.control}
          name="document.documentNumber"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Document Number"
              error={fieldState.error?.message}
              placeholder="Unique document number e.g Reg No, Passport No, ID No"
            />
          )}
        />
      )}
      {enabledFields.includes('serialNumber') && (
        <Controller
          control={form.control}
          name="document.serialNumber"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Unique document number"
              error={fieldState.error?.message}
              placeholder="Secondary identifier like serial number if present"
            />
          )}
        />
      )}
      {enabledFields.includes('batchNumber') && (
        <Controller
          control={form.control}
          name="document.batchNumber"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Batch number"
              error={fieldState.error?.message}
              placeholder="Batch number if available"
            />
          )}
        />
      )}
      {enabledFields.includes('issuer') && (
        <Controller
          control={form.control}
          name="document.issuer"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Issuer" error={fieldState.error?.message} />
          )}
        />
      )}
      {enabledFields.includes('placeOfBirth') && (
        <Controller
          control={form.control}
          name="document.placeOfBirth"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Place of birth"
              error={fieldState.error?.message}
              placeholder="Owner's place of birth"
            />
          )}
        />
      )}
      {enabledFields.includes('bloodGroup') && (
        <Controller
          control={form.control}
          name="document.bloodGroup"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Blood group"
              error={fieldState.error?.message}
              placeholder="Owner's place of birth"
            />
          )}
        />
      )}
      {enabledFields.includes('placeOfIssue') && (
        <Controller
          control={form.control}
          name="document.placeOfIssue"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Place of issue"
              error={fieldState.error?.message}
              placeholder="Document place of issue"
            />
          )}
        />
      )}
      {enabledFields.includes('gender') && (
        <Controller
          control={form.control}
          name="document.gender"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Gender"
              error={fieldState.error?.message}
              placeholder="Owner's gender"
            />
          )}
        />
      )}
      {enabledFields.includes('nationality') && (
        <Controller
          control={form.control}
          name="document.nationality"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Nationality"
              error={fieldState.error?.message}
              placeholder="Nationality"
            />
          )}
        />
      )}
      {enabledFields.includes('note') && (
        <Controller
          control={form.control}
          name="document.note"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              label="Additional notes"
              error={fieldState.error?.message}
              placeholder="notes ..."
            />
          )}
        />
      )}
      {enabledFields.includes('expiryDate') && (
        <Controller
          control={form.control}
          name="document.expiryDate"
          render={({ field, fieldState }) => (
            <DateInput
              {...field}
              label="Expiry date"
              error={fieldState.error?.message}
              placeholder="Document expiry date"
            />
          )}
        />
      )}
      {enabledFields.includes('dateOfBirth') && (
        <Controller
          control={form.control}
          name="document.dateOfBirth"
          render={({ field, fieldState }) => (
            <DateInput
              {...field}
              label="Date of birth"
              error={fieldState.error?.message}
              placeholder="Owner's date of birth"
            />
          )}
        />
      )}
      {enabledFields.includes('issuanceDate') && (
        <Controller
          control={form.control}
          name="document.issuanceDate"
          render={({ field, fieldState }) => (
            <DateInput
              {...field}
              label="Date of Issue"
              error={fieldState.error?.message}
              placeholder="Document date of issue"
            />
          )}
        />
      )}
    </>
  );
};

export default DocumentFormInputs;
