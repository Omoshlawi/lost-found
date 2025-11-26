import { apiFetch, APIFetchResponse, constructUrl, mutate, useApi } from '@/lib/api';
import {
  AddressLocale,
  AddressLocaleFormData,
  AddressLocalePayload,
  AddressLocaleFormatSpec,
  AddressLocaleMetadata,
  AddressLocaleExample,
} from '../types';

type AddressLocaleFilters = Record<string, string | number | boolean | undefined>;

export const useAddressLocales = (filters: AddressLocaleFilters = {}) => {
  const url = constructUrl('/address-locales', filters);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<{ results: AddressLocale[] }>>(url);

  return {
    locales: data?.data?.results ?? [],
    error,
    isLoading,
    mutate: swrMutate,
    pagination: (data?.data as any)?.pagination,
  };
};

export const useAddressLocale = (id?: string, filters: AddressLocaleFilters = {}) => {
  const url = id ? constructUrl(`/address-locales/${id}`, filters) : null;
  const { data, error, isLoading, mutate: swrMutate } = useApi<APIFetchResponse<AddressLocale>>(url);

  return {
    locale: data?.data,
    error,
    isLoading,
    mutate: swrMutate,
  };
};

export const useAddressLocalesApi = () => {
  const createAddressLocale = async (payload: AddressLocaleFormData) => {
    const response = await apiFetch<AddressLocale>('/address-locales', {
      method: 'POST',
      data: buildAddressLocalePayload(payload),
    });
    return response.data;
  };

  const updateAddressLocale = async (localeId: string, payload: AddressLocaleFormData) => {
    const response = await apiFetch<AddressLocale>(`/address-locales/${localeId}`, {
      method: 'PATCH',
      data: buildAddressLocalePayload(payload),
    });
    return response.data;
  };

  const deleteAddressLocale = async (localeId: string, purge = false) => {
    const response = await apiFetch<AddressLocale>(`/address-locales/${localeId}`, {
      method: 'DELETE',
      params: { purge },
    });
    return response.data;
  };

  const restoreAddressLocale = async (localeId: string) => {
    const response = await apiFetch<AddressLocale>(`/address-locales/${localeId}/restore`, {
      method: 'POST',
    });
    return response.data;
  };

  const mutateAddressLocales = () => mutate('/address-locales');
  const mutateAddressLocale = (localeId: string) => mutate(`/address-locales/${localeId}`);

  return {
    createAddressLocale,
    updateAddressLocale,
    deleteAddressLocale,
    restoreAddressLocale,
    mutateAddressLocales,
    mutateAddressLocale,
  };
};

const buildAddressLocalePayload = (payload: AddressLocaleFormData): AddressLocalePayload => {
  const sanitizeString = (value?: string | null) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const sanitizeArray = (values?: string[]) =>
    values?.map((value) => value.trim()).filter((value) => value.length) ?? undefined;

  const sanitizeLevels = (): AddressLocaleFormatSpec['levels'] =>
    payload.formatSpec.levels
      .map((level) => ({
        label: level.label.trim(),
        level: level.level,
        required: level.required ?? true,
        aliases: sanitizeArray(level.aliases),
        helperText: sanitizeString(level.helperText) ?? null,
      }))
      .filter((level) => level.label.length);

  const sanitizeMetadata = (): AddressLocaleMetadata | undefined => {
    if (!payload.formatSpec.metadata) {
      return undefined;
    }
    const { instructions, preferredFields, validationRules } = payload.formatSpec.metadata;
    const normalized: AddressLocaleMetadata = {};
    const instructionsValue = sanitizeString(instructions);
    const preferred = sanitizeArray(preferredFields);

    const validation =
      validationRules?.reduce<Record<string, string>>((acc, { field, rule }) => {
        const key = field.trim();
        const value = rule.trim();
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {}) ?? {};

    if (instructionsValue) {
      normalized.instructions = instructionsValue;
    }
    if (preferred && preferred.length) {
      normalized.preferredFields = preferred;
    }
    if (Object.keys(validation).length) {
      normalized.validation = validation;
    }

    return Object.keys(normalized).length ? normalized : undefined;
  };

  const sanitizePostalCode = () => {
    const { postalCode } = payload.formatSpec;
    if (!postalCode || !postalCode.label) {
      return undefined;
    }
    const label = postalCode.label.trim();
    if (!label.length) {
      return undefined;
    }
    return {
      label,
      required: postalCode.required ?? true,
      description: sanitizeString(postalCode.description) ?? null,
    };
  };

  const sanitizeExamples = (): AddressLocaleExample[] | undefined => {
    if (!payload.examples) {
      return undefined;
    }

    const normalized = payload.examples
      .map((example) => {
        const label = example.label.trim();
        if (!label) {
          return null;
        }

        const addressEntries = example.addressEntries ?? [];
        const address = addressEntries.reduce<Record<string, string>>((acc, entry) => {
          const key = entry.field.trim();
          const value = entry.value.trim();
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        }, {});

        if (!Object.keys(address).length) {
          return null;
        }

        return {
          label,
          notes: sanitizeString(example.notes) ?? null,
          address,
        };
      })
      .filter(Boolean) as AddressLocaleExample[];

    return normalized.length ? normalized : undefined;
  };

  return {
    code: payload.code.trim(),
    country: payload.country.trim().toUpperCase(),
    regionName: payload.regionName.trim(),
    description: sanitizeString(payload.description) ?? null,
    tags: sanitizeArray(payload.tags),
    formatSpec: {
      displayTemplate: sanitizeString(payload.formatSpec.displayTemplate) ?? null,
      levels: sanitizeLevels(),
      metadata: sanitizeMetadata() ?? null,
      postalCode: sanitizePostalCode() ?? null,
    },
    examples: sanitizeExamples(),
  };
};

