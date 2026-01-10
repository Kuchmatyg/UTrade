import React, { useEffect, useState } from 'react';
import { fetchChats } from '../../api/chats.api';
import '../../styles/pages/ChatsList.css';
import { Link } from 'react-router-dom';
import Avatar from '../../components/avatar/Avatar';
import api from '../../api/axios';

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

  // return (
  //   <div>
  //     <h2>Chats</h2>
  //     <ul>
  //       {chats.map(c => (
  //         <li key={c.id}>
  //           <Link to={`/chats/${c.id}`}>{c.advertisementName} — {c.lastMessagePreview}</Link>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  return (
    <div className="chats-list">
      <h2>Chats</h2>

      <ul className="chats-ul">
        {chats.map(c => (
          <li key={c.id} className="chat-item">
            <Link to={`/chats/${c.id}`} className="chat-link">

              {/* ЛЕВАЯ ЧАСТЬ — фото объявления + аватар */}
              <div className="chat-avatars">

                {c.advertisementImageUrl ? (
                  <img
                    src={`${api.defaults.baseURL}/uploads/${c.advertisementImageUrl}`}
                    className="ad-preview"
                    alt=""
                  />
                ) : (
                  <div className="ad-preview placeholder">📦</div>
                )}

                <div className="user-avatar">
                  <Avatar
                    user={{
                      firstName: c.companionFirstName,
                      surname: c.companionSurname,
                      avatarUrl: c.companionAvatarUrl
                    }}
                    size={36}
                    clickable={false}
                  />
                </div>

              </div>

              {/* ПРАВАЯ ЧАСТЬ — текст */}
              <div className="chat-text">
                <div className="chat-title">{c.advertisementName} — <span className="chat-companion">{c.companionFirstName}</span></div>
                <div className="chat-last">
                  {c.lastMessageText
                    ? (c.isLastMessageMine ? `Вы: ${c.lastMessageText}` : c.lastMessageText)
                    : 'Нет сообщений'}
                </div>
              </div>

            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsList;
