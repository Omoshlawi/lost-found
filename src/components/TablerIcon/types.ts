import * as TablerIconsReact from '@tabler/icons-react';

// Create a type that extracts all icon names from the library
export type _TablerIconName = keyof typeof TablerIconsReact;

// Create a type for the clean names (without the "Icon" prefix)
export type TablerIconNameWithoutPrefix = Exclude<
  {
    [K in _TablerIconName]: K extends `Icon${infer Rest}` ? Rest : never;
  }[_TablerIconName],
  never
>;

// Convert PascalCase to camelCase
export type TablerIconName = {
  [K in TablerIconNameWithoutPrefix]: K extends `${infer First}${infer Rest}`
    ? `${Lowercase<First>}${Rest}`
    : K;
}[TablerIconNameWithoutPrefix];
