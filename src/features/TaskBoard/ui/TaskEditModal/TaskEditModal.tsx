import type { Task } from '@/features/TaskBoard/model/types';
import { Modal } from '@/shared';
import { Pencil, Save } from 'lucide-react';
import React from 'react';
import s from './TaskEditModal.module.css';

type TaskEditModalProps = {
  task: Task;
  onClose: () => void;
  onSave: (taskId: number, patch: Pick<Task, 'title' | 'description'>) => void;
};

export const TaskEditModal = ({ task, onClose, onSave }: TaskEditModalProps) => {
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    onSave(task.id, {
      title: trimmedTitle,
      description: description.trim(),
    });
  };

  return (
    <Modal isOpen onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <header className={s.heading}>
          <Pencil aria-hidden="true" />
          <div>
            <span>Task details</span>
            <h2>Edit task</h2>
          </div>
        </header>

        <div className={s.fields}>
          <label>
            <span>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              autoFocus
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={300}
              rows={5}
            />
          </label>
        </div>

        <footer className={s.actions}>
          <button type="button" className={s.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={s.saveButton} disabled={!title.trim()}>
            <Save aria-hidden="true" />
            Save changes
          </button>
        </footer>
      </form>
    </Modal>
  );
};
