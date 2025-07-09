import React, { useState } from 'react';
import KanbanScreen from './screens/KanbanScreen';
import SettingsScreen from './screens/SettingsScreen';

function App() {
  const [screen, setScreen] = useState('kanban');

  const navigate = scr => setScreen(scr);

  if (screen === 'settings') {
    return <SettingsScreen navigate={navigate} />;
  }
  return <KanbanScreen navigate={navigate} />;
}

export default App;
