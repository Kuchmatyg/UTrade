import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAsRead, deleteNotification } from '../api/notifications.api';
import '../styles/pages/Notifications.css';

const Notifications = () => {
  const [notes, setNotes] = useState([]);

  const load = async () => {
    try {
      const data = await fetchNotifications();
      setNotes(data || []);
    } catch (e) {
      console.error('fetch notifications', e);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      await load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await load();
    } catch (e) { console.error(e); }
  };

  if (!notes.length) return <div>No notifications</div>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notes.map(n => (
          <li key={n.id} style={{ marginBottom: 8 }}>
            <div>{n.message}</div>
            <div style={{ fontSize: 12, color: '#494545ff' }}>{n.Content}</div>
            {!n.isRead && <button onClick={() => handleRead(n.id)}> User read</button>}
            <button onClick={() => handleDelete(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
