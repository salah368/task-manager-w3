import { useState, useEffect } from 'react'
import Login from './Login'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:3000/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [token])

  function handleLogin(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setTasks([])
  }

  function addTask() {
    if (!text) return
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask])
        setText('')
      })
  }

  function markDone(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => t.id === updated.id ? updated : t))
      })
  }

  function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id))
      })
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Task Manager</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flex: 1, padding: '8px', fontSize: '14px' }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px' }}>
          Add
        </button>
      </div>

      {tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          marginBottom: '8px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          textDecoration: task.done ? 'line-through' : 'none',
          color: task.done ? '#999' : '#000'
        }}>
          <span style={{ flex: 1 }}>{task.text}</span>
          <button onClick={() => markDone(task.id)} disabled={task.done}>
            Done
          </button>
          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}

      {tasks.length === 0 && <p style={{ color: '#999' }}>No tasks yet. Add one above!</p>}
    </div>
  )
}

export default App