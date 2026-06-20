import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../components/TodoInput';

describe('TodoInput', () => {
  it('ruft onAdd mit getrimmtem Titel auf wenn Enter gedrückt wird', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoInput onAdd={onAdd} />);
    const input = screen.getByPlaceholderText('Neue Aufgabe hinzufügen…');
    await userEvent.type(input, 'Einkaufen gehen{Enter}');
    expect(onAdd).toHaveBeenCalledWith('Einkaufen gehen');
  });

  it('ruft onAdd auf wenn der Hinzufügen-Button geklickt wird', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoInput onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText('Neue Aufgabe hinzufügen…'), 'Test');
    await userEvent.click(screen.getByLabelText('Todo hinzufügen'));
    expect(onAdd).toHaveBeenCalledWith('Test');
  });

  it('leert das Eingabefeld nach dem Hinzufügen', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<TodoInput onAdd={onAdd} />);
    const input = screen.getByPlaceholderText('Neue Aufgabe hinzufügen…');
    await userEvent.type(input, 'Test{Enter}');
    expect(input).toHaveValue('');
  });

  it('zeigt Hinweis bei leerem Titel', async () => {
    render(<TodoInput onAdd={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Todo hinzufügen'));
    expect(screen.getByText('Bitte gib einen Titel ein')).toBeInTheDocument();
  });

  it('erstellt kein Todo bei reinen Leerzeichen', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText('Neue Aufgabe hinzufügen…'), '   {Enter}');
    expect(onAdd).not.toHaveBeenCalled();
  });
});
