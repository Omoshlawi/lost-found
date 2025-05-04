import { EmptyState, ErrorState, TableSkeleton } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { DocumentReportForm } from '../forms';
import { useDocumentReport } from '../hooks';

const FoundItemsPage = () => {
  const { isLoading, error, reports } = useDocumentReport();

  const handleLaunchReportForm = () => {
    const close = launchWorkspace(<DocumentReportForm closeWorkspase={() => close()} />, {
      expandable: true,
      width: 'wide',
      title: 'Document report form',
    });
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState headerTitle="Found Items" error={error} />;
  if (!reports?.length)
    return (
      <EmptyState
        headerTitle="Found Items"
        message="No found items report"
        onAdd={handleLaunchReportForm}
      />
    );
  return <div>FoundItemsPage</div>;
};

export default FoundItemsPage;
