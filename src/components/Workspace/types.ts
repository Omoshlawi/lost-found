export type WorkspaceOptions = {
  expandable?: boolean;
  dismissable?: boolean;
  animation?: 'none' | 'slide' | 'fade';
  width?: 'narrow' | 'wide' | 'extra-wide';
  title?: string;
};

export type Workspace = WorkspaceOptions & {
  id: string;
  component?: React.ReactNode;
  expanded: boolean;
};
