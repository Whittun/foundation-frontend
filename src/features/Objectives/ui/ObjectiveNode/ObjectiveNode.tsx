import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import s from './ObjectiveNode.module.css';

import { useObjectiveNodeActions } from '@/features/Objectives/model/ObjectiveNodeActionsContext';
import clsx from 'clsx';
import { Check, CornerDownLeft } from 'lucide-react';
import React from 'react';

type ObjectiveNodeData = {
  label: string;
  completed: boolean;
};

type ObjectiveNodeProps = NodeProps<Node<ObjectiveNodeData>>;

export const ObjectiveNode = ({ data, selected, id }: ObjectiveNodeProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draftValue, setDraftValue] = React.useState(data.label);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const { updateObjectiveNodeData } = useObjectiveNodeActions();

  const doubleClickHandle = () => {
    setDraftValue(data.label);
    setIsEditing(true);
  };

  const blurHandler = () => {
    const trimmedValue = draftValue.trim();

    if (trimmedValue.length > 0) {
      updateObjectiveNodeData(id, { label: trimmedValue, completed: data.completed });
    }

    setIsEditing(false);
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();

    const trimmedValue = draftValue.trim();

    if (event.key === 'Enter' && trimmedValue.length > 0) {
      event.preventDefault();
      updateObjectiveNodeData(id, { label: trimmedValue, completed: data.completed });
      setIsEditing(false);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDraftValue(data.label);
      setIsEditing(false);
    }
  };

  const completeButtonHandler = () => {
    updateObjectiveNodeData(id, { completed: !data.completed });
  };

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={clsx(s.root, { [s.selected]: selected, [s.completed]: data.completed })}>
      <Handle className={s.handle} type="target" position={Position.Top} />
      <Handle className={s.handle} type="source" position={Position.Bottom} />

      <div className={s.nodeHeader}>
        <span>{data.completed ? 'Objective complete' : 'Objective'}</span>
        <button
          type="button"
          title={data.completed ? 'Mark as active' : 'Mark as completed'}
          aria-label={data.completed ? 'Mark objective as active' : 'Mark objective as completed'}
          aria-hidden={!selected || isEditing}
          tabIndex={selected && !isEditing ? 0 : -1}
          onClick={completeButtonHandler}
          className={clsx(s.completeButton, 'nodrag', {
            [s.hiddenCompleteButton]: !selected || isEditing,
          })}
        >
          {data.completed ? <CornerDownLeft /> : <Check />}
        </button>
      </div>

      {isEditing ? (
        <textarea
          onKeyDown={keyHandler}
          className={clsx(s.textarea, 'nodrag')}
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          onBlur={blurHandler}
          ref={textareaRef}
        />
      ) : (
        <React.Fragment>
          <p
            className={clsx(s.label, { [s.disabledLabel]: data.completed })}
            onDoubleClick={doubleClickHandle}
          >
            {data.label}
          </p>
        </React.Fragment>
      )}
    </div>
  );
};
