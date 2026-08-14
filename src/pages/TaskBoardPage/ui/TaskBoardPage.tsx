import clsx from 'clsx';
import { Check, Kanban, Plus } from 'lucide-react';
import React from 'react';
import s from './TaskBoardPage.module.css';

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const todayTasks: Task[] = [
  {
    id: 1,
    title: 'Review priorities',
    description: 'Choose the three most important things to focus on today.',
    completed: false,
  },
  {
    id: 2,
    title: 'Finish board UI',
    description: 'Polish the task cards and check how they behave in the Today column.',
    completed: false,
  },
  {
    id: 3,
    title: 'Plan tomorrow',
    description: 'Write down the first task for tomorrow before finishing the day.',
    completed: false,
  },
];

const columns = [
  {
    title: 'Habits',
    placeholder: 'Coming soon',
    description: 'Habit cards will appear here.',
    tasks: [],
  },
  {
    title: 'Today',
    placeholder: null,
    description: null,
    tasks: todayTasks,
  },
  {
    title: 'Tasks',
    placeholder: 'In development',
    description: 'Task backlog is being prepared.',
    tasks: [],
  },
];

export const TaskBoardPage = () => {
  const [tasks, setTasks] = React.useState(todayTasks);
  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleCreateTask = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        title: trimmedTitle,
        description: trimmedDescription,
        completed: false,
      },
    ]);
    setTitle('');
    setDescription('');
    setIsCreateFormOpen(false);
  };

  const handleToggleTask = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <section className={s.root}>
      <header className={s.toolbar}>
        <div className={s.heading}>
          <Kanban aria-hidden="true" />
          <div>
            <h1>Task Board</h1>
          </div>
        </div>
      </header>

      <div className={s.board} aria-label="Task board columns">
        {columns.map((column) => {
          const columnTasks = column.title === 'Today' ? tasks : column.tasks;

          return (
            <section className={s.column} key={column.title}>
              <header className={s.columnHeader}>
                <h2 className={s.columnTitle}>{column.title}</h2>
                <div className={s.columnActions}>
                  {column.title === 'Today' && (
                    <button
                      type="button"
                      className={clsx(s.openCreateFormButton, {
                        [s.openCreateFormButtonActive]: isCreateFormOpen,
                      })}
                      onClick={() => setIsCreateFormOpen((isOpen) => !isOpen)}
                      aria-label={isCreateFormOpen ? 'Close task form' : 'Create task'}
                      aria-expanded={isCreateFormOpen}
                      aria-controls="create-task-form"
                      title={isCreateFormOpen ? 'Close task form' : 'Create task'}
                    >
                      <Plus aria-hidden="true" />
                    </button>
                  )}
                  <span className={s.count}>{columnTasks.length}</span>
                </div>
              </header>
              <div className={s.tasks}>
                {column.title === 'Today' && isCreateFormOpen && (
                  <form
                    id="create-task-form"
                    className={s.createTaskForm}
                    onSubmit={handleCreateTask}
                  >
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
                )}
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <div
                      className={clsx(s.task, { [s.completedTask]: task.completed })}
                      key={task.id}
                    >
                      <div className={s.taskHeader}>
                        <h3>{task.title}</h3>
                        <button
                          type="button"
                          className={s.completeButton}
                          onClick={() => handleToggleTask(task.id)}
                          aria-label={
                            task.completed
                              ? `Mark ${task.title} as active`
                              : `Complete ${task.title}`
                          }
                          title={task.completed ? 'Mark as active' : 'Complete task'}
                        >
                          {task.completed && <Check aria-hidden="true" />}
                        </button>
                      </div>
                      <p>{task.description}</p>
                    </div>
                  ))
                ) : (
                  <div className={s.placeholder}>
                    <span>{column.placeholder}</span>
                    <p>{column.description}</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};
