import Fastify from 'fastify';
import cors from '@fastify/cors';
import { todoRoutes } from './routes/todos.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: 'http://localhost:5173' });
await app.register(todoRoutes);

await app.listen({ port: 3000, host: '0.0.0.0' });
