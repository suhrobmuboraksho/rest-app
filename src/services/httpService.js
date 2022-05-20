import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, error => {
    console.log("Error", error);
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
        console.log("Logging the error", error);
        // alert("An unexpected error occurred");
    }

    console.log("Manual", error.response.status);

    if (error.response.status === 401 || error.response.status === 404) {
        const tokenKey = "token";
        const userKey = "user";
        const roleKey = "role";
        const abilityKey = "abilities";
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem(userKey);
        sessionStorage.removeItem(roleKey);
        sessionStorage.removeItem(abilityKey);
        console.log("Entered");
        window.location = "/";
    }

    return Promise.reject(error);
});

function setToken(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
const defaultExport = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    cancelToken: axios.CancelToken,
    setToken
};

export default defaultExport;