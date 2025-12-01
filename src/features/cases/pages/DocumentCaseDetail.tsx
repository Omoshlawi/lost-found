import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Divider } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification, updateNotification } from '@mantine/notifications';
import { ErrorState, TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import {
  AdditionalDetails,
  ContactFooter,
  DocumentImages,
  DocumentInformation,
  LocationInformation,
  ReportDetails,
  ReportHeader,
} from '../components';
import { ReportDocumentImageUploadForm } from '../forms';
import { useDocumentCase, useDocumentCaseApi } from '../hooks';
import { CaseType, DocumentImage } from '../types';
import DocumentCaseDetailSkeleton from './DocumentCaseDetailSkeleton';

const DocumentCaseDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { error, isLoading, report: reportData } = useDocumentCase(reportId);
  // eslint-disable-next-line no-empty-pattern
  const {} = useDocumentCaseApi();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [_deleting, setDeleting] = useState(false);

  if (isLoading) {
    return <DocumentCaseDetailSkeleton />;
  }
  if (error || !reportData) {
    return <ErrorState error={error} message="No report data available" title="Report Detail" />;
  }

  // Extract common data
  const docType = reportData.document?.type?.name || 'Unknown';
  const docTypeIcon = reportData.document?.type?.icon || 'id';
  const docId = reportData.id ? `${reportData.id.substring(0, 8)}...` : 'Unknown';
  const reportType: CaseType = reportData.lostReport ? 'LOST' : 'FOUND';
  const launchDocumentReportInfoForm = () => {};
  const launchDocumentImageForm = () => {
    const modalId = modals.open({
      title: 'Upload Document Images',
      children: (
        <ReportDocumentImageUploadForm report={reportData} onClose={() => modals.close(modalId)} />
      ),
    });
  };
  const launchDocumentInfoForm = () => {};

  const handleDeleteDocumentImage = async (_image: DocumentImage) => {
    try {
      setDeleting(true);
      const id = showNotification({
        loading: true,
        title: 'Deleting Image',
        message: 'please wait ...',
        autoClose: false,
        withCloseButton: false,
      });
      // await deleteDocumentImage(reportData.id, image);

      updateNotification({
        id,
        color: 'green',
        title: 'Success',
        message: 'Image deleted succesfully',
        icon: <TablerIcon name="check" size={18} />,
        loading: false,
        autoClose: 2000,
      });
    } catch (error) {
      const e = handleApiErrors(error);
      if (e.detail) {
        showNotification({
          title: `Error Uploading document image`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <ReportHeader
        docType={docType}
        docId={docId}
        status={status}
        pointAwarded={reportData.foundReport?.pointAwarded ?? 0}
        docTypeIcon={docTypeIcon}
        reportType={reportType}
        onUpdateReportDetails={launchDocumentReportInfoForm}
      />

      <Divider my="md" />

      <DocumentImages
        // images={[{ url: 'https://picsum.photos/200/300' }, { url: 'https://picsum.photos/200' }]}
        images={reportData?.document?.images}
        onUploadImage={launchDocumentImageForm}
        onDeleteImage={handleDeleteDocumentImage}
      />
      <DocumentInformation
        document={reportData.document}
        onUpdateReportDocument={launchDocumentInfoForm}
      />

      <LocationInformation
        county={reportData.county}
        subCounty={reportData.subCounty}
        ward={reportData.ward}
        landMark={reportData.landMark}
      />

      <ReportDetails
        lostOrFoundDate={reportData.lostOrFoundDate}
        createdAt={reportData.createdAt}
        description={reportData.description}
        tags={reportData.tags}
        lostReport={reportData?.lostReport}
        foundReport={reportData?.foundReport}
      />

      <AdditionalDetails
        isOpen={detailsOpen}
        toggleOpen={() => setDetailsOpen(!detailsOpen)}
        createdAt={reportData.createdAt}
        updatedAt={reportData.updatedAt}
        status={status}
        document={reportData.document}
      />

      <ContactFooter
        contactPreference={contactPreference}
        reportType={reportType}
        handoverPreference={reportData?.foundReport?.handoverPreference}
      />
    </Card>
  );
};

export default DocumentCaseDetail;
