import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/AdCard.css';

const AdCard = ({ ad }) => (
  <div className="ad-card">
    <h3>{ad.name}</h3>
    <p>{ad.price} ₽</p>
    <p>by {ad.username}</p>
    <Link to={`/ads/${ad.id}`}>View</Link>
  </div>
);

export default AdCard;
