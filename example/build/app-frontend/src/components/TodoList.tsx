import { List, Typography, Box } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { TodoItem } from './TodoItem';
import type { Todo, Filter } from '../types';

interface Props {
  todos: Todo[];
  filter: Filter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete }: Props) {
  const visible = todos.filter(t => {
    if (filter === 'Offen') return !t.done;
    if (filter === 'Erledigt') return t.done;
    return true;
  });

  if (visible.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={6} color="text.disabled">
        <ChecklistIcon sx={{ fontSize: 48 }} />
        <Typography variant="body1">
          {filter === 'Alle'
            ? 'Noch keine Aufgaben vorhanden'
            : filter === 'Offen'
            ? 'Keine offenen Aufgaben'
            : 'Keine erledigten Aufgaben'}
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {visible.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </List>
  );
}
