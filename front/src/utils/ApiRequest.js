// ApiRequest.js
import axios from "axios";

const ApiRequest = async (url, data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // 401 Unauthorized 상태 코드가 반환된 경우 로그인 페이지로 리다이렉트
      if (error.response.status === 401) {
        // 로그인 상태를 해제하고 로그인 페이지로 이동
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
      } else {
        // 다른 종류의 오류 처리
        console.error("Another error happened:", error.message);
      }
    } else {
      console.error("Error sending request:", error.message);
    }
  }
};

export default ApiRequest;
