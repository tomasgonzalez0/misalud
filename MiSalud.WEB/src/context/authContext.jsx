import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  loginRequest,
  storeSession,
  getStoredUser,
  isAuthenticated,
  logout,
  decodeJWT
} from "../services/auth";
import { extractRolesFromPayload } from "../utils/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const u = getStoredUser();
      setAuthUser(u);
      if (u) {
        if (u.roles) setRoles(u.roles);
        else {
          const token = localStorage.getItem("token");
            const decoded = decodeJWT(token);
          setRoles(extractRolesFromPayload(decoded));
        }
      }
    }
    setLoading(false);

    const unauthorizedHandler = () => {
      handleLogout();
    };
    window.addEventListener("auth:unauthorized", unauthorizedHandler);
    return () => window.removeEventListener("auth:unauthorized", unauthorizedHandler);
  }, []);

  const handleLogin = useCallback(async (userNameOrEmail, password) => {
    const { token } = await loginRequest(userNameOrEmail, password);
    const payload = storeSession(token);
    setAuthUser(payload || { token });
    const decoded = payload || decodeJWT(token) || {};
    const extracted = extractRolesFromPayload(decoded);
    setRoles(extracted);
    return { payload: decoded, roles: extracted };
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setAuthUser(null);
    setRoles([]);
  }, []);

  useEffect(() => {
    if (authUser?.exp) {
      const now = Date.now() / 1000;
      if (authUser.exp < now) {
        handleLogout();
      }
    }
  }, [authUser, handleLogout]);

  const hasRole = useCallback(
    (role) => roles.includes(role),
    [roles]
  );

  return (
    <AuthContext.Provider
      value={{
        user: authUser,
        roles,
        isAuthenticated: !!authUser,
        loading,
        login: handleLogin,
        logout: handleLogout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}