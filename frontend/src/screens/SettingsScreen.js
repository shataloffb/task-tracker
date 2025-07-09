import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import Badge from '../components/Badge';
import ToggleSwitch from '../components/ToggleSwitch';
import AddTypeModal from '../components/AddTypeModal';
import BottomTabs from '../navigation/BottomTabs';

// fake services
const initialTypes = [
  { id: '1', title: 'Bug', color: '#f87171' },
  { id: '2', title: 'Feature', color: '#60a5fa' }
];
const settingsDefault = { showClosed: false, showDescription: true };

function SettingsScreen({ navigate }) {
  const [taskTypes, setTaskTypes] = useState([]);
  const [settings, setSettings] = useState(settingsDefault);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // emulate getTaskTypes and getSettings
    setTaskTypes(initialTypes);
    setSettings(settingsDefault);
  }, []);

  const updateSettings = newVals => setSettings(prev => ({ ...prev, ...newVals }));

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <FaArrowLeft onClick={() => navigate('kanban')} style={{ cursor: 'pointer', marginRight: 8 }} />
        <h2 style={{ margin: 0 }}>Настройки</h2>
      </div>

      <h3>Типы задач</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {taskTypes.map(t => (
            <Badge key={t.id} title={t.title} color={t.color} />
          ))}
        </div>
        <FaPlus onClick={() => setModalVisible(true)} style={{ marginLeft: 8, cursor: 'pointer' }} />
      </div>

      <AddTypeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={type => setTaskTypes([...taskTypes, type])}
      />

      <ToggleSwitch
        label="Показывать завершённые задачи"
        value={settings.showClosed}
        onChange={v => updateSettings({ showClosed: v })}
      />
      <ToggleSwitch
        label="Показывать описание задач в канбане"
        value={settings.showDescription}
        onChange={v => updateSettings({ showDescription: v })}
      />

      <h3 style={{ marginTop: 20 }}>Управление учётной записью</h3>
      <button style={{ display: 'block', marginBottom: 8 }} onClick={() => {}}>Сбросить задачи</button>
      <button style={{ display: 'block', marginBottom: 8 }} onClick={() => {}}>Сменить пароль</button>
      <button style={{ display: 'block', marginBottom: 8 }} onClick={() => {}}>Выйти</button>

      <BottomTabs current="settings" navigate={navigate} />
    </div>
  );
}

export default SettingsScreen;
