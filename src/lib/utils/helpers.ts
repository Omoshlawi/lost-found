import { z } from 'zod';
import { FieldPath, Path } from './path';

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
  if (!date && !defaultNow) return;
  if (!date && defaultNow) return new Date();
  if (date) return new Date(date);
};

type NestedObject = { [key: string]: any };
type FlattenedArray = (string | string)[]; // Changed to string | string since all values will be stringified

export function flattenObject(obj: NestedObject, parentKey: string = ''): FlattenedArray {
  const result: FlattenedArray = [];

  Object.entries(obj).forEach(([key, value]) => {
    const accessor = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result.push(...flattenObject(value, accessor));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayAccessor = `${accessor}.${index}`;
        if (typeof item === 'object' && item !== null) {
          result.push(...flattenObject(item, arrayAccessor));
        } else {
          // Stringify primitive values to preserve type
          result.push(arrayAccessor, JSON.stringify(item));
        }
      });
    } else {
      // Stringify primitive values to preserve type
      result.push(accessor, JSON.stringify(value));
    }
  });

  return result;
}

type UnflattenedObject = { [key: string]: any };

export function unflattenArray(arr: FlattenedArray): UnflattenedObject {
  const result: UnflattenedObject = {};

  for (let i = 0; i < arr.length; i += 2) {
    const accessor = arr[i] as string;
    const stringifiedValue = arr[i + 1] as string;

    // Parse stringified value to restore its original type
    let value;
    try {
      value = JSON.parse(stringifiedValue);
    } catch (e) {
      // If parsing fails, use the original string value
      value = stringifiedValue;
    }

    const keys = accessor.split('.');
    let current = result;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value; // Assign the value at the deepest level
      } else {
        current[key] = current[key] || (isNaN(parseInt(keys[index + 1] || '')) ? {} : []); // Create an object or array
        current = current[key];
      }
    });
  }

  return result;
}

type KeyValuePairs = [string, any][]; // Values now preserve their original types

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
        current[key] = current[key] || (isNaN(parseInt(keys[index + 1] || '')) ? {} : []);
        current = current[key];
      }
    });
  });

  return result;
}
