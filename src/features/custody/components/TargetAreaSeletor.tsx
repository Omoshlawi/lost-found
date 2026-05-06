import { useMemo, useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Loader, Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useAddressHierarchy } from '@/features/addresses/hooks';

type TargetAreaSeletorProps<T extends FieldValues> = SelectProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
};

const TargetAreaSeletor = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder = 'Select option',
  ...selectProps
}: TargetAreaSeletorProps<T>) => {
  const [search, setSearch] = useState<string>('');
  const [debounceSearch, _] = useDebouncedValue<string>(search, 500);
  const { hierarchy, isLoading } = useAddressHierarchy({ search: debounceSearch, limit: 5 });
  const uniqueAddressList = useMemo(() => [...new Set(hierarchy.map((h) => h.name))], [hierarchy]);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...selectProps}
          {...field}
          label={label}
          placeholder={placeholder}
          data={uniqueAddressList}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          error={error?.message}
          rightSection={isLoading && <Loader size="xs" />}
          clearable
          onClear={() => {
            field.onChange('');
            setSearch('');
          }}
        />
      )}
    />
  );
};

export default TargetAreaSeletor;
