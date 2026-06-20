import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import { v4 as uuidv4 } from 'uuid';
import Fastify from 'fastify';
import cors from '@fastify/cors';

let db: DatabaseSync;

vi.mock('../db.js', () => ({ getDb: () => db }));

const { todoRoutes } = await import('../routes/todos.js');

async function buildApp() {
  const app = Fastify();
  await app.register(cors);
  await app.register(todoRoutes);
  return app;
}

beforeAll(() => {
  db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE todos (
      id      TEXT PRIMARY KEY,
      title   TEXT NOT NULL,
      done    INTEGER NOT NULL DEFAULT 0,
      created TEXT NOT NULL
    )
  `);
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.exec('DELETE FROM todos');
});

describe('GET /todos', () => {
  it('gibt leere Liste zurück wenn keine Todos vorhanden', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/todos' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('gibt Todos in absteigender Reihenfolge zurück', async () => {
    db.prepare('INSERT INTO todos VALUES (?, ?, ?, ?)').run(uuidv4(), 'Erstes', 0, '2024-01-01T00:00:00.000Z');
    db.prepare('INSERT INTO todos VALUES (?, ?, ?, ?)').run(uuidv4(), 'Zweites', 0, '2024-01-02T00:00:00.000Z');
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/todos' });
    const todos = res.json<{ title: string }[]>();
    expect(todos[0].title).toBe('Zweites');
    expect(todos[1].title).toBe('Erstes');
  });
});

describe('POST /todos', () => {
  it('erstellt ein neues Todo', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST', url: '/todos',
      payload: { title: 'Einkaufen gehen' },
    });
    expect(res.statusCode).toBe(201);
    const todo = res.json<{ title: string; done: boolean }>();
    expect(todo.title).toBe('Einkaufen gehen');
    expect(todo.done).toBe(false);
    expect(todo.id).toBeDefined();
  });

  it('lehnt leeren Titel ab', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST', url: '/todos',
      payload: { title: '   ' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('lehnt Titel über 280 Zeichen ab', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST', url: '/todos',
      payload: { title: 'a'.repeat(281) },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('PATCH /todos/:id/toggle', () => {
  it('markiert offenes Todo als erledigt', async () => {
    const id = uuidv4();
    db.prepare('INSERT INTO todos VALUES (?, ?, ?, ?)').run(id, 'Test', 0, new Date().toISOString());
    const app = await buildApp();
    const res = await app.inject({ method: 'PATCH', url: `/todos/${id}/toggle` });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ done: boolean }>().done).toBe(true);
  });

  it('macht erledigtes Todo wieder offen', async () => {
    const id = uuidv4();
    db.prepare('INSERT INTO todos VALUES (?, ?, ?, ?)').run(id, 'Test', 1, new Date().toISOString());
    const app = await buildApp();
    const res = await app.inject({ method: 'PATCH', url: `/todos/${id}/toggle` });
    expect(res.json<{ done: boolean }>().done).toBe(false);
  });
});

describe('DELETE /todos/:id', () => {
  it('löscht ein Todo', async () => {
    const id = uuidv4();
    db.prepare('INSERT INTO todos VALUES (?, ?, ?, ?)').run(id, 'Test', 0, new Date().toISOString());
    const app = await buildApp();
    const res = await app.inject({ method: 'DELETE', url: `/todos/${id}` });
    expect(res.statusCode).toBe(204);
    const check = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    expect(check).toBeUndefined();
  });

  it('gibt 404 zurück wenn Todo nicht existiert', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'DELETE', url: `/todos/${uuidv4()}` });
    expect(res.statusCode).toBe(404);
  });
});
