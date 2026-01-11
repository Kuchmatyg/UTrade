import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/AdCard.css';
import api from '../../api/axios';

const AdCard = ({ ad }) => {
  const navigate = useNavigate();

  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const firstImage = ad.images?.[0];
  const previewSrc = firstImage
    ? (firstImage.startsWith('http') ? firstImage : `${api.defaults.baseURL}${firstImage}`)
    : null;

  return (
    <div 
      className="ad-card clickable"
      onClick={() => navigate(`/ads/${ad.id}`)}
    >
      {previewSrc ? (
        <img
          src={previewSrc}
          alt="preview"
          className="ad-card-image"
        />
      ) : (
        <div className="ad-card-image placeholder">📦</div>
      )}
      <div className="ad-card-body">
        <h3 className="ad-card-title">{ad.name}</h3>
        <p className="ad-card-price">{ad.price} ₽</p>
      </div>
    </div>
  )
};

export default AdCard;
