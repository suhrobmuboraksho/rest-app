import http from "./httpService";

const apiEndpoint = `/orders.php`;
const cancelToken = http.cancelToken;

function getOrders(filter = "active", cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            filter: filter
        }
    });
}

const defaultExports = {
    getOrders,
    cancelToken
}

export default defaultExports;




// {
//     "id": "1",
//     "number": "124",
//     "opentime": "2021-03-27 11:12:00",
//     "closetime": null,
//     "status": "1",
//     "by": "Pretty Waiter",
//     "by_id": "2",
//     "sum": "37.00",
//     "sum_total": "40.70"
// }