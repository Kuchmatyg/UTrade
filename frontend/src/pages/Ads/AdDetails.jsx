import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAd } from '../../api/ads.api';

const AdDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchAd(id);
      setAd(data);
    })();
  }, [id]);

  if (!ad) return <div>Loading...</div>;

  return (
    <div>
      <h2>{ad.title}</h2>
      <p>{ad.description}</p>
    </div>
  );
};

export default AdDetails;
