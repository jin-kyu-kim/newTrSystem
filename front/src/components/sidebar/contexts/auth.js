import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import {getUser, signIn as sendSignInRequest, setTokenExtension, setIntlPwsdYn} from '../api/auth';
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
      setCookie("userAuth", result.data.data.authorities);
      setCookie("userInfo", result.data.data.userInfo);
      setCookie("deptInfo", result.data.data.deptInfo);

      localStorage.setItem("userAuth", JSON.stringify(result.data.data.authorities));
      localStorage.setItem("userInfo", JSON.stringify(result.data.data.userInfo));
      localStorage.setItem("deptInfo", JSON.stringify(result.data.data.deptInfo));
      if(result.data.data.userInfo.intlPwsdYn && result.data.data.userInfo.intlPwsdYn === 'Y'){
        await setIntlPwsdYn(result.data.data.userInfo.empId, 'N');
        navigate("/infoInq/empDetailInfo");
      }else{
        navigate("/home");
      }
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

  const tokenExtension = useCallback(async ()=>{
    const result =await setTokenExtension(localStorage.getItem("token"));
    setCookie("userAuth", result.authorities);
    setCookie("userInfo", result.userInfo);
    setCookie("deptInfo", result.deptInfo);
    localStorage.setItem("userAuth", JSON.stringify(result.data.data.authorities));
    localStorage.setItem("userInfo", JSON.stringify(result.data.data.userInfo));
    localStorage.setItem("deptInfo", JSON.stringify(result.data.data.deptInfo));
  })

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, tokenExtension, loading }} {...props} />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
