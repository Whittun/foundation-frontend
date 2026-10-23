import { Plus } from 'lucide-react';
import React from 'react';
import { useCreateTaskMutation } from '../../api/tasksApi';
import s from './TaskCreateForm.module.css';

type TaskCreateFormProps = {
  activeDay: string;
  setIsCreateFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TaskCreateForm = ({ activeDay, setIsCreateFormOpen }: TaskCreateFormProps) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const [createTask] = useCreateTaskMutation();

  const handleCreateTask = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    try {
      await createTask({
        title: trimmedTitle,
        description: trimmedDescription,
        startDate: activeDay,
        schedule: {
          type: 'daily',
          every: 1,
        },
      }).unwrap();

      setTitle('');
      setDescription('');
      setIsCreateFormOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form id="create-task-form" className={s.createTaskForm} onSubmit={handleCreateTask}>
      <label className={s.srOnly} htmlFor="task-title">
        Task title
      </label>
      <input
        id="task-title"
        className={s.taskInput}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        maxLength={100}
      />
      <label className={s.srOnly} htmlFor="task-description">
        Task description
      </label>
      <textarea
        id="task-description"
        className={s.taskInput}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description (optional)"
        maxLength={300}
        rows={2}
      />
      <button className={s.createTaskButton} type="submit" disabled={!title.trim()}>
        <Plus aria-hidden="true" />
        Add task
      </button>
    </form>
  );
};
