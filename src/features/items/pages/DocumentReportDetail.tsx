import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Grid, Group, Pill, Stack, Table, Text } from '@mantine/core';
import { ErrorState } from '@/components';
import { parseDate } from '@/lib/utils';
import { useDocumentReport } from '../hooks';

const DocumentReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { error, isLoading, report } = useDocumentReport(reportId!);

  if (error) return <ErrorState headerTitle="Report Detail" error={error} />;

  return (
    <Stack>
      <Text fw={'bold'}>Document report detail</Text> {/* Breadcramb */}
      <Grid grow gutter="sm">
        <Grid.Col span={4}>
          <Card>
            <Card.Section p={'sm'} fw={'bold'}>
              Reporting Details
            </Card.Section>
            <Card.Section p={'sm'}>
              <Table
                data={{
                  head: ['Property', 'Value'],
                  body: [
                    [
                      'Date lost or found',
                      parseDate(report?.lostOrFoundDate)?.toLocaleDateString(),
                    ],
                    ['Date Reported', parseDate(report?.createdAt)?.toLocaleDateString()],
                    ['Status', report?.status],
                    ['County', report?.county?.name],
                    ['Sub county', report?.subCounty?.name],
                    ['Ward', report?.ward?.name],
                  ],
                }}
                highlightOnHover
              />
            </Card.Section>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card>
            <Card.Section p={'sm'} fw={'bold'}>
              Document Details
            </Card.Section>
            <Card.Section p={'sm'}>
              <Table
                data={{
                  head: ['Property', 'Value'],
                  body: [
                    ['Owner', report?.document?.ownerName],
                    ['Document number', report?.document?.serialNumber],
                    ['Issuer', report?.document?.issuer],
                    ['Expiry date', parseDate(report?.document?.expiryDate)?.toLocaleDateString()],
                    [
                      'Date of Issue',
                      parseDate(report?.document?.issuanceDate)?.toLocaleDateString(),
                    ],
                    ['Type', report?.document?.type.name],
                  ],
                }}
                highlightOnHover
              />
            </Card.Section>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card>
            <Card.Section p={'sm'} fw={'bold'}>
              Extra info
            </Card.Section>
            <Card.Section p={'sm'}>
              <Table
                data={{
                  head: ['Property', 'Value'],
                  body: [
                    [
                      'Tags',
                      report?.tags?.map((tag, i) => (
                        <Pill key={i} m={1}>
                          {tag}
                        </Pill>
                      )),
                    ],
                  ],
                }}
                highlightOnHover
              />
            </Card.Section>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card>
            <Card.Section p={'sm'} fw={'bold'}>
              Images
            </Card.Section>
            <Card.Section p={'sm'}>{JSON.stringify(report)}</Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default DocumentReportDetail;
