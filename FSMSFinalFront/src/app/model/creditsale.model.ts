export class CreditSale {
	Id: number;
	PumpId: number;
	ShiftId: number;
	EmployeeId: number;
	CustomerID: number;
	Customer: string;
	VehicleID: number;
	Vehicle: string;
	RfID: number;
	RfIDCode: string;
	RecordDate: Date;
	NoOfUnits: number;
	UnitPrice: number;
	Total: number;
	Isvalid: boolean;
	GroupOfCompanyID: number;
	CreatedUser: number;
	CreatedDate: Date;
	ModifiedUser: number;
	ModifiedDate: Date;
	DataTransfer: number;
	NozzelId: number;
	FuelTypeId:number;
	Fueltype:string;
	Details:Array<CreditSale>;
}

export class CreditSaleViewModel {
	Id: number;
	Fueltype:string;
	RfIDCode: string;
	NoOfUnits: number;
	UnitPrice: number;
	Total: number;
	RecordDate: Date;
}