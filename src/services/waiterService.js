import http from "./httpService";

const apiEndpoint = `/waiters.php`;
const cancelToken = http.cancelToken;

export function getWaiters(cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            filter: "active"
        }
    });
}

export function receiveCashFromWaiter(id) {
    return http.post(apiEndpoint, null, {
        params: {
            action: "receivecash",
            waiter_id: id
        }
    });
}

const defaultExports = {
    getWaiters, receiveCashFromWaiter, cancelToken
}

export default defaultExports;

