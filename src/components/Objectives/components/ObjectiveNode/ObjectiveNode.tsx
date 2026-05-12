import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import s from './ObjectiveNode.module.css';

import clsx from 'clsx';
import React from 'react';

type ObjectiveNodeData = {
  label: string;
};

type ObjectiveNodeProps = NodeProps<Node<ObjectiveNodeData>>;

export const ObjectiveNode = ({ data, selected, id }: ObjectiveNodeProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftValue, setDraftValue] = React.useState(data.label);

  const { updateNodeData } = useReactFlow();

  const doubleClickHandle = () => {
    setIsEditing(true);
  };

  const blurHandler = () => {
    updateNodeData(id, { label: draftValue });
    setIsEditing(false);
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();

    const trimmedValue = draftValue.trim();

    if (event.key === 'Enter' && trimmedValue.length > 0) {
      event.preventDefault();
      updateNodeData(id, { label: trimmedValue });
      setIsEditing(false);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDraftValue(data.label);
      setIsEditing(false);
    }
  };

  return (
    <div className={clsx(s.root, { [s.selected]: selected })}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {isEditing ? (
        <textarea
          onKeyDown={keyHandler}
          className={clsx(s.textarea, 'nodrag')}
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          onBlur={blurHandler}
        />
      ) : (
        <p className={clsx(s.label)} onDoubleClick={doubleClickHandle}>
          {data.label}
        </p>
      )}
    </div>
  );
};
