import { Logo } from '@/components';
import { constructUrl, useApi } from '@/lib/api';
import { APIFetchResponse } from '@/lib/api/types';

const APITest = () => {
  const { data, error, isLoading } = useTodos();
  if (isLoading) {
    return <p>Loading</p>;
  }
  if (error) {
    return <p color="text">{JSON.stringify(error, null, 2)}</p>;
  }
  return (
    <div>
      <Logo />\ <p color="text">{JSON.stringify(data, null, 2)}</p>
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
  >(constructUrl('/documents', { userId: '1234', page: 20 }));
  return { data: data?.data, isLoading, error };
};
