# CodeConnect

CodeConnect is a collaborative platform designed to connect techies, it's a developer-centric community platform designed to empower programmers of all levels by providing a space to connect, collaborate, and learn.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Contact](#contact)

---

## Features

- 👤 **User Profiles:** Users can create and update personal profiles with GitHub, LinkedIn, education, and role details.
- 📝 **Blogging Platform:** Users can write, edit, and publish technical blogs with rich text formatting.
- 💬 **Discussion Forums:** Engage in technical discussions, ask questions, and share knowledge with other developers.
- 🔍 **Code Snippet Sharing:** Share reusable code snippets with syntax highlighting and optional explanations.
- 🎙️ **Developer Podcasts:** Access curated or community-created podcasts centered on development trends and tutorials.
- 🔐 **Authentication with Clerk:** Secure login/signup using email, Google, GitHub, etc., with user session management.
- 📦 **Firebase Backend Integration:** User data and content are stored and retrieved using Firebase Firestore & Storage.
- 📲 **Responsive UI Design:** Optimized for mobile, tablet, and desktop using SCSS, MUI, and Bootstrap.
- 🌈 **Interactive Animations:** Engaging transitions and effects using Framer Motion.

---

## Technologies Used

### Frontend
- **React.js** – v18.3.1
- React Router (v6.29.0)
- **SCSS / Styling Libraries** – `sass`, `@emotion`, `styled-components`
- **Material-UI (MUI)** – v6.4.4
- **Formik & Yup** – Form state management and validation
- **Framer Motion** – Animations and transitions
- **Bootstrap / React-Bootstrap** – UI prototyping
- **TinyMCE** – Rich text editing
- **Axios** – API client
- **React-Toastify** – Notifications

### Backend
- **Node.js & Express.js**(v4.21.2) – REST API layer
- **Firebase** – Authentication
- **Firebase (Firestore + Storage)**(v11.4.0) – Cloud-hosted NoSQL database and file storage
- **dotenv & cors** – Configuration and API security

---

## Project Structure

```
CODECONNECT/
├── public/
├── src/
│   ├── assets/                      # Static files (images, fonts, etc.)
│   ├── Components/                 # Reusable UI components, organized by feature
│   ├── LandingPage/
│   │   ├── About/
│   │   ├── Blogs/
│   │   ├── CodeSnippets/
│   │   ├── Forums/
│   │   ├── Hero/
│   │   ├── Navbar/
│   │   ├── Podcasts/
│   ├── MainPages/                  # Full-page views corresponding to main app routes
│   │   ├── BlogPosts/
│   │   ├── CodeSnippet/
│   │   ├── Feed/
│   │   ├── Forums/
│   │   ├── MyAccount/
│   │   ├── Podcasts/
│   │   ├── Profile/
│   │   ├── PublicProfile/
│   │   └── SavedPosts/
│   ├── Pages/                      # Page-level components
│   │   ├── Auth.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   ├── App.jsx                     # Root React component
│   ├── main.jsx                    # ReactDOM render entry
│   ├── firebase.js                 # Firebase config initialization
│   ├── App.scss                    # Global styles
│   ├── index.scss                  # Additional styles
├── .env.local                      # Environment-specific configuration variables
├── vite.config.js                 # Vite build configuration
├── package.json                   # Project dependencies and scripts
├── README.md                      # Project documentation

```


---

## Setup Instructions

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/your-username/CodeConnect.git
cd CodeConnect
```

### 2. 📦 Install Dependencies

Install required packages using npm:

```bash
npm install
```

### 3. 🛠️ Configure Environment Variables

Create a `.env.local` file in the project root and add the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here

# Optional: Google Analytics
measurementId=your_google_analytics_measurement_id_here
```

⚠️ **Do not share this file or push it to version control. It contains sensitive keys.**

### 4. 🔥 Firebase Initialization (Reference)

Ensure your Firebase setup in `src/firebase.js` uses these environment variables correctly (with Vite):

```javascript
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

### 5. ▶️ Run the App

To start the development server:

```bash
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## Contact

For questions or support, please open an issue or contact the maintainer at [swathipriyamoru@gmail.com].

---
