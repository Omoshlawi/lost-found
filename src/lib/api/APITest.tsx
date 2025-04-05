import React from 'react';
import { useApi } from '@/lib/api';
import { APIFetchResponse } from '@/lib/api/types';

const APITest = () => {
  const { data, error, isLoading } = useTodos();
  if (isLoading) return <p>Loading</p>;
  if (error) return <p color={'text'}>{JSON.stringify(error, null, 2)}</p>;
  return (
    <div>
      <p color={'text'}>{JSON.stringify(data, null, 2)}</p>
    </div>
  );
};

export default APITest;

const useTodos = () => {
  const { data, isLoading, error } = useApi<
    APIFetchResponse<{
      userId: number;
      id: number;
      title: string;
      completed: boolean;
    }>
  >('https://jsonplaceholder.typicode.com/todos/1');
  return { data: data?.data, isLoading, error };
};
