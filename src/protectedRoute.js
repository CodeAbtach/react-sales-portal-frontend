import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({children}){
    if (window.localStorage.getItem('Token') === null || window.localStorage.getItem('Token') === undefined) {
      return <Navigate to="/authentication/sign-in" replace />;
    }
  
    return children;
  }


export default ProtectedRoute