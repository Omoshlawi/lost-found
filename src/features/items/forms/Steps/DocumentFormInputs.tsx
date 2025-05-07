import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton } from '@/components';
import { useDocumentTypes } from '@/features/admin/hooks';
import { DocumentReportFormData } from '../../types';

const DocumentFormInputs = () => {
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
            />
          ) : (
            <InputSkeleton />
          )
        }
      />
      <Controller
        control={form.control}
        name="document.ownerName"
        render={({ field, fieldState }) => (
          <TextInput {...field} label="Owner name" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="document.issuer"
        render={({ field, fieldState }) => (
          <TextInput {...field} label="Issuer" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="document.serialNumber"
        render={({ field, fieldState }) => (
          <TextInput {...field} label="Unique document number" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="document.expiryDate"
        render={({ field, fieldState }) => (
          <DateInput {...field} label="Expiry date" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="document.issuanceDate"
        render={({ field, fieldState }) => (
          <DateInput {...field} label="Issuance date" error={fieldState.error?.message} />
        )}
      />
    </>
  );
};

export default DocumentFormInputs;
