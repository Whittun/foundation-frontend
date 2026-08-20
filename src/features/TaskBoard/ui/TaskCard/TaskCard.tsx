import type { Task } from '@/features/TaskBoard/model/types';
import clsx from 'clsx';
import { Check, Ellipsis, Trash2 } from 'lucide-react';
import React from 'react';
import s from './TaskCard.module.css';

type TaskCardProps = {
  task: Task;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

export const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className={clsx(s.task, { [s.completedTask]: task.completed })}>
      <div className={s.taskHeader}>
        <h3>{task.title}</h3>
        <div className={s.taskActions}>
          <button
            type="button"
            className={s.completeButton}
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? `Mark ${task.title} as active` : `Complete ${task.title}`}
            title={task.completed ? 'Mark as active' : 'Complete task'}
          >
            {task.completed && <Check aria-hidden="true" />}
          </button>

          <div className={s.taskMenu} ref={menuRef}>
            <button
              type="button"
              className={s.taskMenuButton}
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              aria-label={`Open actions for ${task.title}`}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              title="Task actions"
            >
              <Ellipsis aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div className={s.taskMenuPopover} role="menu">
                <button
                  type="button"
                  className={s.deleteTaskAction}
                  onClick={() => onDelete(task.id)}
                  role="menuitem"
                >
                  <Trash2 aria-hidden="true" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {task.description && <p>{task.description}</p>}
    </div>
  );
};
