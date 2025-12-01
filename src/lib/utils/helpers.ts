import dayjs from 'dayjs';

export const getNameInitials = (name: string) => {
  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};
export const getNameInitialsFromEmail = (email: string) => {
  const name = email.split('@')[0];
  return getNameInitials(name);
};

export const parseDate = (date?: string, defaultNow?: boolean) => {
  if (!date && !defaultNow) {
    return;
  }
  if (!date && defaultNow) {
    return new Date();
  }
  if (date) {
    return new Date(date);
  }
};

export const flattenPermisionsObject = (permissions: Record<string, Array<string>>) => {
  return Object.entries(permissions)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort resources
    .flatMap(
      ([resource, actions]) => [...actions].sort().map((action) => `${resource}.${action}`) // Sort actions
    );
};

type KeyValuePairs = [string, any][]; // Values now preserve their original types
type NestedObject = { [key: string]: any };
type UnflattenedObject = { [key: string]: any };

export function flattenObjectToPairs(obj: NestedObject, parentKey: string = ''): KeyValuePairs {
  const result: KeyValuePairs = [];

  Object.entries(obj).forEach(([key, value]) => {
    const accessor = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result.push(...flattenObjectToPairs(value, accessor));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayAccessor = `${accessor}.${index}`; // Keeps original ".index" format
        if (typeof item === 'object' && item !== null) {
          result.push(...flattenObjectToPairs(item, arrayAccessor));
        } else {
          result.push([arrayAccessor, item]); // Stores raw value (no stringification)
        }
      });
    } else {
      result.push([accessor, value]); // Stores raw value (no stringification)
    }
  });

  return result;
}

export function unflattenPairsToObject(pairs: KeyValuePairs): UnflattenedObject {
  const result: UnflattenedObject = {};

  pairs.forEach(([accessor, value]) => {
    const keys = accessor.split('.');
    let current = result;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value; // Uses raw value directly
      } else {
        // eslint-disable-next-line radix
        current[key] = current[key] || (isNaN(parseInt(keys[index + 1] || '')) ? {} : []);
        current = current[key];
      }
    });
  });

  return result;
}

export const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatDateTime = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};
export const formatTime = (date: string) => {
  return dayjs(date).format('HH:mm');
};
