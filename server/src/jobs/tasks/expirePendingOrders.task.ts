import orderExpirationService from "../../services/order-expiration.service";

export const expirePendingOrdersTask = async () => {
    const result = await orderExpirationService.expirePendingOrders();

    if (result.expiredCount > 0) {
        console.log(
            `[ORDER_EXPIRATION] Expired ${result.expiredCount} pending orders`
        );
    }
};
