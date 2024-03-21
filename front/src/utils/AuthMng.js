import ApiRequest from "./ApiRequest";
import {Cookies} from "react-cookie";

const defaultUser = null;
export async function signIn(empno, password) {
    try {
        const param = {empno:empno, password:password};
            console.log("1");
        const response = await ApiRequest("/boot/sysMng/lgnSkll", param);

            if(!response.fail){
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
        sessionStorage.clear();
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
        console.log(empno, newPassword);

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

export async function resetPassword() {
    try {
        const param = {empId:'2022f551-bf25-11ee-b259-000c2956283f',empno:'VK1545'};
        console.log("1");
        const response = await ApiRequest("/boot/trs/sysMng/resetPswd", param);
        console.log(response);
        return {
            isOk: true,
            data: response
        };
    }
    catch {
        return {
            isOk: false,
            data: {msg:"Authentication failed"}
        };
    }
}
