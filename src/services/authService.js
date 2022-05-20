import http from "./httpService";

const apiEndpoint = `/auth.php`;
const tokenKey = "token";
const userKey = "user";
const roleKey = "role";
const abilityKey = "abilities";

http.setToken(getToken());

export async function login(username, password) {
    const response = await http.post(apiEndpoint, null, {
        params: {
            signin: "",
            username: username,
            password: password
        }
    });

    sessionStorage.setItem(tokenKey, response.data.body.token);
    sessionStorage.setItem(roleKey, response.data.body.role.name);
    sessionStorage.setItem(userKey, response.data.body.fullname);
    sessionStorage.setItem(abilityKey, JSON.stringify(response.data.body.abilities));
    /*
    To parse back:
        JSON.parse(sessionStorage.getItem(abilityKey));
    */
}

export function getToken() {
    return sessionStorage.getItem(tokenKey);
}

export function logout() {
    sessionStorage.removeItem(tokenKey);
    sessionStorage.removeItem(userKey);
    sessionStorage.removeItem(roleKey);
    sessionStorage.removeItem(abilityKey);
}

export function getCurrentUser() {
    try {
        const username = sessionStorage.getItem(userKey);
        return username;
    } catch (ex) {
        return null;
    }
}

export function getCurrentUserRole() {
    try {
        const role = sessionStorage.getItem(roleKey);
        return role;
    } catch (ex) {
        return null;
    }
}

const defaultExport = {
    login, logout, getCurrentUser, getToken, getCurrentUserRole
}

export default defaultExport;


