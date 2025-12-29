import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAd, updateAd, uploadAdImage } from '../../api/ads.api';
import '../../styles/pages/CreateAd.css'; // можно использовать те же стили

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryCsv, setCategoryCsv] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ad = await fetchAd(id);
        setName(ad.name);
        setDescription(ad.description ?? '');
        setPrice(ad.price);
        setLocation(ad.location);
        setEmail(ad.contactEmail);
        setPhone(ad.contactPhoneNumber ?? '');
        setCategoryCsv(ad.categories?.join(',') ?? '');
      } catch (e) {
        console.error(e);
        setError('Failed to load advertisement');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const categoryIds = categoryCsv
        .split(',')
        .map(s => s.trim())
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n));

      const body = {
        Name: name,
        Description: description,
        Price: Number(price) || 0,
        Location: location,
        ContactEmail: email,
        ContactPhoneNumber: phone || null,
        CategoryIds: categoryIds.length ? categoryIds : null,
      };

      await updateAd(id, body);

      if (file) {
        try {
          await uploadAdImage(id, file);
        } catch (e) {
          console.error('image upload failed', e);
        }
      }

      navigate(`/ads/${id}`);
    } catch (e) {
      console.error('EditAd handleSubmit error:', e);
    
      let serverMsg = 'Update failed';
    
      // axios error
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
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="email" placeholder="Contact email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Contact phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Category IDs (comma separated)" value={categoryCsv} onChange={(e) => setCategoryCsv(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button
            type="button"
            onClick={() => navigate(`/ads/${id}`)}
            style={{ marginLeft: '8px' }}
          >
            Cancel
          </button>
        </div>
        {error && <div style={{ color: 'red' }}>{String(error)}</div>}
      </form>
    </div>
  );
};

export default EditAd;
