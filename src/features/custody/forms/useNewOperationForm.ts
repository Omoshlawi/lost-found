import { useCallback, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { showNotification } from '@mantine/notifications';
import { useDocumentCases } from '@/features/cases/hooks';
import { handleApiErrors } from '@/lib/api';
import { useActiveStation } from '@/hooks/useActiveStation';
import { createOperation, useAllowedOperations } from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';
import { DocumentOperationType } from '../types';
import { makeNewOperationSchema, NewOperationFormData } from '../utils/validation';

interface UseNewOperationFormOptions {
  preselectedType?: DocumentOperationType;
  defaultStationId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useNewOperationForm = ({
  preselectedType,
  defaultStationId,
  onClose,
  onSuccess,
}: UseNewOperationFormOptions) => {
  const { stationId: activeStationId } = useActiveStation();

  // ── Case label tracking (pills display after search clears) ─────────────────
  const [caseLabels, setCaseLabels] = useState<Record<string, string>>({});
  const [caseSearch, setCaseSearch] = useState('');

  // ── Dynamic Zod resolver via ref so the schema reflects the current op type ─
  const selectedOpTypeRef = useRef<DocumentOperationType | undefined>(preselectedType);

  const resolver: Resolver<NewOperationFormData> = useCallback(
    async (data, context, options) => {
      const schema = makeNewOperationSchema(selectedOpTypeRef.current);
      return zodResolver(schema)(data, context, options);
    },
    [], // stable — reads opType at call-time via ref
  );

  // ── RHF form ──────────────────────────────────────────────────────────────
  const form = useForm<NewOperationFormData>({
    defaultValues: {
      operationTypeId: preselectedType?.id ?? '',
      foundCaseIds: [],
      stationId: defaultStationId ?? activeStationId ?? null,
      toStationId: null,
      fromStationId: null,
      notes: '',
    },
    resolver,
    mode: 'onTouched',
  });

  // ── Static data fetching (no dependencies) ────────────────────────────────
  const { allowedOperations, isLoading: opTypesLoading } = useAllowedOperations(
    activeStationId || defaultStationId
  );
  const { stations } = usePickupStations();

  // ── Derived state ──────────────────────────────────────────────────────────
  const watchedTypeId = form.watch('operationTypeId');
  const watchedFoundCaseIds = form.watch('foundCaseIds');
  const watchedFromStationId = form.watch('fromStationId');

  const selectedOpType = useMemo<DocumentOperationType | undefined>(
    () => preselectedType ?? allowedOperations.find((t) => t.id === watchedTypeId),
    [preselectedType, allowedOperations, watchedTypeId]
  );

  // Keep ref in sync so the resolver always uses the latest op type
  selectedOpTypeRef.current = selectedOpType;

  const isRequisition = selectedOpType?.code === 'REQUISITION';

  // ── Case fetching — filtered by source station when REQUISITION ───────────
  const { reports: cases, isLoading: casesLoading } = useDocumentCases({
    caseType: 'FOUND',
    limit: 20,
    ...(caseSearch && { search: caseSearch }),
    // Only show documents currently at the selected source station for REQUISITION
    ...(isRequisition && watchedFromStationId && { currentStationId: watchedFromStationId }),
    v: 'custom:include(foundDocumentCase,document:include(type))',
  });

  const operationTypeOptions = useMemo(
    () => allowedOperations.map((t) => ({ value: t.id, label: t.name })),
    [allowedOperations]
  );

  const stationOptions = useMemo(
    () => stations.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })),
    [stations]
  );

  const availableCases = useMemo(
    () => cases.filter((c) => !watchedFoundCaseIds.includes(c.foundDocumentCase?.id ?? '')),
    [cases, watchedFoundCaseIds]
  );

  // ── Case selection helpers ─────────────────────────────────────────────────
  const addCase = (foundCaseId: string, label: string) => {
    form.setValue('foundCaseIds', [...watchedFoundCaseIds, foundCaseId], { shouldValidate: true });
    setCaseLabels((prev) => ({ ...prev, [foundCaseId]: label }));
    setCaseSearch('');
  };

  const removeCase = (foundCaseId: string) => {
    const remaining = watchedFoundCaseIds.filter((id) => id !== foundCaseId);
    form.setValue('foundCaseIds', remaining, { shouldValidate: true });
    setCaseLabels((prev) => {
      const next = { ...prev };
      delete next[foundCaseId];
      return next;
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<NewOperationFormData> = async (data) => {
    try {
      await createOperation({
        operationTypeId: data.operationTypeId,
        foundCaseIds: data.foundCaseIds,
        ...(data.stationId && { stationId: data.stationId }),
        ...(data.toStationId && { toStationId: data.toStationId }),
        ...(data.fromStationId && { fromStationId: data.fromStationId }),
        notes: data.notes || undefined,
      });
      showNotification({
        title: 'Operation created',
        message: `Draft operation created with ${data.foundCaseIds.length} document(s).`,
        color: 'teal',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<NewOperationFormData>(err);
      if (e.detail) {
        form.setError('root', { message: e.detail });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof NewOperationFormData, { message: String(val) })
        );
      }
    }
  };

  return {
    form,
    selectedOpType,
    isRequisition,
    opTypesLoading,
    operationTypeOptions,
    stationOptions,
    // Case picker
    caseSearch,
    setCaseSearch,
    cases,
    casesLoading,
    availableCases,
    caseLabels,
    addCase,
    removeCase,
    watchedFoundCaseIds,
    watchedFromStationId,
    // Submit
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
