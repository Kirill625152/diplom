import styled from 'styled-components';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

const TrackerContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.cardStyle.borderRadius};
  padding: 15px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: ${({ theme }) => theme.cardStyle.border};
  backdrop-filter: ${({ theme }) => theme.cardStyle.backdropFilter};
  height: 100%;
  overflow-y: auto;
`;

const TrackerHeader = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const HabitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: calc(100% - 100px);
  overflow-y: auto;
`;

const HabitItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HabitName = styled.span`
  flex: 1;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.name === 'dark' ? '#ff8a80' : '#c0392b'};
  }
`;

const AddHabitForm = styled.form`
  display: flex;
  margin-top: 15px;
`;

const HabitInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px 0 0 6px;
  outline: none;
  font-size: 0.9rem;
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

export const HabitsTracker = ({ habits, onAddHabit, onDeleteHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName);
      setNewHabitName('');
    }
  };

  return (
    <TrackerContainer>
      <TrackerHeader>
        Трекер привычек
      </TrackerHeader>
      
      <HabitsList>
        {habits.map(habit => (
          <HabitItem key={habit.id}>
            <HabitName>{habit.name}</HabitName>
            <DeleteButton 
              onClick={() => onDeleteHabit(habit.id)}
              aria-label="Удалить привычку"
            >
              <FiTrash2 size={16} />
            </DeleteButton>
          </HabitItem>
        ))}
      </HabitsList>

      <AddHabitForm onSubmit={handleSubmit}>
        <HabitInput
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Новая привычка"
          aria-label="Название новой привычки"
        />
        <AddButton type="submit" aria-label="Добавить привычку">
          <FiPlus size={16} />
        </AddButton>
      </AddHabitForm>
    </TrackerContainer>
  );
};