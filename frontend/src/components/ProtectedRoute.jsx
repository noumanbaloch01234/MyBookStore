// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useStore } from '../Context/AppContext';

// function ProtectedRoute({ children }) {
//     const { user } = useStore();

//     // Agar user logged in nahi hai, to home page pe redirect
//     if (!user) {
//         return <Navigate to="/" replace />;
//     }

//     // Agar user logged in hai, to page dikhao
//     return children;
// }

// export default ProtectedRoute;