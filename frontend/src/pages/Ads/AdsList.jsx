import React, { useEffect, useState } from 'react';
import { fetchAds } from '../../api/ads.api';
import AdCard from '../../components/Ads/AdCard';
import '../../styles/pages/AdsList.css';

const AdsList = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchAds();
      setAds(data || []);
    })();
  }, []);

  return (
    <div>
      <h2>Объявления</h2>
      <div>
        {ads.map((a) => (
          <AdCard key={a.id} ad={a} />
        ))}
      </div>
    </div>
  );
};

export default AdsList;
