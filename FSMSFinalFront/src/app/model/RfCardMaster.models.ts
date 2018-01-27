export class RfCardMaster {
	Id: number;
	CardNo: string;
	IssuedBy: number;
	IssueDate: Date;
	CardStatus: number;
	GroupOfCompanyID: number;
	CreatedUser: number;
	CreatedDate: Date;
	ModifiedUser: number;
	ModifiedDate: Date;
	DataTransfer: number;
}

export class RfCardStatus {

	public static CardTypes:Array<CardTypes> = [
		{id:1,text:"UnOccupied"},
		{id:2,text:"Occupied"},
		{id:3,text:"Cancel"},
		{id:4,text:"Damaged"},
	] 
	// public get GetCardTypes() : Array<string> {
	// 	return this.CardTypes;
	// }
	// public set SetCardTypes(v : Array<string>) {
	// 	this.CardTypes = v;
	// }
	
}

export class CardTypes{
	id:number;
	text:string;
}