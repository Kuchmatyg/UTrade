import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChatMessages, sendMessage } from '../../api/chats.api';
import { connectChat } from '../../api/chat.socket';
import '../../styles/pages/Chat.css';

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

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
    <div className="chat-page">

      {/* Сообщения */}
      <div className="chat-messages">
        {messages.map(m => (
          <div
            key={m.id}
            className={`chat-message ${m.isMine ? 'mine' : 'theirs'}`}
          >
            {!m.isMine && <div className="sender">{m.senderName}</div>}
            <div className="bubble">{m.content}</div>
            <div className="time">
              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Ввод */}
      <div className="chat-input">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Отправить</button>
      </div>

    </div>
  );
};

export default Chat;
