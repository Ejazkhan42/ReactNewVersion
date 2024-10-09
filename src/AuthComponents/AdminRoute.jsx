import React, { useContext } from "react";
import { AuthLoginInfo } from "./AuthLogin";
import { Navigate } from "react-router-dom";
import "./Styles/loadingPage.css";

function AdminRoute({ children }) {
  const user = useContext(AuthLoginInfo);
  if (user === undefined) {
    return (
      <div className="loading-page-wrapper">
        <div className="loading-page">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  return user?.role_id === 1 ? children : <Navigate to="/" />;
}
export default AdminRoute;
