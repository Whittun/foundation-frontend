import clsx from 'clsx';
import { Check, Kanban } from 'lucide-react';
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
                <span className={s.count}>{columnTasks.length}</span>
              </header>
              <div className={s.tasks}>
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
