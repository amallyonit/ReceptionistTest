export const RecpImgArray:PathStore[] = [
    {name:'Meeting',path:"../../assets/recscreen/MEETING.png"},
    {name:'Visit',path:'../../assets/recscreen/VISIT.png'},
    {name:'Service',path:'../../assets/recscreen/SERVICE.png'},
    {name:'Contractor',path:'../../assets/recscreen/CONTRACTOR.png'},
    {name:'Interview',path:'../../assets/recscreen/INTERVIEW.png'},
    {name:'Delivery / Pickup',path:'../../assets/recscreen/DELIVERY.png'}
]

export interface PathStore{
    name:any
    path:any
}

export interface InfoFormProps{
    appBarTitle:any,
    type:any
}