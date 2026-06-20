import { useState, useRef } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  onAdd: (title: string) => Promise<void>;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    await onAdd(trimmed);
    setValue('');
    setError(false);
    inputRef.current?.focus();
  }

  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      value={value}
      onChange={e => { setValue(e.target.value); if (error) setError(false); }}
      onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
      placeholder="Neue Aufgabe hinzufügen…"
      error={error}
      helperText={error ? 'Bitte gib einen Titel ein' : ' '}
      inputProps={{ maxLength: 280 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSubmit} edge="end" aria-label="Todo hinzufügen" color="primary">
              <AddIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
