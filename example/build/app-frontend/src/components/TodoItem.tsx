import { ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          aria-label={`Todo "${todo.title}" löschen`}
          onClick={() => onDelete(todo.id)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      }
      sx={{ pr: 6 }}
    >
      <Checkbox
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        inputProps={{ 'aria-label': `Todo "${todo.title}" abhaken` }}
        color="primary"
      />
      <ListItemText
        primary={todo.title}
        sx={{
          textDecoration: todo.done ? 'line-through' : 'none',
          color: todo.done ? 'text.disabled' : 'text.primary',
        }}
      />
    </ListItem>
  );
}
