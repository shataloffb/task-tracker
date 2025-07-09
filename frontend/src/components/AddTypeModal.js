import React, { useState } from 'react';

const COLORS = ['#f87171', '#facc15', '#4ade80', '#60a5fa', '#a78bfa'];

function AddTypeModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const add = () => {
    if (!title) return;
    onAdd({ id: Date.now().toString(), title, color });
    setTitle('');
    setColor(COLORS[0]);
    onClose();
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h3>Новый тип задачи</h3>
        <input
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <div style={{ display: 'flex', marginBottom: 10 }}>
          {COLORS.map(c => (
            <span
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: c,
                marginRight: 8,
                border: c === color ? '2px solid #000' : '2px solid transparent',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
        <button onClick={add}>Добавить</button>
      </div>
    </div>
  );
}

export default AddTypeModal;
