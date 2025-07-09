// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

// Компонент модального окна подтверждения завершения
function ConfirmModal({ task, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 20
    }}>
      <div style={{
        background: '#fff', padding: 20, borderRadius: 4, width: '80vw'
      }}>
        <p>Вы точно хотите завершить задачу «{task.title}»?</p>
        <button onClick={onConfirm} style={{ marginRight: 8 }}>Да</button>
        <button onClick={onCancel}>Нет</button>
      </div>
    </div>
  );
}

// Компонент модального окна настроек статусов
function SettingsModal({ statuses, setStatuses, onClose }) {
  const [local, setLocal] = useState(statuses);

  const updateTitle = (id, title) => {
    setLocal(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  };
  const addStatus = () => {
    setLocal(prev => [
      ...prev,
      { id: `status-${Date.now()}`, title: 'Новый статус' }
    ]);
  };
  const deleteStatus = id => {
    setLocal(prev => prev.filter(s => s.id !== id));
  };
  const save = () => {
    setStatuses(local);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 20
    }}>
      <div style={{
        background: '#fff', padding: 20, borderRadius: 4, width: '90vw', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3>Настройки статусов</h3>
        {local.map(s => (
          <div key={s.id} style={{ display: 'flex', marginBottom: 8 }}>
            <input
              value={s.title}
              onChange={e => updateTitle(s.id, e.target.value)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <button onClick={() => deleteStatus(s.id)}>Удалить</button>
          </div>
        ))}
        <button onClick={addStatus} style={{ marginTop: 8 }}>Добавить статус</button>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button onClick={save} style={{ marginRight: 8 }}>Сохранить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Динамические статусы
  const [statuses, setStatuses] = useState([
    { id: 'pending', title: 'Новые' },
    { id: 'in-progress', title: 'В работе' },
    { id: 'done', title: 'Сделано' },
  ]);

  // Состояния задач
  const [columns, setColumns] = useState({});
  const [completed, setCompleted] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Модальные окна и свайп
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmTask, setConfirmTask] = useState(null);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex(i => Math.min(i + 1, statuses.length - 1)),
    onSwipedRight: () => setActiveIndex(i => Math.max(i - 1, 0)),
    trackTouch: true,
  });

  // Загрузка задач при старте и после изменения статусов
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/tasks')
      .then(res => {
        const cols = {}, comp = {};
        statuses.forEach(s => {
          cols[s.id] = res.data.filter(t => t.status === s.id);
          comp[s.id] = []; // пустые completed-массивы
        });
        setColumns(cols);
        setCompleted(comp);
      })
      .catch(err => console.error(err));
  }, [statuses]);

  // Добавление новой задачи
  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    axios.post('http://127.0.0.1:5000/api/tasks', {
      title: newTitle,
      type: newType,
      dueDate: newDueDate || null,
      status: statuses[0].id,
    })
    .then(res => {
      setColumns(prev => ({
        ...prev,
        [statuses[0].id]: [res.data, ...(prev[statuses[0].id] || [])]
      }));
      setNewTitle(''); setNewType(''); setNewDueDate('');
    })
    .catch(err => console.error(err));
  };

  // Drag & Drop
  const onDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    const task = columns[source.droppableId].find(t => t._id === draggableId);
    axios.put(`http://127.0.0.1:5000/api/tasks/${draggableId}`, {
      ...task,
      status: destination.droppableId
    }).then(res => {
      setColumns(prev => {
        const src = [...prev[source.droppableId]];
        const dst = [...prev[destination.droppableId]];
        src.splice(source.index, 1);
        dst.unshift(res.data);
        return {
          ...prev,
          [source.droppableId]: src,
          [destination.droppableId]: dst
        };
      });
    }).catch(err => console.error(err));
  };

  // Инициация подтверждения завершения
  const handleComplete = task => setConfirmTask(task);

  // Подтвердить завершение
  const confirmYes = () => {
    const task = confirmTask;
    setConfirmTask(null);
    setColumns(prev => ({
      ...prev,
      [task.status]: prev[task.status].filter(t => t._id !== task._id)
    }));
    setCompleted(prev => ({
      ...prev,
      [task.status]: [...(prev[task.status]||[]), task]
    }));
  };
  const confirmNo = () => setConfirmTask(null);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      paddingTop: 50  // для кнопки настроек
    }}>
      {/* Кнопка настроек */}
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: 'absolute', top: 10, right: 10, zIndex: 10,
          padding: 8
        }}
      >⚙️</button>

      {/* Форма новой задачи */}
      <div style={{
        position: 'absolute', top: 50, left: 0, width: '100vw',
        padding: '8px', background: '#fafafa', zIndex: 5
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Заголовок"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Тип"
            value={newType}
            onChange={e => setNewType(e.target.value)}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={e => setNewDueDate(e.target.value)}
          />
          <button onClick={handleAddTask}>Добавить</button>
        </div>
      </div>

      {/* Swipeable канбан */}
      <div
        {...handlers}
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          width: '100vw',
          height: 'calc(100% - 100px)',
          overflow: 'hidden'
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{
            display: 'flex',
            transform: `translateX(-${activeIndex * 90}vw)`,
            transition: 'transform 0.3s'
          }}>
            {statuses.map((s, idx) => (
              <Droppable droppableId={s.id} key={s.id}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      width: '90vw',
                      marginRight: idx < statuses.length - 1 ? '10vw' : 0,
                      background: '#f4f5f7',
                      padding: 8,
                      borderRadius: 4,
                      minHeight: '100%'
                    }}
                  >
                    <h3>{s.title}</h3>
                    {/* Активные таски */}
                    {(columns[s.id] || []).map((task, i) => (
                      <Draggable key={task._id} draggableId={task._id} index={i}>
                        {prov => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onComplete={handleComplete}
                              isCompleted={false}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Выполненные */}
                    {completed[s.id]?.length > 0 && (
                      <>
                        <h4>Выполнено</h4>
                        {(completed[s.id] || []).map(task => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            isCompleted={true}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Модалки */}
      {showSettings && (
        <SettingsModal
          statuses={statuses}
          setStatuses={setStatuses}
          onClose={() => setShowSettings(false)}
        />
      )}
      {confirmTask && (
        <ConfirmModal
          task={confirmTask}
          onConfirm={confirmYes}
          onCancel={confirmNo}
        />
      )}
    </div>
  );
}

export default App;
