import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import RecuperationCookie from './cryptages/RécupérationCookie';

const ProtectedRoutes = ({ cookieNames, redirectPath = '/' }) => {
  const secretKey = 'your-secret-key';
  const isAuthenticated = cookieNames.every(cookieName => RecuperationCookie(secretKey, cookieName));

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoutes;
