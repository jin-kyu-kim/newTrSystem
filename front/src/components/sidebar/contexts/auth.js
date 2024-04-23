import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getUser, signIn as sendSignInRequest } from '../api/auth';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie] = useCookies(["userInfo", "userAuth", "deptInfo"]);
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const result = await getUser();
      if (result.isOk) {
        setUser(result.data);
      }else{
        setUser(null);
      }
      setLoading(false);
    })();
  }, [user]);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      setUser(result.data);
      setCookie("userAuth", result.data.userAuth);
      setCookie("userInfo", result.data.userInfo);
      setCookie("deptInfo", result.data.deptInfo);
      console.log(result.data.deptInfo);
      navigate("/");
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();
    setCookie("userInfo", undefined, { path: '/', expires: new Date(0) });
    setCookie("userAuth", undefined, { path: '/', expires: new Date(0) });
    setCookie("deptInfo", undefined, { path: '/', expires: new Date(0) });
    setUser(null);
    navigate("/LoginFrom");
  }, [navigate, setCookie]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
