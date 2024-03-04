export const ServerEndpoints = {
    POST_USER_LOGIN:'api/v1/recAuth/generateLogin',
    POST_VISITOR_DATA:'api/v1/recHome/generateVisitorData',
    POST_USER_LOCATION:'api/v1/recHome/getUsersByLocationCode',
    GET_VISITOR_HISTORY:'api/v1/recHome/getVisitorHistoryByUserCode',
    POST_NOTIFICATION_DATA:'api/v1/recAdmin/getNotificationsByUserType',
    GET_ALL_REVISITORS_DATA:'api/v1/recHome/getVisitorsMobileNumber',
    GET_DETAILS_BY_PHONENUMBER:'api/v1/recHome/getSelectorVisitorDataByPhoneNumber',
    POST_NOTIFICATION_TOKEN:'api/v1/recNotific/registerMessageData'
}