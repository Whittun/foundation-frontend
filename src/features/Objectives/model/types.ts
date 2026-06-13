export type ObjectiveFlowNode = {
  id: string;
  type: 'objective';
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    completed: boolean;
  };
};

export type ObjectiveFlowEdge = { id: string; source: string; target: string };

export type ObjectivesGraph = {
  version: number;
  nodes: ObjectiveFlowNode[];
  edges: ObjectiveFlowEdge[];
};
