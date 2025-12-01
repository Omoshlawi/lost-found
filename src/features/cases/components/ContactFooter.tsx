import React from 'react';
import { IconMail, IconPhone } from '@tabler/icons-react';
import {
  Badge,
  Group,
  Paper,
  Text,
  ThemeIcon,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { CaseType } from '../types';

interface ContactFooterProps {
  contactPreference: string;
  handoverPreference?: string;
  reportType: CaseType;
}

const ContactFooter: React.FC<ContactFooterProps> = ({
  contactPreference,

  reportType,
  handoverPreference,
}) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();

  if (reportType === 'Lost') {
    return (
      <Paper
        p="md"
        radius="md"
        withBorder
        mt="md"
        style={{
          backgroundColor:
            colorScheme === 'dark' ? `${theme.colors.blue[9]}15` : theme.colors.blue[1],
        }}
      >
        <Group>
          <Group>
            <ThemeIcon size="md" radius="xl" color="blue">
              {contactPreference === 'EMAIL' ? <IconMail size={16} /> : <IconPhone size={16} />}
            </ThemeIcon>
            <div>
              <Text size="sm">Contact Preference</Text>
              <Text fw={700}>{contactPreference}</Text>
            </div>
          </Group>
          {/* <Badge
            size="lg"
            variant="outline"
            color={getUrgencyColor(urgencyLevel, colorScheme) as any}
          >
            {urgencyLevel} Priority
          </Badge> */}
        </Group>
      </Paper>
    );
  }
  if (reportType === 'Found') {
    return (
      <Paper
        p="md"
        radius="md"
        withBorder
        mt="md"
        style={{
          backgroundColor:
            colorScheme === 'dark' ? `${theme.colors.blue[9]}15` : theme.colors.blue[1],
        }}
      >
        <Group>
          <Group>
            <ThemeIcon size="md" radius="xl" color="blue">
              {contactPreference === 'EMAIL' ? <IconMail size={16} /> : <IconPhone size={16} />}
            </ThemeIcon>
            <div>
              <Text size="sm">Handover Preference</Text>
              <Text fw={700}>{handoverPreference}</Text>
            </div>
          </Group>
          <Badge size="lg" variant="outline" color="green">
            Ready for Claim
          </Badge>
        </Group>
      </Paper>
    );
  }
};

export default ContactFooter;
