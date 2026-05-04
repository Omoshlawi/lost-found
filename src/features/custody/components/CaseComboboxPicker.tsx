import React from 'react';
import { Combobox, Group, Input, Pill, PillsInput, Text, useCombobox } from '@mantine/core';

interface CaseOption {
  foundCaseId: string;
  caseNumber: string;
  typeName: string;
}

interface CaseComboboxPickerProps {
  selectedIds: string[];
  labels: Record<string, string>;
  options: CaseOption[];
  isLoading: boolean;
  search: string;
  error?: string;
  disabled?: boolean;
  onSearchChange: (value: string) => void;
  onAdd: (foundCaseId: string, label: string) => void;
  onRemove: (foundCaseId: string) => void;
}

export const CaseComboboxPicker: React.FC<CaseComboboxPickerProps> = ({
  selectedIds,
  labels,
  options,
  isLoading,
  search,
  error,
  disabled,
  onSearchChange,
  onAdd,
  onRemove,
}) => {
  const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });

  return (
    <Input.Wrapper label="Documents" required error={error}>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          const option = options.find((o) => o.foundCaseId === val);
          if (option) {
            onAdd(val, `${option.caseNumber} · ${option.typeName}`);
            combobox.closeDropdown();
          }
        }}
      >
        <Combobox.DropdownTarget>
          <PillsInput
            onClick={() => !disabled && combobox.openDropdown()}
            error={!!error}
            disabled={disabled}
          >
            <Pill.Group>
              {selectedIds.map((id) => (
                <Pill key={id} withRemoveButton onRemove={() => onRemove(id)}>
                  {labels[id] ?? id}
                </Pill>
              ))}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  placeholder={
                    disabled
                      ? 'Select a source station first'
                      : selectedIds.length === 0
                        ? 'Search by case number or document type…'
                        : undefined
                  }
                  value={search}
                  disabled={disabled}
                  onChange={(e) => {
                    if (!disabled) {
                      onSearchChange(e.currentTarget.value);
                      combobox.openDropdown();
                    }
                  }}
                  onFocus={() => !disabled && combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {isLoading ? (
              <Combobox.Empty>Searching…</Combobox.Empty>
            ) : options.length === 0 ? (
              <Combobox.Empty>No matching cases found</Combobox.Empty>
            ) : (
              options.map((option) => (
                <Combobox.Option key={option.foundCaseId} value={option.foundCaseId}>
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={500}>
                      {option.caseNumber}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {option.typeName}
                    </Text>
                  </Group>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
};
