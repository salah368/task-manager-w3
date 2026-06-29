const request = require('supertest')

describe('Task Manager API', () => {
  it('should reject login with missing credentials', async () => {
    const response = await request('http://localhost:3000')
      .post('/login')
      .send({})

    expect(response.status).toBe(401)
  }, 20000)

  it('should reject creating a task without authentication', async () => {
    const response = await request('http://localhost:3000')
      .post('/tasks')
      .send({ text: 'Test task', priority: 'High' })

    expect(response.status).toBe(401)
  }, 20000)
})