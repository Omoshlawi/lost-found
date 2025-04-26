import React from 'react';
import { Button } from '@mantine/core';
import { TablerIcon, TablerIconName, TablerIconPicker } from '@/components/TablerIcon';

const UiComponents = () => {
  const [state, setState] = React.useState<TablerIconName | null>(null);
  return (
    <div>
      <TablerIconPicker
        onIconSelect={setState}
        renderTriggerComponent={({ onTrigger }) => (
          <Button
            onClick={onTrigger}
            leftSection={<TablerIcon name={state ?? 'search'} size={16} />}
            variant="outline"
          >
            {state ? 'Update icon' : 'Search Icon'}
          </Button>
        )}
      />
    </div>
  );
};

export default UiComponents;
