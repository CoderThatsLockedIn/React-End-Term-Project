import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/services';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import RequestCard from '../components/RequestCard';
import "./pages.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [helpingRequests, setHelpingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 1. My Personal Requests
        const qMyReqs = query(
          collection(db, "requests"), 
          where("userId", "==", currentUser.uid)
        );

        const unsubMyReqs = onSnapshot(qMyReqs, 
          (snapshot) => {
            setMyRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          },
          (error) => {
            if (error.code === 'permission-denied') {
              console.warn("Permission denied caught in MyRequests listener (likely due to deletion).");
            } else {
              console.error("Firestore Error in MyRequests:", error);
            }
          }
        );

        // 2. Requests I am Helping With
        const qHelping = query(
          collection(db, "requests"), 
          where("helperIds", "array-contains", currentUser.uid)
        );

        const unsubHelping = onSnapshot(qHelping, 
          (snapshot) => {
            setHelpingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
          },
          (error) => {
            if (error.code === 'permission-denied') {
              console.warn("Permission denied caught in HelpingRequests listener.");
            } else {
              console.error("Firestore Error in HelpingRequests:", error);
            }
            setLoading(false);
          }
        );

        return () => {
          unsubMyReqs();
          unsubHelping();
        };
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <div className="dashboard-container"><p className="empty-state">Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, Akshay</h1>
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
    </div>
  );
};

export default Dashboard;
