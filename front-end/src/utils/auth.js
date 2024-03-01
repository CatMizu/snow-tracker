import { useContext, createContext, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
  });

  const getSession = () => {
    const token = Cookies.get("tokens");
    if (token) {
      return Promise.resolve(JSON.parse(token));
    }
    return Promise.reject();
  };

  const signUp = async (userName, email, password) => {
    const { data } = await apiClient.post("/auth/register", {
      name: userName,
      email,
      password,
    });

    if (data && data.tokens) {
      Cookies.set("tokens", JSON.stringify(data.tokens));
      return Promise.resolve(data);
    }
    return Promise.reject();
  };

  const login = async (email, password) => {
    const { data } = await apiClient.post("auth/login", {
      email,
      password,
    });

    if (data && data.tokens) {
      Cookies.set("tokens", JSON.stringify(data.tokens));
      return Promise.resolve(data);
    }
    return Promise.reject();
  };

  const logout = async () => {
    const tokens = await getSession();
    if (tokens) {
      console.log(tokens);
      const refreshToken = tokens.refresh.token;

      await apiClient.post("auth/logout", {
        refreshToken,
      });
      Cookies.remove("tokens");
      return Promise.resolve("Successfully logged out");
    }
    return Promise.reject();
  };

  // value defines the variables that the context will contains
  const value = useMemo(
    () => ({ login, logout, signUp, getSession }),
    [login, logout, signUp, getSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  // this will return the value of the authContext, which is the context provided by the provider
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
