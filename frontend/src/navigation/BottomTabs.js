import React from 'react';
import { FaTasks, FaCog } from 'react-icons/fa';

function BottomTabs({ current, navigate }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: 10, borderTop: '1px solid #ccc', backgroundColor: '#fff' }}>
      <div onClick={() => navigate('kanban')} style={{ textAlign: 'center', color: current === 'kanban' ? '#000' : '#777' }}>
        <FaTasks />
        <div>Kanban</div>
      </div>
      <div onClick={() => navigate('settings')} style={{ textAlign: 'center', color: current === 'settings' ? '#000' : '#777' }}>
        <FaCog />
        <div>Настройки</div>
      </div>
    </div>
  );
}

export default BottomTabs;
