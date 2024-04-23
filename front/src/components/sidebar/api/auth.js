import ApiRequest from "../../../utils/ApiRequest";
import {useAuth} from "../contexts/auth";

export async function signIn(empno, password) {
  try {
    const param = {empno:empno, password:password};
    const response = await ApiRequest("/boot/sysMng/lgnSkll", param);
    if(!response.fail){
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", response.token);
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
  }
  catch {
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


