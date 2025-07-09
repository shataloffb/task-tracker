// frontend/src/TaskCard.js

import React from 'react';

export default function TaskCard({ task, onComplete, isCompleted }) {
  return (
    <div style={{
      position: 'relative',
      border: '1px solid #ccc',
      borderRadius: 4,
      padding: 12,
      marginBottom: 12,
      background: 'white',
      minHeight: 80,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Заголовок и дедлайн */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6
      }}>
        <strong style={{ 
          fontSize: 16, 
          color: isCompleted ? '#888' : '#000' 
        }}>
          {task.title}
        </strong>
        <span style={{ 
          fontSize: 14, 
          color: isCompleted ? '#aaa' : '#888' 
        }}>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : '—'}
        </span>
      </div>

      {/* Тип задачи */}
      <div style={{
        fontSize: 14,
        color: isCompleted ? '#aaa' : '#555',
        marginBottom: isCompleted ? 4 : 28
      }}>
        {task.type || 'Без типа'}
      </div>

      {/* Кнопка «Завершить» */}
      {!isCompleted && (
        <button
          onClick={() => onComplete(task)}
          style={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            padding: '4px 8px',
            fontSize: 13
          }}
        >
          Завершить
        </button>
      )}
    </div>
  );
}
