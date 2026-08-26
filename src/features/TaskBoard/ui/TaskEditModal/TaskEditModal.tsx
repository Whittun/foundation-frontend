import type { Task } from '@/features/TaskBoard/model/types';
import { Modal } from '@/shared';
import { Pencil, Save } from 'lucide-react';
import React from 'react';
import s from './TaskEditModal.module.css';

type TaskEditModalProps = {
  task: Task;
  onClose: () => void;
  onSave: (
    taskId: number,
    patch: Pick<Task, 'title' | 'description' | 'startDate' | 'schedule'>,
  ) => void;
};

export const TaskEditModal = ({ task, onClose, onSave }: TaskEditModalProps) => {
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description);
  const [startDate, setStartDate] = React.useState(task.startDate);
  const [scheduleType, setScheduleType] = React.useState<'daily'>('daily');
  const [every, setEvery] = React.useState(
    task.schedule.type === 'daily' ? task.schedule.every : 1,
  );

  const isEveryValid = Number.isInteger(every) && every >= 1;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !startDate || !isEveryValid) return;

    onSave(task.id, {
      title: trimmedTitle,
      description: description.trim(),
      startDate,
      schedule: {
        type: scheduleType,
        every,
      },
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

          <label>
            <span>Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <div className={s.scheduleFields}>
            <label>
              <span>Schedule type</span>
              <select
                value={scheduleType}
                onChange={(event) => setScheduleType(event.target.value as 'daily')}
              >
                <option value="daily">Daily</option>
              </select>
            </label>

            <label>
              <span>Repeat every</span>
              <div className={s.intervalField}>
                <input
                  type="number"
                  value={every}
                  onChange={(event) => setEvery(Number(event.target.value))}
                  min={1}
                  step={1}
                  inputMode="numeric"
                />
                <span>day(s)</span>
              </div>
            </label>
          </div>
        </div>

        <footer className={s.actions}>
          <button type="button" className={s.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={s.saveButton}
            disabled={!title.trim() || !startDate || !isEveryValid}
          >
            <Save aria-hidden="true" />
            Save changes
          </button>
        </footer>
      </form>
    </Modal>
  );
};
