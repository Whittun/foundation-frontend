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
  type XYPosition,
  getNodesBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import s from './Objectives.module.css';
import clsx from 'clsx';
import { ObjectiveNode } from './components/ObjectiveNode';

type ObjectiveFlowNode = {
  id: string;
  position: { x: number; y: number };
  data: { label: string; completed: boolean };
  type: string;
  selected?: boolean;
};

type ObjectiveFlowEdge = {
  id: string;
  source: string;
  target: string;
};

const initialNodes: ObjectiveFlowNode[] = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1', completed: false },
    type: 'objective',
    selected: false,
  },
  {
    id: 'n2',
    position: { x: 0, y: 100 },
    data: { label: 'Node 2', completed: false },
    type: 'objective',
    selected: false,
  },
];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const nodeTypes = {
  objective: ObjectiveNode,
};

export const Objectives = () => {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [clipboardGraph, setClipboardGraph] = React.useState<{
    nodes: ObjectiveFlowNode[] | null;
    edges: ObjectiveFlowEdge[] | null;
  }>({
    nodes: null,
    edges: null,
  });

  const mousePositionRef = React.useRef<XYPosition | null>(null);

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
        data: { label: 'New node', completed: false },
        type: 'objective',
        selected: false,
      };

      setNodes((prev) => [...prev, newNode]);
    }

    setIsCreateMode(false);
  };

  const handleCreateNode = () => {
    setIsCreateMode(true);
  };

  React.useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.ctrlKey) {
        event.preventDefault();

        const selectedNodes = nodes.filter((node) => node.selected);

        const selectedNodeIds = selectedNodes.map((node) => {
          return node.id;
        });

        const selectedEdges = edges.filter((edge) => {
          return selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target);
        });

        if (selectedNodes.length === 0) return;

        setClipboardGraph({ nodes: selectedNodes, edges: selectedEdges });
      }

      if (event.code === 'KeyV' && event.ctrlKey) {
        event.preventDefault();

        const mousePosition = mousePositionRef.current;

        if (!clipboardGraph.nodes || clipboardGraph.nodes?.length === 0 || !mousePosition) {
          return;
        }

        const bounds = getNodesBounds(clipboardGraph.nodes, { nodeOrigin: [0.5, 0.5] });

        const groupCenterX = bounds.x + bounds.width / 2;
        const groupCenterY = bounds.y + bounds.height / 2;

        const idNodesMap: Record<string, string> = {};

        const newNodes = clipboardGraph.nodes.map((clipboardNode) => {
          const relativeX = clipboardNode.position.x - groupCenterX;
          const relativeY = clipboardNode.position.y - groupCenterY;

          const newId = Math.random().toString();

          idNodesMap[clipboardNode.id] = newId;

          return {
            id: newId,
            position: { x: mousePosition.x + relativeX, y: mousePosition.y + relativeY },
            data: clipboardNode.data,
            type: 'objective',
            selected: true,
          };
        });

        const newEdges = clipboardGraph.edges?.map((edge) => {
          return {
            id: Math.random().toString(),
            source: idNodesMap[edge.source],
            target: idNodesMap[edge.target],
          };
        });

        setNodes((prev) => {
          const unselectedPreviousNodes = prev.map((node) => {
            return { ...node, selected: false };
          });

          return [...unselectedPreviousNodes, ...newNodes];
        });

        setEdges((prev) => [...prev, ...newEdges]);
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [nodes, clipboardGraph]);

  const handleMouseMove = (event: React.MouseEvent) => {
    mousePositionRef.current = screenToFlowPosition({ x: event.clientX, y: event.clientY });
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
          onMouseMove={handleMouseMove}
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
