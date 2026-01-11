import React, { useEffect, useState } from 'react';
import AdCard from '../../components/Ads/AdCard';
import { fetchCategories } from '../../api/ads.api';
import api from '../../api/axios';
import '../../styles/pages/AdsList.css';

const AdsList = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    query: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
  });
  const [loading, setLoading] = useState(true);

  // Подгружаем категории при монтировании
  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    })();
  }, []);

  // Функция загрузки объявлений с фильтрами
  const loadAds = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await api.get('/api/Advertisement/search', { params });
      setAds(data);
    } catch (e) {
      console.error('Failed to load ads', e);
    } finally {
      setLoading(false);
    }
  };

  // Подгружаем все объявления при первом рендере
  useEffect(() => {
    loadAds();
  }, []);

  // Обработчик изменения фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // Обработчик применения фильтров
  const handleApplyFilters = () => {
    loadAds();
  };

  return (
    <div>
      <h2>Объявления</h2>

      {/* Фильтры */}
      <div className="filters" style={{ marginBottom: 16 }}>
        <input
          type="text"
          name="query"
          placeholder="Поиск..."
          value={filters.query}
          onChange={handleFilterChange}
          style={{ marginRight: 8 }}
        />

        <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} style={{ marginRight: 8 }}>
          <option value="">Все категории</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Мин. цена"
          value={filters.minPrice}
          onChange={handleFilterChange}
          style={{ marginRight: 8 }}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Макс. цена"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          style={{ marginRight: 8 }}
        />

        <button onClick={handleApplyFilters}>Применить</button>
      </div>

      {/* Список объявлений */}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div 
          className="ads-grid"
          // style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
          >
            {ads.length === 0 ? (
              <p>Объявления не найдены</p>
            ) : (
              ads.map(a => <AdCard key={a.id} ad={a} />)
            )}
        </div>
      )}
    </div>
  );
};

export default AdsList;
