const amqplib = require('amqplib');
const express = require('express');
const logger = require('./logger');
const { swaggerJSDocs } = require('./swagger');
require('dotenv').config();

const QUEUE = process.env.RABBITMQ_QUEUE || 'cartshop';
const MAX_MESSAGES = Number(process.env.MAX_MESSAGES || 50);
const PORT = process.env.PORT || 3000;

// In-memory data structure shared between the RabbitMQ consumer and the HTTP API
const store = [];

function buildConnectionUrl() {
  const user = process.env.RABBITMQ_USER || 'guest';
  const pass = process.env.RABBITMQ_PASS || 'guest';
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || 5672;
  const vhost = process.env.RABBITMQ_VHOST || '/';
  return `amqp://${user}:${pass}@${host}:${port}${vhost}`;
}

async function startConsumer() {
  const connection = await amqplib.connect(buildConnectionUrl(), 'heartbeat=60');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  channel.prefetch(10);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      const record = {
        ...data,
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 11),
        at: new Date().toISOString()
      };
      store.push(record);
      if (store.length > MAX_MESSAGES) store.shift();
      logger.info('message received', { id: record.id, user: data.usuario, items: data.carrito?.length });
      channel.ack(msg);
    } catch (err) {
      logger.error('failed to process message', err.message);
      channel.nack(msg, false, false);
    }
  });

  logger.info('Waiting for messages on queue', QUEUE);
}

function startHttp() {
  const app = express();
  app.use(express.json());

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check
   *     tags: [System]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                   example: true
   *                 stored:
   *                   type: integer
   *                   description: Number of messages currently stored in memory
   *                   example: 0
   */
  app.get('/health', (_, res) => res.json({ ok: true, stored: store.length }));

  /**
   * @swagger
   * /messages:
   *   get:
   *     summary: List all stored purchase messages
   *     tags: [Shipping]
   *     parameters:
   *       - in: query
   *         name: usuario
   *         schema:
   *           type: string
   *         description: Filter messages by username
   *     responses:
   *       200:
   *         description: Array of stored messages
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ShippingMessage'
   */
  app.get('/messages', (req, res) => {
    const { usuario } = req.query;
    if (usuario) {
      return res.json(store.filter((m) => m.usuario === usuario));
    }
    res.json(store);
  });

  /**
   * @swagger
   * /messages/{id}:
   *   get:
   *     summary: Get a stored message by ID
   *     tags: [Shipping]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The message ID
   *     responses:
   *       200:
   *         description: The stored message
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShippingMessage'
   *       404:
   *         description: Message not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: message not found
   */
  app.get('/messages/:id', (req, res) => {
    const found = store.find((m) => m.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'message not found' });
    res.json(found);
  });

  swaggerJSDocs(app);

  app.listen(PORT, () => logger.info('HTTP server listening on', PORT));
}

async function main() {
  logger.info('Starting backend-shipping...');
  startHttp();
  await startConsumer();
}

main().catch((err) => {
  logger.error('Fatal', err.message);
  process.exit(1);
});
