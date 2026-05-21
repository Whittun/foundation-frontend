import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import s from './ObjectiveNode.module.css';

import clsx from 'clsx';
import React from 'react';
import { Check, CornerDownLeft } from 'lucide-react';
import { CompletedTag } from '../../../../shared/CompletedTag';
import { useObjectiveNodeActions } from '../../ObjectiveNodeActionsContext';

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
      {selected && !isEditing && (
        <button onClick={completeButtonHandler} className={clsx(s.completeButton, 'nodrag')}>
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

          {data.completed && <CompletedTag className={s.completedTag} />}
        </React.Fragment>
      )}
    </div>
  );
};
