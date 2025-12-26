import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChatMessages, sendMessage } from '../../api/chats.api';
import { connectChat } from '../../api/chat.socket';
import '../../styles/pages/Chat.css';

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

useEffect(() => {
  let connection;

  const init = async () => {
    // 1️⃣ REST — история
    const data = await fetchChatMessages(id);
    setMessages(data || []);

    // 2️⃣ WebSocket — realtime
    connection = await connectChat(id, (message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) {
          return prev; // ❌ уже есть
        }
        return [...prev, message];
      });
    });
  };

  init();

  return () => {
    if (connection) {
      connection.stop();
    }
  };
}, [id]);


  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      // 🔥 ТОЛЬКО REST
      await sendMessage(id, text);
      setText('');
      // сообщение прилетит обратно через WebSocket
    } catch (e) {
      console.error(e);
      showSendError(e);
    }
  };

  const showSendError = (e) => {
    const status = e?.response?.status;
    const resp = e?.response?.data;
    alert(`Send failed: ${status || ''}\n${JSON.stringify(resp) || e.message}`);
  };

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ minHeight: 200, border: '1px solid #ddd', padding: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 6 }}>
            <div><strong>{m.senderUsername}</strong></div>
            <div>{m.content}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
