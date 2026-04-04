import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';

const DEFAULT_PAGE_SIZE = 12;
const PAGE_SIZE_OPTIONS = [12, 25, 50, 100];

interface UseTableUrlFiltersOptions {
  searchDebounce?: number;
}

/**
 * Manages table filter state (search, status, page, pageSize) in the URL so that
 * filters survive a page refresh and can be bookmarked / shared.
 *
 * - `search` is debounced before it lands in the URL (no per-keystroke updates).
 * - `status`, `page`, and `pageSize` are written to the URL immediately.
 * - All filter setters reset `page` to 1 except `setPage`.
 */
export function useTableUrlFilters(options: UseTableUrlFiltersOptions = {}) {
  const { searchDebounce = 300 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current values from the URL
  const page = Number(searchParams.get('page') ?? '1');
  const status = searchParams.get('status') ?? null;
  const urlSearch = searchParams.get('search') ?? '';
  const pageSize = PAGE_SIZE_OPTIONS.includes(Number(searchParams.get('pageSize')))
    ? Number(searchParams.get('pageSize'))
    : DEFAULT_PAGE_SIZE;

  // Local input value so the text field stays responsive while typing
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [debouncedSearch] = useDebouncedValue(searchInput, searchDebounce);

  // Skip the initial mount so loading a URL that already has ?search=x
  // doesn't needlessly reset page to 1
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setSearchParams(
      (prev) => {
        if (debouncedSearch) { prev.set('search', debouncedSearch); }
        else { prev.delete('search'); }
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  }, [debouncedSearch]);

  const setStatus = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) { prev.set('status', value); }
        else { prev.delete('status'); }
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  const setPage = (p: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', String(p));
        return prev;
      },
      { replace: true }
    );
  };

  const setPageSize = (size: number) => {
    setSearchParams(
      (prev) => {
        prev.set('pageSize', String(size));
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  return {
    /** Current page number (1-indexed), read from URL. */
    page,
    /** Active status filter value, or null if none. */
    status,
    /** Debounced search string — use this for the API call. */
    search: debouncedSearch,
    /** Raw input value — bind this to the TextInput. */
    searchInput,
    /** Number of records per page, validated against allowed options. */
    pageSize,
    setSearchInput,
    setStatus,
    setPage,
    setPageSize,
  };
}

export { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE };
