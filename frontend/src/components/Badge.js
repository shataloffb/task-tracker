import React from 'react';

function Badge({ title, color }) {
  return (
    <span style={{
      backgroundColor: color || '#ccc',
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '12px',
      marginRight: '8px',
      display: 'inline-block',
      fontSize: '12px'
    }}>
      {title}
    </span>
  );
}

export default Badge;
