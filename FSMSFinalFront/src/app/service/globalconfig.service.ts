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
}