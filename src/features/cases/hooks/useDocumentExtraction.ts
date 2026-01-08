import { useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import type { DocumentCase, Extraction, FoundDocumentCaseFormData } from '../types';

export const useDocumentExtraction = () => {
  const { publishEventWithAck, socketRef, addEventListener } = useSocket({
    withAuth: true,
    nameSpace: '/extraction',
  });

  const startExtraction = useCallback(async () => {
    if (socketRef.current?.connected) {
      const extraction = await publishEventWithAck<Extraction>('start');
      return extraction;
    }
    return undefined;
  }, [publishEventWithAck, socketRef]);

  const extract = useCallback(
    async (extractionId: string, payload: FoundDocumentCaseFormData) => {
      if (socketRef.current?.connected) {
        const documentCase = await publishEventWithAck<DocumentCase>('extract', {
          ...payload,
          extractionId,
        });
        return documentCase;
      }
      return undefined;
    },
    [publishEventWithAck, socketRef]
  );

  return {
    startExtraction,
    extract,
    socketRef,
    addEventListener,
  };
};
