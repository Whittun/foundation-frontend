import { ReactFlowProvider } from '@xyflow/react';
import { Objectives } from '../../../features/Objectives';

export const ObjectivesPage = () => {
  return (
    <ReactFlowProvider>
      <Objectives />
    </ReactFlowProvider>
  );
};
