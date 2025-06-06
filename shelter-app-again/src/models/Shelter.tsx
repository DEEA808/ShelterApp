import { Dog } from "./Dog";

export interface Shelter {
    id:number,
    name:string,
    type:string,
    description:string,
    address:string,
    city:string,
    totalNbOfDogs:number,
    availableDogs:number,
    phoneNumber:string,
    email:string,
    image1:string,
    image2:string,
    dogs:Dog[]
}