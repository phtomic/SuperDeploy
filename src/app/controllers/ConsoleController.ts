import { Response } from "express";
import { Globals } from "./Globals";

export class ConsoleController {
    private globals: Globals;
    private controllers: any = {};
    private fila: Array<any> = [];
    private filaRunning: boolean = false;
    constructor(globals: Globals) {
        this.globals = globals;

    }

    public async exec(command: any, res: Response): Promise<void> {
        this.fila.push({command:command,res:res})
        if(!this.filaRunning) this.startFila()
    }

    private async startFila(): Promise<void> {
        this.filaRunning = true
        let command = this.fila[0]
        this.fila.shift()
        this.executeCommand(command.command, function (error:any, result:any, errorLog:any) {
            command.res.send("<br<br><h3>Error<h3>: ".concat(error,"<br>",errorLog,"<br><br><br><h3>Result</h3>: <br>",result))
            console.log(error,result,errorLog)
        })
        this.filaRunning = this.fila.length>0
        if(this.filaRunning) this.startFila()
    }

    private executeCommand(command: any, callback: any){
        var exec = require('child_process').exec;
        exec(command, function(error: any, stdout:any, stderr:any){ callback(error, stdout, stderr) });
    }

}