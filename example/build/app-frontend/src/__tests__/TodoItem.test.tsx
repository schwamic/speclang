import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../components/TodoItem';
import type { Todo } from '../types';

const openTodo: Todo = { id: '1', title: 'Test Todo', done: false, created: '2024-01-01T00:00:00Z' };
const doneTodo: Todo = { ...openTodo, done: true };

describe('TodoItem', () => {
  it('zeigt den Titel an', () => {
    render(<TodoItem todo={openTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('zeigt erledigte Todos durchgestrichen', () => {
    render(<TodoItem todo={doneTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Todo')).toHaveStyle('text-decoration: line-through');
  });

  it('ruft onToggle auf bei Klick auf Checkbox', async () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={openTodo} onToggle={onToggle} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Todo "Test Todo" abhaken'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('ruft onDelete auf bei Klick auf Löschen', async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={openTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByLabelText('Todo "Test Todo" löschen'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
