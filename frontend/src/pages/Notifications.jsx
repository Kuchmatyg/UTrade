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

  if (!notes.length) return <div>Нет уведомлений</div>;

  return (
    <div>
      <h2>Уведомления</h2>
      <ul className="notifications">
  {notes.map(n => (
    <li
      key={n.id}
      className={`notification ${n.isRead ? 'read' : 'unread'}`}
    >
      <div className="dot" />

      <div className="body">
        <div className="content">{n.content}</div>
        <div className="date">
          {new Date(n.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="actions">
        {!n.isRead && (
          <button onClick={() => handleRead(n.id)}>✓</button>
        )}
        <button onClick={() => handleDelete(n.id)}>🗑</button>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Notifications;
