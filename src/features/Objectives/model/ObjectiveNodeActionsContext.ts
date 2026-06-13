import React from 'react';

type ObjectiveNodeDataPatch = {
  label?: string;
  completed: boolean;
};

type ObjectiveNodeActionsContextValue = {
  updateObjectiveNodeData: (id: string, patch: ObjectiveNodeDataPatch) => void;
};

const ObjectiveNodeActionContext = React.createContext<ObjectiveNodeActionsContextValue | null>(
  null,
);

export const ObjectiveNodeActionsProvider = ObjectiveNodeActionContext.Provider;

export const useObjectiveNodeActions = () => {
  const context = React.useContext(ObjectiveNodeActionContext);

  if (!context) {
    throw new Error('useObjectiveNodeActions must be used inside ObjectiveNodeActionsProvider');
  }

  return context;
};
