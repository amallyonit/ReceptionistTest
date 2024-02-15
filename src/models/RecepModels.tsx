export const RecpImgArray: PathStore[] = [
    { name: 'Meeting', path: "../../assets/recscreen/MEETING.png" },
    { name: 'Visit', path: '../../assets/recscreen/VISIT.png' },
    { name: 'Service', path: '../../assets/recscreen/SERVICE.png' },
    { name: 'Contractor', path: '../../assets/recscreen/CONTRACTOR.png' },
    { name: 'Interview', path: '../../assets/recscreen/INTERVIEW.png' },
    { name: 'Delivery / Pickup', path: '../../assets/recscreen/DELIVERY.png' }
]

export const ViewHistoryList: ViewHistory[] = [
    { id: 1, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1 },
    { id: 2, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 12 },
    { id: 3, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 123 },
    { id: 4, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 5, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 6, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 7, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 8, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 9, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 10, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 11, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 12, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 13, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 14, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
    { id: 15, description: 'Meeting with sivadarsh', purpose: 'product service', date: new Date(), phonenumber: 1234 },
]

export const DelpickData: DeliveryData[] = [
    { billnumber: 5566, date: new Date(), partyname: 'LyonIT' }
]
export interface PathStore {
    name: any
    path: any
}

export interface InfoFormProps {
    appBarTitle: any,
    type: any
}

export interface ViewHistory {
    id: any
    description: any,
    purpose: any,
    date: any
    phonenumber: any
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
}

export interface UserLoginLocation {
    LocationAddress:any
    LocationCode: any
    LocationCompanyCode: any
    LocationId: any
    LocationName: any
    LocationPremise: any
}