export const STAGE_LABEL: Record<string, string> = {
  VISION: 'Image Scan',
  STRUCTURE: 'Data Reading',
};

export const STAGE_ICON: Record<string, string> = {
  VISION: 'eye',
  STRUCTURE: 'textRecognition',
};

export function formatDuration(startedAt: string | null, completedAt: string): string {
  if (!startedAt) {
    return '—';
  }
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}
