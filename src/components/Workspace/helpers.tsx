import React from 'react';
import uniqueId from 'lodash/uniqueId';
import { useWorkspaceStore } from './store';
import { type WorkspaceOptions } from './types';
import { WorkspaceWrapper } from './WorkspaceWrapper';

export const launchWorkspace = (component: React.ReactNode, options?: WorkspaceOptions) => {
  const state = useWorkspaceStore.getState();
  const dismiss = () => state.dismiss(id);
  const id = uniqueId(`${Date.now()}`);
  state.updateWorkspaces([
    // ...state.workspaces,
    {
      component: (
        <WorkspaceWrapper
          title={options?.title}
          onClose={dismiss}
          expandable={options?.expandable}
          id={id}
        >
          {component}
        </WorkspaceWrapper>
      ),
      id,
      expanded: false,
      expandable: options?.expandable ?? false,
      width: options?.width ?? 'narrow',
      dismissable: options?.dismissable ?? false,
      animation: options?.animation ?? 'none',
    },
  ]);
  return dismiss;
};
