import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from '../components/TodoList';
import type { Todo } from '../types';

const todos: Todo[] = [
  { id: '1', title: 'Offen', done: false, created: '2024-01-02T00:00:00Z' },
  { id: '2', title: 'Erledigt', done: true, created: '2024-01-01T00:00:00Z' },
];

describe('TodoList', () => {
  it('zeigt leere-Liste-Hinweis wenn keine Todos vorhanden', () => {
    render(<TodoList todos={[]} filter="Alle" onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Noch keine Aufgaben vorhanden')).toBeInTheDocument();
  });

  it('filtert offene Todos', () => {
    render(<TodoList todos={todos} filter="Offen" onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Offen')).toBeInTheDocument();
    expect(screen.queryByText('Erledigt')).not.toBeInTheDocument();
  });

  it('filtert erledigte Todos', () => {
    render(<TodoList todos={todos} filter="Erledigt" onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Erledigt')).toBeInTheDocument();
    expect(screen.queryByText('Offen')).not.toBeInTheDocument();
  });

  it('zeigt alle Todos wenn Filter "Alle"', () => {
    render(<TodoList todos={todos} filter="Alle" onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Offen')).toBeInTheDocument();
    expect(screen.getByText('Erledigt')).toBeInTheDocument();
  });
});
