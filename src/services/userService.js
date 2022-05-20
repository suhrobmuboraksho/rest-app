import http from "./httpService";

const apiEndpoint = `/auth.php`;
const cancelToken = http.cancelToken;

export async function register(fullname, username, password, role) {
    return await http.post(apiEndpoint, null, {
        params: {
            register: "",
            fullname: fullname,
            username: username,
            password: password,
            role_id: role,
        }
    });
}

export function getStaff(cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            get_all: ""
        }
    });
}

export function deleteStaff(id) {
    return http.post(apiEndpoint, null, {
        params: {
            delete: "",
            id: id
        }
    });
}

export function updateStaff(id, fullname, password) {
    return http.post(apiEndpoint, null, {
        params: {
            update: "",
            id: id,
            fullname: fullname,
            password: password
        }
    });
}

const defaultExport = {
    register, getStaff, deleteStaff, updateStaff, cancelToken
}

export default defaultExport;
