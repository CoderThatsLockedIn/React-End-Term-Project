import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/services';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import RequestCard from '../components/RequestCard';
// If you have an EventCard component, make sure it is imported here:
// import EventCard from '../components/EventCard'; 
import "./pages.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [helpingRequests, setHelpingRequests] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 1. Events I've Joined
        const qEvents = query(
          collection(db, "events"), 
          where("volunteers", "array-contains", currentUser.uid)
        );
        const unsubEvents = onSnapshot(qEvents, (snapshot) => {
          setJoinedEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. My Personal Requests
        const qMyReqs = query(
          collection(db, "requests"), 
          where("userId", "==", currentUser.uid)
        );
        const unsubMyReqs = onSnapshot(qMyReqs, (snapshot) => {
          setMyRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 3. Requests I am Helping With
        const qHelping = query(
          collection(db, "requests"), 
          where("helperIds", "array-contains", currentUser.uid)
        );
        const unsubHelping = onSnapshot(qHelping, (snapshot) => {
          setHelpingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });

        return () => {
          unsubEvents();
          unsubMyReqs();
          unsubHelping();
        };
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Helper to get name from email (e.g., "akshay@gmail.com" -> "akshay")
  const userName = user?.email ? user.email.split('@')[0] : "Neighbor";

  if (loading) return <div className="dashboard-container"><p className="empty-state">Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* FIXED: Dynamic name greeting */}
        <h1>Welcome back, {userName}</h1>
        <p className="user-subtitle">Logged in as <strong>{user?.email}</strong></p>
      </header>

      {/* Section 1: My Requests */}
      <section className="dashboard-section">
        <h2 className="section-title">My Help Requests</h2>
        <div className="dashboard-grid">
          {myRequests.length > 0 ? (
            myRequests.map(req => <RequestCard key={req.id} request={req} />)
          ) : (
            <div className="empty-state"><p>No requests posted yet.</p></div>
          )}
        </div>
      </section>

      {/* Section 2: Helping Others */}
      <section className="dashboard-section">
        <h2 className="section-title">Requests I'm Helping With</h2>
        <div className="dashboard-grid">
          {helpingRequests.length > 0 ? (
            helpingRequests.map(req => <RequestCard key={req.id} request={req} />)
          ) : (
            <div className="empty-state"><p>You haven't offered help yet.</p></div>
          )}
        </div>
      </section>

      {/* Section 3: Joined Events */}
      <section className="dashboard-section">
        <h2 className="section-title">Events I'm Volunteering For</h2>
        <div className="dashboard-grid">
          {joinedEvents.length > 0 ? (
            joinedEvents.map(evt => (
              // Ensure EventCard is defined/imported or replace with a generic div
              <div key={evt.id} className="event-card-simple">
                <h3>{evt.title}</h3>
                <p>📍 {evt.location}</p>
              </div>
            ))
          ) : (
            <div className="empty-state"><p>No events joined yet.</p></div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
