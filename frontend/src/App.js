import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
         .then(res => setTasks(res.data));
  }, []);

  const addTask = () => {
    axios.post('http://localhost:5000/api/tasks', { title })
         .then(res => setTasks([res.data, ...tasks]));
    setTitle('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Мой Task Tracker</h1>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Новая задача"
      />
      <button onClick={addTask}>Добавить</button>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>{t.title} — {t.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
