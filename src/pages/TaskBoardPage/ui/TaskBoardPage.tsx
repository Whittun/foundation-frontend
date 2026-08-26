import { TaskCard, TaskEditModal, type Task } from '@/features/TaskBoard';
import { isTaskScheduledForDate } from '@/features/TaskBoard/model/isTaskScheduledForDate';
import { getLocalDayKey, Modal } from '@/shared';
import clsx from 'clsx';
import { Kanban, Moon, Plus } from 'lucide-react';
import React from 'react';
import s from './TaskBoardPage.module.css';

const ACTIVE_DAY_STORAGE_KEY = 'taskBoardActiveDay';
const DAY_CHECK_INTERVAL = 60000;

const dailyTasks: Task[] = [
  {
    id: 1,
    title: 'Review priorities',
    description: 'Choose the three most important things to focus on today.',
    completed: false,
    startDate: getLocalDayKey(),
    schedule: {
      type: 'weekly',
      every: 1,
      days: [1, 2, 3, 4, 5],
    },
  },
  {
    id: 2,
    title: 'Finish board UI',
    description: 'Polish the task cards and check how they behave in the Today column.',
    completed: false,
    startDate: '2026-08-22',
    schedule: {
      type: 'daily',
      every: 1,
    },
  },
  {
    id: 3,
    title: 'Plan tomorrow',
    description: 'Write down the first task for tomorrow before finishing the day.',
    completed: false,
    startDate: '2026-08-22',
    schedule: {
      type: 'daily',
      every: 3,
    },
  },
];

const todayTasks = dailyTasks.filter((task) => isTaskScheduledForDate(task, getLocalDayKey()));

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
    tasks: dailyTasks,
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
  const [isDaySummaryOpen, setIsDaySummaryOpen] = React.useState(false);
  const [editingTaskId, setEditingTaskId] = React.useState<number | null>(null);
  const [activeDay, setActiveDay] = React.useState(
    () => localStorage.getItem(ACTIVE_DAY_STORAGE_KEY) ?? getLocalDayKey(),
  );
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const checkActiveDay = React.useCallback(() => {
    if (activeDay !== getLocalDayKey()) {
      setIsDaySummaryOpen(true);
    }
  }, [activeDay]);

  React.useEffect(() => {
    localStorage.setItem(ACTIVE_DAY_STORAGE_KEY, activeDay);
  }, [activeDay]);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkActiveDay();
      }
    };

    checkActiveDay();

    window.addEventListener('focus', checkActiveDay);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const intervalId = window.setInterval(checkActiveDay, DAY_CHECK_INTERVAL);

    return () => {
      window.removeEventListener('focus', checkActiveDay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [checkActiveDay]);

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
        startDate: getLocalDayKey(),
        schedule: {
          type: 'daily',
          every: 1,
        },
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

  const handleDeleteTask = (taskId: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    setEditingTaskId((currentId) => (currentId === taskId ? null : currentId));
  };

  const handleEditTask = (taskId: number) => {
    setIsDaySummaryOpen(false);
    setEditingTaskId(taskId);
  };

  const handleSaveTask = (
    taskId: number,
    patch: Pick<Task, 'title' | 'description' | 'startDate' | 'schedule'>,
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)),
    );
    setEditingTaskId(null);
  };

  const handleStartNewDay = () => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => ({
        ...task,
        completed: false,
      })),
    );
    setActiveDay(getLocalDayKey());
    setIsDaySummaryOpen(false);
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null;

  return (
    <section className={s.root}>
      <header className={s.toolbar}>
        <div className={s.heading}>
          <Kanban aria-hidden="true" />
          <div>
            <h1>Task Board</h1>
          </div>
        </div>
        <button
          className={s.finishDayButton}
          type="button"
          onClick={() => setIsDaySummaryOpen(true)}
        >
          <Moon aria-hidden="true" />
          Finish day
        </button>
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
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
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

      <Modal isOpen={isDaySummaryOpen} onClose={() => setIsDaySummaryOpen(false)}>
        <section className={s.daySummary}>
          <header className={s.daySummaryHeader}>
            <div>
              <span>Day summary</span>
              <h2>Review today’s tasks</h2>
            </div>
            <strong>
              {completedTasksCount} / {tasks.length}
            </strong>
          </header>

          <p className={s.daySummaryHint}>
            Check anything you finished before starting the next day.
          </p>

          <div className={s.summaryTasks}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                showMenu={false}
              />
            ))}
          </div>

          <button className={s.startNextDayButton} type="button" onClick={handleStartNewDay}>
            Start new day
          </button>
        </section>
      </Modal>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTaskId(null)}
          onSave={handleSaveTask}
        />
      )}
    </section>
  );
};
