import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/services'; // Import from your services file
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import RequestCard from '../components/RequestCard';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });

  // --- SPEED FIX: Real-time listener ---
  useEffect(() => {
  // MUST NOT have where("userId", "==", ...) here!
  const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Current Requests:", docs); // Check your console to see if data arrives
    setRequests(docs);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const handlePostRequest = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please log in first!");

    try {
      await addDoc(collection(db, 'requests'), {
        ...formData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        status: 'open'
      });
      setShowModal(false);
      setFormData({ title: '', description: '', location: '' });
    } catch (err) {
      console.error("Error adding request:", err);
    }
  };

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="feed-title">
          <h1>Community Help Requests</h1>
        </div>
        <button className="add-request-btn" onClick={() => setShowModal(true)}>
          + Post a Request
        </button>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Help Request</h2>
            <form onSubmit={handlePostRequest}>
              <input 
                type="text" placeholder="Title" required 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
              <textarea 
                placeholder="Description" required 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
              <input 
                type="text" placeholder="Location" required 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="confirm-btn">Post Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="feed-grid">
        {requests.map(req => <RequestCard key={req.id} request={req} />)}
      </div>
    </div>
  );
};

export default Requests;