import { db, auth } from "../services/services";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useState } from "react";

const RequestCard = ({ request }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title: request.title, 
    description: request.description,
    location: request.location 
  });
  
  const user = auth.currentUser;
  const isOwner = user?.uid === request.userId;
  const hasOffered = request.helperIds?.includes(user?.uid);

  // --- OFFER HELP ---
  const handleOfferHelp = async () => {
    if (!user) return alert("Please log in!");
    setLoading(true);
    try {
      await updateDoc(doc(db, "requests", request.id), {
        helperIds: arrayUnion(user.uid),
        helperEmails: arrayUnion(user.email),
        status: "in-progress"
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // --- WITHDRAW HELP (The New Part!) ---
  const handleWithdrawHelp = async () => {
    if (!window.confirm("Are you sure you want to withdraw your offer to help?")) return;
    
    setLoading(true);
    try {
      const requestRef = doc(db, "requests", request.id);
      await updateDoc(requestRef, {
        helperIds: arrayRemove(user.uid),
        helperEmails: arrayRemove(user.email)
      });
      
      // Optional: If no one is left helping, reset status to open
      if (request.helperIds.length <= 1) {
        await updateDoc(requestRef, { status: "open" });
      }
      
      alert("You have withdrawn your offer to help.");
    } catch (e) {
      console.error(e);
      alert("Error withdrawing help.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      try { await deleteDoc(doc(db, "requests", request.id)); } catch (e) { console.error(e); }
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "requests", request.id), {
        title: editData.title,
        description: editData.description,
        location: editData.location
      });
      setIsEditing(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="request-card">
      <div className="request-content">
        <div className="card-header">
          <span className={`status-tag ${request.status || 'open'}`}>{request.status || 'open'}</span>
          {isOwner && (
            <div className="owner-actions">
              <button onClick={() => setIsEditing(!isEditing)} className="icon-btn">✏️</button>
              <button onClick={handleDelete} className="icon-btn delete">🗑️</button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="edit-mode">
            <label>Title</label>
            <input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
            <label>Location</label>
            <input value={editData.location} onChange={(e) => setEditData({...editData, location: e.target.value})} />
            <label>Description</label>
            <textarea value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} rows="3" />
            <div className="edit-buttons">
              <button onClick={handleUpdate} className="save-btn" disabled={loading}>Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h3>{request.title}</h3>
            <p className="request-desc">{request.description}</p>
            <div className="request-meta">
              <span>📍 {request.location}</span>
              <span>📧 Contact: {request.userEmail}</span>
            </div>
          </>
        )}

        {isOwner && request.helperEmails?.length > 0 && (
          <div className="volunteer-list">
            <h4>People ready to help:</h4>
            <ul>{request.helperEmails.map((email, index) => <li key={index}>✉️ {email}</li>)}</ul>
          </div>
        )}
      </div>
      
      {/* BUTTON LOGIC: If owner, show nothing. If helper, show Withdraw. If stranger, show Offer. */}
      {!isOwner && (
        hasOffered ? (
          <button className="help-btn withdraw" onClick={handleWithdrawHelp} disabled={loading}>
            {loading ? "..." : "Withdraw Help"}
          </button>
        ) : (
          <button className="help-btn" onClick={handleOfferHelp} disabled={loading}>
            {loading ? "..." : "Offer Help"}
          </button>
        )
      )}
    </div>
  );
};

export default RequestCard;