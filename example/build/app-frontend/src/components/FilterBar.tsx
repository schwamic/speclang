import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { Filter } from '../types';

interface Props {
  value: Filter;
  onChange: (filter: Filter) => void;
}

const FILTERS: Filter[] = ['Alle', 'Offen', 'Erledigt'];

export function FilterBar({ value, onChange }: Props) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, next) => { if (next) onChange(next as Filter); }}
      aria-label="Todo-Filter"
      size="small"
    >
      {FILTERS.map(f => (
        <ToggleButton key={f} value={f} aria-label={`Filter: ${f}`}>
          {f}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
