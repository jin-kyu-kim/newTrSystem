import ApiRequest from "./ApiRequest";

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
        localStorage.clear();
        window.location.href = "/login";
    }
    catch {
        return {
            isOk: false,
            data: {msg:"Authentication failed"}
        };
    }
}

export async function changePassword(empId, oldPwd, newPwd) {
    const param = {empId:empId, oldPwd: oldPwd, newPwd: newPwd};
    return await ApiRequest("/boot/sysMng/changePwd", param);
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
