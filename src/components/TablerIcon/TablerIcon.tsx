// TablerIcon.tsx
import React from 'react';
import * as TablerIconsReact from '@tabler/icons-react';
import { _TablerIconName, TablerIconName } from './types';

interface TablerIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke'> {
  name: TablerIconName;
  size?: number;
  stroke?: number;
  color?: string;
}

const TablerIcon: React.FC<TablerIconProps> = ({
  name,
  size = 24,
  stroke = 2,
  color = 'currentColor',
  ...props
}) => {
  // Convert camelCase back to PascalCase and add "Icon" prefix
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
  const iconName = `Icon${pascalName}` as _TablerIconName;

  const IconComponent = TablerIconsReact[iconName] as React.ElementType;

  if (IconComponent) {
    return <IconComponent size={size} stroke={stroke} color={color} {...props} />;
  }

  console.warn(`Icon "${name}" not found in Tabler icons library`);
  return null;
};

export default TablerIcon;
