import React from 'react';

function ToggleSwitch({ label, value, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        style={{ marginRight: 8 }}
      />
      {label}
    </label>
  );
}

export default ToggleSwitch;
