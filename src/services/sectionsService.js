import http from "./httpService";

const apiEndpoint = `/orders.php`;
const cancelToken = http.cancelToken;

export function getSections(cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            department: ""
        }
    });
}

const defaultExports = {
    getSections, cancelToken
}

export default defaultExports;