import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState } from '@/components';
import { ClaimDetailSkeleton } from '../components';
import { useClaim } from '../hooks';

const ClaimDetailPage = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const { claim, error, isLoading } = useClaim(claimId);

  if (isLoading) {
    return <ClaimDetailSkeleton />;
  }
  if (error) {
    return <ErrorState error={error} message="No report data available" title="Report Detail" />;
  }
  return (
    <div>
      <pre>{JSON.stringify(claim, null, 2)}</pre>
    </div>
  );
};

export default ClaimDetailPage;
