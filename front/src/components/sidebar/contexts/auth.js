import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import {getUser, signIn as sendSignInRequest, setTokenExtension, setIntlPwsdYn} from '../api/auth';
import { useNavigate } from "react-router-dom";


function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
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
    setUser(null);
    navigate("/LoginFrom");
  }, [navigate]);

  const tokenExtension = useCallback(async ()=>{
    const result =await setTokenExtension(localStorage.getItem("token"));
    console.log(result);
    localStorage.setItem("userAuth", JSON.stringify(result.authorities));
    localStorage.setItem("userInfo", JSON.stringify(result.userInfo));
    localStorage.setItem("deptInfo", JSON.stringify(result.deptInfo));
  })

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, tokenExtension, loading }} {...props} />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
