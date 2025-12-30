import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAd, updateAd, uploadAdImage, fetchCategories } from '../../api/ads.api';
import { AuthContext } from '../../auth/AuthContext';
import '../../styles/pages/CreateAd.css';

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([null]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [ad, allCategories] = await Promise.all([fetchAd(id), fetchCategories()]);
        setName(ad.name);
        setDescription(ad.description ?? '');
        setPrice(ad.price);
        setLocation(ad.location);
        setEmail(ad.contactEmail);
        setPhone(ad.contactPhoneNumber ?? '');
        setCategories(allCategories);

        // Подставляем существующие категории
        if (ad.categories && ad.categories.length > 0) {
          const catIds = allCategories
            .filter(c => ad.categories.includes(c.name))
            .map(c => c.id);
          setSelectedCategories([...catIds, null]); // последний null для добавления новых
        } else {
          setSelectedCategories([null]);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load advertisement');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const categoryIds = selectedCategories.filter(id => id && id !== -1);

      const body = {
        Name: name,
        Description: description,
        Price: Number(price),
        Location: location,
        ContactEmail: email,
        ContactPhoneNumber: phone || null,
        CategoryIds: categoryIds.length ? categoryIds : null
      };

      await updateAd(id, body);

      if (file) {
        try {
          await uploadAdImage(id, file);
        } catch (e) {
          console.error('Image upload failed', e);
        }
      }

      navigate(`/ads/${id}`);
    } catch (e) {
      console.error('EditAd handleSubmit error:', e);
      let serverMsg = 'Update failed';
      if (e?.response?.data) {
        if (typeof e.response.data === 'string') serverMsg = e.response.data;
        else if (e.response.data.message) serverMsg = e.response.data.message;
        else serverMsg = JSON.stringify(e.response.data);
      } else if (e?.message) {
        serverMsg = e.message;
      }
      setError(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="create-ad">
      <h2>Edit Advertisement</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
        <input type="email" placeholder="Contact email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Contact phone" value={phone} onChange={e => setPhone(e.target.value)} />

        {/* Categories */}
        <div className="categories">
          <label>Categories</label>
          {selectedCategories.map((catId, index) => (
            <div key={`${index}-${catId ?? 'empty'}`} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <select value={catId ?? ''} onChange={e => handleCategoryChange(index, e.target.value)}>
                <option value="">Выбрать категорию</option>
                {getAvailableCategories(index).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {selectedCategories.length > 1 && (
                <button type="button" onClick={() => setSelectedCategories(prev => prev.filter((_, i) => i !== index))}>❌</button>
              )}
            </div>
          ))}
        </div>

        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => navigate(`/ads/${id}`)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
        {error && <div style={{ color: 'red' }}>{String(error)}</div>}
      </form>
    </div>
  );
};

export default EditAd;
