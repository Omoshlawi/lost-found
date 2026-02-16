import dayjs from 'dayjs';
import { ReactNode, useMemo } from 'react';
import { useClaim } from './use-claimes';

const useCompareCases = (claimId?: string) => {
  const { claim, error, isLoading } = useClaim(claimId);
  const foundCase = useMemo(() => claim?.foundDocumentCase, [claim]);
  const lostCase = useMemo(() => claim?.match?.lostDocumentCase, [claim]);
  const dateFomart = 'ddd DD MMM, YYYY';
  const comparisons = useMemo<Array<{ lost: ReactNode; found: ReactNode; field: string }>>(
    () => [
      {
        field: 'Owner name',
        found: foundCase?.case?.document?.ownerName,
        lost: lostCase?.case?.document?.ownerName,
      },
      {
        field: 'Document Type',
        found: foundCase?.case?.document?.type?.name,
        lost: lostCase?.case?.document?.type?.name,
      },
      {
        field: 'Document ID',
        found: foundCase?.case?.document?.documentNumber,
        lost: lostCase?.case?.document?.documentNumber,
      },
      {
        field: 'Serial Number',
        found: foundCase?.case?.document?.serialNumber ?? 'N/A',
        lost: lostCase?.case?.document?.serialNumber ?? 'N/A',
      },
      {
        field: 'Batch Number',
        found: foundCase?.case?.document?.batchNumber ?? 'N/A',
        lost: lostCase?.case?.document?.batchNumber ?? 'N/A',
      },
      {
        field: 'Date of birth',
        found: foundCase?.case?.document?.dateOfBirth
          ? dayjs(foundCase?.case?.document?.dateOfBirth).format(dateFomart)
          : 'N/A',
        lost: lostCase?.case?.document?.dateOfBirth
          ? dayjs(lostCase?.case?.document?.dateOfBirth).format(dateFomart)
          : 'N/A',
      },
      {
        field: 'Place of birth',
        found: foundCase?.case?.document?.placeOfBirth ?? 'N/A',
        lost: lostCase?.case?.document?.placeOfBirth ?? 'N/A',
      },
      {
        field: 'Date of issue',
        found: foundCase?.case?.document?.issuanceDate
          ? dayjs(foundCase?.case?.document?.issuanceDate).format(dateFomart)
          : 'N/A',
        lost: lostCase?.case?.document?.issuanceDate
          ? dayjs(lostCase?.case?.document?.issuanceDate).format(dateFomart)
          : 'N/A',
      },
      {
        field: 'Place of Issue',
        found: foundCase?.case?.document?.placeOfIssue ?? 'N/A',
        lost: lostCase?.case?.document?.placeOfIssue ?? 'N/A',
      },
      {
        field: 'Issuer/Institution/Authority',
        found: foundCase?.case?.document?.issuer ?? 'N/A',
        lost: lostCase?.case?.document?.issuer ?? 'N/A',
      },
      {
        field: 'Notes',
        found: foundCase?.case?.document?.note ?? 'N/A',
        lost: lostCase?.case?.document?.note ?? 'N/A',
      },
      {
        field: 'Lost/Found Date',
        found: foundCase?.case?.eventDate
          ? dayjs(foundCase?.case?.eventDate).format(dateFomart)
          : 'N/A',
        lost: lostCase?.case?.eventDate
          ? dayjs(lostCase?.case?.eventDate).format(dateFomart)
          : 'N/A',
      },
      {
        field: 'Case Tags',
        found: foundCase?.case?.tags?.join(',') ?? 'N/A',
        lost: lostCase?.case?.tags?.join(', ') ?? 'N/A',
      },
      {
        field: 'Case Description',
        found: foundCase?.case?.description ?? 'N/A',
        lost: lostCase?.case?.description ?? 'N/A',
      },
      {
        field: 'Case Description',
        found: foundCase?.status ?? 'N/A',
        lost: lostCase?.status ?? 'N/A',
      },
      {
        field: 'Additional Fields',
        found: foundCase?.case?.document?.additionalFields?.length ? (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {foundCase.case.document.additionalFields.map((ad, index) => (
              <li key={index}>
                {ad.fieldName}: {ad.fieldValue}
              </li>
            ))}
          </ul>
        ) : (
          'N/A'
        ),
        lost: lostCase?.case?.document?.additionalFields?.length ? (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {lostCase.case.document.additionalFields.map((ad, index) => (
              <li key={index}>
                {ad.fieldName}: {ad.fieldValue}
              </li>
            ))}
          </ul>
        ) : (
          'N/A'
        ),
      },
    ],
    [foundCase, lostCase]
  );
  return { foundCase, lostCase, isLoading, claim, error, comparisons };
};

export default useCompareCases;
