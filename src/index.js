import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
// import Store from './Pages/Store';
import AdminPanel from './Pages/Admin';
import Login from './Pages/Login';
import SignUpForm from './Pages/SignUp';
import CreateStore from './Components/StoreForm';
import Dashboard from './Pages/Dashboard';
import CreateCoupon from './Pages/CreateCoupon';
import ManageCoupons from './Pages/ManageCoupons';
import ManageStores from './Pages/ManageStores';

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminPanel />,   // layout
    children: [
      { path: "/Dashboard", element: <Dashboard /> },          // default home
      { path: "coupons/create", element: <CreateCoupon /> },
      { path: "coupons/manage", element: <ManageCoupons /> },
      { path: "stores/create", element: <CreateStore /> },
      { path: "stores/manage", element: <ManageStores /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUpForm /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
