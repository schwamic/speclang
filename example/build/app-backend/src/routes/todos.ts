import type { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db.js';
import type { Todo, CreateTodoBody } from '../types.js';

export async function todoRoutes(app: FastifyInstance) {
  app.get<{ Reply: Todo[] }>('/todos', async () => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM todos ORDER BY created DESC').all() as Array<{
      id: string; title: string; done: number; created: string;
    }>;
    return rows.map(r => ({ ...r, done: r.done === 1 }));
  });

  app.post<{ Body: CreateTodoBody; Reply: Todo }>('/todos', {
    schema: {
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 280 }
        }
      }
    }
  }, async (req, reply) => {
    const title = req.body.title.trim();
    if (!title) {
      return reply.status(400).send({ error: 'Titel darf nicht leer sein' } as never);
    }

    const todo: Todo = {
      id: uuidv4(),
      title,
      done: false,
      created: new Date().toISOString(),
    };

    getDb().prepare('INSERT INTO todos (id, title, done, created) VALUES (?, ?, ?, ?)')
      .run(todo.id, todo.title, 0, todo.created);

    return reply.status(201).send(todo);
  });

  app.patch<{ Params: { id: string }; Reply: Todo }>('/todos/:id/toggle', async (req, reply) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as {
      id: string; title: string; done: number; created: string;
    } | undefined;

    if (!row) return reply.status(404).send({ error: 'Todo nicht gefunden' } as never);

    const newDone = row.done === 1 ? 0 : 1;
    db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(newDone, row.id);

    return { ...row, done: newDone === 1 };
  });

  app.delete<{ Params: { id: string } }>('/todos/:id', async (req, reply) => {
    const result = getDb().prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
    if ((result as { changes: number }).changes === 0) {
      return reply.status(404).send({ error: 'Todo nicht gefunden' } as never);
    }
    return reply.status(204).send();
  });
}
