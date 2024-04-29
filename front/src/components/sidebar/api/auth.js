import {useAuth} from "../contexts/auth";
import axios from "axios";
import ApiRequest from "../../../utils/ApiRequest";

export async function signIn(empno, password) {
  try {
    const param = {empno:empno, password:password};
    const response = await axios.post("/boot/sysMng/lgnSkll", param, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(response){
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("expirationTime", response.data.expirationTime);
      return {
        isOk: true,
        data: response
      };
    }else{
      return {
        isOk: false,
        data: response
      };
    }
  } catch {
    return {
      isOk: false,
      data: {msg:"Authentication failed"}
    };
  }
}

export async function getUser() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useAuth();
    if(user){
      return {
        isOk: true,
        data: user
      }
    }else{
      return {
        isOk: false
      };
    }
  }
  catch {
    return {
      isOk: false
    };
  }
}

export async function setTokenExtension(token) {
  try {
    const response = await ApiRequest("/boot/sysMng/tokenExtension", null);
    if(response){
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", response.token);
      localStorage.setItem("expirationTime", response.expirationTime);
      return response;
    }else{
      console.log("Extention Error");
    }
  } catch(error) {
    console.error("Extension Error", error.message);
  }
}