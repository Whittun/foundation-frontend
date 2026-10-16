import { TaskCard, TaskEditModal, type Task } from '@/features/TaskBoard';
import { isTaskScheduledForDate } from '@/features/TaskBoard/model/isTaskScheduledForDate';
import { getLocalDayKey, Modal } from '@/shared';
import clsx from 'clsx';
import { Kanban, Moon, Plus } from 'lucide-react';
import React from 'react';
import {
  useCreateTaskMutation,
  useEditTaskMutation,
  useGetTasksQuery,
  useRemoveTaskMutation,
} from '../api/tasksApi';
import s from './TaskBoardPage.module.css';

const ACTIVE_DAY_STORAGE_KEY = 'taskBoardActiveDay';
const DAY_CHECK_INTERVAL = 60000;

type TaskView = 'today' | 'all';

export const TaskBoardPage = () => {
  const { data = [] } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [editTask] = useEditTaskMutation();
  const [removeTask] = useRemoveTaskMutation();

  console.log(data);

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
      tasks: data,
    },
    {
      title: 'Tasks',
      placeholder: 'In development',
      description: 'Task backlog is being prepared.',
      tasks: [],
    },
  ];

  const [taskView, setTaskView] = React.useState<TaskView>('today');
  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);
  const [isDaySummaryOpen, setIsDaySummaryOpen] = React.useState(false);
  const [editingTaskId, setEditingTaskId] = React.useState<number | null>(null);
  const [activeDay, setActiveDay] = React.useState(
    () => localStorage.getItem(ACTIVE_DAY_STORAGE_KEY) ?? getLocalDayKey(),
  );
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const activeDayTasks = data.filter((task) => isTaskScheduledForDate(task, activeDay));

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

    createTask({
      title: trimmedTitle,
      description: trimmedDescription,
      startDate: getLocalDayKey(),
      schedule: {
        type: 'daily',
        every: 1,
      },
    });

    setTitle('');
    setDescription('');
    setIsCreateFormOpen(false);
  };

  const handleToggleTask = (taskId: number, isCompleted: boolean) => {
    editTask({ id: taskId, task: { completedDate: isCompleted ? null : getLocalDayKey() } });
  };

  const handleDeleteTask = (taskId: number) => {
    setEditingTaskId((currentId) => (currentId === taskId ? null : currentId));

    removeTask({ id: taskId });
  };

  const handleEditTask = (taskId: number) => {
    setIsDaySummaryOpen(false);
    setEditingTaskId(taskId);
  };

  const handleSaveTask = (
    taskId: number,
    patch: Pick<Task, 'title' | 'description' | 'startDate' | 'schedule'>,
  ) => {
    editTask({
      id: taskId,
      task: patch,
    });

    setEditingTaskId(null);
  };

  const handleStartNewDay = () => {
    setActiveDay(getLocalDayKey());
    setIsDaySummaryOpen(false);
  };

  const editingTask = data.find((task) => task.id === editingTaskId) ?? null;

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
          console.log(column);
          const isTaskColumn = column.title === 'Today';
          const columnTasks = isTaskColumn && taskView !== 'all' ? activeDayTasks : column.tasks;
          const columnTitle = isTaskColumn && taskView === 'all' ? 'All tasks' : column.title;
          console.log(taskView, 'test');
          return (
            <section className={s.column} key={column.title}>
              <header className={s.columnHeader}>
                <h2 className={s.columnTitle}>{columnTitle}</h2>
                <div className={s.columnActions}>
                  {isTaskColumn && (
                    <>
                      <div className={s.taskViewSwitch} aria-label="Task view">
                        {(['today', 'all'] as const).map((view) => (
                          <button
                            type="button"
                            className={clsx({ [s.activeTaskView]: taskView === view })}
                            onClick={() => setTaskView(view)}
                            aria-pressed={taskView === view}
                            key={view}
                          >
                            {view === 'today' ? 'Today' : 'All'}
                          </button>
                        ))}
                      </div>

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
                    </>
                  )}
                  {/* <span className={s.count}>{columnTasks.length}</span> */}
                </div>
              </header>
              <div className={s.tasks}>
                {isTaskColumn && isCreateFormOpen && (
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
            <strong>{/* {completedTasksCount} / {activeDayTasks.length} */}</strong>
          </header>

          <p className={s.daySummaryHint}>
            Check anything you finished before starting the next day.
          </p>

          <div className={s.summaryTasks}>
            {activeDayTasks.map((task) => (
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
