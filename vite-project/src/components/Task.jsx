import styled from 'styled-components'
import { FaTrash, FaCheck, FaUndo } from 'react-icons/fa'

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary}20;
`

const TaskText = styled.span`
  flex: 1;
  margin-left: 10px;
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  color: ${({ completed, theme }) =>
    completed ? theme.colors.text + '80' : theme.colors.text};
`

const TaskButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme, action }) => {
      if (action === 'delete') return theme.colors.danger
      if (action === 'complete') return theme.colors.success
      return theme.colors.primary
    }};
  }
`

export const Task = ({ task, onToggle, onDelete }) => {
  return (
    <TaskItem>
      <TaskButton onClick={onToggle} action="complete">
        {task.completed ? <FaUndo /> : <FaCheck />}
      </TaskButton>
      <TaskText completed={task.completed}>{task.text}</TaskText>
      <TaskButton onClick={onDelete} action="delete">
        <FaTrash />
      </TaskButton>
    </TaskItem>
  )
}