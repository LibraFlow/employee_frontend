import React, { createContext, useState } from 'react';

export const AuthContext = createContext({ jwt: null, setJwt: () => {} });

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(null);
  return (
    <AuthContext.Provider value={{ jwt, setJwt }}>
      {children}
    </AuthContext.Provider>
  );
}; 