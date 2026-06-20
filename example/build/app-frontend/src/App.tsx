import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { fetchTodos, createTodo, toggleTodo, deleteTodo } from './api';
import type { Todo, Filter } from './types';

const FILTER_KEY = 'to-done:filter';

function loadFilter(): Filter {
  const stored = localStorage.getItem(FILTER_KEY);
  return (stored as Filter) ?? 'Alle';
}

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(loadFilter);

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleFilterChange = useCallback((f: Filter) => {
    setFilter(f);
    localStorage.setItem(FILTER_KEY, f);
  }, []);

  const handleAdd = useCallback(async (title: string) => {
    const todo = await createTodo(title);
    setTodos(prev => [todo, ...prev]);
  }, []);

  const handleToggle = useCallback(async (id: string) => {
    const updated = await toggleTodo(id);
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} mb={1} color="primary">
        To Done
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Die einfachste Todo-App der Welt
      </Typography>

      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box px={3} pt={3} pb={1}>
          <TodoInput onAdd={handleAdd} />
        </Box>

        <Box px={3} py={1} display="flex" justifyContent="flex-end">
          <FilterBar value={filter} onChange={handleFilterChange} />
        </Box>

        <Divider />

        <Box px={1} py={1}>
          <TodoList todos={todos} filter={filter} onToggle={handleToggle} onDelete={handleDelete} />
        </Box>
      </Paper>
    </Container>
  );
}
