import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../Context/AppContext';

export default function ProtectedSellerRoute({ children }) {
    const { sellerAuth } = useStore();

    // ✅ DEBUG LOGS
    console.log('🔍 ProtectedSellerRoute Check:', {
        sellerAuth,
        isLoggedIn: sellerAuth?.loggedIn,
        localStorage: localStorage.getItem('sellerAuth')
    });

    // ✅ Check if seller is logged in
    if (!sellerAuth || !sellerAuth.loggedIn) {
        console.log('🚫 Unauthorized - Redirecting to home');
        return <Navigate to="/" replace />;
    }

    console.log('✅ Authorized - Showing seller page');
    return children;
}