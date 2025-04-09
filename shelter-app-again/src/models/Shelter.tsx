import { Dog } from "./Dog";

export interface Shelter {
    id:number,
    name:string,
    type:string,
    description:string,
    address:string,
    totalNbOfDogs:number,
    availableDogs:number,
    phoneNumber:string,
    email:string,
    image:string,
    dogs:Dog[]
}