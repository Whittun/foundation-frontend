import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import s from './ObjectiveNode.module.css';

import clsx from 'clsx';
import React from 'react';
import { Check, CornerDownLeft } from 'lucide-react';
import { CompletedTag } from '../../../../shared/CompletedTag';

type ObjectiveNodeData = {
  label: string;
  completed: true;
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

  const completeButtonHandler = () => {
    updateNodeData(id, { completed: !data.completed });
  };

  return (
    <div className={clsx(s.root, { [s.selected]: selected, [s.completed]: data.completed })}>
      {selected && (
        <button onClick={completeButtonHandler} className={clsx(s.comleteButton, 'nodrag')}>
          {data.completed ? <CornerDownLeft /> : <Check />}
        </button>
      )}

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
        <React.Fragment>
          <p
            className={clsx(s.label, { [s.disabledLabel]: data.completed })}
            onDoubleClick={doubleClickHandle}
          >
            {data.label}
          </p>

          {data.completed && <CompletedTag className={s.completedTag} />}
        </React.Fragment>
      )}
    </div>
  );
};
