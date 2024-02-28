// ApiRequest.js
import axios from "axios";

const ApiFileRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

export default ApiFileRequest;
