// Avatar.jsx
import React, { use, useRef, useState } from 'react';
import api from '../../api/axios';

const getInitials = (user) => {
    const first = user.firstName?.[0]?.toUpperCase() || '';
    const last = user.surname?.[0]?.toUpperCase() || '';
    return first + last;
};

const Avatar = ({ user, size = 80, onChange }) => {
    const inputRef = useRef(null);
    const [hovered, setHovered] = useState(false);

    // Переменная для подставновки в src, для отображения аватарки
    const avatarSrc = user.avatarUrl
    ? `${api.defaults.baseURL}/avatars/${user.avatarUrl}`
    : null;

    const handleClick = () => {
    if (inputRef.current) {
        inputRef.current.click();
    }
    };


    return (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size / 3,
            fontWeight: 'bold',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
    >
        {user.avatarUrl ? (
        <img
            src={avatarSrc}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        ) : (
        getInitials(user)
        )}

        {hovered && (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                textAlign: 'center',
                fontSize: size / 6,
                padding: 2,
            }}
        >
            Change
        </div>
        )}

        <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onChange}
        />
    </div>
    );
};

export default Avatar;
