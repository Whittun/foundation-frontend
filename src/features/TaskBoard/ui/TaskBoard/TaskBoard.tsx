import { isTaskScheduledForDate } from '@/features/TaskBoard/model/isTaskScheduledForDate';
import { Modal } from '@/shared';
import clsx from 'clsx';
import { Kanban, Moon, Plus } from 'lucide-react';
import React from 'react';
import { useEditTaskMutation, useGetTasksQuery, useRemoveTaskMutation } from '../../api/tasksApi';
import { useActiveDay } from '../../model/hooks/useActiveDay';
import { TaskCard } from '../TaskCard/TaskCard';
import { TaskCreateForm } from '../TaskCreateForm';
import { TaskEditModal } from '../TaskEditModal/TaskEditModal';
import s from './TaskBoard.module.css';

type TaskView = 'today' | 'all';

export const TaskBoard = () => {
  const { data = [], error, isLoading } = useGetTasksQuery();
  const [editTask] = useEditTaskMutation();
  const [removeTask] = useRemoveTaskMutation();

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

  const { handleStartNewDay, activeDay } = useActiveDay(setIsDaySummaryOpen);

  const activeDayTasks = data.filter((task) => isTaskScheduledForDate(task, activeDay));

  const handleToggleTask = async (taskId: number, isCompleted: boolean) => {
    try {
      await editTask({
        id: taskId,
        task: { completedDate: isCompleted ? null : activeDay },
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await removeTask({ id: taskId }).unwrap();

      setEditingTaskId((currentId) => (currentId === taskId ? null : currentId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (taskId: number) => {
    setIsDaySummaryOpen(false);
    setEditingTaskId(taskId);
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
          const isTaskColumn = column.title === 'Today';
          const columnTasks = isTaskColumn && taskView !== 'all' ? activeDayTasks : column.tasks;
          const columnTitle = isTaskColumn && taskView === 'all' ? 'All scheduled' : column.title;
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
                  <TaskCreateForm activeDay={activeDay} setIsCreateFormOpen={setIsCreateFormOpen} />
                )}
                {isTaskColumn && isLoading ? (
                  <p>Loading tasks...</p>
                ) : isTaskColumn && error ? (
                  <p>Failed to load tasks.</p>
                ) : columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      activeDay={activeDay}
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
            <strong>{/* {completedTasksCount} / {activeDayTasks.length}{' '} */}</strong>
          </header>

          <p className={s.daySummaryHint}>
            Check anything you finished before starting the next day.
          </p>

          <div className={s.summaryTasks}>
            {activeDayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                activeDay={activeDay}
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

      {editingTask && <TaskEditModal task={editingTask} onClose={() => setEditingTaskId(null)} />}
    </section>
  );
};
