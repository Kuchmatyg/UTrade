import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPendingAds, approveAd, rejectAd } from '../../api/ads.api';
import '../../styles/pages/ModeratorAds.css';

const ModeratorAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, adId: null, action: null, reason: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingAds();
      setAds(data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openApprove = (adId) => setModal({ open: true, adId, action: 'approve', reason: '' });
  const openReject = (adId) => setModal({ open: true, adId, action: 'reject', reason: '' });

  const close = () => setModal({ open: false, adId: null, action: null, reason: '' });

  const submit = async () => {
    if (!modal.adId) return;
    try {
      if (modal.action === 'approve') {
        await approveAd(modal.adId);
      } else if (modal.action === 'reject') {
        await rejectAd(modal.adId, modal.reason || 'No reason');
      }
      await load();
      close();
    } catch (e) {
      console.error(e);
      alert('Action failed');
    }
  };

  return (
    <div className="moderator-ads">
      <h2>Pending Advertisements</h2>
      {loading && <div>Loading...</div>}
      {!loading && ads.length === 0 && <div>No pending ads</div>}
      <ul className="moderator-list">
        {ads.map(a => (
          <li key={a.id} className="moderator-item">
            <div className="info">
              <div className="title"><Link to={`/ads/${a.id}`}>{a.name}</Link></div>
              <div className="meta">by {a.username} — {a.createdAt}</div>
            </div>
            <div className="controls">
              <button className="btn-approve" onClick={() => openApprove(a.id)}>Approve</button>
              <button className="btn-reject" onClick={() => openReject(a.id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>

      {modal.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{modal.action === 'approve' ? 'Approve advertisement' : 'Reject advertisement'}</h3>
            {modal.action === 'reject' && (
              <textarea placeholder="Reason for rejection" value={modal.reason} onChange={(e) => setModal(m => ({ ...m, reason: e.target.value }))} />
            )}
            <div className="modal-actions">
              <button onClick={submit}>{modal.action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}</button>
              <button onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorAds;
// File ends with single `export default ModeratorAds;`
