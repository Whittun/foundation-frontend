import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  getNodesBounds,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type EdgeChange,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';

import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '../../../../shared/hooks';
import {
  objectivesApi,
  useGetObjectivesGraphQuery,
  useSaveObjectivesGraphMutation,
} from '../../api/objectivesApi';
import { ObjectiveNodeActionsProvider } from '../../model/ObjectiveNodeActionsContext';
import { ObjectiveNode } from '../ObjectiveNode/ObjectiveNode';
import s from './Objectives.module.css';

type ObjectiveFlowNode = {
  id: string;
  position: { x: number; y: number };
  data: { label: string; completed: boolean };
  type: 'objective';
  selected?: boolean;
};

type ObjectiveFlowEdge = {
  id: string;
  source: string;
  target: string;
};

const nodeTypes = {
  objective: ObjectiveNode,
};

export const Objectives = () => {
  const [nodes, setNodes] = React.useState<ObjectiveFlowNode[]>([]);
  const [edges, setEdges] = React.useState<ObjectiveFlowEdge[]>([]);
  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [clipboardGraph, setClipboardGraph] = React.useState<{
    nodes: ObjectiveFlowNode[];
    edges: ObjectiveFlowEdge[];
  }>({
    nodes: [],
    edges: [],
  });
  const [currentVersion, setCurrentVersion] = React.useState<number>();
  const [dirty, setDirty] = React.useState(false);

  const mousePositionRef = React.useRef<XYPosition | null>(null);
  const hasHydratedGraphRef = React.useRef(false);

  const [saveObjectivesGraph] = useSaveObjectivesGraphMutation();

  const { screenToFlowPosition } = useReactFlow();

  const dispatch = useAppDispatch();

  const handleSaveGraph = React.useCallback(async () => {
    if (!currentVersion) {
      return;
    }

    try {
      const savedGraph = await saveObjectivesGraph({
        version: currentVersion,
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      }).unwrap();

      setCurrentVersion(savedGraph.version);
      setDirty(false);

      dispatch(
        objectivesApi.util.updateQueryData('getObjectivesGraph', undefined, () => savedGraph),
      );
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 409
      ) {
        const freshGraph = await refetch().unwrap();

        setCurrentVersion(freshGraph.version);
        setNodes(freshGraph.nodes);
        setEdges(freshGraph.edges);
        setDirty(false);

        return;
      }

      throw error;
    }
  }, [currentVersion, nodes, edges, saveObjectivesGraph, dispatch]);

  const isPersistableNodeChange = (changes: NodeChange<ObjectiveFlowNode>[]) => {
    return changes.some((change) => {
      return change.type === 'position' || change.type === 'remove' || change.type === 'add';
    });
  };

  const isPersistableEdgeChange = (changes: EdgeChange<ObjectiveFlowEdge>[]) => {
    return changes.some((change) => {
      return change.type === 'remove' || change.type === 'add';
    });
  };

  const onNodesChange: OnNodesChange<ObjectiveFlowNode> = React.useCallback((changes) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));

    if (isPersistableNodeChange(changes)) {
      setDirty(true);
    }
  }, []);

  const onEdgesChange: OnEdgesChange<ObjectiveFlowEdge> = React.useCallback((changes) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));

    if (isPersistableEdgeChange(changes)) {
      setDirty(true);
    }
  }, []);

  const onConnect: OnConnect = React.useCallback((params) => {
    setEdges((edgesSnapshot) => addEdge({ ...params, id: crypto.randomUUID() }, edgesSnapshot));

    setDirty(true);
  }, []);

  const { data, refetch } = useGetObjectivesGraphQuery();

  React.useEffect(() => {
    if (!data) {
      return;
    }

    if (hasHydratedGraphRef.current) {
      return;
    }

    hasHydratedGraphRef.current = true;

    setCurrentVersion(data.version);
    setNodes(data.nodes);
    setEdges(data.edges);

    setDirty(false);
  }, [data]);

  const handlePaneClick = (event: React.MouseEvent) => {
    if (isCreateMode) {
      const newNode: ObjectiveFlowNode = {
        id: crypto.randomUUID(),
        position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
        data: { label: 'New node', completed: false },
        type: 'objective',
        selected: false,
      };

      setNodes((prev) => [...prev, newNode]);
      setDirty(true);
    }

    setIsCreateMode(false);
  };

  const handleCreateNode = () => {
    setIsCreateMode((prev) => !prev);
  };

  React.useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.ctrlKey) {
        event.preventDefault();

        const selectedNodes = nodes.filter((node) => node.selected);

        if (selectedNodes.length === 0) return;

        const selectedNodeIds = selectedNodes.map((node) => {
          return node.id;
        });

        const selectedEdges = edges.filter((edge) => {
          return selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target);
        });

        setClipboardGraph({ nodes: selectedNodes, edges: selectedEdges });
      }

      if (event.code === 'KeyV' && event.ctrlKey) {
        event.preventDefault();

        const mousePosition = mousePositionRef.current;

        if (clipboardGraph.nodes?.length === 0 || !mousePosition) {
          return;
        }

        const bounds = getNodesBounds(clipboardGraph.nodes, { nodeOrigin: [0.5, 0.5] });

        const groupCenterX = bounds.x + bounds.width / 2;
        const groupCenterY = bounds.y + bounds.height / 2;

        const idNodesMap: Record<string, string> = {};

        const newNodes: ObjectiveFlowNode[] = clipboardGraph.nodes.map((clipboardNode) => {
          const relativeX = clipboardNode.position.x - groupCenterX;
          const relativeY = clipboardNode.position.y - groupCenterY;

          const newId = crypto.randomUUID();

          idNodesMap[clipboardNode.id] = newId;

          const dataCopy = structuredClone(clipboardNode.data);

          return {
            id: newId,
            position: { x: mousePosition.x + relativeX, y: mousePosition.y + relativeY },
            data: dataCopy,
            type: 'objective',
            selected: true,
          };
        });

        const newEdges = clipboardGraph.edges.map((edge) => {
          return {
            ...edge,
            id: crypto.randomUUID(),
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
        setDirty(true);
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [nodes, edges, clipboardGraph]);

  const handleMouseMove = (event: React.MouseEvent) => {
    mousePositionRef.current = screenToFlowPosition({ x: event.clientX, y: event.clientY });
  };

  React.useEffect(() => {
    if (!currentVersion) return;

    if (!dirty) {
      return;
    }

    const timeout = setTimeout(() => {
      handleSaveGraph();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [dirty, nodes, edges, currentVersion, handleSaveGraph]);

  const updateObjectiveNodeData = React.useCallback(
    (id: string, patch: { label?: string; completed?: boolean }) => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== id) {
            return node;
          }

          return {
            ...node,
            data: {
              ...node.data,
              ...patch,
            },
          };
        }),
      );
      setDirty(true);
    },
    [],
  );

  const objectiveNodeActions = React.useMemo(
    () => ({ updateObjectiveNodeData }),
    [updateObjectiveNodeData],
  );

  return (
    <div className={s.root}>
      <button
        onClick={handleCreateNode}
        className={clsx(s.addNode, { [s.activeCreate]: isCreateMode })}
      >
        <Plus /> Add Objective
      </button>
      <div className={clsx(s.flowWrapper, { [s.createMode]: isCreateMode })}>
        <ObjectiveNodeActionsProvider value={objectiveNodeActions}>
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
        </ObjectiveNodeActionsProvider>
      </div>
    </div>
  );
};
