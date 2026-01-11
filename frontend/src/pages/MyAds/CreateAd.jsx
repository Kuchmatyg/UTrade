import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createAd, uploadAdImage, fetchCategories } from '../../api/ads.api';
import '../../styles/pages/CreateAd.css';

const CreateAd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([null]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const categoryIds = selectedCategories.filter(id => id && id !== -1);

      if (categoryIds.length === 0) {
        throw new Error('Выберите хотя бы одну категорию');
      }

      const body = {     
          Name: name,
          Description: description,
          Price: Number(price),
          Location: location,
          ContactEmail: email,
          ContactPhoneNumber: phone || null,
          CategoryIds: selectedCategories.filter(id => id && id !== -1)
      
      };



      const ad = await createAd(body);

      if (file) {
        try {
          await uploadAdImage(ad.id, file);
        } catch (e) {
          // ignore image upload failure but notify
          console.error('image upload failed', e);
        }
      }

      navigate(`/ads/${ad.id}`);
    } catch (e) {
      console.error(e);
      const serverMsg = e?.response?.data?.message || e?.response?.data || e.message;
      setError(serverMsg || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  (async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  })();
}, []);

useEffect(() => {
  if (!user) return;

  setEmail(user.email || '');
  setPhone(user.phone || '');
  setLocation(user.location || '');
}, [user]);



  
  const handleCategoryChange = (index, value) => {
    const updated = [...selectedCategories];
    updated[index] = value ? Number(value) : null;

    // если выбрали категорию в последнем селекте — добавляем новый
    if (index === selectedCategories.length - 1 && value) {
      updated.push(null);
    }

    setSelectedCategories(updated);
  };

    const getAvailableCategories = (index) => {
      const used = selectedCategories
        .filter((_, i) => i !== index)
        .filter(Boolean);
    return categories.filter(c => !used.includes(c.id));
  };


  return (
    <div className="create-ad">
      <h2>Создание объявления</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input
          type="email"
          placeholder="Contact email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />


        <input placeholder="Contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="categories">
      <label>Categories</label>

{selectedCategories.map((catId, index) => (
  <div
   key={`${index}-${catId ?? 'empty'}`}
    style={{ display: 'flex', gap: 8 }}
  >
    <select
      value={catId ?? ''}
      onChange={(e) => handleCategoryChange(index, e.target.value)}
    >
      <option value="">Выбрать категорию</option>
      {getAvailableCategories(index).map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>

    {selectedCategories.length > 1 && catId !== null && (
      <button
        type="button"
        onClick={() =>
          setSelectedCategories(prev =>
            prev.filter((_, i) => i !== index)
          )
        }
      >
        ❌
      </button>
    )}
  </div>
))}


        </div>

        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="form-buttons">
          <button type="submit" disabled={loading}>{loading ? 'Создание...' : 'Создать'}</button>
          <button type="button" onClick={() => navigate(-1)}>
            Отмена
          </button>
        </div>
        {error && <div style={{ color: 'red' }}>{String(error)}</div>}
      </form>
    </div>
  );
};

export default CreateAd;
