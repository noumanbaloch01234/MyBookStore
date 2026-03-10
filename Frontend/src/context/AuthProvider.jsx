import React, { createContext, useContext, useState } from "react";

// 1️⃣ Context create
const AuthContext = createContext();

// 2️⃣ Provider component
export const AuthProvider = ({ children }) => {
  const initialAuthUser=localStorage.getItem("user");
  const [authUser, setauthUSer] = useState(
    initialAuthUser? JSON.parse(initialAuthUser):undefined

  );


  return (
    <AuthContext.Provider value={[authUser,setauthUSer]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
