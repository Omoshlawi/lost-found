import React, { FC } from "react";
import { TablerIcon, TablerIconName } from "../TablerIcon";
import { Group, ThemeIcon, Stack, Title, Divider, Text } from "@mantine/core";
type PageHeaderProps = {
  title: string;
  subTitle: string | (() => React.JSX.Element);
  icon: TablerIconName | (() => React.JSX.Element);
};

const DashboardPageHeader: FC<PageHeaderProps> = ({
  icon,
  subTitle,
  title,
}) => {
  return (
    <>
      <Group align="flex-start" justify="space-between">
        <Group>
          <ThemeIcon radius={0} size={60} variant="light">
            {typeof icon === "string" && <TablerIcon name={icon} />}
            {typeof icon === "function" && <>{icon()}</>}
          </ThemeIcon>
          <Group h={"100%"} flex={1}>
            <Stack gap={2} align="flex-start" h={"100%"}>
              <Title order={3}>{title}</Title>
              {typeof subTitle === "string" && (
                <Text size="sm" c={"dimmed"}>
                  {subTitle}
                </Text>
              )}
              {typeof subTitle === "function" && <>{subTitle()}</>}
            </Stack>
          </Group>
        </Group>
        <Group gap={"xs"} visibleFrom="sm">
          <TablerIcon name="calendar" size={20} />
          <Text c={"dimmed"}>{new Date().toLocaleString()}</Text>
        </Group>
      </Group>
      <Divider />
    </>
  );
};

export default DashboardPageHeader;
