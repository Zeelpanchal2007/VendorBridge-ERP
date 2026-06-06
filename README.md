# VendorBridge Frontend (React + Vite)

This is the frontend portion of the **VendorBridge Procurement & Vendor Management ERP**. It has been built with React 18, Vite, Tailwind CSS, and a suite of modern libraries to ensure a clean, professional, and scalable architecture.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔗 Connecting to a FastAPI + PostgreSQL Backend

The frontend is built to be easily plug-and-play with your backend.

### Step 1: Environment Variables
Create a `.env` file in the root of this project and add your FastAPI backend URL:
```env
VITE_API_URL=http://localhost:8000/api
```

### Step 2: The API Central Client
All HTTP requests route through the centralized Axios instance located at `src/api/index.js`.
- It automatically grabs the JWT token from `localStorage` and injects it into the `Authorization: Bearer <token>` header for every request.
- It intercepts `401 Unauthorized` responses and automatically redirects the user to the login screen.

### Step 3: Integrating Endpoints
Currently, the UI components use mock data arrays to demonstrate functionality. To connect them to your FastAPI backend, simply replace the mock state with an API call.

Here is an example of how to fetch RFQs from the backend:

```jsx
// src/pages/RFQs.jsx (Example implementation)
import React, { useState, useEffect } from 'react';
import api from '../api';

const RFQs = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        // Calls http://localhost:8000/api/rfqs
        const response = await api.get('/rfqs'); 
        setRfqs(response.data);
      } catch (error) {
        console.error("Failed to fetch RFQs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRfqs();
  }, []);

  // ... rest of the component
}
```

### Step 4: Connecting the Login Flow
Update `src/contexts/AuthContext.jsx` to hit your FastAPI authentication endpoint (usually `POST /token` or `/api/auth/login`).

```jsx
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Assuming backend returns { access_token: "...", user: { role: "admin", name: "..." } }
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    setUser(response.data.user);
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};
```

## ✨ Features Implemented
- **Role-Based Access Control**: Supports Admin, Manager, Procurement Officer, and Vendor views.
- **Dynamic Routing**: Protected routes ensure users only see what they are authorized to see.
- **Dark Mode**: Fully functional theme toggling with Tailwind dark variants.
- **PDF Generation**: Purchase Order invoices are generated dynamically using `jsPDF`.
- **Form Validation**: `react-hook-form` + `zod` schema validations on all forms.
- **Interactive UI**: Toast notifications, modals, and dynamic multi-step wizards.
