import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAd, uploadAdImage } from '../../api/ads.api';
import '../../styles/pages/CreateAd.css';

const CreateAd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryCsv, setCategoryCsv] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const categoryIds = categoryCsv
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => parseInt(s, 10));

      const body = {
        Name: name,
        Description: description,
        Price: Number(price) || 0,
        Location: location,
        ContactEmail: email,
        ContactPhoneNumber: phone || null,
        CategoryIds: categoryIds.length ? categoryIds : null,
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

  return (
    <div className="create-ad">
      <h2>Create Advertisement</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="email" placeholder="Contact email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Category IDs (comma separated)" value={categoryCsv} onChange={(e) => setCategoryCsv(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </div>
        {error && <div style={{ color: 'red' }}>{String(error)}</div>}
      </form>
    </div>
  );
};

export default CreateAd;
