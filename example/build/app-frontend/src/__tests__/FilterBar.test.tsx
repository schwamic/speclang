import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../components/FilterBar';

describe('FilterBar', () => {
  it('zeigt alle drei Filter-Optionen', () => {
    render(<FilterBar value="Alle" onChange={vi.fn()} />);
    expect(screen.getByText('Alle')).toBeInTheDocument();
    expect(screen.getByText('Offen')).toBeInTheDocument();
    expect(screen.getByText('Erledigt')).toBeInTheDocument();
  });

  it('ruft onChange auf wenn Filter gewählt wird', async () => {
    const onChange = vi.fn();
    render(<FilterBar value="Alle" onChange={onChange} />);
    await userEvent.click(screen.getByText('Offen'));
    expect(onChange).toHaveBeenCalledWith('Offen');
  });
});
