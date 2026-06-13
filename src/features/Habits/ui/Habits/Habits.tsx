import clsx from 'clsx';
import s from './Habits.module.css';
import { Plus, SquarePen, Trash } from 'lucide-react';
import {
  useCreateHabitLevelMutation,
  useDeleteHabitLevelMutation,
  useGetHabitLevelsByHabitQuery,
  useUpdateHabitLevelMutation,
} from '../../api/habitsApi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import type { DraftInputsValues, UpdateHabitLevelArgs } from '../../model/types';
import { CompletedTag } from '../../../../shared/CompletedTag';
import { HabitLevelForm } from '../HabitLevelForm/HabitLevelForm';

export const Habits = () => {
  const [habitLevelFormState, setHabitLevelFormState] = React.useState<{
    type: string;
    id?: number;
  } | null>();

  const [createErrors, setCreateErrors] = React.useState<{ level: string | null }>({
    level: null,
  });

  const { habitId } = useParams();

  const numericHabitId = Number(habitId);
  const isValidHabitId = Number.isInteger(numericHabitId);

  const { data, error, isError, isSuccess } = useGetHabitLevelsByHabitQuery(
    { habitId: numericHabitId },
    { skip: !isValidHabitId },
  );

  const [createHabitLevel] = useCreateHabitLevelMutation();
  const [updateHabitLevel] = useUpdateHabitLevelMutation();
  const [deleteHabitLevel] = useDeleteHabitLevelMutation();

  const navigate = useNavigate();

  const createOpenHandler = () => {
    setHabitLevelFormState({ type: 'create' });
  };

  const cancelHandler = () => {
    setHabitLevelFormState(null);
  };

  const editHandler = (habitLevelId: number) => {
    setHabitLevelFormState({ type: 'edit', id: habitLevelId });
  };

  const createHabitLevelHandler = async (inputsValues: DraftInputsValues) => {
    if (
      !inputsValues.levelValue ||
      !inputsValues.targetValue ||
      !inputsValues.descriptionValue ||
      !numericHabitId
    ) {
      throw new Error('Habit args is missing');
    }

    try {
      setCreateErrors({ level: null });

      await createHabitLevel({
        level: inputsValues.levelValue,
        description: inputsValues.descriptionValue,
        target: inputsValues.targetValue,
        habitId: numericHabitId,
      }).unwrap();

      setHabitLevelFormState(null);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const errorData = error.data as { message: string };

        setCreateErrors({ level: errorData.message });
        console.error(errorData.message);
      }
    }
  };

  const editHabitLevelHandler = (inputsValues: DraftInputsValues, habitLevelId: number) => {
    if (
      !inputsValues.levelValue ||
      !inputsValues.targetValue ||
      !inputsValues.descriptionValue ||
      !numericHabitId
    ) {
      throw new Error('Habit args is missing');
    }

    updateHabitLevel({
      habitLevelId: habitLevelId,
      level: inputsValues.levelValue,
      description: inputsValues.descriptionValue,
      target: inputsValues.targetValue,
    });

    setHabitLevelFormState(null);
  };

  const updateHabitProgress = (updateArgs: UpdateHabitLevelArgs) => {
    updateHabitLevel(updateArgs);
  };

  const deleteHabitLevelHandler = (habitLevelId: number) => {
    deleteHabitLevel({ habitLevelId });
  };

  React.useEffect(() => {
    if (isValidHabitId && isSuccess && habitId) {
      localStorage.setItem('lastOpenedHabitId', `${habitId}`);
    }
  }, [isSuccess, habitId, isValidHabitId]);

  React.useEffect(() => {
    if (isError && 'status' in error && error.status === 404) {
      localStorage.removeItem('lastOpenedHabitId');
      navigate('/habits', { replace: true });
    }
  }, [isError, error, navigate]);

  if (!isValidHabitId) {
    return <Navigate to="/habits" replace />;
  }

  if (isSuccess) {
    return (
      <div className={s.detailRoot}>
        {data.map((habitLevel) => {
          const isCompleted = habitLevel.target <= habitLevel.progress;

          const isEdit =
            habitLevelFormState &&
            habitLevelFormState.type === 'edit' &&
            habitLevel.id === habitLevelFormState.id;

          return (
            <div className={clsx(s.habitLevel, isCompleted && s.habitLevelCompleted)}>
              {!isEdit ? (
                <React.Fragment>
                  <div className={s.upWrapper}>
                    <p className={s.habitLevelNumber}>lvl {habitLevel.level}</p>
                    <div className={s.controlButtons}>
                      <button
                        onClick={() => editHandler(habitLevel.id)}
                        className={s.controlButton}
                      >
                        <SquarePen className={s.controlButtonIcon} />
                      </button>
                      <button
                        onClick={() => deleteHabitLevelHandler(habitLevel.id)}
                        className={s.controlButton}
                      >
                        <Trash className={s.controlButtonIcon} />
                      </button>
                    </div>
                    {isCompleted && <CompletedTag className={s.comletedTag} />}
                  </div>
                  <p className={s.description}>{habitLevel.description}</p>
                  <div className={s.progressCircles}>
                    {Array.from({ length: habitLevel.target }, (_, i) => (
                      <div
                        key={`${habitLevel.id}-${i}`}
                        className={clsx(
                          s.progressCircle,
                          habitLevel.progress > i && s.completedCircle,
                        )}
                      ></div>
                    ))}
                  </div>
                  <div className={s.numProgressWrap}>
                    <p className={s.numProgress}>
                      {habitLevel.progress} / {habitLevel.target}
                    </p>
                  </div>
                  <div className={s.changeButtons}>
                    <button
                      onClick={() =>
                        updateHabitProgress({
                          habitLevelId: habitLevel.id,
                          progress: habitLevel.progress - 1,
                        })
                      }
                      className={s.changeProgress}
                    >
                      -1
                    </button>
                    <button
                      onClick={() =>
                        updateHabitProgress({
                          habitLevelId: habitLevel.id,
                          progress: habitLevel.progress + 1,
                        })
                      }
                      className={s.changeProgress}
                    >
                      +1
                    </button>
                  </div>{' '}
                </React.Fragment>
              ) : (
                <HabitLevelForm
                  cancelHandler={cancelHandler}
                  habitLevelHandler={(inputsValues) =>
                    editHabitLevelHandler(inputsValues, habitLevel.id)
                  }
                  initialValues={{
                    levelValue: habitLevel.level,
                    descriptionValue: habitLevel.description,
                    targetValue: habitLevel.target,
                  }}
                />
              )}
            </div>
          );
        })}
        <div className={clsx(s.habitLevel, s.habitCreateLevel)}>
          {habitLevelFormState && habitLevelFormState.type === 'create' ? (
            <HabitLevelForm
              cancelHandler={cancelHandler}
              habitLevelHandler={createHabitLevelHandler}
              errors={createErrors}
              setErrors={setCreateErrors}
            />
          ) : (
            <button onClick={createOpenHandler} className={s.habitCreateLevelButton}>
              <Plus />
            </button>
          )}
        </div>
      </div>
    );
  }
};
