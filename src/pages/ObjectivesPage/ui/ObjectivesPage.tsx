import { ReactFlowProvider } from '@xyflow/react';
import { Objectives } from '../../../components/Objectives';

export const ObjectivesPage = () => {
  return (
    <ReactFlowProvider>
      <Objectives />
    </ReactFlowProvider>
  );
};
