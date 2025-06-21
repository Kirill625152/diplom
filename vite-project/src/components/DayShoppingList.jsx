import styled from 'styled-components';
import { useState, useContext } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import { ThemeContext } from 'styled-components';

const ShoppingListContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.cardStyle.borderRadius};
  padding: 15px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: ${({ theme }) => theme.cardStyle.border};
  backdrop-filter: ${({ theme }) => theme.cardStyle.backdropFilter};
  height: fit-content;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 12px 0;
  font-size: 1rem;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  max-height: 200px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 0.85rem;
  cursor: pointer;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const ItemName = styled.span`
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
  color: ${({ completed, theme }) => 
    completed ? theme.colors.textSecondary : theme.colors.text};
  opacity: ${({ completed }) => completed ? 0.8 : 1};
`;

const ItemPrice = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.shoppingPrice};
  min-width: 60px;
  text-align: right;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  padding: 4px;
  margin-left: 6px;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  outline: none;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PriceInput = styled(Input)`
  max-width: 80px;
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DaySummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryValue = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.shoppingPrice};
`;

export const DayShoppingList = ({ day, items, onAddItem, onDeleteItem, onToggleItem }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const theme = useContext(ThemeContext);
  const darkMode = theme.name === 'dark';

  const dayTotal = items.reduce((sum, item) => sum + (item.completed ? item.price : 0), 0);
  const completedCount = items.filter(item => item.completed).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && price) {
      onAddItem({ name, price: parseFloat(price) });
      setName('');
      setPrice('');
    }
  };

  return (
    <ShoppingListContainer>
      <Title>
        {format(day, 'EEEE', { locale: ru })}
      </Title>
      
      <List>
        {items.map((item, index) => (
          <ListItem 
            key={index} 
            onClick={() => onToggleItem(index)}
          >
            <ItemInfo>
              {item.completed && <FiCheck size={14} color={darkMode ? '#bb86fc' : '#4a6fa5'} />}
              <ItemName completed={item.completed}>
                {item.name}
              </ItemName>
              <ItemPrice>{item.price.toFixed(2)} ₽</ItemPrice>
            </ItemInfo>
            <DeleteButton 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(index);
              }}
              aria-label="Удалить"
            >
              <FiTrash2 size={14} />
            </DeleteButton>
          </ListItem>
        ))}
      </List>

      <DaySummary>
        <SummaryLabel>
          {completedCount}/{items.length} куплено
        </SummaryLabel>
        <SummaryValue>
          {dayTotal.toFixed(2)} ₽
        </SummaryValue>
      </DaySummary>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название товара"
          required
        />
        <PriceInput
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Цена"
          min="0"
          step="0.01"
          required
        />
        <AddButton type="submit" aria-label="Добавить">
          <FiPlus size={16} />
        </AddButton>
      </Form>
    </ShoppingListContainer>
  );
};