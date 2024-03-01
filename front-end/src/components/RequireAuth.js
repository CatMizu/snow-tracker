import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const [isLogedin, setIsLogedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth
      .getSession()
      .then(() => {
        setIsLogedin(true);
      })
      .catch((error) => {
        // there is no user session
        setIsLogedin(false);
        console.log("no user session", error);
        navigate("/");
      });
  }, [auth, navigate]);

  if (isLogedin) {
    return children;
  }
};
