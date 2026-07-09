import { Kanban } from 'lucide-react';
import s from './TaskBoardPage.module.css';

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
    tasks: ['Review priorities', 'Finish board UI'],
  },
  {
    title: 'Tasks',
    placeholder: 'In development',
    description: 'Task backlog is being prepared.',
    tasks: [],
  },
];

export const TaskBoardPage = () => {
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
        {columns.map((column) => (
          <section className={s.column} key={column.title}>
            <header className={s.columnHeader}>
              <h2 className={s.columnTitle}>{column.title}</h2>
              <span className={s.count}>{column.tasks.length}</span>
            </header>
            <div className={s.tasks}>
              {column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                  <div className={s.task} key={task}>
                    {task}
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
        ))}
      </div>
    </section>
  );
};
