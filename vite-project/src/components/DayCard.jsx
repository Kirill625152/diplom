import { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styled from 'styled-components';
import { Task } from './Task';
import { FiPlus } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.cardStyle.borderRadius};
  padding: 15px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: ${({ theme }) => theme.cardStyle.border};
  backdrop-filter: ${({ theme }) => theme.cardStyle.backdropFilter};
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-height: 200px;
`;

const DayTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TaskList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
  max-height: 150px;
  margin-bottom: 10px;
`;

const AddTaskForm = styled.form`
  display: flex;
  margin-top: auto;
`;

const TaskInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px 0 0 6px;
  outline: none;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0 12px;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const HabitsContainer = styled.div`
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const HabitsTitle = styled.h4`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 8px 0;
`;

const HabitItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const HabitName = styled.span`
  font-size: 0.8rem;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const HabitCheckbox = styled.button`
  width: 18px;
  height: 18px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  background: ${({ checked, theme }) => 
    checked ? theme.colors.habitChecked : theme.colors.habitUnchecked};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const DayCard = ({ 
  day, 
  tasks, 
  habits, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onToggleHabit 
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const dateKey = format(day, 'yyyy-MM-dd');

  const handleSubmit = e => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(day, newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <Card>
      <DayTitle>
        {format(day, 'EEEE', { locale: ru })}
        <br />
        {format(day, 'd MMMM', { locale: ru })}
      </DayTitle>

      <TaskList>
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(day, task.id)}
            onDelete={() => onDeleteTask(day, task.id)}
          />
        ))}
      </TaskList>

      <AddTaskForm onSubmit={handleSubmit}>
        <TaskInput
          type="text"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          placeholder="Добавить задачу..."
        />
        <AddButton type="submit">
          <FiPlus size={14} />
        </AddButton>
      </AddTaskForm>

      {habits?.length > 0 && (
        <HabitsContainer>
          <HabitsTitle>Привычки:</HabitsTitle>
          {habits.map(habit => {
            const isChecked = habit.days[dateKey];
            return (
              <HabitItem key={habit.id}>
                <HabitCheckbox 
                  checked={isChecked}
                  onClick={() => onToggleHabit(habit.id, day)}
                >
                  {isChecked && <FaCheck size={10} color="white" />}
                </HabitCheckbox>
                <HabitName>{habit.name}</HabitName>
              </HabitItem>
            );
          })}
        </HabitsContainer>
      )}
    </Card>
  );
};