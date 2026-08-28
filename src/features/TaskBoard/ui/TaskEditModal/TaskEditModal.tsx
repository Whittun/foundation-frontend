import type { Task } from '@/features/TaskBoard/model/types';
import { Modal } from '@/shared';
import clsx from 'clsx';
import { Pencil, Save } from 'lucide-react';
import React from 'react';
import s from './TaskEditModal.module.css';

type EditableScheduleType = 'daily' | 'weekly';

const weekDays = [
  { label: 'MO', value: 1 },
  { label: 'TU', value: 2 },
  { label: 'WE', value: 3 },
  { label: 'TH', value: 4 },
  { label: 'FR', value: 5 },
  { label: 'SA', value: 6 },
  { label: 'SU', value: 0 },
] as const;

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
  const [scheduleType, setScheduleType] = React.useState<EditableScheduleType>(
    task.schedule.type === 'weekly' ? 'weekly' : 'daily',
  );
  const [every, setEvery] = React.useState(task.schedule.every);
  const [selectedDays, setSelectedDays] = React.useState<number[]>(
    task.schedule.type === 'weekly' ? task.schedule.days : [new Date(task.startDate).getUTCDay()],
  );

  const isEveryValid = Number.isInteger(every) && every >= 1;
  const isScheduleValid = scheduleType === 'daily' || selectedDays.length > 0;

  const handleToggleWeekDay = (day: number) => {
    setSelectedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day],
    );
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !startDate || !isEveryValid || !isScheduleValid) return;

    const schedule: Task['schedule'] =
      scheduleType === 'daily'
        ? { type: 'daily', every }
        : { type: 'weekly', every, days: selectedDays };

    onSave(task.id, {
      title: trimmedTitle,
      description: description.trim(),
      startDate,
      schedule,
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
                onChange={(event) => setScheduleType(event.target.value as EditableScheduleType)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
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
                <span>{scheduleType === 'daily' ? 'day(s)' : 'week(s)'}</span>
              </div>
            </label>
          </div>

          {scheduleType === 'weekly' && (
            <fieldset className={s.weekDaysField}>
              <legend>Repeat on</legend>
              <div className={s.weekDays}>
                {weekDays.map((weekDay) => {
                  const isSelected = selectedDays.includes(weekDay.value);

                  return (
                    <button
                      type="button"
                      className={clsx(s.weekDayButton, { [s.selectedWeekDay]: isSelected })}
                      onClick={() => handleToggleWeekDay(weekDay.value)}
                      aria-pressed={isSelected}
                      key={weekDay.value}
                    >
                      {weekDay.label}
                    </button>
                  );
                })}
              </div>
              {selectedDays.length === 0 && (
                <p className={s.scheduleError}>Select at least one day.</p>
              )}
            </fieldset>
          )}
        </div>

        <footer className={s.actions}>
          <button type="button" className={s.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={s.saveButton}
            disabled={!title.trim() || !startDate || !isEveryValid || !isScheduleValid}
          >
            <Save aria-hidden="true" />
            Save changes
          </button>
        </footer>
      </form>
    </Modal>
  );
};
