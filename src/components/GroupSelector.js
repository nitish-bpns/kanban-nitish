import React from 'react';
import styles from '../styles/Selector.module.css';

const GroupSelector = ({ groupBy, setGroupBy }) => {
  return (
    <div className={styles.selector}>
      <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
        <option value="status">Status</option>
        <option value="assigned_user">User</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
};

export default GroupSelector;
