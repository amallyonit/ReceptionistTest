export const RecpImgArray: PathStore[] = [
    { name: 'Meeting', path: "../../assets/recscreen/MEETING.png" },
    { name: 'Visit', path: '../../assets/recscreen/VISIT.png' },
    { name: 'Service', path: '../../assets/recscreen/SERVICE.png' },
    { name: 'Contractor', path: '../../assets/recscreen/CONTRACTOR.png' },
    { name: 'Interview', path: '../../assets/recscreen/INTERVIEW.png' },
    { name: 'Courier', path: '../../assets/recscreen/MEETING.png' },
    { name: 'Inward / Outward', path: '../../assets/recscreen/DELIVERY.png' }
]

export const DelpickData: DeliveryData[] = [
    { billnumber: 5566, date: new Date(), partyname: 'LyonIT' }
]
export interface ItemDescription {
    ProdMovDetBillNumber: string
    ProdMovDetPartyName: string
    ProdMovDetItems: string
    ProdMovDetItemQty: number
}
export interface PathStore {
    name: any
    path: any
}

export interface UserPayload {
    userid: any
    token: any
}

export interface InfoFormProps {
    appBarTitle: any,
    type: any,
    category: number
}

export interface ViewHistory {
    VisitorName: any
    VisitorMobileNo: any
    VisitorImage: any
    VisitTranVisitorFrom: any
}

export interface ViewNotification {
    VisitorName: any
    VisitorImage: any
    VisitorMobileNo: any
    VisitTranVisitorFrom: any
    VisitTranMeetingWith: any
    VisitTranVisitStatus: any
    VisitTranPurpose: any
    VisitTranNoOfVisitors: any
    VisitTranCheckinTime: string
    VisitTranRemarks: any
    VisitTranReason: any
    VisitTranId: any
    VisitorCode: any
}

export interface DeliveryData {
    billnumber: number,
    date: any,
    partyname: any
}


export interface UserLoginData {
    UserCode: any
    UserId: any
    UserLocationCode: any
    UserMobileNo: any
    UserName: any
    UserPassword: any
    UserType: any
}
export interface UserLDData {
    UserCode: any
    UserDeviceToken: any
    UserMobileNo: any
    UserName: any
    UserPassword: any
    LocationPremise: any
    UserType: any
}
export interface UserLoginLocation {
    LocationAddress: any
    LocationCode: any
    LocationCompanyCode: any
    LocationId: any
    LocationName: any
    LocationPremise: any
    CompanyName: any
}

export interface NotificationData {
    NotificationDeviceToken: any
    NotificationsData: any
    NotificationCreatedAt: any
}

export interface ProductMovementData {
    ProdMovCode: string
    ProdMovImage: string
    ProdMovDriverName: string
    ProdMovMobileNo: string
    ProdMovTransporter: string
    ProdMovAuthorizedPerson: string
    ProdMovVehicleNo: string
    ProdMovInTime: string
    ProdMovOutTime: string
    ProdMovDetId: 2
    ProdMovDetBillNumber: string
    ProdMovDetDate: string
    ProdMovDetPartyName: string
    ProdMovDetItems: string
    ProdMovDetItemQty: number
}