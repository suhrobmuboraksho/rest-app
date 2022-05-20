import http from "./httpService";

const apiEndpoint = `/menuitems.php`;
const cancelToken = http.cancelToken;

export function getMenu(cancelToken) {
    return http.get(apiEndpoint, {
        cancelToken: cancelToken,
        params: {
            full_info: ""
        }
    });
}

export function addMenu(name, price, depId, menuId, varof) {
    return http.post(apiEndpoint, null, {
        params: {
            action: "insert",
            name,
            price,
            varof,
            dep_id: depId,
            menu_id: menuId,
        }
    })
}
export function editMenu(id, name, price, depId, menuId) {
    return http.post(apiEndpoint, null, {
        params: {
            action: "update",
            id,
            name,
            price,
            dep_id: depId,
            menu_id: menuId,
        }
    })
}
export function deleteMenuItem(id) {
    return http.post(apiEndpoint, null, {
        params: {
            action: "delete",
            id
        }
    })
}

const defaultExports = {
    getMenu,
    addMenu,
    editMenu,
    deleteMenuItem,
    cancelToken
}

export default defaultExports;
