import React, { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  JsonInput,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { ImageScanResult } from '@/features/cases/types';
import { flattenObjectToPairs, unflattenPairsToObject } from '@/lib/utils';

type DocumentScanExtractionResultsProps = {
  extractedText: string;
  extractedinfo: ImageScanResult['info'];
  onImport?: (data: ImageScanResult['info']) => void;
};
const DocumentScanExtractionResults: React.FC<DocumentScanExtractionResultsProps> = ({
  extractedText,
  extractedinfo,
  onImport,
}) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const flattentedInfo = useMemo(() => flattenObjectToPairs(extractedinfo), [extractedinfo]);
  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <Tabs
      defaultValue="text"
      styles={{
        tab: {
          color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          '&[data-active]': {
            color: theme.colors.teal[colorScheme === 'dark' ? 4 : 7],
          },
        },
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="text" leftSection={<TablerIcon name="fileText" size={16} />}>
          Text
        </Tabs.Tab>
        <Tabs.Tab value="json" leftSection={<TablerIcon name="code" size={16} />}>
          JSON
        </Tabs.Tab>
        <Tabs.Tab value="fields" leftSection={<TablerIcon name="listCheck" size={16} />}>
          Import Fields
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="text" pt="md">
        {/* <ScrollArea h={450}> */}
        <Paper p="md" withBorder bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.white}>
          <Text component="pre" style={{ whiteSpace: 'pre-wrap' }}>
            {extractedText}
          </Text>
        </Paper>
        {/* </ScrollArea> */}
      </Tabs.Panel>

      <Tabs.Panel value="json" pt="md">
        {/* <ScrollArea h={450}> */}
        <JsonInput
          value={JSON.stringify(extractedinfo, null, 2)}
          formatOnBlur
          autosize
          minRows={20}
          readOnly
          styles={{
            input: {
              fontFamily: 'monospace',
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
              color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            },
          }}
        />
        {/* </ScrollArea> */}
      </Tabs.Panel>

      <Tabs.Panel value="fields" pt="md">
        {/* <ScrollArea h={450}> */}
        <Stack>
          <Title order={4} c={theme.primaryColor}>
            Select Fields To Import
          </Title>
          {flattentedInfo.map(([key, value]) => (
            <Checkbox
              key={key}
              label={
                <Group>
                  <Text fw={500}>{key}:</Text>
                  <Text>{String(value)}</Text>
                </Group>
              }
              checked={selectedFields.includes(key)}
              onChange={() => handleFieldToggle(key)}
            />
          ))}

          {selectedFields.length > 0 && (
            <>
              <Divider
                my="sm"
                color={colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]}
              />
              <Group justify="space-between">
                <Title order={4} c={theme.primaryColor}>
                  Selected Fields
                </Title>
                <Button
                  leftSection={<TablerIcon name="download" />}
                  onClick={() =>
                    onImport?.(
                      unflattenPairsToObject(
                        selectedFields
                          .map((field) => flattentedInfo.find(([key, _]) => key === field))
                          .filter((pair): pair is [string, string] => pair !== undefined)
                      )
                    )
                  }
                >
                  Import
                </Button>
              </Group>
              <Paper
                p="md"
                withBorder
                bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.white}
              >
                {selectedFields.map((field) => {
                  const path = field.split('.');
                  let value = extractedinfo;
                  for (const key of path) {
                    value = (value as Record<string, any>)?.[key];
                  }
                  return (
                    <Group key={field} mb="xs">
                      <Text fw={700}>{field}:</Text>
                      <Text>{String(value)}</Text>
                    </Group>
                  );
                })}
              </Paper>
            </>
          )}
        </Stack>
        {/* </ScrollArea> */}
      </Tabs.Panel>
    </Tabs>
  );
};

export default DocumentScanExtractionResults;
