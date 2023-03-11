import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({children}){
    console.log("TOKEN", window.localStorage.getItem('token'))
    if (window.localStorage.getItem('token') === null || window.localStorage.getItem('token') === undefined) {
      return <Navigate to="/authentication/sign-in" replace />;
    }
  
    return children;
  }


export default ProtectedRoute