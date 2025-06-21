import { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { WeekHeader } from './components/WeekHeader';
import { DayCard } from './components/DayCard';
import { HabitsTracker } from './components/HabitsTracker';
import { DayShoppingList } from './components/DayShoppingList';
import { FiSun, FiMoon } from 'react-icons/fi';

// Темы
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#4a6fa5',
    secondary: '#6c8fc7',
    background: '#f5f7fa',
    backgroundGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    text: '#2d3436',
    textSecondary: '#636e72',
    border: 'rgba(74, 111, 165, 0.2)',
    success: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
    icon: '#4a6fa5',
    habitChecked: '#4a6fa5',
    habitUnchecked: '#dfe6e9',
    shoppingPrice: '#2ecc71',
    statsBg: '#ffffff',
  },
  shadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
    container: '0 8px 32px rgba(31, 38, 135, 0.15)',
  },
  cardStyle: {
    borderRadius: '12px',
    border: 'none',
    backdropFilter: 'none',
  }
};

const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#bb86fc',
    secondary: '#3700b3',
    background: '#121212',
    backgroundGradient: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)',
    cardBg: 'rgba(30, 30, 30, 0.85)',
    text: '#e1e1e1',
    textSecondary: '#a0a0a0',
    border: 'rgba(187, 134, 252, 0.2)',
    success: '#03dac6',
    danger: '#cf6679',
    warning: '#ffa726',
    icon: '#bb86fc',
    habitChecked: '#bb86fc',
    habitUnchecked: '#333333',
    shoppingPrice: '#03dac6',
    statsBg: 'rgba(40, 40, 40, 0.9)',
  },
  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.3)',
    container: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  cardStyle: {
    borderRadius: '16px',
    border: '1px solid rgba(187, 134, 252, 0.1)',
    backdropFilter: 'blur(10px)',
  }
};

// Глобальные стили
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: 
      background-color 0.4s ease,
      color 0.4s ease,
      border-color 0.4s ease,
      box-shadow 0.4s ease,
      transform 0.2s ease,
      opacity 0.4s ease;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  #root {
    min-height: 100vh;
    padding: 10px;
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }
`;

// Стилизованные компоненты
const AppContainer = styled.div`
  max-width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.backgroundGradient};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.container};
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  padding: 10px 0;
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  font-weight: 600;
  text-shadow: ${({ theme }) => 
    theme.name === 'dark' ? '0 0 8px rgba(187, 134, 252, 0.3)' : 'none'};
`;

const ThemeToggle = styled.button`
  background: ${({ theme }) => theme.colors.cardBg};
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  &:hover {
    transform: scale(1.1);
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  flex: 1;
  overflow: hidden;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 320px;
  }
`;

const WeekWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DaysContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow: hidden;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  overflow-y: auto;
  padding: 5px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const StatsPanel = styled.div`
  background: ${({ theme }) => theme.colors.statsBg};
  border-radius: ${({ theme }) => theme.cardStyle.borderRadius};
  padding: 15px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: ${({ theme }) => theme.cardStyle.border};
  backdrop-filter: ${({ theme }) => theme.cardStyle.backdropFilter};
  margin-top: 15px;
`;

const StatsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: 10px;
  padding: 12px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.shoppingPrice};
`;

const StatDay = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('weekly-planner-tasks');
    return saved ? JSON.parse(saved) : {};
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('weekly-planner-habits');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Пить воду', days: {} },
      { id: 2, name: 'Спорт', days: {} },
      { id: 3, name: 'Чтение', days: {} }
    ];
  });

  const [shoppingLists, setShoppingLists] = useState(() => {
    const saved = localStorage.getItem('weekly-shopping-lists');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('weekly-planner-tasks', JSON.stringify(tasks));
    localStorage.setItem('weekly-planner-habits', JSON.stringify(habits));
    localStorage.setItem('weekly-shopping-lists', JSON.stringify(shoppingLists));
  }, [darkMode, tasks, habits, shoppingLists]);

  const weekStart = startOfWeek(currentDate, { locale: ru });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  // Функции для задач
  const addTask = (day, taskText) => {
    if (!taskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    const dateKey = format(day, 'yyyy-MM-dd');
    setTasks(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask],
    }));
  };

  const toggleTask = (day, taskId) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const deleteTask = (day, taskId) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(task => task.id !== taskId),
    }));
  };

  // Функции для привычек
  const toggleHabit = (habitId, day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              days: { 
                ...habit.days, 
                [dateKey]: !habit.days[dateKey] 
              } 
            } 
          : habit
      )
    );
  };

  const addHabit = (name) => {
    if (!name.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      name,
      days: {}
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  // Функции для списка покупок
  const addShoppingItem = (day, item) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    setShoppingLists(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { ...item, completed: false }],
    }));
  };

  const deleteShoppingItem = (day, index) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    setShoppingLists(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((_, i) => i !== index),
    }));
  };

  const toggleShoppingItem = (day, index) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    setShoppingLists(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map((item, i) => 
        i === index ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Навигация по неделям
  const navigateWeek = direction => {
    setCurrentDate(addDays(currentDate, direction * 7));
  };

  // Переключение темы
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Расчет статистики
  const stats = useMemo(() => {
    const result = {
      totalSpent: 0,
      days: {},
      mostExpensiveDay: { date: null, amount: 0 },
      cheapestDay: { date: null, amount: Infinity },
      averagePerDay: 0,
      completedItems: 0,
      totalItems: 0
    };

    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayItems = shoppingLists[dateKey] || [];
      const dayTotal = dayItems.reduce((sum, item) => sum + (item.completed ? item.price : 0), 0);
      const dayCompleted = dayItems.filter(item => item.completed).length;
      
      result.days[dateKey] = {
        total: dayTotal,
        completed: dayCompleted,
        totalItems: dayItems.length
      };
      
      result.totalSpent += dayTotal;
      result.completedItems += dayCompleted;
      result.totalItems += dayItems.length;

      if (dayTotal > result.mostExpensiveDay.amount) {
        result.mostExpensiveDay = {
          date: day,
          amount: dayTotal
        };
      }

      if (dayTotal < result.cheapestDay.amount && dayItems.length > 0) {
        result.cheapestDay = {
          date: day,
          amount: dayTotal
        };
      }
    });

    result.averagePerDay = result.totalSpent / days.length;
    result.completionRate = result.totalItems > 0 
      ? (result.completedItems / result.totalItems) * 100 
      : 0;

    return result;
  }, [shoppingLists, days]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppContainer>
        <TitleWrapper>
          <Title>Еженедельный Планировщик</Title>
          <ThemeToggle onClick={toggleTheme} aria-label="Переключить тему">
            {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
          </ThemeToggle>
        </TitleWrapper>
        
        <WeekHeader currentDate={currentDate} onNavigate={navigateWeek} />
        
        <MainContent>
          <WeekWrapper>
            <DaysContainer>
              <ResponsiveGrid>
                {days.map(day => (
                  <DayCard
                    key={day}
                    day={day}
                    tasks={tasks[format(day, 'yyyy-MM-dd')] || []}
                    habits={habits}
                    onAddTask={addTask}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onToggleHabit={toggleHabit}
                  />
                ))}
              </ResponsiveGrid>

              <ResponsiveGrid>
                {days.map(day => (
                  <DayShoppingList
                    key={`shopping-${day}`}
                    day={day}
                    items={shoppingLists[format(day, 'yyyy-MM-dd')] || []}
                    onAddItem={(item) => addShoppingItem(day, item)}
                    onDeleteItem={(index) => deleteShoppingItem(day, index)}
                    onToggleItem={(index) => toggleShoppingItem(day, index)}
                  />
                ))}
              </ResponsiveGrid>

              <StatsPanel>
                <StatsTitle>📊 Статистика расходов</StatsTitle>
                <StatsGrid>
                  <StatCard>
                    <StatLabel>Всего потрачено</StatLabel>
                    <StatValue>{stats.totalSpent.toFixed(2)} ₽</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Средний расход</StatLabel>
                    <StatValue>{stats.averagePerDay.toFixed(2)} ₽</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Самый дорогой день</StatLabel>
                    <StatValue>{stats.mostExpensiveDay.amount.toFixed(2)} ₽</StatValue>
                    <StatDay>
                      {stats.mostExpensiveDay.date 
                        ? format(stats.mostExpensiveDay.date, 'EEEE')
                        : '—'}
                    </StatDay>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Самый экономный день</StatLabel>
                    <StatValue>{stats.cheapestDay.amount !== Infinity 
                      ? stats.cheapestDay.amount.toFixed(2) 
                      : '0'} ₽</StatValue>
                    <StatDay>
                      {stats.cheapestDay.date 
                        ? format(stats.cheapestDay.date, 'EEEE')
                        : '—'}
                    </StatDay>
                  </StatCard>
                </StatsGrid>
              </StatsPanel>
            </DaysContainer>
          </WeekWrapper>

          <HabitsTracker 
            habits={habits} 
            onAddHabit={addHabit} 
            onDeleteHabit={deleteHabit} 
          />
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}