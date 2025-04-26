import * as TablerIconsReact from '@tabler/icons-react';
import { TablerIconName } from './types';

export const getAllTablerIconNames = () => {
  // Extract all icon names for browsing
  const allIconNames = Object.keys(TablerIconsReact)
    .filter((key) => key.startsWith('Icon') && key !== 'IconProps')
    .map((iconName) => {
      // Convert from IconSomething to something
      const nameWithoutPrefix = iconName.slice(4); // remove 'Icon'
      return nameWithoutPrefix.charAt(0).toLowerCase() + nameWithoutPrefix.slice(1);
    });
  return allIconNames as TablerIconName[];
};

export const getTablerIconCategories = () => {
  // Extract all icon names for browsing
  const allIconNames = getAllTablerIconNames();
  const categories: Record<string, TablerIconName[]> = { all: allIconNames };

  allIconNames.forEach((name) => {
    // Split the name into words based on camelCase pattern
    const words = name.match(/[A-Z]?[a-z]+/g);
    if (words && words.length > 1) {
      const categoryName = words[0].toLowerCase(); // Use the first word as the category
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push(name);
    }
  });

  return categories;
};
