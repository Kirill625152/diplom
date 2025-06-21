import styled from 'styled-components';
import { useState } from 'react';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';

const ShoppingListContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  color: #4a6fa5;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(74, 111, 165, 0.1);
  cursor: pointer;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const ItemName = styled.span`
  text-decoration: ${({ completed }) => completed ? 'line-through' : 'none'};
  color: ${({ completed }) => completed ? '#999' : '#333'};
  flex: 1;
`;

const ItemPrice = styled.span`
  font-weight: bold;
  color: #2ecc71;
  min-width: 60px;
  text-align: right;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const PriceInput = styled(Input)`
  max-width: 80px;
`;

const AddButton = styled.button`
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ShoppingList = ({ items, onAddItem, onDeleteItem, onToggleItem }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

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
        <FiCheck size={18} /> Список покупок
      </Title>
      
      <List>
        {items.map((item, index) => (
          <ListItem 
            key={index} 
            onClick={() => onToggleItem(index)}
          >
            <ItemInfo>
              <ItemName completed={item.completed}>
                {item.name}
              </ItemName>
              <ItemPrice>{item.price} ₽</ItemPrice>
            </ItemInfo>
            <DeleteButton 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(index);
              }}
              aria-label="Удалить"
            >
              <FiTrash2 size={16} />
            </DeleteButton>
          </ListItem>
        ))}
      </List>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название"
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
          <FiPlus size={18} />
        </AddButton>
      </Form>
    </ShoppingListContainer>
  );
};