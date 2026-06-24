import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])   // stores the list of tasks
  const [text, setText] = useState('')      // stores what user types

  // runs once when the page loads — fetches all tasks from your API
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  // sends a POST request to create a new task
  function addTask() {
    if (!text) return
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask])  // add new task to the list
        setText('')                     // clear the input
      })
  }

  // sends a PATCH request to mark a task done
  function markDone(id) {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'PATCH' })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => t.id === updated.id ? updated : t))
      })
  }

  // sends a DELETE request to remove a task
  function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id))
      })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>

      {/* Add task input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '14px', borderRadius: '7px', border: 'solid', borderWidth: '1px' }}
        />
        <button onClick={addTask} style={{ padding: '10px 16px', border: 'solid', borderRadius: '7px', borderWidth: '1px' }}>
          Add
        </button>
      </div>

      {/* Task list */}
      {tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex',
          alignItems: 'start',
          gap: '8px',
          padding: '12px',
          marginBottom: '8px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          textDecoration: task.done ? 'line-through' : 'none',
          color: task.done ? 'lightblue' : 'white'
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