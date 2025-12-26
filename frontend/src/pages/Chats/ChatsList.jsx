import React, { useEffect, useState } from 'react';
import { fetchChats } from '../../api/chats.api';
import '../../styles/pages/ChatsList.css';
import { Link } from 'react-router-dom';

const ChatsList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchChats();
        setChats(data || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  if (!chats.length) return <div>No chats</div>;

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.map(c => (
          <li key={c.id}>
            <Link to={`/chats/${c.id}`}>{c.advertisementName} — {c.lastMessagePreview}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsList;
