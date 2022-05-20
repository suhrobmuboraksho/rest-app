import http from "./httpService";

const apiEndpoint = `/orders.php`;

export async function getCheque(id) {
    return http.get(apiEndpoint, {
        params: {
            id: id
        }
    });
}

export async function editCheque(entryId, inputValue) {
    return await http.post(apiEndpoint, null, {
        params: {
            action: "edititem",
            entry_id: entryId,
            quantity: inputValue
        }
    });
}

export async function postDiscount(orderId, discount) {
    return await http.post(apiEndpoint, null, {
        params: {
            action: "discount",
            order_id: orderId,
            discount: discount
        }
    })
}
