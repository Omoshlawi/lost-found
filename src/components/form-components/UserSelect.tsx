import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Loader, Select, SelectProps } from '@mantine/core';
import { useSearchUser } from '@/hooks/usesearchUser';

type UserSelectProps<T extends FieldValues> = SelectProps & {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  description?: string;
  defaultSearch?: string;
};

export const UserSelect = <T extends FieldValues>({
  control,
  name,
  placeholder = 'Select option',
  defaultSearch,
  ...selectProps
}: UserSelectProps<T>) => {
  const userSearch = useSearchUser(defaultSearch ?? undefined);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...selectProps}
          {...field}
          placeholder={placeholder}
          data={userSearch.users.map((u) => ({ value: u.id, label: u.name ?? u.email }))}
          searchable
          searchValue={userSearch?.filters?.search}
          onSearchChange={(val) => {
            userSearch.setFilters({ searchField: 'email', searchValue: val });
          }}
          error={error?.message}
          rightSection={userSearch.isLoading && <Loader size="xs" />}
          clearable
          onClear={() => {
            field.onChange('');
            userSearch.setFilters({ searchField: 'email', searchValue: '' });
          }}
          nothingFoundMessage={userSearch.isLoading ? 'Searching…' : 'No users found'}
        />
      )}
    />
  );
};
