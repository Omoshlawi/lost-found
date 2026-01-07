import React from 'react';
import { useStreamFoundDocumentCase } from '../hooks/useFoundDocumentCase';

const CreatingFoundDocumentCase = () => {
  const { connected, state, socketRef } = useStreamFoundDocumentCase();
  return <div>CreatingFoundDocumentCase: {`${connected}-${state}-${socketRef.current}`}</div>;
};

export default CreatingFoundDocumentCase;
