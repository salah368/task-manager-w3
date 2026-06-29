const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('./middleware/auth')

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors')

const morgan = require('morgan')
const logger = require('./logger')

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}))

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    })
    res.status(201).json({ id: user.id, email: user.email })
  } catch {
    res.status(400).json({ error: 'Email already in use' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

app.get('/tasks', authenticate, async (req, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.userId } })
  res.json(tasks)
})

app.post('/tasks', authenticate, async (req, res) => {
  const { text, priority } = req.body
  if (!text) return res.status(400).json({ error: 'Text is required' })

  const task = await prisma.task.create({
    data: {
      text,
      priority: priority || 'Medium',
      userId: req.userId
    }
  })
  res.status(201).json(task)
})

app.patch('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { done: true }
  })
  res.json(task)
})

app.delete('/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params
  await prisma.task.delete({ where: { id: Number(id) } })
  res.json({ message: 'Task deleted' })
})

app.get('/tasks/completed', authenticate, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId, done: true }
  })
  res.json(tasks)
})

// Catch-all error handler — must be the LAST app.use()
app.use((err, req, res, next) => {
  logger.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

app.listen(3000, () => {
  logger.info('Server running on http://localhost:3000')
})