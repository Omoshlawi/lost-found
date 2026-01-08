import React, { FC, useEffect, useRef, useState } from 'react';
import { useDocumentExtraction } from '../hooks/useDocumentExtraction';
import { AsyncState, DocumentCase, Extraction, FoundDocumentCaseFormData } from '../types';

type CreatingFoundDocumentCaseProps = {
  extraction: Extraction;
  onExtractionComplete: (documentCase: DocumentCase) => void;
  data: FoundDocumentCaseFormData;
};

const CreatingFoundDocumentCase: FC<CreatingFoundDocumentCaseProps> = ({
  extraction,
  onExtractionComplete,
  data,
}) => {
  const [progress, setProgress] = useState<Array<AsyncState>>([]);
  const { extract, socketRef, addEventListener } = useDocumentExtraction();
  const hasExtractedRef = useRef(false);

  // Listen to streaming progress event
  useEffect(() => {
    const cleanup = addEventListener(
      `stream_progress:${extraction.id}`,
      (progressData: AsyncState) => {
        // eslint-disable-next-line no-console
        console.log(progressData);
        setProgress((p) => [...p, progressData]);
      }
    );

    return cleanup;
  }, [extraction.id, addEventListener]);

  // Start extraction once when component mounts
  useEffect(() => {
    if (hasExtractedRef.current) {
      return;
    }

    let connectionCheckInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const performExtraction = async () => {
      // Wait for socket to be connected
      if (!socketRef.current?.connected) {
        // Wait for connection
        connectionCheckInterval = setInterval(() => {
          if (socketRef.current?.connected) {
            if (connectionCheckInterval) {
              clearInterval(connectionCheckInterval);
              connectionCheckInterval = null;
            }
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            performExtraction();
          }
        }, 100);

        // Cleanup interval after 10 seconds
        timeoutId = setTimeout(() => {
          if (connectionCheckInterval) {
            clearInterval(connectionCheckInterval);
            connectionCheckInterval = null;
          }
        }, 10000);
        return;
      }

      hasExtractedRef.current = true;
      const docCase = await extract(extraction.id, data);
      if (docCase) {
        onExtractionComplete(docCase);
      }
    };

    performExtraction();

    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [extract, extraction.id, data, onExtractionComplete, socketRef]);

  return (
    <div>
      <pre>
        {JSON.stringify({ progress, connected: `${socketRef.current?.connected}` }, null, 2)}
      </pre>
    </div>
  );
};

export default CreatingFoundDocumentCase;
