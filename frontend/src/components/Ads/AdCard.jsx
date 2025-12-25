import React from 'react';
import { Link } from 'react-router-dom';

const AdCard = ({ ad }) => (
  <div className="ad-card">
    <h3>{ad.name}</h3>
    <p>{ad.price}</p>
    <Link to={`/api/Advertisement/${ad.id}`}>View</Link>
  </div>
);

export default AdCard;
