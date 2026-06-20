import type { Todo } from './types';

const BASE = '/todos';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Fehler beim Laden der Todos');
  return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Fehler beim Erstellen des Todos');
  return res.json();
}

export async function toggleTodo(id: string): Promise<Todo> {
  const res = await fetch(`${BASE}/${id}/toggle`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Fehler beim Aktualisieren des Todos');
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Fehler beim Löschen des Todos');
}
