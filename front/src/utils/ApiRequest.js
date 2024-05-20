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
      console.log(error.response);
      if (error.response.status === 401) {
      } else {
        // 다른 종류의 오류 처리
        console.error("Another error happened:", error.message);
      }
    } else {
      console.error("Error sending request:", error.message);
    }
  }
};

// function extension (token) {
//   console.log(token)
//   const payloadBase64 = token.split('.')[1];
//   const decodedJson = atob(payloadBase64);
//   const payload = JSON.parse(decodedJson);
//   const expirationDate = new Date(payload.exp * 1000);
//
//   localStorage.setItem("token", token);
//   localStorage.setItem("expirationTime", expirationDate);
// }
export default ApiRequest;
