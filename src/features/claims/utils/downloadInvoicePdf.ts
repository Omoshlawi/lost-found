import httpClient from '@/lib/api/httpClient';

export const downloadInvoicePdf = async (invoiceId: string, invoiceNumber: string) => {
  const response = await httpClient.get(`/api/invoice/${invoiceId}/pdf`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${invoiceNumber}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
