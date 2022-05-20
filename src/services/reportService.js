import http from "./httpService";

const apiEndpoint = `/backup.php`;
const cancelToken = http.cancelToken;

function getReport(daily, dateFrom, dateTo, cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            action: "report",
            today: daily,
            date_from: dateFrom,
            date_to: dateTo
        }
    });
}

function getBackup(cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            action: "backup"
        }
    });
}

const defaultExports = {
    getReport,
    getBackup,
    cancelToken
}

export default defaultExports;
