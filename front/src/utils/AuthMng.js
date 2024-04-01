import ApiRequest from "./ApiRequest";
import {Cookies} from "react-cookie";

export async function signIn(empno, password) {
    try {
        const param = {empno:empno, password:password};
        const response = await ApiRequest("/boot/sysMng/lgnSkll", param);
            if(!response.fail){
                localStorage.setItem("isLoggedIn", true);
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

export async function signOut() {
    try {
        // const response = await ApiRequest("/boot/sysMng/lgnOut");
        // sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
        //
        // if(!response.fail){
        //     return {
        //         isOk: true,
        //         data: response
        //     };
        // }else{
        //     return {
        //         isOk: false,
        //         data: response
        //     };
        // }
    }
    catch {
        return {
            isOk: false,
            data: {msg:"Authentication failed"}
        };
    }
}

export async function changePassword(empno, oldPassword, newPassword) {
    try {
        // Send request
        return {
            isOk: true
        };
    }
    catch {
        return {
            isOk: false,
            message: "Failed to change password"
        }
    }
}

export async function resetPassword(empId, empno) {
    try {
        const param = {empId:empId, empno:empno};
        const response = await ApiRequest("/boot/sysMng/resetPswd", param);
        return {
            isOk: true,
            data: response
        };
    }
    catch {
        return {
            isOk: "false",
            data: {msg:"Authentication failed"}
        };
    }
}
