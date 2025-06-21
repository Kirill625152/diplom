import { format, addDays } from 'date-fns'
import { ru } from 'date-fns/locale'
import styled from 'styled-components'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 8px;
`

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const WeekRange = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`

export const WeekHeader = ({ currentDate, onNavigate }) => {
  const weekStart = format(currentDate, 'd MMMM yyyy', { locale: ru })
  const weekEnd = format(addDays(currentDate, 6), 'd MMMM yyyy', { locale: ru })

  return (
    <Header>
      <NavButton onClick={() => onNavigate(-1)}>
        <FaChevronLeft />
      </NavButton>
      <WeekRange>
        {weekStart} - {weekEnd}
      </WeekRange>
      <NavButton onClick={() => onNavigate(1)}>
        <FaChevronRight />
      </NavButton>
    </Header>
  )
}