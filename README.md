# 🤝 Connect NGO: Neighborhood Support Platform

**Connect NGO** is a real-time, peer-to-peer assistance platform built to foster local support networks. Whether it's a neighbor needing help moving furniture or someone looking for a ride to a medical appointment, CommunityAid bridges the gap through a seamless, secure, and reactive interface.

---

## 🚀 Key Features

### 🛠️ For Help-Seekers (Full CRUD)
- **Post Requests:** Easily create help requests with a title, location, and description.
- **Live Volunteer Tracking:** Request owners can see a real-time list of emails for users who have volunteered to help.
- **Manage Posts:** Full control to **Edit** post details or **Delete** requests directly from the dashboard.
- **Status Updates:** Visual indicators showing whether a request is 'Open' or 'In-Progress'.

### 🙋 For Volunteers
- **One-Click Support:** Offer help with a single click.
- **Withdrawal System:** Flexibility to withdraw an offer of help if circumstances change, automatically updating the owner's list.
- **Personal Dashboard:** A dedicated section to track all active requests you have committed to helping with.

### 🔐 Security & Sync
- **Firebase Authentication:** Secure login system ensuring only verified users can post or volunteer.
- **Firestore Security Rules:** Robust backend rules ensuring only the creator of a post can edit or delete it.
- **Real-time Updates:** Powered by Firebase `onSnapshot`, ensuring all users see data changes (edits, deletions, or new helpers) the millisecond they happen without refreshing.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Hooks, Functional Components)
- **Backend-as-a-Service:** Firebase
- **Database:** Cloud Firestore (NoSQL)
- **Authentication:** Firebase Auth
- **Styling:** Custom CSS3 (Modular and Responsive)
- **Icons/UI:** Emoji-based intuitive UI

---

## 📂 Project Structure

```text
src/
├── components/       # Reusable UI (Navbar, RequestCard, etc.)
├── pages/            # Page-level components (Dashboard, Requests, Login)
├── services/         # Firebase configuration and initialization
├── styles/           # components.css and pages.css
└── App.js            # Routing and Global State
