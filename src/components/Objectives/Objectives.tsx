import React from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  Controls,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import s from './Objectives.module.css';
import clsx from 'clsx';
import { ObjectiveNode } from './components/ObjectiveNode';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'objective' },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, type: 'objective' },
];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const nodeTypes = {
  objective: ObjectiveNode,
};

export const Objectives = () => {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const [isCreateMode, setIsCreateMode] = React.useState(false);

  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = React.useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = React.useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = React.useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const handlePaneClick = (event: React.MouseEvent) => {
    if (isCreateMode) {
      const newNode = {
        id: Date.now().toString(),
        position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
        data: { label: 'New node' },
        type: 'objective',
      };

      setNodes((prev) => [...prev, newNode]);
    }

    setIsCreateMode(false);
  };

  const handleCreateNode = () => {
    setIsCreateMode(true);
  };

  return (
    <div className={s.root}>
      <button onClick={handleCreateNode} className={s.addNode}>
        {'add node'}
      </button>
      <div
        className={clsx(s.flowWrapper, { [s.createMode]: isCreateMode })}
        style={{ width: '100%', height: '600px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={(event) => handlePaneClick(event)}
          fitView
          nodeOrigin={[0.5, 0.5]}
          deleteKeyCode={['Delete', 'Backspace']}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <Background color="#000000" variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
