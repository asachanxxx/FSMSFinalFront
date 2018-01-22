import { Injectable } from "@angular/core";



@Injectable()
export class GlobalConfig {

   
    
   private _logedInUserID : number;
    public get GetlogedInUserID() : number {
        return this._logedInUserID;
    }
    public set SetlogedInUserID(v : number) {
        this._logedInUserID = v;
    }
    

    private _globalConnection: string;
    public get GetglobalConnection(): string {
        return this._globalConnection;
    }
    public set SetglobalConnection(v: string) {
        this._globalConnection = v;
    }


    public GetConnection(controller: string, method: string): string {
        return `${this._globalConnection}/${controller}/${method}`;
    }

    
    private _messageCaption : string = "FSMS Messaging System";
    public get GetmessageCaption() : string {
        return this._messageCaption;
    }
    public set SetmessageCaption(v : string) {
        this._messageCaption = v;
    }
    
    
    private _confirmInsert : string = "Are you really <b>sure</b> you want to insert this?";
    public get GetconfirmInsert() : string {
        return this._confirmInsert;
    }
    public set SetconfirmInsert(v : string) {
        this._confirmInsert = v;
    }

    
    private _confirmModify : string = "Are you really <b>sure</b> you want to update this?";
    public get GetconfirmModify() : string {
        return this._confirmModify;
    }
    public set SetconfirmModify(v : string) {
        this._confirmModify = v;
    }

    
    private _confirmDelete : string = "Are you really <b>sure</b> you want to Delete this?";
    public get GetconfirmDelete() : string {
        return this._confirmDelete;
    }
    public set SetconfirmDelete(v : string) {
        this._confirmDelete = v;
    }
    
    
    
    
}