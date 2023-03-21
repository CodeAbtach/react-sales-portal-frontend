import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({children}){
    if (window.localStorage.getItem('token') === null || window.localStorage.getItem('token') === undefined) {
      return <Navigate to="/authentication/sign-in" replace />;
    }
  
    return children;
  }


export default ProtectedRoute