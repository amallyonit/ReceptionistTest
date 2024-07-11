export const ServerEndpoints = {
    POST_USER_LOGIN:'api/v1/recAuth/generateLogin',
    POST_VISITOR_DATA:'api/v1/recHome/generateVisitorData',
    POST_USER_LOCATION:'api/v1/recHome/getUsersByLocationCode',
    GET_VISITOR_HISTORY:'api/v1/recHome/getVisitorHistoryByUserCode',
    POST_NOTIFICATION_DATA:'api/v1/recAdmin/getNotificationsByUserType',
    GET_ALL_REVISITORS_DATA:'api/v1/recHome/getVisitorsMobileNumber',
    GET_DETAILS_BY_PHONENUMBER:'api/v1/recHome/getSelectorVisitorDataByPhoneNumber',
    POST_NOTIFICATION_TOKEN:'api/v1/recNotific/registerMessageData',
    UPDATE_VISITOR_STATUS:'api/v1/recHome/updateVisitStatus',
    GET_ALL_VEHICLE_NUMBERS:'api/v1/recProd/getVehicleNumbers',
    GET_VEHICLE_DETAILS_BY_NO:'api/v1/recProd/getVehicleDetailsByNo',
    POST_PRODUCT_DATA:'api/v1/recProd/productEntry',
    GET_TRANSPORT_NAMES:'api/v1/recProd/getTransportNames',
    UPDATE_PRODUCT_STATUS:'api/v1/recProd/updateTransStatus',
    UPDATE_PRODUCT_OUTTIME:'api/v1/recProd/updateItemProduct'
}