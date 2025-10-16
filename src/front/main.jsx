import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Private from "./pages/Private.jsx";
import "./index.css";

const Protected = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      {
        path: "private",
        element: (
          <Protected>
            <Private />
          </Protected>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
