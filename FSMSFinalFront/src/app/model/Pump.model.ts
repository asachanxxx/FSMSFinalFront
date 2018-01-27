import { Nozzle } from "./Nozzle.model";

export class Pump
{
         Id:number;
         NoofNozzels:number;
         PumpName:string;
         PumpOrderNo:number;
         GroupOfCompanyID:number;
         CreatedUser:number;
         CreatedDate:Date;
         ModifiedUser:number;
         ModifiedDate:Date;
         DataTransfer:number;
         Nozzels:Array<Nozzle>;
}
