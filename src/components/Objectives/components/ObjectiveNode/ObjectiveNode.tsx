import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import s from './ObjectiveNode.module.css';

import clsx from 'clsx';

type ObjectiveNodeData = {
  label: string;
};

type ObjectiveNodeProps = NodeProps<Node<ObjectiveNodeData>>;

export const ObjectiveNode = ({ data, selected }: ObjectiveNodeProps) => {
  return (
    <div className={clsx(s.root, { [s.selected]: selected })}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div>{data.label}</div>
    </div>
  );
};
