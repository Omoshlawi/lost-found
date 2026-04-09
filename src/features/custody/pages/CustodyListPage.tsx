import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Menu, Select, Stack, Text, TextInput } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { useDocumentCases } from '@/features/cases/hooks';
import { DocumentCase } from '@/features/cases/types';
import { CustodyStatusBadge } from '../components/CustodyStatusBadge';
import { CustodyStatus } from '../types';
import { usePickupStations } from '../hooks/usePickupStations';
import { formatDate } from '@/lib/utils/helpers';

const CUSTODY_STATUS_OPTIONS = [
  { label: 'With Finder', value: CustodyStatus.WITH_FINDER },
  { label: 'In Custody', value: CustodyStatus.IN_CUSTODY },
  { label: 'In Transit', value: CustodyStatus.IN_TRANSIT },
  { label: 'Handed Over', value: CustodyStatus.HANDED_OVER },
  { label: 'Disposed', value: CustodyStatus.DISPOSED },
];

const CustodyListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, search, searchInput, setSearchInput, setPage, setPageSize } =
    useTableUrlFilters();

  const custodyStatus = searchParams.get('custodyStatus');
  const stationId = searchParams.get('stationId');

  const setCustodyStatus = (value: string | null) => {
    setSearchParams((prev) => {
      value ? prev.set('custodyStatus', value) : prev.delete('custodyStatus');
      prev.set('page', '1');
      return prev;
    }, { replace: true });
  };

  const setStationFilter = (value: string | null) => {
    setSearchParams((prev) => {
      value ? prev.set('stationId', value) : prev.delete('stationId');
      prev.set('page', '1');
      return prev;
    }, { replace: true });
  };

  const { stations } = usePickupStations();
  const stationOptions = stations.map((s) => ({ label: `${s.name} (${s.code})`, value: s.id }));

  const casesAsync = useDocumentCases({
    v: 'custom:include(foundDocumentCase,document:include(type),address,user)',
    caseType: 'FOUND',
    page,
    limit: pageSize,
    ...(search && { search }),
    ...(custodyStatus && { custodyStatus }),
    ...(stationId && { currentStationId: stationId }),
  });

  const columns = useMemo<ColumnDef<DocumentCase>[]>(
    () => [
      {
        header: 'Case No.',
        accessorKey: 'caseNumber',
        cell: ({ row: { original } }) => (
          <Link to={`${original.foundDocumentCase?.id}`}>{original.caseNumber}</Link>
        ),
      },
      {
        header: 'Document Type',
        cell: ({ row: { original } }) => original.document?.type?.name ?? '—',
      },
      {
        header: 'Custody Status',
        id: 'custodyStatus',
        cell: ({ row: { original } }) => (
          <CustodyStatusBadge status={(original.foundDocumentCase as any)?.custodyStatus} />
        ),
      },
      {
        header: 'Current Station',
        id: 'currentStation',
        cell: ({ row: { original } }) =>
          (original.foundDocumentCase as any)?.currentStation?.name ?? '—',
      },
      {
        header: 'Case Status',
        id: 'caseStatus',
        cell: ({ row: { original } }) => original.foundDocumentCase?.status ?? '—',
      },
      {
        header: 'Reported',
        accessorKey: 'createdAt',
        cell: ({ row: { original } }) => formatDate(original.createdAt),
      },
    ],
    []
  );

  const actionsColumn: ColumnDef<DocumentCase> = {
    id: 'actions',
    size: 40,
    cell: ({ row: { original } }) => (
      <Menu position="bottom-end" width={180}>
        <Menu.Target>
          <ActionIcon variant="subtle" size="sm">
            <TablerIcon name="dots" size={14} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<TablerIcon name="eye" size={14} />}
            component={Link}
            to={`${original.foundDocumentCase?.id}`}
          >
            View Custody
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Document Custody"
        subTitle="Track the physical location and operations of found documents"
        icon="buildingWarehouse"
      />
      <StateFullDataTable
        {...casesAsync}
        data={casesAsync.reports}
        columns={[...columns, actionsColumn]}
        renderActions={() => (
          <>
            <TextInput
              placeholder="Search cases..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={200}
            />
            <Select
              placeholder="Custody Status"
              data={CUSTODY_STATUS_OPTIONS}
              value={custodyStatus}
              onChange={setCustodyStatus}
              size="xs"
              clearable
              w={160}
            />
            <Select
              placeholder="Station"
              data={stationOptions}
              value={stationId}
              onChange={setStationFilter}
              size="xs"
              clearable
              w={180}
              searchable
            />
          </>
        )}
        pagination={{
          totalCount: casesAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </Stack>
  );
};

export default CustodyListPage;
